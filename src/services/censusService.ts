// US Census Bureau Service - FREE API for real demographics data
export class CensusService {
  private static readonly BASE_URL = 'https://api.census.gov/data/2022/acs/acs5';
  private static readonly API_KEY = import.meta.env.VITE_CENSUS_API_KEY;

  // Census variable codes for community data
  private static readonly VARIABLES = {
    TOTAL_POPULATION: 'B01003_001E',
    MEDIAN_HOUSEHOLD_INCOME: 'B19013_001E', 
    MEDIAN_HOME_VALUE: 'B25077_001E',
    MEDIAN_AGE: 'B01002_001E',
    BACHELOR_DEGREE: 'B15003_022E',
    TOTAL_25_PLUS: 'B15003_001E',
    UNEMPLOYMENT_TOTAL: 'B23025_002E',
    UNEMPLOYMENT_UNEMPLOYED: 'B23025_005E',
    MEDIAN_RENT: 'B25064_001E',
    TOTAL_HOUSEHOLDS: 'B25003_001E',
    OWNER_OCCUPIED: 'B25003_002E',
    WHITE_ALONE: 'B02001_002E',
    BLACK_ALONE: 'B02001_003E',
    ASIAN_ALONE: 'B02001_005E',
    HISPANIC_LATINO: 'B03003_003E',
    MARRIED_HOUSEHOLDS: 'B11001_003E'
  };

  static async getRealDemographics(zipCode: string) {
    try {
      if (!this.API_KEY || this.API_KEY === 'your_census_api_key_here') {
        console.warn('Census API key not configured');
        return null;
      }

      const variables = Object.values(this.VARIABLES).join(',');
      const response = await fetch(
        `${this.BASE_URL}?get=${variables}&for=zip%20code%20tabulation%20area:${zipCode}&key=${this.API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`Census API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data || data.length < 2) {
        console.warn(`No Census data found for ZIP code: ${zipCode}`);
        return null;
      }

      // Parse the response (first row is headers, second row is data)
      const headers = data[0];
      const values = data[1];
      
      const parsedData = this.parseResponse(headers, values);
      
      return {
        zipCode,
        population: parsedData.TOTAL_POPULATION || 0,
        medianAge: parsedData.MEDIAN_AGE || 0,
        medianIncome: parsedData.MEDIAN_HOUSEHOLD_INCOME || 0,
        medianHomeValue: parsedData.MEDIAN_HOME_VALUE || 0,
        medianRent: parsedData.MEDIAN_RENT || 0,
        unemploymentRate: this.calculateUnemploymentRate(
          parsedData.UNEMPLOYMENT_UNEMPLOYED,
          parsedData.UNEMPLOYMENT_TOTAL
        ),
        collegeEducatedRate: this.calculateEducationRate(
          parsedData.BACHELOR_DEGREE,
          parsedData.TOTAL_25_PLUS
        ),
        homeOwnershipRate: this.calculateHomeownership(
          parsedData.OWNER_OCCUPIED,
          parsedData.TOTAL_HOUSEHOLDS
        ),
        diversityIndex: this.calculateDiversityIndex({
          white: parsedData.WHITE_ALONE,
          black: parsedData.BLACK_ALONE,
          asian: parsedData.ASIAN_ALONE,
          hispanic: parsedData.HISPANIC_LATINO,
          total: parsedData.TOTAL_POPULATION
        }),
        marriedCouplesRate: this.calculateMarriedRate(
          parsedData.MARRIED_HOUSEHOLDS,
          parsedData.TOTAL_HOUSEHOLDS
        ),
        source: 'US Census Bureau ACS 5-Year',
        lastUpdated: new Date().toISOString(),
        dataQuality: 'official' as const
      };

    } catch (error) {
      console.error('Error fetching Census data:', error);
      return null;
    }
  }

  private static parseResponse(headers: string[], values: any[]): Record<string, number> {
    const result: Record<string, number> = {};
    
    // Map variable codes to their values
    Object.entries(this.VARIABLES).forEach(([key, variableCode]) => {
      const index = headers.indexOf(variableCode);
      if (index !== -1) {
        const value = values[index];
        result[key] = value === null || value === '' ? 0 : parseInt(value, 10);
      }
    });
    
    return result;
  }

  private static calculateUnemploymentRate(unemployed: number, totalLabor: number): number {
    if (!totalLabor || totalLabor === 0) return 0;
    return Number(((unemployed / totalLabor) * 100).toFixed(1));
  }

  private static calculateEducationRate(bachelors: number, total25Plus: number): number {
    if (!total25Plus || total25Plus === 0) return 0;
    return Number(((bachelors / total25Plus) * 100).toFixed(1));
  }

  private static calculateHomeownership(ownerOccupied: number, totalHouseholds: number): number {
    if (!totalHouseholds || totalHouseholds === 0) return 0;
    return Number(((ownerOccupied / totalHouseholds) * 100).toFixed(1));
  }

  private static calculateMarriedRate(marriedHouseholds: number, totalHouseholds: number): number {
    if (!totalHouseholds || totalHouseholds === 0) return 0;
    return Number(((marriedHouseholds / totalHouseholds) * 100).toFixed(1));
  }

  private static calculateDiversityIndex(demographics: {
    white: number;
    black: number;
    asian: number;
    hispanic: number;
    total: number;
  }): number {
    const { white, black, asian, hispanic, total } = demographics;
    
    if (!total || total === 0) return 0;
    
    // Calculate diversity using Simpson's Diversity Index
    const proportions = [
      white / total,
      black / total,
      asian / total,
      hispanic / total,
      Math.max(0, (total - white - black - asian - hispanic) / total) // Other
    ].filter(p => p > 0);
    
    const simpsonIndex = proportions.reduce((sum, p) => sum + (p * p), 0);
    const diversityIndex = (1 - simpsonIndex) * 10; // Scale to 0-10
    
    return Number(diversityIndex.toFixed(1));
  }

  // Get multiple ZIP codes efficiently
  static async getBulkDemographics(zipCodes: string[]) {
    try {
      const results = await Promise.all(
        zipCodes.map(zipCode => this.getRealDemographics(zipCode))
      );
      
      return results.reduce((acc, data, index) => {
        if (data) {
          acc[zipCodes[index]] = data;
        }
        return acc;
      }, {} as Record<string, any>);
    } catch (error) {
      console.error('Error fetching bulk Census data:', error);
      return {};
    }
  }

  // Test API connection
  static async testConnection(): Promise<boolean> {
    try {
      const testData = await this.getRealDemographics('78746'); // Westlake ZIP
      return testData !== null;
    } catch (error) {
      console.error('Census API test failed:', error);
      return false;
    }
  }
}
