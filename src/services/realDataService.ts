import { CensusService } from './censusService';
import { EPAService } from './epaService';
import { DeptEducationSchoolService } from './deptEducationSchoolService';
import { FBICrimeService } from './fbiCrimeService';

// Enhanced Real Data Integration Service
export class RealDataService {
  private static readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
  private static dataCache = new Map<string, any>();

  // Main method to get all real data for a community
  static async getRealCommunityData(zipCode: string) {
    try {
      const cacheKey = `real_data_${zipCode}`;
      const cached = this.getCachedData(cacheKey);
      
      if (cached) {
        console.log(`Using cached real data for ZIP: ${zipCode}`);
        return cached;
      }

      console.log(`Fetching real data for ZIP: ${zipCode}`);
      
      // Fetch data from all sources in parallel
      const [
        censusData,
        airQualityData,
        schoolData,
        crimeData
      ] = await Promise.allSettled([
        CensusService.getRealDemographics(zipCode),
        EPAService.getRealAirQuality(zipCode),
        DeptEducationSchoolService.getFreeSchoolData(zipCode),
        FBICrimeService.getRealCrimeData(zipCode)
      ]);

      const realData = {
        zipCode,
        demographics: this.extractSettledResult(censusData),
        airQuality: this.extractSettledResult(airQualityData),
        schools: this.extractSettledResult(schoolData),
        crime: this.extractSettledResult(crimeData),
        dataSources: this.getDataSourceSummary(censusData, airQualityData, schoolData, crimeData),
        dataQuality: this.assessDataQuality(censusData, airQualityData, schoolData, crimeData),
        lastUpdated: new Date().toISOString(),
        cacheExpiry: Date.now() + this.CACHE_DURATION
      };

      // Cache the result
      this.setCachedData(cacheKey, realData);
      
      return realData;

    } catch (error) {
      console.error('Error fetching real community data:', error);
      return null;
    }
  }

  // Enhanced method that merges real data with existing sample data
  static async getEnhancedCommunityData(communityData: any) {
    try {
      const zipCode = communityData.zipCode || communityData.location?.zipCode;
      
      if (!zipCode) {
        console.warn('No ZIP code found for community data enhancement');
        return communityData;
      }

      const realData = await this.getRealCommunityData(zipCode);
      
      if (!realData) {
        console.warn(`No real data available for ZIP: ${zipCode}`);
        return {
          ...communityData,
          dataEnhancement: {
            realDataAvailable: false,
            lastAttempted: new Date().toISOString()
          }
        };
      }

      // Merge real data with existing community data
      const enhancedData = this.mergeRealDataWithCommunity(communityData, realData);
      
      return enhancedData;

    } catch (error) {
      console.error('Error enhancing community data:', error);
      return communityData;
    }
  }

  private static extractSettledResult(settledResult: PromiseSettledResult<any>) {
    if (settledResult.status === 'fulfilled') {
      return settledResult.value;
    } else {
      console.warn('Data fetch failed:', settledResult.reason);
      return null;
    }
  }

  private static getDataSourceSummary(...settledResults: PromiseSettledResult<any>[]) {
    const sources = [
      { name: 'US Census Bureau', key: 'census' },
      { name: 'EPA AirNow', key: 'airQuality' },
      { name: 'Dept of Education', key: 'schools' },
      { name: 'FBI Crime Data', key: 'crime' }
    ];

    return sources.map((source, index) => ({
      ...source,
      available: settledResults[index].status === 'fulfilled' && settledResults[index].value !== null,
      status: settledResults[index].status,
      lastUpdated: settledResults[index].status === 'fulfilled' ? new Date().toISOString() : null
    }));
  }

  private static assessDataQuality(...settledResults: PromiseSettledResult<any>[]): string {
    const successfulSources = settledResults.filter(result => 
      result.status === 'fulfilled' && result.value !== null
    ).length;

    const totalSources = settledResults.length;
    const successRate = (successfulSources / totalSources) * 100;

    if (successRate >= 75) return 'high';
    if (successRate >= 50) return 'medium';
    if (successRate >= 25) return 'low';
    return 'minimal';
  }

