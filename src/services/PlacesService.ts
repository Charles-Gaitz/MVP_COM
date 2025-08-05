/**
 * Google Places API Service
 * Provides nearby amenities, businesses, and points of interest
 */

export interface PlaceData {
  placeId: string;
  name: string;
  type: string;
  distance: string;
  driveTime: string;
  rating: number;
  priceLevel?: number;
  address: string;
  hours?: string;
  phoneNumber?: string;
  website?: string;
  photos: string[];
}

export interface AmenitiesData {
  grocery: PlaceData[];
  healthcare: PlaceData[];
  dining: PlaceData[];
  entertainment: PlaceData[];
  education: PlaceData[];
  shopping: PlaceData[];
}

export class PlacesService {
  private static readonly PLACES_URL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
  private static readonly DETAILS_URL = 'https://maps.googleapis.com/maps/api/place/details/json';
  private static readonly DISTANCE_URL = 'https://maps.googleapis.com/maps/api/distancematrix/json';
  private static readonly API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Geographic coordinates for Texas communities
  private static readonly COORDINATES = {
    'austin': { lat: 30.2672, lon: -97.7431 },
    'westlake': { lat: 30.3991, lon: -97.8300 },
    'plano': { lat: 33.0198, lon: -96.6989 },
    'frisco': { lat: 33.1507, lon: -96.8236 },
    'dallas': { lat: 32.7767, lon: -96.7970 },
    'houston': { lat: 29.7604, lon: -95.3698 },
    'katy': { lat: 29.7858, lon: -95.8244 },
    'sugar-land': { lat: 29.6196, lon: -95.6349 }
  };

  // Place type mappings for Google Places API
  private static readonly PLACE_TYPES = {
    grocery: ['grocery_or_supermarket', 'supermarket'],
    healthcare: ['hospital', 'pharmacy', 'doctor', 'dentist'],
    dining: ['restaurant', 'meal_takeaway', 'cafe'],
    entertainment: ['movie_theater', 'shopping_mall', 'amusement_park', 'museum'],
    education: ['school', 'university'],
    shopping: ['shopping_mall', 'store', 'clothing_store']
  };

  /**
   * Get comprehensive amenities data for a community
   */
  static async getAmenitiesData(communityId: string): Promise<AmenitiesData | null> {
    const coords = this.COORDINATES[communityId as keyof typeof this.COORDINATES];
    if (!coords) {
      console.warn(`No coordinates found for ${communityId}`);
      return null;
    }

    try {
      const amenities: AmenitiesData = {
        grocery: [],
        healthcare: [],
        dining: [],
        entertainment: [],
        education: [],
        shopping: []
      };

      // Get each category of amenities
      for (const [category, types] of Object.entries(this.PLACE_TYPES)) {
        for (const type of types) {
          const places = await this.getNearbyPlaces(coords, type, 5);
          const categoryKey = category as keyof AmenitiesData;
          amenities[categoryKey].push(...places);
        }
        
        // Remove duplicates and limit to top 5 per category
        amenities[category as keyof AmenitiesData] = this.removeDuplicates(
          amenities[category as keyof AmenitiesData]
        ).slice(0, 5);
      }

      return amenities;
    } catch (error) {
      console.error('Places API Error:', error);
      return null;
    }
  }

