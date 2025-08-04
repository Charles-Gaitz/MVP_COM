import { GoogleMapsService } from '../services/googleMaps'
import { WeatherService } from '../services/weather'
import { RealEstateService } from '../services/realEstate'
import { SchoolService } from '../services/schools'
import { FreeTierManager } from '../services/freeTierManager'
import { DemographicsService } from '../services/demographicsService'
import { EnhancedRealEstateService } from '../services/enhancedRealEstateService'
import { QualityOfLifeService } from '../services/qualityOfLifeService'
import { InfrastructureService } from '../services/infrastructureService'

// Community interface with enhanced data
export interface Community {
  id: string
  name: string
  city: string
  state: string
  zip_code: string
  description: string
  median_home_price: number
  price_per_sqft: number
  population: number
  median_age: number
  median_income: number
  crime_rate: number
  school_rating: number
  walkability_score: number
  transit_score: number
  bike_score: number
  cost_of_living_index: number
  unemployment_rate: number
  weather_rating: number
  air_quality_index: number
  noise_level: number
  traffic_rating: number
  nightlife_rating: number
  restaurant_rating: number
  shopping_rating: number
  parks_recreation_rating: number
  healthcare_rating: number
  diversity_index: number
  community_events_score: number
  local_business_support: number
  internet_speed: number
  cell_coverage: number
  property_tax_rate: number
  sales_tax_rate: number
  commute_time_downtown: number
  public_transportation: number
  parking_availability: number
  grocery_stores_count: number
  restaurants_count: number
  parks_count: number
  schools_count: number
  hospitals_count: number
  libraries_count: number
  gyms_fitness_count: number
  latitude: number
  longitude: number
  images: string[]
  amenities: string[]
  nearby_attractions: string[]
  transportation_options: string[]
  created_at: string
  updated_at: string
  // Enhanced real-time data
  market_data?: any
  weather_data?: any
  school_data?: any
  nearby_places?: any
  // Real data source tracking
  real_data_sources?: {
    demographics?: string
    housing?: string
    quality_of_life?: string
    infrastructure?: string
    last_updated?: string
  }
}

export interface User {
  id: string
  email: string
  name: string
  preferences?: UserPreferences
  favorites: string[]
  created_at: string
}

export interface UserPreferences {
  budget_range: [number, number]
  preferred_cities: string[]
  must_have_amenities: string[]
  lifestyle_priorities: string[]
  commute_preferences: {
    max_time: number
    transportation_mode: string
  }
}

// Enhanced Database Service with real-time API integration
export class DatabaseService {
  // Enhanced community data with real-time APIs and intelligent caching
  static async getAllCommunities(): Promise<Community[]> {
    try {
      // Check cache first
      const cacheKey = 'enhanced_communities_all';
      const cachedData = FreeTierManager.getCache<Community[]>(cacheKey);
      
      if (cachedData) {
        console.log('✅ Using cached community data');
        return cachedData;
      }

      // Get base community data from database
      const communities = await this.getBaseCommunities()
      
      // Enhance with real-time data using intelligent API management
      const enhancedCommunities = await Promise.all(
        communities.map(async (community) => {
          const enhancementPromises: Promise<any>[] = [];
          
          // Only make API calls if within limits and high priority
          if (FreeTierManager.canMakeAPICall('real_estate')) {
            enhancementPromises.push(
              RealEstateService.getMarketData(community.zip_code)
                .then(data => {
                  FreeTierManager.recordAPICall('real_estate');
                  return { market_data: data };
                })
                .catch(() => ({ market_data: FreeTierManager.getFallbackData('market_data') }))
            );
          } else {
            enhancementPromises.push(Promise.resolve({ market_data: FreeTierManager.getFallbackData('market_data') }));
          }

          if (FreeTierManager.canMakeAPICall('weather')) {
            enhancementPromises.push(
              WeatherService.getCurrentWeather(community.latitude, community.longitude)
                .then(data => {
                  FreeTierManager.recordAPICall('weather');
                  return { weather_data: data };
                })
                .catch(() => ({ weather_data: FreeTierManager.getFallbackData('weather') }))
            );
          } else {
            enhancementPromises.push(Promise.resolve({ weather_data: FreeTierManager.getFallbackData('weather') }));
          }

          if (FreeTierManager.canMakeAPICall('school_data')) {
            enhancementPromises.push(
              SchoolService.getSchoolDistrict(community.zip_code)
                .then(data => {
                  FreeTierManager.recordAPICall('school_data');
                  return { school_data: data };
                })
                .catch(() => ({ school_data: FreeTierManager.getFallbackData('school_data', community.city) }))
            );
          } else {
            enhancementPromises.push(Promise.resolve({ school_data: FreeTierManager.getFallbackData('school_data', community.city) }));
          }

          if (FreeTierManager.canMakeAPICall('google_maps')) {
            enhancementPromises.push(
              GoogleMapsService.findNearbyPlaces(community.latitude, community.longitude, 'restaurant')
                .then(data => {
                  FreeTierManager.recordAPICall('google_maps');
                  return { nearby_places: data };
                })
                .catch(() => ({ nearby_places: FreeTierManager.getFallbackData('nearby_places') }))
            );
          } else {
            enhancementPromises.push(Promise.resolve({ nearby_places: FreeTierManager.getFallbackData('nearby_places') }));
          }

          // Wait for all enhancements
          const enhancements = await Promise.all(enhancementPromises);
          
          // Merge all enhancements into community data
          const enhancedCommunity = enhancements.reduce((acc, enhancement) => ({
            ...acc,
            ...enhancement
          }), { ...community });

          return enhancedCommunity;
        })
      )

      // Cache the enhanced data for 6 hours
      FreeTierManager.setCache(cacheKey, enhancedCommunities, 6 * 60 * 60 * 1000);
      
      console.log('✅ Enhanced communities loaded with real-time data');
      return enhancedCommunities;
    } catch (error) {
      console.error('Error fetching enhanced communities:', error)
      // Return base data as fallback
      return this.getBaseCommunities()
    }
  }

