/**
 * Transportation and Traffic API Service
 * Integrates with Google Maps, HERE, and other transportation APIs
 */

export interface TrafficPattern {
  routeName: string;
  distance: string;
  peakTime: number; // minutes
  offPeakTime: number; // minutes
  congestionLevel: 'light' | 'moderate' | 'heavy';
  alternativeRoutes?: string[];
}

export interface CommuteDestination {
  name: string;
  peakTime: number; // minutes
  offPeakTime: number; // minutes
  distance: string;
  coordinates: { lat: number; lng: number };
  transitOptions?: string[];
}

export interface PeakHours {
  morning: {
    time: string;
    duration: number;
    traffic: 'light' | 'moderate' | 'heavy';
  };
  evening: {
    time: string;
    duration: number;
    traffic: 'light' | 'moderate' | 'heavy';
  };
}

export interface PublicTransit {
  hasPublicTransit: boolean;
  nearestStation?: {
    name: string;
    type: 'bus' | 'rail' | 'subway' | 'light_rail';
    distance: string;
    walkTime: number;
  };
  routes?: {
    name: string;
    type: string;
    frequency: string;
    operatingHours: string;
  }[];
}

export interface TrafficData {
  averageCommute: number;
  peakTimes: PeakHours;
  majorRoutes: TrafficPattern[];
  destinations: CommuteDestination[];
  publicTransit: PublicTransit;
  walkScore?: number;
  bikeScore?: number;
  transitScore?: number;
}

export class TransportationService {
  private static readonly GOOGLE_MAPS_API_URL = 'https://maps.googleapis.com/maps/api';
  private static readonly WALK_SCORE_API_URL = 'https://api.walkscore.com';

  /**
   * Get comprehensive traffic and transportation data for a community
   */
  static async getTrafficData(
    communityId: string,
    coordinates?: { lat: number; lng: number }
  ): Promise<TrafficData | null> {
    try {
      if (!coordinates) {
        const coords = await this.getCommunityCoordinates(communityId);
        if (!coords) return null;
        coordinates = coords;
      }

      if (!coordinates) return null;

      const [trafficData, transitData, walkabilityData] = await Promise.allSettled([
        this.getGoogleTrafficData(coordinates),
        this.getPublicTransitData(coordinates),
        this.getWalkabilityScores(coordinates)
      ]);

      // Combine data from multiple sources
      const combinedData: TrafficData = {
        averageCommute: 30, // Default fallback
        peakTimes: {
          morning: { time: '7:00-9:00 AM', duration: 35, traffic: 'moderate' },
          evening: { time: '5:00-7:00 PM', duration: 32, traffic: 'moderate' }
        },
        majorRoutes: [],
        destinations: [],
        publicTransit: { hasPublicTransit: false }
      };

      // Merge successful API responses
      if (trafficData.status === 'fulfilled' && trafficData.value) {
        Object.assign(combinedData, trafficData.value);
      }

      if (transitData.status === 'fulfilled' && transitData.value) {
        combinedData.publicTransit = transitData.value;
      }

      if (walkabilityData.status === 'fulfilled' && walkabilityData.value) {
        Object.assign(combinedData, walkabilityData.value);
      }

      return combinedData;
    } catch (error) {
      console.error('Transportation Data Error:', error);
      return null;
    }
  }

