// FBI Crime Data Service - FREE API for real crime statistics
export class FBICrimeService {
  private static readonly BASE_URL = 'https://api.usa.gov/crime/fbi/cde';
  private static readonly API_KEY = import.meta.env.VITE_FBI_CRIME_API_KEY;

  static async getRealCrimeData(zipCode: string) {
    try {
      if (!this.API_KEY || this.API_KEY === 'your_fbi_crime_api_key_here') {
        console.warn('FBI Crime API key not configured');
        return null;
      }

      // FBI Crime Data API typically requires state and agency codes
      // We'll need to map ZIP codes to agencies first
      const agencyInfo = await this.getAgencyByZipCode(zipCode);
      if (!agencyInfo) {
        console.warn(`No agency found for ZIP code: ${zipCode}`);
        return null;
      }

      const crimeData = await this.getCrimeDataByAgency(agencyInfo.ori);
      
      if (!crimeData) {
        console.warn(`No crime data found for agency: ${agencyInfo.name}`);
        return null;
      }

      const processedData = this.processCrimeData(crimeData, agencyInfo);
      
      return {
        zipCode,
        agencyName: agencyInfo.name,
        coverage: agencyInfo.coverage,
        population: agencyInfo.population,
        crimeIndex: this.calculateCrimeIndex(processedData),
        violentCrime: this.extractViolentCrimes(processedData),
        propertyCrime: this.extractPropertyCrimes(processedData),
        yearOverYearTrends: this.calculateTrends(processedData),
        safetyRating: this.calculateSafetyRating(processedData),
        comparisons: this.generateComparisons(processedData),
        lastReportedYear: this.getLatestYear(processedData),
        source: 'FBI Crime Data API',
        dataQuality: 'official' as const,
        lastUpdated: new Date().toISOString()
      };

    } catch (error) {
      console.error('Error fetching FBI crime data:', error);
      return null;
    }
  }

