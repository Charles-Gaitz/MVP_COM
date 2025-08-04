// Database-driven community data with Supabase integration
import { Community } from '../lib/supabase'
import { database } from '../lib/supabase-enhanced'

// Convert database community to app format
export const convertCommunityFromDB = (dbCommunity: Community) => {
  return {
    id: dbCommunity.slug,
    name: dbCommunity.name,
    city: dbCommunity.city,
    region: getRegionFromCity(dbCommunity.city),
    price: getPriceRange(dbCommunity.average_home_price || 0),
    schoolRating: getSchoolRatingLetter(dbCommunity.school_rating || 0),
    medianHomePrice: dbCommunity.average_home_price || 0,
    population: dbCommunity.population || 0,
    crimeRate: dbCommunity.crime_rate || 0,
    avgCommute: 25, // Default value - could be enhanced with transportation data
    walkScore: dbCommunity.walkability_score || 0,
    type: 'Suburban', // Default - could be enhanced with community type field
    image: dbCommunity.image_url || 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop',
    
    // Extended data for detailed pages
    demographics: {
      medianAge: dbCommunity.median_age || 35,
      medianHouseholdIncome: dbCommunity.median_household_income || 60000,
      collegeEducated: 70, // Default - could be enhanced
      marriedCouples: 60   // Default - could be enhanced
    },
    housing: {
      homeOwnership: 75,   // Default - could be enhanced
      avgHomeSize: 2200,   // Default - could be enhanced
      propertyTax: 2.2,    // Default - could be enhanced
      avgRent: dbCommunity.average_rent || 1500
    },
    amenities: {
      parks: 15,      // Default - could use amenities table
      restaurants: 25, // Default - could use amenities table
      shopping: 10,   // Default - could use amenities table
      healthcare: 8,  // Default - could use amenities table
      entertainment: 12 // Default - could use amenities table
    },
    employment: {
      unemploymentRate: dbCommunity.unemployment_rate || 3.5,
      majorEmployers: dbCommunity.major_employers || [],
      averageWage: 65000 // Default - could be enhanced
    },
    climate: {
      avgTemp: ((dbCommunity.average_temp_summer || 85) + (dbCommunity.average_temp_winter || 55)) / 2,
      rainyDays: Math.round((dbCommunity.annual_rainfall || 35) * 2.5), // Rough conversion
      sunnyDays: 220 // Default - could be enhanced
    },
    
    // Additional database fields
    county: dbCommunity.county,
    state: dbCommunity.state,
    latitude: dbCommunity.latitude,
    longitude: dbCommunity.longitude,
    zipCodes: dbCommunity.zip_codes,
    description: dbCommunity.description,
    shortDescription: dbCommunity.short_description,
    featured: dbCommunity.featured,
    schoolDistrict: dbCommunity.school_district,
    costOfLivingIndex: dbCommunity.cost_of_living_index,
    diversityIndex: dbCommunity.diversity_index,
    jobGrowthRate: dbCommunity.job_growth_rate,
    homePriceTrend: dbCommunity.home_price_trend,
    transitScore: dbCommunity.transit_score,
    bikeScore: dbCommunity.bike_score
  }
}

// Helper functions
const getRegionFromCity = (city: string): string => {
  const regions: { [key: string]: string } = {
    'Austin': 'Central Texas',
    'Dallas': 'North Texas',
    'Houston': 'East Texas',
    'San Antonio': 'South Texas',
    'Fort Worth': 'North Texas',
    'Plano': 'North Texas',
    'Frisco': 'North Texas',
    'Allen': 'North Texas',
    'McKinney': 'North Texas',
    'Cedar Park': 'Central Texas',
    'Round Rock': 'Central Texas',
    'Georgetown': 'Central Texas',
    'Katy': 'East Texas',
    'Sugar Land': 'East Texas',
    'The Woodlands': 'East Texas',
    'Pearland': 'East Texas',
    'Kingwood': 'East Texas'
  }
  return regions[city] || 'Texas'
}

const getPriceRange = (price: number): string => {
  if (price >= 500000) return '$$$'
  if (price >= 300000) return '$$'
  return '$'
}

const getSchoolRatingLetter = (rating: number): string => {
  if (rating >= 9) return 'A+'
  if (rating >= 8) return 'A'
  if (rating >= 7) return 'B+'
  if (rating >= 6) return 'B'
  if (rating >= 5) return 'C+'
  return 'C'
}

// Database-driven community functions
export const communityService = {
  // Get all communities
  async getAllCommunities() {
    try {
      const dbCommunities = await database.getAllCommunities()
      return dbCommunities.map((community: any) => convertCommunityFromDB(community))
    } catch (error) {
      console.error('Error fetching communities:', error)
      // Return empty array as fallback
      return []
    }
  },

  // Get featured communities
  async getFeaturedCommunities() {
    try {
      const dbCommunities = await database.getAllCommunities()
      return dbCommunities.slice(0, 6).map((community: any) => convertCommunityFromDB(community))
    } catch (error) {
      console.error('Error fetching featured communities:', error)
      return []
    }
  },

  // Search communities with filters
  async searchCommunities(filters: {
    minPrice?: number
    maxPrice?: number
    minSchoolRating?: number
    cities?: string[]
    featured?: boolean
    search?: string
  }) {
    try {
      const dbCommunities = await database.searchCommunities(filters)
      return dbCommunities.map((community: any) => convertCommunityFromDB(community))
    } catch (error) {
      console.error('Error searching communities:', error)
      return []
    }
  },

  // Get community by slug with full details
  async getCommunityBySlug(slug: string) {
    try {
      const dbCommunity = await database.getCommunityById(slug)
      if (!dbCommunity) return null
      
      const community: any = dbCommunity
      return {
        ...convertCommunityFromDB(community),
        amenities: community.amenities || [],
        neighborhoods: community.neighborhoods || [],
        reviews: community.reviews || []
      }
    } catch (error) {
      console.error('Error fetching community by slug:', error)
      return null
    }
  },

  // Get communities by price range
  async getCommunitiesByPriceRange(minPrice: number, maxPrice: number) {
    try {
      const dbCommunities = await database.getAllCommunities()
      const filtered = dbCommunities.filter((community: any) => 
        community.median_home_price >= minPrice && community.median_home_price <= maxPrice
      )
      return filtered.map((community: any) => convertCommunityFromDB(community))
    } catch (error) {
      console.error('Error fetching communities by price range:', error)
      return []
    }
  },

  // Get unique cities for filters
  async getUniqueCities() {
    try {
      const communities = await database.getAllCommunities()
      const cities = [...new Set(communities.map((c: any) => c.city))].sort()
      return cities
    } catch (error) {
      console.error('Error fetching unique cities:', error)
      return []
    }
  },

  // Get price ranges for filters
  async getPriceRanges() {
    try {
      const communities = await database.getAllCommunities()
      const prices = communities
        .map((c: any) => c.average_home_price)
        .filter((p: any) => p !== null && p !== undefined) as number[]
      
      if (prices.length === 0) return { min: 0, max: 1000000 }
      
      return {
        min: Math.min(...prices),
        max: Math.max(...prices)
      }
    } catch (error) {
      console.error('Error fetching price ranges:', error)
      return { min: 0, max: 1000000 }
    }
  }
}

// Export for backward compatibility
export { communityService as default }