  private static mergeRealDataWithCommunity(communityData: any, realData: any) {
    const enhanced = { ...communityData };

    // Merge demographics
    if (realData.demographics) {
      enhanced.demographics = {
        ...enhanced.demographics,
        population: realData.demographics.population,
        medianAge: realData.demographics.medianAge,
        medianIncome: realData.demographics.medianHouseholdIncome,
        educationLevel: realData.demographics.educationLevel,
        employmentRate: 100 - realData.demographics.unemploymentRate,
        diversityIndex: realData.demographics.diversityIndex,
        dataSource: 'US Census Bureau (Official)'
      };
    }

    // Merge air quality
    if (realData.airQuality) {
      enhanced.qualityOfLife = {
        ...enhanced.qualityOfLife,
        airQualityIndex: realData.airQuality.aqi,
        airQuality: realData.airQuality.category,
        pollutionLevel: realData.airQuality.healthMessage,
        dataSource: 'EPA AirNow (Official)'
      };
    }

    // Merge school data
    if (realData.schools) {
      enhanced.schools = {
        ...enhanced.schools,
        districtName: realData.schools.districtName,
        districtRating: realData.schools.districtRating,
        averageRating: realData.schools.averageRating,
        totalSchools: realData.schools.totalSchools,
        schoolsByLevel: realData.schools.schoolsByLevel,
        topSchools: realData.schools.topSchools,
        dataSource: 'GreatSchools API (Official)'
      };
    }

    // Merge crime data
    if (realData.crime) {
      enhanced.safety = {
        ...enhanced.safety,
        crimeIndex: realData.crime.crimeIndex,
        safetyRating: realData.crime.safetyRating,
        violentCrimeRate: realData.crime.violentCrime?.rate,
        propertyCrimeRate: realData.crime.propertyCrime?.rate,
        trends: realData.crime.yearOverYearTrends,
        dataSource: 'FBI Crime Data (Official)'
      };
    }

    // Add data enhancement metadata
    enhanced.dataEnhancement = {
      realDataAvailable: true,
      dataSources: realData.dataSources,
      dataQuality: realData.dataQuality,
      lastUpdated: realData.lastUpdated,
      enhancementVersion: '1.0'
    };

    return enhanced;
  }

  private static getCachedData(key: string) {
    const cached = this.dataCache.get(key);
    if (cached && cached.cacheExpiry > Date.now()) {
      return cached;
    }
    if (cached) {
      this.dataCache.delete(key); // Remove expired cache
    }
    return null;
  }

  private static setCachedData(key: string, data: any) {
    this.dataCache.set(key, data);
    
    // Clean up old cache entries periodically
    if (this.dataCache.size > 100) {
      this.cleanupCache();
    }
  }

  private static cleanupCache() {
    const now = Date.now();
    for (const [key, value] of this.dataCache.entries()) {
      if (value.cacheExpiry <= now) {
        this.dataCache.delete(key);
      }
    }
  }

  // Bulk enhancement for multiple communities
  static async enhanceMultipleCommunities(communities: any[]) {
    try {
      const enhancementPromises = communities.map(community => 
        this.getEnhancedCommunityData(community)
      );
      
      const results = await Promise.allSettled(enhancementPromises);
      
      return results.map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          console.error(`Failed to enhance community ${index}:`, result.reason);
          return communities[index]; // Return original data on failure
        }
      });

    } catch (error) {
      console.error('Error in bulk community enhancement:', error);
      return communities; // Return original data on error
    }
  }

  // Test all data source connections
  static async testAllConnections() {
    const tests = [
      { name: 'Census Bureau', test: () => CensusService.testConnection() },
      { name: 'EPA AirNow', test: () => EPAService.testConnection() },
      { name: 'Dept of Education', test: () => DeptEducationSchoolService.testConnection() },
      { name: 'FBI Crime Data', test: () => FBICrimeService.testConnection() }
    ];

    const results = await Promise.allSettled(
      tests.map(async test => ({
        name: test.name,
        connected: await test.test()
      }))
    );

    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          name: tests[index].name,
          connected: false,
          error: result.reason
        };
      }
    });
  }

  // Get data source status and coverage
  static getDataSourceStatus() {
    const apiKeys = {
      census: import.meta.env.VITE_CENSUS_API_KEY,
      epa: import.meta.env.VITE_EPA_AIR_QUALITY_API_KEY,
      deptEducation: import.meta.env.VITE_DEPT_EDUCATION_API_KEY,
      fbiCrime: import.meta.env.VITE_FBI_CRIME_API_KEY
    };

    return {
      configurationStatus: {
        census: this.isApiKeyConfigured(apiKeys.census),
        epa: this.isApiKeyConfigured(apiKeys.epa),
        deptEducation: this.isApiKeyConfigured(apiKeys.deptEducation),
        fbiCrime: this.isApiKeyConfigured(apiKeys.fbiCrime)
      },
      cacheSize: this.dataCache.size,
      availableSources: Object.entries(apiKeys)
        .filter(([, key]) => this.isApiKeyConfigured(key))
        .map(([name]) => name)
    };
  }

  private static isApiKeyConfigured(apiKey: string | undefined): boolean {
    return !!(apiKey && apiKey !== 'your_census_api_key_here' && 
             apiKey !== 'your_epa_air_quality_key_here' && 
             apiKey !== 'your_dept_education_api_key_here' && 
             apiKey !== 'your_fbi_crime_api_key_here' &&
             apiKey !== 'DEMO_KEY'); // DEMO_KEY counts as configured for DOE
  }

  // Clear all cached data
  static clearCache() {
    this.dataCache.clear();
    console.log('Real data cache cleared');
  }

  // Get specific data source for a ZIP code
  static async getSpecificData(zipCode: string, source: 'census' | 'epa' | 'schools' | 'crime') {
    switch (source) {
      case 'census':
        return await CensusService.getRealDemographics(zipCode);
      case 'epa':
        return await EPAService.getRealAirQuality(zipCode);
      case 'schools':
        return await DeptEducationSchoolService.getFreeSchoolData(zipCode);
      case 'crime':
        return await FBICrimeService.getRealCrimeData(zipCode);
      default:
        throw new Error(`Unknown data source: ${source}`);
    }
  }
}
