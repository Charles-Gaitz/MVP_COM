/**
 * Integrated Community Data Service
 * Coordinates all API services to provide comprehensive community data
 */

import { BLSService, type EmploymentData } from './BLSService';
import { CensusService, type DemographicData, type HousingData, type CommuteData } from './CensusService';
import { NewsService, type NewsArticle } from './NewsService';
import { WeatherService, type WeatherData, type ClimateData } from './WeatherService';
import { PlacesService, type AmenitiesData } from './PlacesService';
import { RealEstateService, type MarketData, type PropertyListing } from './RealEstateService';
import { TransportationService, type TrafficData } from './TransportationService';

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
  realEstate: MarketData | null;
  traffic: TrafficData | null;
  news: NewsArticle[] | null;
  propertyListings: PropertyListing[] | null;
  coordinates: { lat: number; lng: number } | null;
  lastUpdated: string;
  dataQuality: {
    demographics: 'high' | 'medium' | 'low' | 'unavailable';
    employment: 'high' | 'medium' | 'low' | 'unavailable';
    housing: 'high' | 'medium' | 'low' | 'unavailable';
    realEstate: 'high' | 'medium' | 'low' | 'unavailable';
    traffic: 'high' | 'medium' | 'low' | 'unavailable';
  };
}

export interface CommunityConfig {
  id: string;
  name: string;
  city: string;
  state: string;
  zipCodes: string[];
  coordinates: { lat: number; lng: number };
  metroArea?: string;
  countyFips?: string;
  aliases?: string[];
}

export class CommunityDataService {
  private static cache = new Map<string, { data: ComprehensiveCommunityData; timestamp: number }>();
  private static readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

  // Community configuration - this replaces the static communities.ts data
  private static communityConfigs: Record<string, CommunityConfig> = {
    'westlake': {
      id: 'westlake',
      name: 'Westlake',
      city: 'Austin',
      state: 'TX',
      zipCodes: ['78746'],
      coordinates: { lat: 30.3382, lng: -97.8313 },
      metroArea: 'Austin-Round Rock-Georgetown, TX',
      countyFips: '48453'
    },
    'the-woodlands': {
      id: 'the-woodlands',
      name: 'The Woodlands',
      city: 'Houston',
      state: 'TX',
      zipCodes: ['77381', '77382', '77384'],
      coordinates: { lat: 30.1588, lng: -95.4895 },
      metroArea: 'Houston-The Woodlands-Sugar Land, TX',
      countyFips: '48201'
    },
    'plano': {
      id: 'plano',
      name: 'Plano',
      city: 'Dallas',
      state: 'TX',
      zipCodes: ['75023', '75024', '75025', '75074', '75075'],
      coordinates: { lat: 33.0198, lng: -96.6989 },
      metroArea: 'Dallas-Fort Worth-Arlington, TX',
      countyFips: '48085'
    },
    'katy': {
      id: 'katy',
      name: 'Katy',
      city: 'Houston',
      state: 'TX',
      zipCodes: ['77494', '77449', '77450'],
      coordinates: { lat: 29.7858, lng: -95.8244 },
      metroArea: 'Houston-The Woodlands-Sugar Land, TX',
      countyFips: '48157'
    },
    'allen-frisco': {
      id: 'allen-frisco',
      name: 'Allen & Frisco',
      city: 'Dallas',
      state: 'TX',
      zipCodes: ['75013', '75034', '75035'],
      coordinates: { lat: 33.1031, lng: -96.6706 },
      metroArea: 'Dallas-Fort Worth-Arlington, TX',
      countyFips: '48085'
    },
    'round-rock': {
      id: 'round-rock',
      name: 'Round Rock',
      city: 'Austin',
      state: 'TX',
      zipCodes: ['78664', '78665'],
      coordinates: { lat: 30.5083, lng: -97.6789 },
      metroArea: 'Austin-Round Rock-Georgetown, TX',
      countyFips: '48491'
    },
    'southlake': {
      id: 'southlake',
      name: 'Southlake',
      city: 'Dallas',
      state: 'TX',
      zipCodes: ['76092'],
      coordinates: { lat: 32.9412, lng: -97.1342 },
      metroArea: 'Dallas-Fort Worth-Arlington, TX',
      countyFips: '48439'
    },
    'sugar-land': {
      id: 'sugar-land',
      name: 'Sugar Land',
      city: 'Houston',
      state: 'TX',
      zipCodes: ['77479', '77478'],
      coordinates: { lat: 29.6196, lng: -95.6349 },
      metroArea: 'Houston-The Woodlands-Sugar Land, TX',
      countyFips: '48157'
    }
    // Add more communities as needed
  };