  /**
   * Get nearby places by type
   */
  static async getNearbyPlaces(
    coords: { lat: number; lon: number },
    type: string,
    limit: number = 10
  ): Promise<PlaceData[]> {
    try {
      const url = `${this.PLACES_URL}?location=${coords.lat},${coords.lon}&radius=8000&type=${type}&key=${this.API_KEY}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Places API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
        throw new Error(`Places API error: ${data.status}`);
      }

      const places = data.results?.slice(0, limit) || [];
      const placesWithDistance = await this.addDistanceData(coords, places);
      
      return placesWithDistance;
    } catch (error) {
      console.error('Nearby Places Error:', error);
      return [];
    }
  }

  /**
   * Get detailed information for a specific place
   */
  static async getPlaceDetails(placeId: string): Promise<any> {
    try {
      const fields = 'name,formatted_address,formatted_phone_number,website,opening_hours,price_level,photos';
      const url = `${this.DETAILS_URL}?place_id=${placeId}&fields=${fields}&key=${this.API_KEY}`;
      
      const response = await fetch(url);
      if (!response.ok) return null;

      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Place Details Error:', error);
      return null;
    }
  }

  /**
   * Add distance and drive time data to places
   */
  private static async addDistanceData(
    origin: { lat: number; lon: number },
    places: any[]
  ): Promise<PlaceData[]> {
    if (!places.length) return [];

    try {
      // Get distances for up to 10 places at a time (API limit)
      const destinations = places.slice(0, 10).map(place => 
        `${place.geometry.location.lat},${place.geometry.location.lng}`
      ).join('|');

      const url = `${this.DISTANCE_URL}?origins=${origin.lat},${origin.lon}&destinations=${destinations}&units=imperial&key=${this.API_KEY}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        // Fallback to estimated distances
        return this.addEstimatedDistances(origin, places);
      }

      const distanceData = await response.json();
      
      return places.map((place, index) => {
        const element = distanceData.rows?.[0]?.elements?.[index];
        const distance = element?.distance?.text || 'Unknown';
        const duration = element?.duration?.text || 'Unknown';

        return this.formatPlaceData(place, distance, duration);
      });
    } catch (error) {
      console.error('Distance Matrix Error:', error);
      return this.addEstimatedDistances(origin, places);
    }
  }

  /**
   * Add estimated distances when Distance Matrix API fails
   */
  private static addEstimatedDistances(
    origin: { lat: number; lon: number },
    places: any[]
  ): PlaceData[] {
    return places.map(place => {
      const lat1 = origin.lat;
      const lon1 = origin.lon;
      const lat2 = place.geometry.location.lat;
      const lon2 = place.geometry.location.lng;

      // Calculate straight-line distance using Haversine formula
      const distance = this.calculateDistance(lat1, lon1, lat2, lon2);
      const driveTime = Math.round(distance * 2.5); // Estimate drive time

      return this.formatPlaceData(
        place,
        `${distance.toFixed(1)} miles`,
        `${driveTime} min`
      );
    });
  }

  /**
   * Calculate distance between two coordinates
   */
  private static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Format place data into standardized format
   */
  private static formatPlaceData(place: any, distance: string, driveTime: string): PlaceData {
    return {
      placeId: place.place_id,
      name: place.name,
      type: place.types?.[0]?.replace(/_/g, ' ') || 'Business',
      distance,
      driveTime,
      rating: place.rating || 0,
      priceLevel: place.price_level,
      address: place.vicinity || place.formatted_address || '',
      hours: place.opening_hours?.open_now ? 'Open now' : undefined,
      photos: place.photos?.slice(0, 3).map((photo: any) => 
        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photo.photo_reference}&key=${this.API_KEY}`
      ) || []
    };
  }

  /**
   * Remove duplicate places based on name and location
   */
  private static removeDuplicates(places: PlaceData[]): PlaceData[] {
    const seen = new Set<string>();
    return places.filter(place => {
      const key = `${place.name}-${place.address}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  /**
   * Search for specific amenities or businesses
   */
  static async searchPlaces(
    communityId: string,
    query: string,
    limit: number = 10
  ): Promise<PlaceData[]> {
    const coords = this.COORDINATES[communityId as keyof typeof this.COORDINATES];
    if (!coords) return [];

    try {
      const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&location=${coords.lat},${coords.lon}&radius=8000&key=${this.API_KEY}`;
      
      const response = await fetch(url);
      if (!response.ok) return [];

      const data = await response.json();
      if (data.status !== 'OK') return [];

      const places = data.results?.slice(0, limit) || [];
      return this.addDistanceData(coords, places);
    } catch (error) {
      console.error('Place Search Error:', error);
      return [];
    }
  }
}
