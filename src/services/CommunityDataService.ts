/**
 * Integrated Community Data Service
 * Coordinates all API services to provide comprehensive community data
 */

import { BLSService, type EmploymentData } from './BLSService';
import { CensusService, type DemographicData, type HousingData, type CommuteData } from './CensusService';
import { NewsService, type NewsArticle } from './NewsService';
import { WeatherService, type WeatherData, type ClimateData } from './WeatherService';
import { PlacesService, type AmenitiesData } from './PlacesService';

export interface ComprehensiveCommunityData {
  id: string;
  name: string;
  demographics: DemographicData | null;
  employment: EmploymentData | null;
  housing: HousingData | null;
  commute: CommuteData | null;
  weather: WeatherData | null;
  climate: ClimateData | null;
  amenities: AmenitiesData | null;
  news: NewsArticle[];
  lastUpdated: string;
  dataQuality: {
    demographics: 'excellent' | 'good' | 'fair' | 'unavailable';
    employment: 'excellent' | 'good' | 'fair' | 'unavailable';
    housing: 'excellent' | 'good' | 'fair' | 'unavailable';
    weather: 'excellent' | 'good' | 'fair' | 'unavailable';
    amenities: 'excellent' | 'good' | 'fair' | 'unavailable';
  };
}

export class CommunityDataService {
  private static cache = new Map<string, { data: ComprehensiveCommunityData; timestamp: number }>();
  private static readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

  /**
   * Get comprehensive data for a community
   */
  static async getCommunityData(communityId: string): Promise<ComprehensiveCommunityData> {
    // Check cache first
    const cached = this.cache.get(communityId);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    console.log(`Fetching fresh data for community: ${communityId}`);

    // Fetch all data in parallel for better performance
    const [
      demographics,
      employment,
      housing,
      commute,
      weather,
      climate,
      amenities,
      news
    ] = await Promise.allSettled([
      CensusService.getDemographicData(communityId),
      BLSService.getEmploymentData(communityId),
      CensusService.getHousingData(communityId),
      CensusService.getCommuteData(communityId),
      WeatherService.getCurrentWeather(communityId),
      WeatherService.getClimateData(communityId),
      PlacesService.getAmenitiesData(communityId),
      NewsService.getLocalNews(communityId, 10)
    ]);

    const communityData: ComprehensiveCommunityData = {
      id: communityId,
      name: this.getCommunityName(communityId),
      demographics: demographics.status === 'fulfilled' ? demographics.value : null,
      employment: employment.status === 'fulfilled' ? employment.value : null,
      housing: housing.status === 'fulfilled' ? housing.value : null,
      commute: commute.status === 'fulfilled' ? commute.value : null,
      weather: weather.status === 'fulfilled' ? weather.value : null,
      climate: climate.status === 'fulfilled' ? climate.value : null,
      amenities: amenities.status === 'fulfilled' ? amenities.value : null,
      news: news.status === 'fulfilled' ? news.value : [],
      lastUpdated: new Date().toISOString(),
      dataQuality: {
        demographics: demographics.status === 'fulfilled' && demographics.value ? 'excellent' : 'unavailable',
        employment: employment.status === 'fulfilled' && employment.value ? 'excellent' : 'unavailable',
        housing: housing.status === 'fulfilled' && housing.value ? 'excellent' : 'unavailable',
        weather: weather.status === 'fulfilled' && weather.value ? 'excellent' : 'unavailable',
        amenities: amenities.status === 'fulfilled' && amenities.value ? 'excellent' : 'unavailable'
      }
    };

    // Cache the result
    this.cache.set(communityId, {
      data: communityData,
      timestamp: Date.now()
    });

    return communityData;
  }

  /**
   * Get specific data category for a community
   */
  static async getDemographics(communityId: string): Promise<DemographicData | null> {
    return CensusService.getDemographicData(communityId);
  }

  static async getEmployment(communityId: string): Promise<EmploymentData | null> {
    return BLSService.getEmploymentData(communityId);
  }

  static async getHousing(communityId: string): Promise<HousingData | null> {
    return CensusService.getHousingData(communityId);
  }

  static async getWeather(communityId: string): Promise<WeatherData | null> {
    return WeatherService.getCurrentWeather(communityId);
  }

