// Simplified supabase configuration - using fallback for now
// Will integrate real Supabase once package installation is working

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

// Mock client for development
export const supabase = {
  from: () => ({
    select: () => Promise.resolve({ data: [], error: null }),
    insert: () => Promise.resolve({ data: null, error: null })
  })
}

export const testConnection = async () => {
  console.log('✅ Using fallback data - database integration coming next')
  return { success: true }
}
