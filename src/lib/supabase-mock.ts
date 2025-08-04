// Temporary mock Supabase client for development
// This will be replaced with the real Supabase client once installation is fixed

export interface SupabaseClient {
  from: (table: string) => SupabaseQueryBuilder
}

interface SupabaseQueryBuilder {
  select: (columns?: string) => SupabaseQueryBuilder
  eq: (column: string, value: any) => SupabaseQueryBuilder
  gte: (column: string, value: any) => SupabaseQueryBuilder
  lte: (column: string, value: any) => SupabaseQueryBuilder
  in: (column: string, values: any[]) => SupabaseQueryBuilder
  or: (query: string) => SupabaseQueryBuilder
  order: (column: string, options?: { ascending?: boolean }) => SupabaseQueryBuilder
  limit: (count: number) => SupabaseQueryBuilder
  single: () => SupabaseQueryBuilder
  not: (column: string, operator: string, value: any) => SupabaseQueryBuilder
}

// Mock data for development
const mockCommunities = [
  {
    id: 1,
    name: 'West Lake Hills',
    slug: 'west-lake-hills',
    city: 'Austin',
    county: 'Travis',
    state: 'TX',
    latitude: 30.2981,
    longitude: -97.8206,
    zip_codes: ['78746'],
    population: 3063,
    median_age: 46,
    median_household_income: 158929,
    average_home_price: 1250000,
    median_home_price: 1100000,
    average_rent: 3200,
    home_price_trend: 'rising' as const,
    school_district: 'Eanes ISD',
    school_rating: 10,
    elementary_schools: 2,
    middle_schools: 1,
    high_schools: 1,
    crime_rate: 12,
    walkability_score: 35,
    transit_score: 22,
    bike_score: 45,
    average_temp_summer: 85,
    average_temp_winter: 55,
    annual_rainfall: 32,
    unemployment_rate: 2.1,
    job_growth_rate: 3.2,
    major_employers: ['Austin ISD', 'Local Businesses'],
    cost_of_living_index: 145,
    diversity_index: 25
  },
  {
    id: 2,
    name: 'Cedar Park',
    slug: 'cedar-park',
    city: 'Cedar Park',
    county: 'Williamson',
    state: 'TX',
    latitude: 30.5052,
    longitude: -97.8203,
    zip_codes: ['78613', '78717'],
    population: 77595,
    median_age: 37,
    median_household_income: 88542,
    average_home_price: 485000,
    median_home_price: 465000,
    average_rent: 1850,
    home_price_trend: 'rising' as const,
    school_district: 'Leander ISD',
    school_rating: 8,
    elementary_schools: 8,
    middle_schools: 3,
    high_schools: 2,
    crime_rate: 18,
    walkability_score: 42,
    transit_score: 28,
    bike_score: 38,
    average_temp_summer: 84,
    average_temp_winter: 54,
    annual_rainfall: 33,
    unemployment_rate: 3.2,
    job_growth_rate: 4.1,
    major_employers: ['Dell Technologies', 'Leander ISD'],
    cost_of_living_index: 112,
    diversity_index: 42
  }
]

class MockSupabaseQueryBuilder implements SupabaseQueryBuilder {
  private table: string
  private filters: any = {}
  private selectedColumns = '*'
  private orderBy: { column: string, ascending: boolean } | null = null
  private limitCount: number | null = null
  private isHead = false
  private isSingle = false

  constructor(table: string) {
    this.table = table
  }

  select(columns = '*', options?: { count?: string, head?: boolean }) {
    this.selectedColumns = columns
    if (options?.head) this.isHead = true
    return this
  }

  eq(column: string, value: any) {
    this.filters[column] = { type: 'eq', value }
    return this
  }

  gte(column: string, value: any) {
    this.filters[column] = { type: 'gte', value }
    return this
  }

  lte(column: string, value: any) {
    this.filters[column] = { type: 'lte', value }
    return this
  }

  in(column: string, values: any[]) {
    this.filters[column] = { type: 'in', values }
    return this
  }

  or(query: string) {
    this.filters['_or'] = query
    return this
  }

  order(column: string, options: { ascending?: boolean } = {}) {
    this.orderBy = { column, ascending: options.ascending !== false }
    return this
  }

  limit(count: number) {
    this.limitCount = count
    return this
  }

  single() {
    this.isSingle = true
    return this
  }

  not(column: string, operator: string, value: any) {
    this.filters[column] = { type: 'not', operator, value }
    return this
  }

  // Execute the query
  private async execute() {
    await new Promise(resolve => setTimeout(resolve, 100)) // Simulate network delay
    
    let data = this.table === 'communities' ? [...mockCommunities] : []

    // Apply filters
    Object.entries(this.filters).forEach(([column, filter]: [string, any]) => {
      if (column === '_or') {
        // Handle OR queries (simplified)
        const searchTerm = filter.match(/%([^%]+)%/)?.[1]
        if (searchTerm) {
          data = data.filter((item: any) => 
            item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.city?.toLowerCase().includes(searchTerm.toLowerCase())
          )
        }
        return
      }

      data = data.filter((item: any) => {
        const value = item[column]
        switch (filter.type) {
          case 'eq':
            return value === filter.value
          case 'gte':
            return value >= filter.value
          case 'lte':
            return value <= filter.value
          case 'in':
            return filter.values.includes(value)
          case 'not':
            return value !== filter.value
          default:
            return true
        }
      })
    })

    // Apply ordering
    if (this.orderBy) {
      data.sort((a: any, b: any) => {
        const aVal = a[this.orderBy!.column]
        const bVal = b[this.orderBy!.column]
        const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
        return this.orderBy!.ascending ? comparison : -comparison
      })
    }

    // Apply limit
    if (this.limitCount) {
      data = data.slice(0, this.limitCount)
    }

    // Handle single result
    if (this.isSingle) {
      return { data: data[0] || null, error: data.length === 0 ? { code: 'PGRST116' } : null }
    }

    // Handle select specific columns
    if (this.selectedColumns !== '*' && this.selectedColumns !== 'count') {
      const columns = this.selectedColumns.split(',').map(c => c.trim())
      data = data.map((item: any) => {
        const result: any = {}
        columns.forEach(col => {
          if (item[col] !== undefined) result[col] = item[col]
        })
        return result
      })
    }

    return { data, error: null }
  }

  // Make the query builder awaitable
  then(resolve: (value: any) => void, reject?: (reason: any) => void) {
    return this.execute().then(resolve).catch(reject || (() => {}))
  }

  catch(reject: (reason: any) => void) {
    return this.execute().catch(reject)
  }
}

class MockSupabaseClient implements SupabaseClient {
  from(table: string) {
    return new MockSupabaseQueryBuilder(table)
  }
}

// Mock createClient function
export function createClient(url: string, key: string): SupabaseClient {
  console.log('🔧 Using mock Supabase client for development')
  return new MockSupabaseClient()
}

// Mock test connection
export const testConnection = async () => {
  await new Promise(resolve => setTimeout(resolve, 500)) // Simulate connection time
  console.log('✅ Mock database connected successfully!')
  return { success: true }
}