  /**
   * Get comprehensive data for a community
   */
  static async getCommunityData(communityId: string): Promise<ComprehensiveCommunityData | null> {
    try {
      // Check cache first
      const cached = this.cache.get(communityId);
      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        return cached.data;
      }

      const config = this.communityConfigs[communityId];
      if (!config) {
        console.warn(`Community config not found for: ${communityId}`);
        return null;
      }

      console.log(`Fetching fresh data for community: ${communityId}`);

      // Fetch data from all APIs in parallel
      const [
        demographics,
        employment,
        housing,
        commute,
        weather,
        climate,
        amenities,
        realEstate,
        traffic,
        news,
        propertyListings
      ] = await Promise.allSettled([
        CensusService.getDemographicData(communityId),
        BLSService.getEmploymentData(communityId),
        CensusService.getHousingData(communityId),
        CensusService.getCommuteData(communityId),
        WeatherService.getCurrentWeather(communityId),
        WeatherService.getClimateData(communityId),
        PlacesService.getAmenitiesData(communityId),
        RealEstateService.getMarketData(communityId, config.zipCodes[0], config.coordinates),
        TransportationService.getTrafficData(communityId, config.coordinates),
        NewsService.getLocalNews(communityId, 10),
        RealEstateService.getPropertyListings(communityId, { limit: 10 })
      ]);

      // Build comprehensive data object
      const communityData: ComprehensiveCommunityData = {
        id: config.id,
        name: config.name,
        demographics: demographics.status === 'fulfilled' ? demographics.value : null,
        employment: employment.status === 'fulfilled' ? employment.value : null,
        housing: housing.status === 'fulfilled' ? housing.value : null,
        commute: commute.status === 'fulfilled' ? commute.value : null,
        weather: weather.status === 'fulfilled' ? weather.value : null,
        climate: climate.status === 'fulfilled' ? climate.value : null,
        amenities: amenities.status === 'fulfilled' ? amenities.value : null,
        realEstate: realEstate.status === 'fulfilled' ? realEstate.value : null,
        traffic: traffic.status === 'fulfilled' ? traffic.value : null,
        news: news.status === 'fulfilled' ? news.value : null,
        propertyListings: propertyListings.status === 'fulfilled' ? propertyListings.value : null,
        coordinates: config.coordinates,
        lastUpdated: new Date().toISOString(),
        dataQuality: {
          demographics: this.assessDataQuality(demographics),
          employment: this.assessDataQuality(employment),
          housing: this.assessDataQuality(housing),
          realEstate: this.assessDataQuality(realEstate),
          traffic: this.assessDataQuality(traffic)
        }
      };

      // Cache the result
      this.cache.set(communityId, {
        data: communityData,
        timestamp: Date.now()
      });

      return communityData;
    } catch (error) {
      console.error('Community Data Service Error:', error);
      return null;
    }
  }

  /**
   * Get all available communities
   */
  static getAllCommunities(): CommunityConfig[] {
    return Object.values(this.communityConfigs);
  }

  /**
   * Add a new community configuration
   */
  static addCommunity(config: CommunityConfig): void {
    this.communityConfigs[config.id] = config;
  }

  /**
   * Bulk add communities
   */
  static addCommunities(configs: CommunityConfig[]): void {
    configs.forEach(config => {
      this.communityConfigs[config.id] = config;
    });
  }

  /**
   * Search communities by criteria
   */
  static searchCommunities(criteria: {
    state?: string;
    city?: string;
    metroArea?: string;
    zipCode?: string;
  }): CommunityConfig[] {
    return Object.values(this.communityConfigs).filter(config => {
      if (criteria.state && config.state !== criteria.state) return false;
      if (criteria.city && config.city !== criteria.city) return false;
      if (criteria.metroArea && config.metroArea !== criteria.metroArea) return false;
      if (criteria.zipCode && !config.zipCodes.includes(criteria.zipCode)) return false;
      return true;
    });
  }

  /**
   * Get community configuration
   */
  static getCommunityConfig(communityId: string): CommunityConfig | null {
    return this.communityConfigs[communityId] || null;
  }

  /**
   * Clear cache for a specific community or all communities
   */
  static clearCache(communityId?: string): void {
    if (communityId) {
      this.cache.delete(communityId);
    } else {
      this.cache.clear();
    }
  }

  // Private helper methods
  private static assessDataQuality(
    result: PromiseSettledResult<any>
  ): 'high' | 'medium' | 'low' | 'unavailable' {
    if (result.status === 'rejected') return 'unavailable';
    if (!result.value) return 'unavailable';
    
    // You can add more sophisticated quality assessment logic here
    return 'high';
  }
}
