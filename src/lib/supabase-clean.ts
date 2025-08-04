// Supabase client configuration with mock for development
import { createClient } from './supabase-mock'

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  throw new Error('Missing Supabase environment variables. Check your .env file.')
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey)

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
  image_url?: string
  amenities?: string[]
  created_at?: string
  updated_at?: string
}
