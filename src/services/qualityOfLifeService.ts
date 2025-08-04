// Quality of Life Service - Real data for walkability, safety, infrastructure
export class QualityOfLifeService {
  private static readonly QOL_APIS = {
    // Walk Score API (Free tier available)
    walkscore: 'https://api.walkscore.com/score',
    // Crime Data API (FBI Crime Data)
    crime: 'https://api.usa.gov/crime/fbi/sapi/api',
    // EPA Air Quality API (FREE)
    air_quality: 'https://airnowapi.org/aq/observation/zipCode/current',
    // Transit Score API
    transit: 'https://api.walkscore.com/score',
    // Yelp API for local businesses
    yelp: 'https://api.yelp.com/v3/businesses/search'
  }

  static async getQualityOfLifeMetrics(zipCode: string, latitude: number, longitude: number) {
    try {
      const [walkData, crimeData, airQuality, businessData] = await Promise.all([
        this.getWalkScoreData(latitude, longitude),
        this.getCrimeData(zipCode),
        this.getAirQualityData(zipCode),
        this.getBusinessDensity(latitude, longitude)
      ]);

      return {
        walkability_score: walkData?.walkscore || 0,
        transit_score: walkData?.transit_score || 0,
        bike_score: walkData?.bike_score || 0,
        crime_rate: crimeData?.crime_index || 0,
        air_quality_index: airQuality?.aqi || 0,
        noise_level: this.estimateNoiseLevel(businessData),
        traffic_rating: walkData?.traffic_rating || 0,
        restaurant_rating: businessData?.restaurant_score || 0,
        shopping_rating: businessData?.shopping_score || 0,
        parks_recreation_rating: businessData?.parks_score || 0,
        healthcare_rating: businessData?.healthcare_score || 0,
        source: 'Walk Score, FBI Crime Data, EPA AQI, Yelp',
        last_updated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Quality of life data error:', error);
      return null;
    }
  }

  private static async getWalkScoreData(lat: number, lon: number) {
    // Walk Score API (Free tier: 5,000 calls/month)
    try {
      const response = await fetch(
        `${this.QOL_APIS.walkscore}?format=json&lat=${lat}&lon=${lon}&transit=1&bike=1&wsapikey=YOUR_WALKSCORE_API_KEY`
      );
      const data = await response.json();
      return {
        walkscore: data.walkscore || 0,
        transit_score: data.transit?.score || 0,
        bike_score: data.bike?.score || 0,
        traffic_rating: this.calculateTrafficRating(data)
      };
    } catch (error) {
      return null;
    }
  }

  private static async getCrimeData(zipCode: string) {
    // FBI Crime Data API (FREE)
    try {
      const response = await fetch(
        `${this.QOL_APIS.crime}/data/nibrs/${zipCode}/offense`
      );
      const data = await response.json();
      return {
        crime_index: this.calculateCrimeIndex(data),
        violent_crime_rate: data.violent_crime || 0,
        property_crime_rate: data.property_crime || 0
      };
    } catch (error) {
      return null;
    }
  }

  private static async getAirQualityData(zipCode: string) {
    // EPA AirNow API (FREE)
    try {
      const response = await fetch(
        `${this.QOL_APIS.air_quality}/?format=application/json&zipCode=${zipCode}&API_KEY=YOUR_EPA_API_KEY`
      );
      const data = await response.json();
      return {
        aqi: data[0]?.AQI || 0,
        pm25: data[0]?.PM25 || 0,
        ozone: data[0]?.Ozone || 0
      };
    } catch (error) {
      return null;
    }
  }

  private static async getBusinessDensity(lat: number, lon: number) {
    // Yelp API for business density and ratings
    try {
      const categories = ['restaurants', 'shopping', 'parks', 'health'];
      const businessPromises = categories.map(category => 
        this.getYelpBusinesses(lat, lon, category)
      );
      
      const results = await Promise.all(businessPromises);
      
      return {
        restaurant_score: this.calculateBusinessScore(results[0]),
        shopping_score: this.calculateBusinessScore(results[1]),
        parks_score: this.calculateBusinessScore(results[2]),
        healthcare_score: this.calculateBusinessScore(results[3])
      };
    } catch (error) {
      return null;
    }
  }

  private static async getYelpBusinesses(lat: number, lon: number, category: string) {
    try {
      const response = await fetch(
        `${this.QOL_APIS.yelp}?latitude=${lat}&longitude=${lon}&categories=${category}&radius=5000&limit=50`,
        {
          headers: {
            'Authorization': 'Bearer YOUR_YELP_API_KEY'
          }
        }
      );
      return await response.json();
    } catch (error) {
      return { businesses: [] };
    }
  }

  private static calculateCrimeIndex(crimeData: any): number {
    // Convert raw crime data to 0-10 scale (lower is better)
    const violent = crimeData.violent_crime || 0;
    const property = crimeData.property_crime || 0;
    const total = violent + property;
    
    // Normalize to 0-10 scale based on national averages
    return Math.min((total / 100) * 10, 10);
  }

  private static calculateBusinessScore(businessData: any): number {
    if (!businessData?.businesses) return 0;
    
    const businesses = businessData.businesses;
    const avgRating = businesses.reduce((sum: number, b: any) => sum + (b.rating || 0), 0) / businesses.length;
    const density = Math.min(businesses.length / 10, 1); // Normalize density
    
    return (avgRating * 0.7 + density * 10 * 0.3); // Weight quality over quantity
  }

  private static calculateTrafficRating(walkData: any): number {
    // Estimate traffic based on walk score and transit availability
    const walkScore = walkData.walkscore || 0;
    const transitScore = walkData.transit?.score || 0;
    
    // Higher walk/transit scores usually correlate with better traffic management
    return (walkScore * 0.6 + transitScore * 0.4) / 10;
  }

  private static estimateNoiseLevel(businessData: any): number {
    // Estimate noise based on business density and types
    const totalBusinesses = Object.values(businessData || {}).reduce((sum: number, score: any) => sum + (score || 0), 0);
    
    // More businesses typically mean more noise
    return Math.min(totalBusinesses / 4, 10);
  }
}