  private static async getAgencyByZipCode(zipCode: string) {
    try {
      // This would typically require a ZIP to agency mapping service
      // For major Texas cities, we'll use known mappings
      const texasAgencies = this.getTexasAgencyMappings();
      const agency = texasAgencies[zipCode];
      
      if (agency) {
        return agency;
      }

      // Fallback: try to get agencies by state and filter by coverage area
      const response = await fetch(
        `${this.BASE_URL}/agencies/byStateAbbr/TX?API_KEY=${this.API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`FBI API error: ${response.status}`);
      }

      const agencies = await response.json();
      
      // Find the most appropriate agency for this ZIP code
      // This is a simplified approach - real implementation would use geographic data
      return this.findClosestAgency(agencies, zipCode);

    } catch (error) {
      console.error('Error finding agency for ZIP code:', error);
      return null;
    }
  }

  private static getTexasAgencyMappings(): Record<string, any> {
    // Known mappings for major Texas areas
    return {
      '78701': { ori: 'TX0140100', name: 'Austin Police Department', coverage: 'Austin', population: 978908 },
      '78702': { ori: 'TX0140100', name: 'Austin Police Department', coverage: 'Austin', population: 978908 },
      '78703': { ori: 'TX0140100', name: 'Austin Police Department', coverage: 'Austin', population: 978908 },
      '78704': { ori: 'TX0140100', name: 'Austin Police Department', coverage: 'Austin', population: 978908 },
      '78705': { ori: 'TX0140100', name: 'Austin Police Department', coverage: 'Austin', population: 978908 },
      '78746': { ori: 'TX2410100', name: 'Westlake Hills Police Department', coverage: 'Westlake Hills', population: 3426 },
      '75001': { ori: 'TX0520100', name: 'Dallas Police Department', coverage: 'Dallas', population: 1345047 },
      '75201': { ori: 'TX0520100', name: 'Dallas Police Department', coverage: 'Dallas', population: 1345047 },
      '77001': { ori: 'TX1013600', name: 'Houston Police Department', coverage: 'Houston', population: 2304580 },
      '77002': { ori: 'TX1013600', name: 'Houston Police Department', coverage: 'Houston', population: 2304580 },
    };
  }

  private static findClosestAgency(agencies: any[], _zipCode: string) {
    // Simplified: return the first major city agency
    // Real implementation would use geographic proximity
    const majorAgencies = agencies.filter((agency: any) => 
      agency.agency_name.includes('Police Department') && 
      agency.population > 50000
    );
    
    return majorAgencies.length > 0 ? {
      ori: majorAgencies[0].ori,
      name: majorAgencies[0].agency_name,
      coverage: majorAgencies[0].agency_name.replace(' Police Department', ''),
      population: majorAgencies[0].population || 0
    } : null;
  }

  private static async getCrimeDataByAgency(ori: string) {
    try {
      // Get the latest available year's data
      const currentYear = new Date().getFullYear();
      const years = [currentYear - 1, currentYear - 2, currentYear - 3]; // Last 3 years
      
      const crimeDataPromises = years.map(year => 
        this.getCrimeDataForYear(ori, year)
      );
      
      const results = await Promise.allSettled(crimeDataPromises);
      
      const successfulResults = results
        .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
        .map(result => result.value)
        .filter(data => data !== null);
      
      return successfulResults.length > 0 ? successfulResults : null;

    } catch (error) {
      console.error('Error fetching crime data by agency:', error);
      return null;
    }
  }

  private static async getCrimeDataForYear(ori: string, year: number) {
    try {
      const response = await fetch(
        `${this.BASE_URL}/summarized/agency/${ori}/${year}?API_KEY=${this.API_KEY}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          // Data not available for this year
          return null;
        }
        throw new Error(`FBI API error: ${response.status}`);
      }

      const data = await response.json();
      return { year, data };

    } catch (error) {
      console.error(`Error fetching crime data for ${year}:`, error);
      return null;
    }
  }

  private static processCrimeData(crimeDataArray: any[], agencyInfo: any) {
    return crimeDataArray.map(({ year, data }) => ({
      year,
      totalCrimes: this.calculateTotalCrimes(data),
      violentCrimes: {
        total: data.violent_crime || 0,
        homicide: data.homicide || 0,
        rape: data.rape_revised || data.rape_legacy || 0,
        robbery: data.robbery || 0,
        aggravatedAssault: data.aggravated_assault || 0
      },
      propertyCrimes: {
        total: data.property_crime || 0,
        burglary: data.burglary || 0,
        larceny: data.larceny || 0,
        motorVehicleTheft: data.motor_vehicle_theft || 0,
        arson: data.arson || 0
      },
      population: agencyInfo.population,
      rates: this.calculateCrimeRates(data, agencyInfo.population)
    }));
  }

  private static calculateTotalCrimes(data: any): number {
    const violent = data.violent_crime || 0;
    const property = data.property_crime || 0;
    return violent + property;
  }

  private static calculateCrimeRates(data: any, population: number) {
    if (population === 0) return { violentCrimeRate: 0, propertyCrimeRate: 0, totalCrimeRate: 0 };
    
    const violent = data.violent_crime || 0;
    const property = data.property_crime || 0;
    const total = violent + property;
    
    // Rate per 100,000 residents
    return {
      violentCrimeRate: Number(((violent / population) * 100000).toFixed(2)),
      propertyCrimeRate: Number(((property / population) * 100000).toFixed(2)),
      totalCrimeRate: Number(((total / population) * 100000).toFixed(2))
    };
  }

  private static calculateCrimeIndex(processedData: any[]): number {
    if (processedData.length === 0) return 0;
    
    const latestData = processedData[0]; // Most recent year
    const totalCrimeRate = latestData.rates.totalCrimeRate;
    
    // Convert to 0-100 scale (lower is better)
    // National average is around 2,400 crimes per 100k
    const nationalAverage = 2400;
    const index = Math.max(0, Math.min(100, 100 - ((totalCrimeRate / nationalAverage) * 50)));
    
    return Number(index.toFixed(1));
  }

  private static extractViolentCrimes(processedData: any[]) {
    if (processedData.length === 0) return null;
    
    const latestData = processedData[0];
    return {
      ...latestData.violentCrimes,
      rate: latestData.rates.violentCrimeRate,
      trend: this.calculateTrend(processedData, 'violentCrimes.total')
    };
  }

  private static extractPropertyCrimes(processedData: any[]) {
    if (processedData.length === 0) return null;
    
    const latestData = processedData[0];
    return {
      ...latestData.propertyCrimes,
      rate: latestData.rates.propertyCrimeRate,
      trend: this.calculateTrend(processedData, 'propertyCrimes.total')
    };
  }

  private static calculateTrends(processedData: any[]) {
    if (processedData.length < 2) return null;
    
    return {
      totalCrime: this.calculateTrend(processedData, 'totalCrimes'),
      violentCrime: this.calculateTrend(processedData, 'violentCrimes.total'),
      propertyCrime: this.calculateTrend(processedData, 'propertyCrimes.total')
    };
  }

  private static calculateTrend(data: any[], field: string): string {
    if (data.length < 2) return 'No trend data';
    
    const getValue = (obj: any, path: string) => {
      return path.split('.').reduce((o, p) => o && o[p], obj);
    };
    
    const latest = getValue(data[0], field) || 0;
    const previous = getValue(data[1], field) || 0;
    
    if (previous === 0) return 'No comparison data';
    
    const percentChange = ((latest - previous) / previous) * 100;
    
    if (Math.abs(percentChange) < 1) return 'Stable';
    if (percentChange > 0) return `+${percentChange.toFixed(1)}% increase`;
    return `${percentChange.toFixed(1)}% decrease`;
  }

  private static calculateSafetyRating(processedData: any[]): string {
    const crimeIndex = this.calculateCrimeIndex(processedData);
    
    if (crimeIndex >= 80) return 'Very Safe';
    if (crimeIndex >= 60) return 'Safe';
    if (crimeIndex >= 40) return 'Moderate';
    if (crimeIndex >= 20) return 'Below Average';
    return 'High Crime Area';
  }

  private static generateComparisons(processedData: any[]) {
    if (processedData.length === 0) return null;
    
    const latestData = processedData[0];
    const nationalAverages = {
      violentCrimeRate: 366.7,
      propertyCrimeRate: 1958.2,
      totalCrimeRate: 2324.9
    };
    
    return {
      vsNational: {
        violent: this.generateComparisonText(latestData.rates.violentCrimeRate, nationalAverages.violentCrimeRate),
        property: this.generateComparisonText(latestData.rates.propertyCrimeRate, nationalAverages.propertyCrimeRate),
        total: this.generateComparisonText(latestData.rates.totalCrimeRate, nationalAverages.totalCrimeRate)
      }
    };
  }

  private static generateComparisonText(localRate: number, nationalRate: number): string {
    const difference = ((localRate - nationalRate) / nationalRate) * 100;
    
    if (Math.abs(difference) < 5) return 'Similar to national average';
    if (difference > 0) return `${difference.toFixed(0)}% above national average`;
    return `${Math.abs(difference).toFixed(0)}% below national average`;
  }

  private static getLatestYear(processedData: any[]): number {
    return processedData.length > 0 ? processedData[0].year : new Date().getFullYear() - 1;
  }

  // Test API connection
  static async testConnection(): Promise<boolean> {
    try {
      const testData = await this.getRealCrimeData('78701'); // Austin ZIP
      return testData !== null;
    } catch (error) {
      console.error('FBI Crime API test failed:', error);
      return false;
    }
  }

  // Get bulk crime data for multiple ZIP codes
  static async getBulkCrimeData(zipCodes: string[]) {
    try {
      const results = await Promise.all(
        zipCodes.map(zipCode => this.getRealCrimeData(zipCode))
      );
      
      return results.reduce((acc, data, index) => {
        if (data) {
          acc[zipCodes[index]] = data;
        }
        return acc;
      }, {} as Record<string, any>);
    } catch (error) {
      console.error('Error fetching bulk crime data:', error);
      return {};
    }
  }

  // Get crime data by specific agency ORI
  static async getCrimeDataByORI(ori: string) {
    try {
      return await this.getCrimeDataByAgency(ori);
    } catch (error) {
      console.error('Error fetching crime data by ORI:', error);
      return null;
    }
  }
}