  /**
   * Get real-time traffic conditions for specific routes
   */
  static async getRouteTraffic(
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number },
    departureTime?: Date
  ): Promise<TrafficPattern | null> {
    try {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      if (!apiKey) return null;

      const params = new URLSearchParams({
        origin: `${origin.lat},${origin.lng}`,
        destination: `${destination.lat},${destination.lng}`,
        departure_time: departureTime ? Math.floor(departureTime.getTime() / 1000).toString() : 'now',
        traffic_model: 'best_guess',
        key: apiKey
      });

      const response = await fetch(
        `${this.GOOGLE_MAPS_API_URL}/directions/json?${params}`
      );

      if (!response.ok) return null;

      const data = await response.json();
      return this.parseGoogleDirectionsData(data);
    } catch (error) {
      console.error('Route Traffic Error:', error);
      return null;
    }
  }

  /**
   * Get commute times to major employment centers
   */
  static async getCommuteAnalysis(
    communityCoordinates: { lat: number; lng: number },
    employmentCenters: string[]
  ): Promise<CommuteDestination[]> {
    try {
      const destinations: CommuteDestination[] = [];
      
      for (const center of employmentCenters) {
        const centerCoords = await this.geocodeLocation(center);
        if (!centerCoords) continue;

        const routeData = await this.getRouteTraffic(communityCoordinates, centerCoords);
        if (routeData) {
          destinations.push({
            name: center,
            peakTime: routeData.peakTime,
            offPeakTime: routeData.offPeakTime,
            distance: routeData.distance,
            coordinates: centerCoords
          });
        }
      }

      return destinations;
    } catch (error) {
      console.error('Commute Analysis Error:', error);
      return [];
    }
  }

  // Private helper methods
  private static async getCommunityCoordinates(communityId: string): Promise<{ lat: number; lng: number } | null> {
    // This would integrate with your community database
    const coordinates: Record<string, { lat: number; lng: number }> = {
      'westlake': { lat: 30.3382, lng: -97.8313 },
      'the-woodlands': { lat: 30.1588, lng: -95.4895 },
      'plano': { lat: 33.0198, lng: -96.6989 },
      'katy': { lat: 29.7858, lng: -95.8244 },
      // Add more communities
    };

    return coordinates[communityId] || null;
  }

  private static async getGoogleTrafficData(coordinates: { lat: number; lng: number }): Promise<Partial<TrafficData> | null> {
    try {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      if (!apiKey) return null;

      // Get traffic data for nearby major roads
      const nearbyResponse = await fetch(
        `${this.GOOGLE_MAPS_API_URL}/place/nearbysearch/json?` +
        `location=${coordinates.lat},${coordinates.lng}&` +
        `radius=5000&type=route&key=${apiKey}`
      );

      if (!nearbyResponse.ok) return null;

      const nearbyData = await nearbyResponse.json();
      return this.parseGoogleTrafficData(nearbyData);
    } catch (error) {
      return null;
    }
  }

  private static async getPublicTransitData(coordinates: { lat: number; lng: number }): Promise<PublicTransit | null> {
    try {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      if (!apiKey) return null;

      const response = await fetch(
        `${this.GOOGLE_MAPS_API_URL}/place/nearbysearch/json?` +
        `location=${coordinates.lat},${coordinates.lng}&` +
        `radius=2000&type=transit_station&key=${apiKey}`
      );

      if (!response.ok) return null;

      const data = await response.json();
      return this.parseTransitData(data);
    } catch (error) {
      return null;
    }
  }

  private static async getWalkabilityScores(coordinates: { lat: number; lng: number }): Promise<{ walkScore?: number; bikeScore?: number; transitScore?: number } | null> {
    try {
      const apiKey = import.meta.env.VITE_WALK_SCORE_API_KEY;
      if (!apiKey) return null;

      const response = await fetch(
        `${this.WALK_SCORE_API_URL}/score?` +
        `format=json&address=${coordinates.lat}%2C${coordinates.lng}&` +
        `lat=${coordinates.lat}&lon=${coordinates.lng}&` +
        `transit=1&bike=1&wsapikey=${apiKey}`
      );

      if (!response.ok) return null;

      const data = await response.json();
      return {
        walkScore: data.walkscore,
        bikeScore: data.bike?.score,
        transitScore: data.transit?.score
      };
    } catch (error) {
      return null;
    }
  }

  private static async geocodeLocation(location: string): Promise<{ lat: number; lng: number } | null> {
    try {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      if (!apiKey) return null;

      const response = await fetch(
        `${this.GOOGLE_MAPS_API_URL}/geocode/json?address=${encodeURIComponent(location)}&key=${apiKey}`
      );

      if (!response.ok) return null;

      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        return { lat: location.lat, lng: location.lng };
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  // Data parsing methods
  private static parseGoogleDirectionsData(data: any): TrafficPattern | null {
    if (!data.routes || data.routes.length === 0) return null;

    const route = data.routes[0];
    const leg = route.legs[0];

    return {
      routeName: route.summary || 'Route',
      distance: leg.distance?.text || '0 mi',
      peakTime: Math.round((leg.duration_in_traffic?.value || leg.duration?.value || 0) / 60),
      offPeakTime: Math.round((leg.duration?.value || 0) / 60),
      congestionLevel: this.determineCongestionLevel(leg.duration_in_traffic?.value, leg.duration?.value)
    };
  }

  private static parseGoogleTrafficData(_data: any): Partial<TrafficData> | null {
    // Parse Google Places API response for traffic-related data
    return {
      majorRoutes: [], // Would be populated with actual route analysis
      destinations: []
    };
  }

  private static parseTransitData(data: any): PublicTransit {
    if (!data.results || data.results.length === 0) {
      return { hasPublicTransit: false };
    }

    const nearestStation = data.results[0];
    return {
      hasPublicTransit: true,
      nearestStation: {
        name: nearestStation.name,
        type: this.determineTransitType(nearestStation.types),
        distance: `${this.calculateDistance(nearestStation)} mi`,
        walkTime: Math.round(this.calculateDistance(nearestStation) * 12) // Rough estimate: 5 mph walking speed
      },
      routes: data.results.slice(0, 5).map((station: any) => ({
        name: station.name,
        type: this.determineTransitType(station.types),
        frequency: 'Unknown', // Would need additional API calls
        operatingHours: 'Unknown' // Would need additional API calls
      }))
    };
  }

  private static determineCongestionLevel(trafficDuration?: number, normalDuration?: number): 'light' | 'moderate' | 'heavy' {
    if (!trafficDuration || !normalDuration) return 'moderate';
    
    const ratio = trafficDuration / normalDuration;
    if (ratio < 1.2) return 'light';
    if (ratio < 1.5) return 'moderate';
    return 'heavy';
  }

  private static determineTransitType(types: string[]): 'bus' | 'rail' | 'subway' | 'light_rail' {
    if (types.includes('subway_station')) return 'subway';
    if (types.includes('light_rail_station')) return 'light_rail';
    if (types.includes('train_station')) return 'rail';
    return 'bus';
  }

  private static calculateDistance(_place: any): number {
    // This would calculate actual distance - simplified for now
    return 0.5; // miles
  }
}