  static async getAmenities(communityId: string): Promise<AmenitiesData | null> {
    return PlacesService.getAmenitiesData(communityId);
  }

  static async getNews(communityId: string, limit: number = 10): Promise<NewsArticle[]> {
    return NewsService.getLocalNews(communityId, limit);
  }

  /**
   * Refresh cached data for a community
   */
  static async refreshCommunityData(communityId: string): Promise<ComprehensiveCommunityData> {
    this.cache.delete(communityId);
    return this.getCommunityData(communityId);
  }

  /**
   * Get cached data if available
   */
  static getCachedData(communityId: string): ComprehensiveCommunityData | null {
    const cached = this.cache.get(communityId);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }

  /**
   * Check if data is stale and needs refreshing
   */
  static isDataStale(communityId: string): boolean {
    const cached = this.cache.get(communityId);
    return !cached || Date.now() - cached.timestamp >= this.CACHE_DURATION;
  }

  /**
   * Get API status for debugging
   */
  static async getAPIStatus(): Promise<Record<string, 'available' | 'unavailable'>> {
    const testCommunity = 'austin';
    
    const tests = await Promise.allSettled([
      CensusService.getDemographicData(testCommunity),
      BLSService.getEmploymentData(testCommunity),
      WeatherService.getCurrentWeather(testCommunity),
      NewsService.getLocalNews(testCommunity, 1),
      PlacesService.getAmenitiesData(testCommunity)
    ]);

    return {
      census: tests[0].status === 'fulfilled' && tests[0].value ? 'available' : 'unavailable',
      bls: tests[1].status === 'fulfilled' && tests[1].value ? 'available' : 'unavailable',
      weather: tests[2].status === 'fulfilled' && tests[2].value ? 'available' : 'unavailable',
      news: tests[3].status === 'fulfilled' && tests[3].value.length > 0 ? 'available' : 'unavailable',
      places: tests[4].status === 'fulfilled' && tests[4].value ? 'available' : 'unavailable'
    };
  }

  /**
   * Clear all cached data
   */
  static clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get community display name
   */
  private static getCommunityName(communityId: string): string {
    const names: Record<string, string> = {
      'austin': 'Austin',
      'westlake': 'Westlake Hills',
      'plano': 'Plano',
      'frisco': 'Frisco',
      'dallas': 'Dallas',
      'houston': 'Houston',
      'katy': 'Katy',
      'sugar-land': 'Sugar Land'
    };

    return names[communityId] || communityId;
  }

  /**
   * Batch load data for multiple communities
   */
  static async batchLoadCommunities(communityIds: string[]): Promise<ComprehensiveCommunityData[]> {
    console.log(`Batch loading data for ${communityIds.length} communities`);
    
    const promises = communityIds.map(id => this.getCommunityData(id));
    const results = await Promise.allSettled(promises);
    
    return results
      .filter((result): result is PromiseFulfilledResult<ComprehensiveCommunityData> => 
        result.status === 'fulfilled'
      )
      .map(result => result.value);
  }

  /**
   * Get data quality summary
   */
  static getDataQualitySummary(data: ComprehensiveCommunityData): {
    overall: 'excellent' | 'good' | 'fair' | 'poor';
    details: string[];
  } {
    const qualities = Object.values(data.dataQuality);
    const excellentCount = qualities.filter(q => q === 'excellent').length;
    const availableCount = qualities.filter(q => q !== 'unavailable').length;
    
    let overall: 'excellent' | 'good' | 'fair' | 'poor';
    if (excellentCount >= 4) overall = 'excellent';
    else if (availableCount >= 3) overall = 'good';
    else if (availableCount >= 2) overall = 'fair';
    else overall = 'poor';

    const details: string[] = [];
    if (data.dataQuality.demographics === 'unavailable') details.push('Census demographic data unavailable');
    if (data.dataQuality.employment === 'unavailable') details.push('BLS employment data unavailable');
    if (data.dataQuality.housing === 'unavailable') details.push('Housing market data unavailable');
    if (data.dataQuality.weather === 'unavailable') details.push('Weather data unavailable');
    if (data.dataQuality.amenities === 'unavailable') details.push('Amenities data unavailable');

    return { overall, details };
  }
}
