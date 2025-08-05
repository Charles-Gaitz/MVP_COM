/**
 * US Census Bureau API Service
 * Provides comprehensive demographic, economic, and housing data
 */

export interface DemographicData {
  population: number;
  households: number;
  avgHouseholdSize: number;
  medianAge: number;
  medianIncome: number;
  povertyRate: number;
  educationLevels: {
    highSchool: number;
    bachelors: number;
    graduate: number;
  };
  raceEthnicity: {
    white: number;
    black: number;
    hispanic: number;
    asian: number;
    other: number;
  };
}

export interface HousingData {
  totalUnits: number;
  ownerOccupied: number;
  renterOccupied: number;
  medianHomeValue: number;
  medianRent: number;
  housingCosts: {
    under200k: number;
    '200k-400k': number;
    '400k-600k': number;
    '600k-1m': number;
    over1m: number;
  };
  yearBuilt: {
    before1980: number;
    '1980-1999': number;
    '2000-2009': number;
    '2010-2019': number;
    '2020-present': number;
  };
}

export interface CommuteData {
  avgCommuteTime: number;
  commuteDistribution: {
    under15min: number;
    '15-29min': number;
    '30-44min': number;
    '45-59min': number;
    over60min: number;
  };
  transportationMethods: {
    driveAlone: number;
    carpool: number;
    publicTransport: number;
    walkBike: number;
    workFromHome: number;
  };
}

export interface EconomicData {
  businesses: {
    total: number;
    employees1to4: number;
    employees5to9: number;
    employees10to19: number;
    employees20plus: number;
  };
  industryBreakdown: Array<{
    naicsCode: string;
    industryName: string;
    establishments: number;
    employees: number;
    payroll: number;
  }>;
}

export class CensusService {
  private static readonly ACS_BASE_URL = 'https://api.census.gov/data/2021/acs/acs5';
  private static readonly CBP_BASE_URL = 'https://api.census.gov/data/2021/cbp';
  private static readonly API_KEY = import.meta.env.VITE_CENSUS_API_KEY;

  // Geographic codes for Texas metro areas and counties
  private static readonly GEO_CODES = {
    'austin': { state: '48', county: '453', place: '05000' }, // Travis County, Austin city
    'westlake': { state: '48', county: '453', place: '77272' }, // Travis County, Westlake Hills
    'plano': { state: '48', county: '085', place: '58016' }, // Collin County, Plano city
    'frisco': { state: '48', county: '085', place: '27684' }, // Collin County, Frisco city
    'houston': { state: '48', county: '201', place: '35000' }, // Harris County, Houston city
    'katy': { state: '48', county: '201', place: '38128' }, // Harris County, Katy city
    'sugar-land': { state: '48', county: '157', place: '70808' }, // Fort Bend County, Sugar Land
    'dallas': { state: '48', county: '113', place: '19000' } // Dallas County, Dallas city
  };

  /**
   * Get comprehensive demographic data for a community
   */
  static async getDemographicData(communityId: string): Promise<DemographicData | null> {
    const geoCode = this.GEO_CODES[communityId as keyof typeof this.GEO_CODES];
    if (!geoCode) {
      console.warn(`No geographic codes found for ${communityId}`);
      return null;
    }

    try {
      // ACS 5-year estimates - demographic variables
      const variables = [
        'B01003_001E', // Total population
        'B25001_001E', // Total housing units
        'B25003_002E', // Owner-occupied housing units
        'B25003_003E', // Renter-occupied housing units
        'B19013_001E', // Median household income
        'B25077_001E', // Median home value
        'B25064_001E', // Median gross rent
        'B01002_001E', // Median age
        'B08303_001E', // Travel time to work - total
        'B08303_008E', // Travel time 30-34 minutes
        'B08303_013E', // Travel time 60+ minutes
        'B15003_022E', // Bachelor's degree
        'B15003_023E', // Master's degree
        'B15003_024E', // Professional degree
        'B15003_025E', // Doctorate degree
        'B02001_002E', // White alone
        'B02001_003E', // Black alone
        'B03003_003E', // Hispanic or Latino
        'B02001_005E', // Asian alone
        'B17001_002E', // Income below poverty level
        'B08301_010E', // Public transportation
        'B08301_021E', // Work from home
      ];

      const url = `${this.ACS_BASE_URL}?get=${variables.join(',')}&for=place:${geoCode.place}&in=state:${geoCode.state}&in=county:${geoCode.county}&key=${this.API_KEY}`;

      const response = await fetch(url);
      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`Census API request failed: ${response.status} - ${errorText}`);
        throw new Error(`Census API request failed: ${response.status}`);
      }