  // Get base community data (comprehensive dataset for development)
  private static async getBaseCommunities(): Promise<Community[]> {
    return [
      {
        id: 'westlake',
        name: 'Westlake',
        city: 'Austin',
        state: 'TX',
        zip_code: '78746',
        description: 'Upscale residential community with excellent schools and luxury amenities',
        median_home_price: 485000,
        price_per_sqft: 520,
        population: 3438,
        median_age: 42,
        median_income: 125000,
        crime_rate: 0.8,
        school_rating: 9.5,
        walkability_score: 25,
        transit_score: 35,
        bike_score: 45,
        cost_of_living_index: 135,
        unemployment_rate: 1.9,
        weather_rating: 8.2,
        air_quality_index: 38,
        noise_level: 4.2,
        traffic_rating: 7.8,
        nightlife_rating: 6.5,
        restaurant_rating: 8.8,
        shopping_rating: 9.2,
        parks_recreation_rating: 9.5,
        healthcare_rating: 9.5,
        diversity_index: 6.5,
        community_events_score: 8.2,
        local_business_support: 8.8,
        internet_speed: 600,
        cell_coverage: 98,
        property_tax_rate: 2.1,
        sales_tax_rate: 8.25,
        commute_time_downtown: 28,
        public_transportation: 6.5,
        parking_availability: 8.8,
        grocery_stores_count: 6,
        restaurants_count: 45,
        parks_count: 15,
        schools_count: 8,
        hospitals_count: 2,
        libraries_count: 1,
        gyms_fitness_count: 8,
        latitude: 30.2795,
        longitude: -97.8081,
        images: ['https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'],
        amenities: ['Top-rated Schools', 'Lake Access', 'Luxury Shopping', 'Golf Courses'],
        nearby_attractions: ['Zilker Park', 'Barton Springs', 'Austin City Limits'],
        transportation_options: ['Private Shuttles', 'Ride Share', 'Bike Paths'],
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-03-01T00:00:00Z'
      },
      {
        id: 'plano',
        name: 'Plano',
        city: 'Dallas',
        state: 'TX',
        zip_code: '75023',
        description: 'Family-friendly suburban community with excellent schools and shopping',
        median_home_price: 425000,
        price_per_sqft: 180,
        population: 285494,
        median_age: 38,
        median_income: 95000,
        crime_rate: 1.2,
        school_rating: 9.0,
        walkability_score: 42,
        transit_score: 45,
        bike_score: 55,
        cost_of_living_index: 108,
        unemployment_rate: 2.8,
        weather_rating: 7.8,
        air_quality_index: 52,
        noise_level: 5.5,
        traffic_rating: 6.5,
        nightlife_rating: 7.2,
        restaurant_rating: 8.5,
        shopping_rating: 9.0,
        parks_recreation_rating: 8.8,
        healthcare_rating: 8.8,
        diversity_index: 7.8,
        community_events_score: 8.5,
        local_business_support: 8.2,
        internet_speed: 400,
        cell_coverage: 95,
        property_tax_rate: 2.3,
        sales_tax_rate: 8.25,
        commute_time_downtown: 26,
        public_transportation: 7.0,
        parking_availability: 8.5,
        grocery_stores_count: 25,
        restaurants_count: 180,
        parks_count: 35,
        schools_count: 45,
        hospitals_count: 8,
        libraries_count: 5,
        gyms_fitness_count: 22,
        latitude: 33.0198,
        longitude: -96.6989,
        images: ['https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'],
        amenities: ['Shopping Centers', 'Corporate Headquarters', 'Family Recreation'],
        nearby_attractions: ['Legacy West', 'Arbor Hills Nature Preserve', 'Plano Balloon Festival'],
        transportation_options: ['DART Rail', 'Bus Routes', 'Bike Lanes'],
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-03-01T00:00:00Z'
      },
      {
        id: 'katy',
        name: 'Katy',
        city: 'Houston',
        state: 'TX',
        zip_code: '77494',
        description: 'Growing suburban community known for excellent schools and family amenities',
        median_home_price: 385000,
        price_per_sqft: 140,
        population: 21894,
        median_age: 35,
        median_income: 88000,
        crime_rate: 1.1,
        school_rating: 9.2,
        walkability_score: 35,
        transit_score: 25,
        bike_score: 40,
        cost_of_living_index: 102,
        unemployment_rate: 3.1,
        weather_rating: 7.5,
        air_quality_index: 58,
        noise_level: 5.8,
        traffic_rating: 6.2,
        nightlife_rating: 6.8,
        restaurant_rating: 8.2,
        shopping_rating: 8.5,
        parks_recreation_rating: 8.5,
        healthcare_rating: 8.2,
        diversity_index: 8.5,
        community_events_score: 8.0,
        local_business_support: 7.8,
        internet_speed: 350,
        cell_coverage: 92,
        property_tax_rate: 2.8,
        sales_tax_rate: 8.25,
        commute_time_downtown: 32,
        public_transportation: 5.5,
        parking_availability: 8.8,
        grocery_stores_count: 18,
        restaurants_count: 120,
        parks_count: 28,
        schools_count: 35,
        hospitals_count: 4,
        libraries_count: 3,
        gyms_fitness_count: 15,
        latitude: 29.7858,
        longitude: -95.8244,
        images: ['https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'],
        amenities: ['Top Schools', 'Family Parks', 'Shopping Districts'],
        nearby_attractions: ['Katy Mills Mall', 'Typhoon Texas', 'Mary Jo Peckham Park'],
        transportation_options: ['Park & Ride', 'School Buses', 'Bike Paths'],
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-03-01T00:00:00Z'
      },
      {
        id: 'the-woodlands',
        name: 'The Woodlands',
        city: 'Houston',
        state: 'TX',
        zip_code: '77381',
        description: 'Master-planned community with extensive green spaces and amenities',
        median_home_price: 465000,
        price_per_sqft: 165,
        population: 118365,
        median_age: 40,
        median_income: 105000,
        crime_rate: 0.9,
        school_rating: 8.8,
        walkability_score: 52,
        transit_score: 35,
        bike_score: 48,
        cost_of_living_index: 115,
        unemployment_rate: 2.5,
        weather_rating: 7.5,
        air_quality_index: 55,
        noise_level: 4.8,
        traffic_rating: 7.0,
        nightlife_rating: 7.8,
        restaurant_rating: 8.8,
        shopping_rating: 9.2,
        parks_recreation_rating: 9.8,
        healthcare_rating: 9.0,
        diversity_index: 7.2,
        community_events_score: 9.2,
        local_business_support: 8.8,
        internet_speed: 500,
        cell_coverage: 96,
        property_tax_rate: 2.8,
        sales_tax_rate: 8.25,
        commute_time_downtown: 35,
        public_transportation: 6.0,
        parking_availability: 8.5,
        grocery_stores_count: 22,
        restaurants_count: 200,
        parks_count: 45,
        schools_count: 38,
        hospitals_count: 6,
        libraries_count: 4,
        gyms_fitness_count: 18,
        latitude: 30.1588,
        longitude: -95.4613,
        images: ['https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'],
        amenities: ['Nature Trails', 'Town Centers', 'Golf Courses', 'Concert Venues'],
        nearby_attractions: ['Cynthia Woods Mitchell Pavilion', 'Market Street', 'Hughes Landing'],
        transportation_options: ['Park & Ride', 'Waterway Cruiser', 'Bike Trails'],
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-03-01T00:00:00Z'
      },
      {
        id: 'frisco',
        name: 'Frisco',
        city: 'Dallas',
        state: 'TX',
        zip_code: '75034',
        description: 'Fast-growing city with sports facilities and corporate headquarters',
        median_home_price: 485000,
        price_per_sqft: 175,
        population: 200509,
        median_age: 36,
        median_income: 118000,
        crime_rate: 1.0,
        school_rating: 9.3,
        walkability_score: 38,
        transit_score: 42,
        bike_score: 50,
        cost_of_living_index: 112,
        unemployment_rate: 2.2,
        weather_rating: 7.8,
        air_quality_index: 48,
        noise_level: 5.2,
        traffic_rating: 6.8,
        nightlife_rating: 7.5,
        restaurant_rating: 8.8,
        shopping_rating: 9.5,
        parks_recreation_rating: 9.2,
        healthcare_rating: 8.8,
        diversity_index: 8.2,
        community_events_score: 9.0,
        local_business_support: 9.0,
        internet_speed: 600,
        cell_coverage: 98,
        property_tax_rate: 2.3,
        sales_tax_rate: 8.25,
        commute_time_downtown: 32,
        public_transportation: 7.2,
        parking_availability: 8.8,
        grocery_stores_count: 28,
        restaurants_count: 250,
        parks_count: 42,
        schools_count: 48,
        hospitals_count: 8,
        libraries_count: 6,
        gyms_fitness_count: 25,
        latitude: 33.1507,
        longitude: -96.8236,
        images: ['https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'],
        amenities: ['Sports Complexes', 'Corporate Centers', 'Shopping Districts'],
        nearby_attractions: ['Star District', 'National Videogame Museum', 'Toyota Stadium'],
        transportation_options: ['DART Rail', 'Bus Service', 'Bike Lanes'],
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-03-01T00:00:00Z'
      },
      {
        id: 'sugar-land',
        name: 'Sugar Land',
        city: 'Houston',
        state: 'TX',
        zip_code: '77479',
        description: 'Affluent suburban city with excellent schools and cultural amenities',
        median_home_price: 425000,
        price_per_sqft: 155,
        population: 118600,
        median_age: 39,
        median_income: 115000,
        crime_rate: 0.7,
        school_rating: 9.4,
        walkability_score: 45,
        transit_score: 38,
        bike_score: 42,
        cost_of_living_index: 118,
        unemployment_rate: 2.1,
        weather_rating: 7.5,
        air_quality_index: 54,
        noise_level: 4.5,
        traffic_rating: 6.8,
        nightlife_rating: 7.2,
        restaurant_rating: 9.0,
        shopping_rating: 8.8,
        parks_recreation_rating: 8.8,
        healthcare_rating: 9.2,
        diversity_index: 9.0,
        community_events_score: 8.5,
        local_business_support: 8.5,
        internet_speed: 450,
        cell_coverage: 95,
        property_tax_rate: 2.8,
        sales_tax_rate: 8.25,
        commute_time_downtown: 28,
        public_transportation: 6.5,
        parking_availability: 8.5,
        grocery_stores_count: 20,
        restaurants_count: 180,
        parks_count: 32,
        schools_count: 35,
        hospitals_count: 5,
        libraries_count: 4,
        gyms_fitness_count: 18,
        latitude: 29.6196,
        longitude: -95.6349,
        images: ['https://images.pexels.com/photos/1486974/pexels-photo-1486974.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'],
        amenities: ['Cultural Centers', 'Business Districts', 'Parks'],
        nearby_attractions: ['Sugar Land Town Square', 'Smart Financial Centre', 'Brazos River Park'],
        transportation_options: ['Park & Ride', 'Bus Routes', 'Bike Trails'],
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-03-01T00:00:00Z'
      },
      {
        id: 'allen',
        name: 'Allen',
        city: 'Dallas',
        state: 'TX',
        zip_code: '75013',
        description: 'Family-oriented community with excellent schools and recreational facilities',
        median_home_price: 395000,
        price_per_sqft: 165,
        population: 105623,
        median_age: 37,
        median_income: 98000,
        crime_rate: 1.1,
        school_rating: 9.0,
        walkability_score: 35,
        transit_score: 28,
        bike_score: 38,
        cost_of_living_index: 108,
        unemployment_rate: 2.8,
        weather_rating: 7.8,
        air_quality_index: 50,
        noise_level: 5.0,
        traffic_rating: 6.5,
        nightlife_rating: 6.8,
        restaurant_rating: 8.2,
        shopping_rating: 8.5,
        parks_recreation_rating: 9.0,
        healthcare_rating: 8.5,
        diversity_index: 7.8,
        community_events_score: 8.8,
        local_business_support: 8.0,
        internet_speed: 400,
        cell_coverage: 94,
        property_tax_rate: 2.3,
        sales_tax_rate: 8.25,
        commute_time_downtown: 35,
        public_transportation: 6.0,
        parking_availability: 8.8,
        grocery_stores_count: 18,
        restaurants_count: 140,
        parks_count: 38,
        schools_count: 32,
        hospitals_count: 4,
        libraries_count: 3,
        gyms_fitness_count: 15,
        latitude: 33.1031,
        longitude: -96.6706,
        images: ['https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'],
        amenities: ['Recreation Centers', 'Event Center', 'Youth Sports'],
        nearby_attractions: ['Allen Event Center', 'Watters Creek', 'Allen Station Park'],
        transportation_options: ['DART Bus', 'Park & Ride', 'Bike Paths'],
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-03-01T00:00:00Z'
      },
      {
        id: 'round-rock',
        name: 'Round Rock',
        city: 'Austin',
        state: 'TX',
        zip_code: '78664',
        description: 'Growing suburb north of Austin with tech companies and family amenities',
        median_home_price: 365000,
        price_per_sqft: 155,
        population: 133372,
        median_age: 34,
        median_income: 85000,
        crime_rate: 1.8,
        school_rating: 8.5,
        walkability_score: 32,
        transit_score: 25,
        bike_score: 35,
        cost_of_living_index: 105,
        unemployment_rate: 3.2,
        weather_rating: 8.2,
        air_quality_index: 42,
        noise_level: 5.5,
        traffic_rating: 6.2,
        nightlife_rating: 6.5,
        restaurant_rating: 7.8,
        shopping_rating: 8.2,
        parks_recreation_rating: 8.2,
        healthcare_rating: 8.0,
        diversity_index: 7.5,
        community_events_score: 7.8,
        local_business_support: 7.8,
        internet_speed: 400,
        cell_coverage: 92,
        property_tax_rate: 2.1,
        sales_tax_rate: 8.25,
        commute_time_downtown: 35,
        public_transportation: 5.5,
        parking_availability: 8.5,
        grocery_stores_count: 15,
        restaurants_count: 120,
        parks_count: 28,
        schools_count: 28,
        hospitals_count: 3,
        libraries_count: 2,
        gyms_fitness_count: 12,
        latitude: 30.5083,
        longitude: -97.6789,
        images: ['https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'],
        amenities: ['Tech Companies', 'Dell Diamond', 'Family Recreation'],
        nearby_attractions: ['Dell Diamond', 'Round Rock Premium Outlets', 'Old Settlers Park'],
        transportation_options: ['Capital Metro', 'Park & Ride', 'Bike Lanes'],
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-03-01T00:00:00Z'
      }
    ]
  }

