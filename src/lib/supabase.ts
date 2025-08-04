// Simplified supabase configuration - using fallback for now
// Will integrate real Supabase once package installation is working

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  throw new Error('Missing Supabase environment variables. Check your .env file.')
}

// Mock client for development
export const supabase = {
  from: () => ({
    select: () => Promise.resolve({ data: [], error: null }),
    insert: () => Promise.resolve({ data: null, error: null })
  })
}

// Test connection function
export const testConnection = async () => {
  try {
    console.log('✅ Mock database connected successfully!')
    return { success: true }
  } catch (err) {
    console.error('Database connection error:', err)
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

// Database types for TypeScript
export interface Community {
  id: number
  name: string
  slug: string
  city: string
  county: string
  state: string
  latitude?: number
  longitude?: number
  zip_codes?: string[]
  population?: number
  median_age?: number
  median_household_income?: number
  average_home_price?: number
  median_home_price?: number
  average_rent?: number
  home_price_trend?: 'rising' | 'falling' | 'stable'
  school_district?: string
  school_rating?: number
  elementary_schools?: number
  middle_schools?: number
  high_schools?: number
  crime_rate?: number
  walkability_score?: number
  transit_score?: number
  bike_score?: number
  average_temp_summer?: number
  average_temp_winter?: number
  annual_rainfall?: number
  unemployment_rate?: number
  job_growth_rate?: number
  major_employers?: string[]
  cost_of_living_index?: number
  diversity_index?: number
  description?: string
  short_description?: string
  image_url?: string
  gallery_images?: string[]
  video_tour_url?: string
  meta_title?: string
  meta_description?: string
  featured: boolean
  active: boolean
  created_at: string
  updated_at: string
}

export interface Amenity {
  id: number
  community_id: number
  category: string
  name: string
  type?: string
  address?: string
  distance_miles?: number
  rating?: number
  created_at: string
}

export interface Neighborhood {
  id: number
  community_id: number
  name: string
  description?: string
  average_home_price?: number
  home_price_range_min?: number
  home_price_range_max?: number
  characteristics?: string[]
  image_url?: string
  created_at: string
}

export interface Review {
  id: number
  community_id: number
  user_name?: string
  user_email?: string
  rating: number
  title?: string
  content?: string
  pros?: string[]
  cons?: string[]
  years_lived?: number
  family_type?: string
  approved: boolean
  created_at: string
}

// Database helper functions
export const database = {
  // Get all active communities
  async getCommunities() {
    try {
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .eq('active', true)
        .order('featured', { ascending: false })
        .order('name')
      
      if (error) {
        console.error('Error fetching communities:', error)
        throw error
      }
      return data as Community[]
    } catch (error) {
      console.error('Database error in getCommunities:', error)
      throw error
    }
  },

  // Get community by slug with related data
  async getCommunityBySlug(slug: string) {
    try {
      const { data, error } = await supabase
        .from('communities')
        .select(`
          *,
          amenities(*),
          neighborhoods(*),
          reviews(*)
        `)
        .eq('slug', slug)
        .eq('active', true)
        .single()
      
      if (error) {
        console.error('Error fetching community by slug:', error)
        throw error
      }
      return data
    } catch (error) {
      console.error('Database error in getCommunityBySlug:', error)
      throw error
    }
  },

  // Search communities by filters
  async searchCommunities(filters: {
    minPrice?: number
    maxPrice?: number
    minSchoolRating?: number
    cities?: string[]
    featured?: boolean
    search?: string
  }) {
    try {
      let query = supabase
        .from('communities')
        .select('*')
        .eq('active', true)

      if (filters.minPrice) {
        query = query.gte('average_home_price', filters.minPrice)
      }
      if (filters.maxPrice) {
        query = query.lte('average_home_price', filters.maxPrice)
      }
      if (filters.minSchoolRating) {
        query = query.gte('school_rating', filters.minSchoolRating)
      }
      if (filters.cities && filters.cities.length > 0) {
        query = query.in('city', filters.cities)
      }
      if (filters.featured) {
        query = query.eq('featured', true)
      }
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,city.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }

      const { data, error } = await query.order('name')
      
      if (error) {
        console.error('Error searching communities:', error)
        throw error
      }
      return data as Community[]
    } catch (error) {
      console.error('Database error in searchCommunities:', error)
      throw error
    }
  },

  // Get featured communities
  async getFeaturedCommunities() {
    try {
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .eq('active', true)
        .eq('featured', true)
        .order('name')
        .limit(6)
      
      if (error) {
        console.error('Error fetching featured communities:', error)
        throw error
      }
      return data as Community[]
    } catch (error) {
      console.error('Database error in getFeaturedCommunities:', error)
      throw error
    }
  },

  // Get communities by price range
  async getCommunitiesByPriceRange(minPrice: number, maxPrice: number) {
    try {
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .eq('active', true)
        .gte('average_home_price', minPrice)
        .lte('average_home_price', maxPrice)
        .order('average_home_price')
      
      if (error) {
        console.error('Error fetching communities by price range:', error)
        throw error
      }
      return data as Community[]
    } catch (error) {
      console.error('Database error in getCommunitiesByPriceRange:', error)
      throw error
    }
  },

  // Add user favorite
  async addFavorite(userEmail: string, communityId: number) {
    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .insert({ user_email: userEmail, community_id: communityId })
      
      if (error) {
        console.error('Error adding favorite:', error)
        throw error
      }
      return data
    } catch (error) {
      console.error('Database error in addFavorite:', error)
      throw error
    }
  },

  // Capture lead
  async captureLead(leadData: {
    email: string
    name?: string
    phone?: string
    community_interest?: number
    source?: string
    message?: string
  }) {
    try {
      const { data, error } = await supabase
        .from('lead_captures')
        .insert(leadData)
      
      if (error) {
        console.error('Error capturing lead:', error)
        throw error
      }
      return data
    } catch (error) {
      console.error('Database error in captureLead:', error)
      throw error
    }
  }
}
