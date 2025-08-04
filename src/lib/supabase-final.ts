// Simplified types and mock client for MVP
export interface Community {
  id: number
  name: string
  slug: string
  city: string
  county: string
  state: string
  population?: number
  average_home_price?: number
  school_rating?: number
  crime_rate?: number
  walkability_score?: number
}

// Simple mock - will replace with real Supabase later
export const supabase = {
  from: () => ({
    select: () => Promise.resolve({ data: [], error: null })
  })
}

export const testConnection = () => Promise.resolve({ success: true })