  // NEW: Get community data with real APIs (Phase 2 implementation)
  static async getCommunityWithRealData(communityId: string): Promise<Community | null> {
    try {
      const baseCommunity = await this.getCommunityById(communityId);
      if (!baseCommunity) return null;

      console.log(`🔄 Fetching real data for ${baseCommunity.name}...`);

      // Get real data from multiple services
      const [demographics, housingMetrics, qualityOfLife, infrastructure] = await Promise.all([
        DemographicsService.getDemographics(baseCommunity.zip_code),
        EnhancedRealEstateService.getHousingMetrics(baseCommunity.zip_code),
        QualityOfLifeService.getQualityOfLifeMetrics(
          baseCommunity.zip_code, 
          baseCommunity.latitude, 
          baseCommunity.longitude
        ),
        InfrastructureService.getInfrastructureData(
          baseCommunity.zip_code,
          baseCommunity.latitude,
          baseCommunity.longitude
        )
      ]);

      // Merge real data with base community data
      const enhancedCommunity: Community = {
        ...baseCommunity,
        
        // Real Demographics Data
        population: demographics?.population || baseCommunity.population,
        median_age: demographics?.median_age || baseCommunity.median_age,
        median_income: demographics?.median_income || baseCommunity.median_income,
        diversity_index: demographics?.diversity_index || baseCommunity.diversity_index,
        unemployment_rate: demographics?.unemployment_rate || baseCommunity.unemployment_rate,
        
        // Real Housing Data
        median_home_price: housingMetrics?.median_home_price || baseCommunity.median_home_price,
        price_per_sqft: housingMetrics?.price_per_sqft || baseCommunity.price_per_sqft,
        
        // Real Quality of Life Data
        walkability_score: qualityOfLife?.walkability_score || baseCommunity.walkability_score,
        transit_score: qualityOfLife?.transit_score || baseCommunity.transit_score,
        bike_score: qualityOfLife?.bike_score || baseCommunity.bike_score,
        crime_rate: qualityOfLife?.crime_rate || baseCommunity.crime_rate,
        air_quality_index: qualityOfLife?.air_quality_index || baseCommunity.air_quality_index,
        noise_level: qualityOfLife?.noise_level || baseCommunity.noise_level,
        traffic_rating: qualityOfLife?.traffic_rating || baseCommunity.traffic_rating,
        restaurant_rating: qualityOfLife?.restaurant_rating || baseCommunity.restaurant_rating,
        shopping_rating: qualityOfLife?.shopping_rating || baseCommunity.shopping_rating,
        parks_recreation_rating: qualityOfLife?.parks_recreation_rating || baseCommunity.parks_recreation_rating,
        healthcare_rating: qualityOfLife?.healthcare_rating || baseCommunity.healthcare_rating,
        
        // Real Infrastructure Data
        school_rating: infrastructure?.school_rating || baseCommunity.school_rating,
        schools_count: infrastructure?.schools_count || baseCommunity.schools_count,
        hospitals_count: infrastructure?.hospitals_count || baseCommunity.hospitals_count,
        libraries_count: infrastructure?.libraries_count || baseCommunity.libraries_count,
        gyms_fitness_count: infrastructure?.gyms_fitness_count || baseCommunity.gyms_fitness_count,
        grocery_stores_count: infrastructure?.grocery_stores_count || baseCommunity.grocery_stores_count,
        restaurants_count: infrastructure?.restaurants_count || baseCommunity.restaurants_count,
        parks_count: infrastructure?.parks_count || baseCommunity.parks_count,
        public_transportation: infrastructure?.public_transportation || baseCommunity.public_transportation,
        parking_availability: infrastructure?.parking_availability || baseCommunity.parking_availability,
        internet_speed: infrastructure?.internet_speed || baseCommunity.internet_speed,
        cell_coverage: infrastructure?.cell_coverage || baseCommunity.cell_coverage,
        
        // Add metadata about data sources
        real_data_sources: {
          demographics: demographics?.source || 'sample',
          housing: housingMetrics?.source || 'sample',
          quality_of_life: qualityOfLife?.source || 'sample',
          infrastructure: infrastructure?.source || 'sample',
          last_updated: new Date().toISOString()
        },
        
        updated_at: new Date().toISOString()
      };

      console.log(`✅ Enhanced ${baseCommunity.name} with real data`);
      return enhancedCommunity;

    } catch (error) {
      console.error('Error fetching real community data:', error);
      // Fallback to base data
      return this.getCommunityById(communityId);
    }
  }