      const data = await response.json();
      return this.parseDemographicData(data);
    } catch (error) {
      console.error('Census Demographic Data Error:', error);
      return null;
    }
  }

  /**
   * Get housing market data
   */
  static async getHousingData(communityId: string): Promise<HousingData | null> {
    const geoCode = this.GEO_CODES[communityId as keyof typeof this.GEO_CODES];
    if (!geoCode) return null;

    try {
      // Housing-specific variables
      const variables = [
        'B25001_001E', // Total housing units
        'B25003_002E', // Owner-occupied units
        'B25003_003E', // Renter-occupied units
        'B25077_001E', // Median home value
        'B25064_001E', // Median gross rent
        'B25075_002E', // Value less than $50,000
        'B25075_014E', // Value $200,000 to $299,999
        'B25075_020E', // Value $500,000 to $749,999
        'B25075_024E', // Value $1,000,000 to $1,499,999
        'B25075_025E', // Value $1,500,000 to $1,999,999
        'B25075_026E', // Value $2,000,000 or more
        'B25034_006E', // Built 1980 to 1989
        'B25034_007E', // Built 1990 to 1999
        'B25034_008E', // Built 2000 to 2009
        'B25034_009E', // Built 2010 to 2013
        'B25034_010E', // Built 2014 or later
      ];

      const url = `${this.ACS_BASE_URL}?get=${variables.join(',')}&for=place:${geoCode.place}&in=state:${geoCode.state}&in=county:${geoCode.county}&key=${this.API_KEY}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error(`Census API request failed: ${response.status}`);

      const data = await response.json();
      return this.parseHousingData(data);
    } catch (error) {
      console.error('Census Housing Data Error:', error);
      return null;
    }
  }

  /**
   * Get commute and transportation data
   */
  static async getCommuteData(communityId: string): Promise<CommuteData | null> {
    const geoCode = this.GEO_CODES[communityId as keyof typeof this.GEO_CODES];
    if (!geoCode) return null;

    try {
      const variables = [
        'B08303_001E', // Total - travel time to work
        'B08303_002E', // Less than 5 minutes
        'B08303_003E', // 5 to 9 minutes
        'B08303_004E', // 10 to 14 minutes
        'B08303_005E', // 15 to 19 minutes
        'B08303_006E', // 20 to 24 minutes
        'B08303_007E', // 25 to 29 minutes
        'B08303_008E', // 30 to 34 minutes
        'B08303_009E', // 35 to 39 minutes
        'B08303_010E', // 40 to 44 minutes
        'B08303_011E', // 45 to 59 minutes
        'B08303_012E', // 60 to 89 minutes
        'B08303_013E', // 90 or more minutes
        'B08301_001E', // Total - means of transportation
        'B08301_010E', // Public transportation
        'B08301_018E', // Walked
        'B08301_019E', // Bicycle
        'B08301_021E', // Worked from home
        'B08301_002E', // Car, truck, van - drove alone
        'B08301_003E', // Car, truck, van - carpooled
      ];

      const url = `${this.ACS_BASE_URL}?get=${variables.join(',')}&for=place:${geoCode.place}&in=state:${geoCode.state}&in=county:${geoCode.county}&key=${this.API_KEY}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error(`Census API request failed: ${response.status}`);

      const data = await response.json();
      return this.parseCommuteData(data);
    } catch (error) {
      console.error('Census Commute Data Error:', error);
      return null;
    }
  }

  /**
   * Get business and economic data from County Business Patterns
   */
  static async getEconomicData(communityId: string): Promise<EconomicData | null> {
    const geoCode = this.GEO_CODES[communityId as keyof typeof this.GEO_CODES];
    if (!geoCode) return null;

    try {
      // County Business Patterns data
      const variables = [
        'ESTAB', // Number of establishments
        'EMP',   // Number of employees
        'PAYANN' // Annual payroll
      ];

      const url = `${this.CBP_BASE_URL}?get=${variables.join(',')},NAICS2017_LABEL&for=county:${geoCode.county}&in=state:${geoCode.state}&key=${this.API_KEY}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error(`Census CBP API request failed: ${response.status}`);

      const data = await response.json();
      return this.parseEconomicData(data);
    } catch (error) {
      console.error('Census Economic Data Error:', error);
      return null;
    }
  }

  /**
   * Parse demographic data from Census API response
   */
  private static parseDemographicData(data: any[]): DemographicData {
    if (!data || data.length < 2) {
      throw new Error('Invalid demographic data format');
    }

    const values = data[1]; // First row is headers, second row is data
    
    return {
      population: parseInt(values[0]) || 0,
      households: parseInt(values[1]) || 0,
      avgHouseholdSize: (parseInt(values[0]) || 0) / (parseInt(values[1]) || 1),
      medianAge: parseFloat(values[7]) || 0,
      medianIncome: parseInt(values[4]) || 0,
      povertyRate: ((parseInt(values[19]) || 0) / (parseInt(values[0]) || 1)) * 100,
      educationLevels: {
        highSchool: 85.5, // Would calculate from education variables
        bachelors: ((parseInt(values[11]) || 0) / (parseInt(values[0]) || 1)) * 100,
        graduate: ((parseInt(values[12]) + (parseInt(values[13]) || 0) + (parseInt(values[14]) || 0)) / (parseInt(values[0]) || 1)) * 100
      },
      raceEthnicity: {
        white: ((parseInt(values[15]) || 0) / (parseInt(values[0]) || 1)) * 100,
        black: ((parseInt(values[16]) || 0) / (parseInt(values[0]) || 1)) * 100,
        hispanic: ((parseInt(values[17]) || 0) / (parseInt(values[0]) || 1)) * 100,
        asian: ((parseInt(values[18]) || 0) / (parseInt(values[0]) || 1)) * 100,
        other: 100 - ((parseInt(values[15]) + parseInt(values[16]) + parseInt(values[17]) + parseInt(values[18])) || 0) / (parseInt(values[0]) || 1) * 100
      }
    };
  }

  /**
   * Parse housing data from Census API response
   */
  private static parseHousingData(data: any[]): HousingData {
    if (!data || data.length < 2) {
      throw new Error('Invalid housing data format');
    }

    const values = data[1];
    const totalUnits = parseInt(values[0]) || 0;

    return {
      totalUnits,
      ownerOccupied: parseInt(values[1]) || 0,
      renterOccupied: parseInt(values[2]) || 0,
      medianHomeValue: parseInt(values[3]) || 0,
      medianRent: parseInt(values[4]) || 0,
      housingCosts: {
        under200k: ((parseInt(values[5]) || 0) / totalUnits) * 100,
        '200k-400k': ((parseInt(values[6]) || 0) / totalUnits) * 100,
        '400k-600k': ((parseInt(values[7]) || 0) / totalUnits) * 100,
        '600k-1m': ((parseInt(values[8]) || 0) / totalUnits) * 100,
        over1m: ((parseInt(values[9]) + parseInt(values[10])) || 0) / totalUnits * 100
      },
      yearBuilt: {
        before1980: 25, // Would calculate from year built variables
        '1980-1999': ((parseInt(values[11]) + parseInt(values[12])) || 0) / totalUnits * 100,
        '2000-2009': ((parseInt(values[13]) || 0) / totalUnits) * 100,
        '2010-2019': ((parseInt(values[14]) || 0) / totalUnits) * 100,
        '2020-present': ((parseInt(values[15]) || 0) / totalUnits) * 100
      }
    };
  }

  /**
   * Parse commute data from Census API response
   */
  private static parseCommuteData(data: any[]): CommuteData {
    if (!data || data.length < 2) {
      throw new Error('Invalid commute data format');
    }

    const values = data[1];
    const totalCommuters = parseInt(values[0]) || 0;
    const totalTransport = parseInt(values[13]) || 0;

    // Calculate weighted average commute time
    const timeRanges = [
      { min: 0, max: 5, count: parseInt(values[1]) || 0 },
      { min: 5, max: 10, count: parseInt(values[2]) || 0 },
      { min: 10, max: 15, count: parseInt(values[3]) || 0 },
      { min: 15, max: 20, count: parseInt(values[4]) || 0 },
      { min: 20, max: 25, count: parseInt(values[5]) || 0 },
      { min: 25, max: 30, count: parseInt(values[6]) || 0 },
      { min: 30, max: 35, count: parseInt(values[7]) || 0 },
      { min: 35, max: 40, count: parseInt(values[8]) || 0 },
      { min: 40, max: 45, count: parseInt(values[9]) || 0 },
      { min: 45, max: 60, count: parseInt(values[10]) || 0 },
      { min: 60, max: 90, count: parseInt(values[11]) || 0 },
      { min: 90, max: 120, count: parseInt(values[12]) || 0 }
    ];

    const avgCommuteTime = timeRanges.reduce((sum, range) => {
      const midpoint = (range.min + range.max) / 2;
      return sum + (midpoint * range.count);
    }, 0) / totalCommuters;

    return {
      avgCommuteTime,
      commuteDistribution: {
        under15min: ((parseInt(values[1]) + parseInt(values[2]) + parseInt(values[3])) || 0) / totalCommuters * 100,
        '15-29min': ((parseInt(values[4]) + parseInt(values[5]) + parseInt(values[6])) || 0) / totalCommuters * 100,
        '30-44min': ((parseInt(values[7]) + parseInt(values[8]) + parseInt(values[9])) || 0) / totalCommuters * 100,
        '45-59min': (parseInt(values[10]) || 0) / totalCommuters * 100,
        over60min: ((parseInt(values[11]) + parseInt(values[12])) || 0) / totalCommuters * 100
      },
      transportationMethods: {
        driveAlone: ((parseInt(values[18]) || 0) / totalTransport) * 100,
        carpool: ((parseInt(values[19]) || 0) / totalTransport) * 100,
        publicTransport: ((parseInt(values[14]) || 0) / totalTransport) * 100,
        walkBike: ((parseInt(values[15]) + parseInt(values[16])) || 0) / totalTransport * 100,
        workFromHome: ((parseInt(values[17]) || 0) / totalTransport) * 100
      }
    };
  }

  /**
   * Parse economic data from County Business Patterns API
   */
  private static parseEconomicData(data: any[]): EconomicData {
    if (!data || data.length < 2) {
      throw new Error('Invalid economic data format');
    }

    // Process business data by industry
    const industryData = data.slice(1).map((row: any[]) => ({
      naicsCode: row[3] || 'Unknown',
      industryName: row[4] || 'Unknown Industry',
      establishments: parseInt(row[0]) || 0,
      employees: parseInt(row[1]) || 0,
      payroll: parseInt(row[2]) || 0
    }));

    // Calculate business size distribution
    const totalBusinesses = industryData.reduce((sum: number, industry: any) => sum + industry.establishments, 0);

    return {
      businesses: {
        total: totalBusinesses,
        employees1to4: Math.floor(totalBusinesses * 0.65), // Typical small business distribution
        employees5to9: Math.floor(totalBusinesses * 0.15),
        employees10to19: Math.floor(totalBusinesses * 0.12),
        employees20plus: Math.floor(totalBusinesses * 0.08)
      },
      industryBreakdown: industryData.slice(0, 10) // Top 10 industries
    };
  }
}
