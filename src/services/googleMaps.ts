// Google Maps API integration for location services
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export interface LocationData {
  lat: number;
  lng: number;
  address: string;
  placeId?: string;
}

export interface NearbyPlace {
  name: string;
  type: string;
  rating?: number;
  distance?: string;
  address: string;
}

export class GoogleMapsService {
  // Initialize Google Maps
  static async loadGoogleMaps(): Promise<void> {
    if (window.google) return;
    
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google Maps'));
      document.head.appendChild(script);
    });
  }

  // Geocode an address to get coordinates
  static async geocodeAddress(address: string): Promise<LocationData | null> {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        return {
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng,
          address: result.formatted_address,
          placeId: result.place_id
        };
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  }

  // Find nearby places (schools, parks, shopping, etc.)
  static async findNearbyPlaces(
    lat: number, 
    lng: number, 
    type: string = 'school', 
    radius: number = 5000
  ): Promise<NearbyPlace[]> {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      
      if (data.results) {
        return data.results.map((place: any) => ({
          name: place.name,
          type: type,
          rating: place.rating,
          address: place.vicinity,
          distance: this.calculateDistance(lat, lng, place.geometry.location.lat, place.geometry.location.lng)
        }));
      }
      return [];
    } catch (error) {
      console.error('Places search error:', error);
      return [];
    }
  }

  // Calculate distance between two points
  private static calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): string {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return `${distance.toFixed(1)} mi`;
  }

  // Get traffic data for commute times
  static async getCommuteTime(
    origin: string, 
    destination: string = 'Downtown Austin, TX'
  ): Promise<{ duration: string; distance: string } | null> {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&mode=driving&departure_time=now&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      
      if (data.rows && data.rows[0] && data.rows[0].elements && data.rows[0].elements[0]) {
        const element = data.rows[0].elements[0];
        if (element.status === 'OK') {
          return {
            duration: element.duration_in_traffic?.text || element.duration.text,
            distance: element.distance.text
          };
        }
      }
      return null;
    } catch (error) {
      console.error('Commute time error:', error);
      return null;
    }
  }
}