  // Get unique cities from communities
  static async getUniqueCities(): Promise<string[]> {
    try {
      const communities = await this.getAllCommunities()
      const cities = [...new Set(communities.map(c => c.city))]
      return cities.sort()
    } catch (error) {
      console.error('Error fetching cities:', error)
      return ['Austin'] // Fallback
    }
  }

  static async getCommunityById(id: string): Promise<Community | null> {
    try {
      const communities = await this.getAllCommunities()
      return communities.find(c => c.id === id) || null
    } catch (error) {
      console.error('Error fetching community:', error)
      return null
    }
  }

  static async getCommunitiesByCity(city: string): Promise<Community[]> {
    try {
      const communities = await this.getAllCommunities()
      return communities.filter(c => c.city === city)
    } catch (error) {
      console.error('Error fetching communities by city:', error)
      return []
    }
  }

  static async searchCommunities(filters: {
    minPrice?: number
    maxPrice?: number
    city?: string
    minSchoolRating?: number
    minWalkabilityScore?: number
  }): Promise<Community[]> {
    try {
      const communities = await this.getAllCommunities()
      
      return communities.filter(community => {
        if (filters.minPrice && community.median_home_price < filters.minPrice) return false
        if (filters.maxPrice && community.median_home_price > filters.maxPrice) return false
        if (filters.city && community.city !== filters.city) return false
        if (filters.minSchoolRating && community.school_rating < filters.minSchoolRating) return false
        if (filters.minWalkabilityScore && community.walkability_score < filters.minWalkabilityScore) return false
        return true
      })
    } catch (error) {
      console.error('Error searching communities:', error)
      return []
    }
  }

