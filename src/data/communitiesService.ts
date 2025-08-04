// Database service for communities with Supabase
import { supabase } from '../lib/supabase'
import type { Community } from '../lib/supabase'

// Service class for community database operations
export class CommunityService {
  // Get all communities
  static async getAllCommunities(): Promise<Community[]> {
    try {
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .order('name')
      
      if (error) {
        console.error('Error fetching communities:', error)
        throw error
      }
      
      return data || []
    } catch (error) {
      console.error('Database error:', error)
      throw error
    }
  }

  // Get featured communities (top by population)
  static async getFeaturedCommunities(limit: number = 8): Promise<Community[]> {
    try {
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .order('population', { ascending: false })
        .limit(limit)
      
      if (error) {
        console.error('Error fetching featured communities:', error)
        throw error
      }
      
      return data || []
    } catch (error) {
      console.error('Database error:', error)
      throw error
    }
  }

  // Search communities by name, city, or county
  static async searchCommunities(query: string): Promise<Community[]> {
    if (!query.trim()) {
      return this.getAllCommunities()
    }

    try {
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .or(`name.ilike.%${query}%,city.ilike.%${query}%,county.ilike.%${query}%`)
        .order('name')
      
      if (error) {
        console.error('Error searching communities:', error)
        throw error
      }
      
      return data || []
    } catch (error) {
      console.error('Database error:', error)
      throw error
    }
  }

  // Get communities by city
  static async getCommunitiesByCity(city: string): Promise<Community[]> {
    try {
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .eq('city', city)
        .order('name')
      
      if (error) {
        console.error('Error fetching communities by city:', error)
        throw error
      }
      
      return data || []
    } catch (error) {
      console.error('Database error:', error)
      throw error
    }
  }

  // Get unique cities
  static async getCities(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('communities')
        .select('city')
        .order('city')
      
      if (error) {
        console.error('Error fetching cities:', error)
        throw error
      }
      
      const cities = data?.map((item: any) => item.city).filter((city: string, index: number, arr: string[]) => arr.indexOf(city) === index) || []
      return cities
    } catch (error) {
      console.error('Database error:', error)
      throw error
    }
  }

  // Filter communities by criteria
  static async filterCommunities(filters: {
    minPrice?: number
    maxPrice?: number
    minRating?: number
    cities?: string[]
    searchQuery?: string
  }): Promise<Community[]> {
    try {
      let query = supabase.from('communities').select('*')
      
      // Apply search filter
      if (filters.searchQuery && filters.searchQuery.trim()) {
        query = query.or(`name.ilike.%${filters.searchQuery}%,city.ilike.%${filters.searchQuery}%,county.ilike.%${filters.searchQuery}%`)
      }
      
      // Apply price filters
      if (filters.minPrice) {
        query = query.gte('average_home_price', filters.minPrice)
      }
      
      if (filters.maxPrice) {
        query = query.lte('average_home_price', filters.maxPrice)
      }
      
      // Apply school rating filter
      if (filters.minRating) {
        query = query.gte('school_rating', filters.minRating)
      }
      
      // Apply city filter
      if (filters.cities && filters.cities.length > 0) {
        query = query.in('city', filters.cities)
      }
      
      const { data, error } = await query.order('name')
      
      if (error) {
        console.error('Error filtering communities:', error)
        throw error
      }
      
      return data || []
    } catch (error) {
      console.error('Database error:', error)
      throw error
    }
  }

  // Get community by slug/ID
  static async getCommunityBySlug(slug: string): Promise<Community | null> {
    try {
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .eq('slug', slug)
        .single()
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return null
        }
        console.error('Error fetching community:', error)
        throw error
      }
      
      return data
    } catch (error) {
      console.error('Database error:', error)
      throw error
    }
  }

  // Get price ranges for filtering
  static async getPriceRanges(): Promise<{ min: number; max: number }> {
    try {
      const { data, error } = await supabase
        .from('communities')
        .select('average_home_price')
        .not('average_home_price', 'is', null)
        .order('average_home_price')
      
      if (error) {
        console.error('Error fetching price ranges:', error)
        throw error
      }
      
      if (!data || data.length === 0) {
        return { min: 0, max: 1000000 }
      }
      
      const prices = data.map((item: any) => item.average_home_price).filter((p: any) => p !== null) as number[]
      return {
        min: Math.min(...prices),
        max: Math.max(...prices)
      }
    } catch (error) {
      console.error('Database error:', error)
      return { min: 0, max: 1000000 }
    }
  }
}

// Helper functions for data formatting
export const formatCommunityData = (community: Community) => ({
  id: community.slug,
  name: community.name,
  city: community.city,
  region: getRegionFromCity(community.city),
  price: formatPrice(community.average_home_price || 0),
  schoolRating: formatSchoolRating(community.school_rating || 0),
  medianHomePrice: community.average_home_price || 0,
  population: community.population || 0,
  crimeRate: community.crime_rate || 0,
  avgCommute: 25, // Default value - could be enhanced with transportation data
  walkScore: community.walkability_score || 0,
  type: 'Suburban', // Default - could be enhanced with community type field
  image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'
})

// Helper function to determine region from city
const getRegionFromCity = (city: string): string => {
  const austinArea = ['Austin', 'Cedar Park', 'Round Rock', 'Lakeway', 'Bee Cave', 'West Lake Hills', 'Pflugerville', 'Leander']
  const dallasArea = ['Dallas', 'Plano', 'Frisco', 'Allen', 'McKinney', 'Richardson', 'Carrollton', 'Irving', 'Garland']
  const houstonArea = ['Houston', 'The Woodlands', 'Katy', 'Sugar Land', 'Pearland', 'League City', 'Cypress', 'Spring', 'Tomball']
  
  if (austinArea.includes(city)) return 'Austin Metro'
  if (dallasArea.includes(city)) return 'Dallas Metro'
  if (houstonArea.includes(city)) return 'Houston Metro'
  return 'Texas'
}

const formatPrice = (price: number): string => {
  if (price >= 1000000) return '$1M+'
  if (price >= 800000) return '$800K+'
  if (price >= 600000) return '$600K+'
  if (price >= 400000) return '$400K+'
  if (price >= 200000) return '$200K+'
  return '$200K-'
}

const formatSchoolRating = (rating: number): string => {
  if (rating >= 9) return 'A+'
  if (rating >= 8) return 'A'
  if (rating >= 7) return 'B+'
  if (rating >= 6) return 'B'
  if (rating >= 5) return 'C+'
  return 'C'
}