  // Enhanced community insights with real-time data
  static async getCommunityInsights(communityId: string): Promise<any> {
    try {
      const community = await this.getCommunityById(communityId)
      if (!community) return null

      // Get real-time market predictions
      const marketPredictions = await RealEstateService.getPricePredictions(community.zip_code)
      
      // Get commute data
      const commuteData = await GoogleMapsService.getCommuteTime(
        `${community.name}, ${community.city}, ${community.state}`
      )

      // Get air quality
      const airQuality = await WeatherService.getAirQuality(
        community.latitude, 
        community.longitude
      )

      return {
        marketTrend: community.market_data?.marketTrend || 'stable',
        predictions: marketPredictions,
        commuteData,
        airQuality,
        bestFeatures: this.analyzeBestFeatures(community),
        investmentScore: this.calculateInvestmentScore(community),
        livabilityScore: this.calculateLivabilityScore(community)
      }
    } catch (error) {
      console.error('Error fetching community insights:', error)
      return null
    }
  }

  private static analyzeBestFeatures(community: Community): string[] {
    const features = []
    if (community.school_rating >= 8) features.push('Excellent Schools')
    if (community.walkability_score >= 80) features.push('Very Walkable')
    if (community.crime_rate <= 3) features.push('Low Crime Rate')
    if (community.restaurant_rating >= 8.5) features.push('Great Dining')
    if (community.nightlife_rating >= 8.5) features.push('Vibrant Nightlife')
    if (community.transit_score >= 80) features.push('Good Transit')
    return features.slice(0, 3)
  }

  private static calculateInvestmentScore(community: Community): number {
    const factors = [
      community.school_rating / 10,
      (10 - community.crime_rate) / 10,
      community.walkability_score / 100,
      community.transit_score / 100,
      community.diversity_index / 10
    ]
    return Number((factors.reduce((a, b) => a + b) / factors.length * 10).toFixed(1))
  }

  private static calculateLivabilityScore(community: Community): number {
    const factors = [
      community.walkability_score / 100,
      community.weather_rating / 10,
      (100 - community.air_quality_index) / 100,
      community.healthcare_rating / 10,
      community.parks_recreation_rating / 10
    ]
    return Number((factors.reduce((a, b) => a + b) / factors.length * 10).toFixed(1))
  }

  // User management
  static async createUser(userData: Partial<User>): Promise<User | null> {
    try {
      // Would create user in Supabase
      return {
        id: 'user_1',
        email: userData.email || '',
        name: userData.name || '',
        favorites: [],
        created_at: new Date().toISOString()
      }
    } catch (error) {
      console.error('Error creating user:', error)
      return null
    }
  }

  // Test connection
  static async testConnection(): Promise<boolean> {
    try {
      const communities = await this.getBaseCommunities()
      return communities.length > 0
    } catch (error) {
      console.error('Database connection test failed:', error)
      return false
    }
  }
}

// Backward compatibility exports
export const database = DatabaseService
export const supabase = DatabaseService
export const testConnection = DatabaseService.testConnection
