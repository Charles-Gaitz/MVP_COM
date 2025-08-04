// EPA AirNow Service - FREE API for real air quality data
export class EPAService {
  private static readonly BASE_URL = 'https://airnowapi.org/aq';
  private static readonly API_KEY = import.meta.env.VITE_EPA_AIR_QUALITY_API_KEY;

  static async getRealAirQuality(zipCode: string) {
    try {
      if (!this.API_KEY || this.API_KEY === 'your_epa_api_key_here') {
        console.warn('EPA API key not configured');
        return null;
      }

      const response = await fetch(
        `${this.BASE_URL}/observation/zipCode/current/?format=application/json&zipCode=${zipCode}&API_KEY=${this.API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`EPA API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data || data.length === 0) {
        console.warn(`No air quality data found for ZIP code: ${zipCode}`);
        return null;
      }

      // Process the air quality measurements
      const measurements = this.processAirQualityData(data);
      
      return {
        zipCode,
        aqi: measurements.overallAQI,
        aqiCategory: this.getAQICategory(measurements.overallAQI),
        pm25: measurements.pm25,
        ozone: measurements.ozone,
        primaryPollutant: measurements.primaryPollutant,
        lastUpdate: measurements.lastUpdate,
        healthMessage: this.getHealthMessage(measurements.overallAQI),
        source: 'EPA AirNow',
        dataQuality: 'official' as const,
        rating: this.convertAQIToRating(measurements.overallAQI)
      };

    } catch (error) {
      console.error('Error fetching EPA air quality data:', error);
      return null;
    }
  }

  private static processAirQualityData(data: any[]) {
    let overallAQI = 0;
    let pm25 = null;
    let ozone = null;
    let primaryPollutant = '';
    let lastUpdate = '';

    // Find the highest AQI value and identify pollutants
    data.forEach(measurement => {
      const aqi = measurement.AQI || 0;
      
      if (aqi > overallAQI) {
        overallAQI = aqi;
        primaryPollutant = measurement.ParameterName || 'Unknown';
        lastUpdate = measurement.DateObserved + ' ' + measurement.HourObserved + ':00';
      }

      // Store specific pollutant values
      if (measurement.ParameterName === 'PM2.5') {
        pm25 = aqi;
      } else if (measurement.ParameterName === 'OZONE') {
        ozone = aqi;
      }
    });

    return {
      overallAQI,
      pm25,
      ozone,
      primaryPollutant,
      lastUpdate
    };
  }

  private static getAQICategory(aqi: number): string {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  }

  private static getHealthMessage(aqi: number): string {
    if (aqi <= 50) {
      return 'Air quality is satisfactory, and air pollution poses little or no risk.';
    }
    if (aqi <= 100) {
      return 'Air quality is acceptable for most people. Unusually sensitive individuals may experience minor respiratory symptoms.';
    }
    if (aqi <= 150) {
      return 'Members of sensitive groups may experience respiratory symptoms. The general public is less likely to be affected.';
    }
    if (aqi <= 200) {
      return 'Some members of the general public may experience respiratory symptoms. Sensitive groups may experience more serious symptoms.';
    }
    if (aqi <= 300) {
      return 'Health alert: The risk of health effects is increased for everyone.';
    }
    return 'Health warning of emergency conditions. Everyone is more likely to be affected.';
  }

  private static convertAQIToRating(aqi: number): number {
    // Convert AQI (0-500) to our 1-10 rating scale (inverted - lower AQI is better)
    if (aqi <= 50) return 9.0;
    if (aqi <= 100) return 7.5;
    if (aqi <= 150) return 6.0;
    if (aqi <= 200) return 4.5;
    if (aqi <= 300) return 3.0;
    return 1.5;
  }

  // Get forecast data for planning
  static async getAirQualityForecast(zipCode: string) {
    try {
      if (!this.API_KEY || this.API_KEY === 'your_epa_api_key_here') {
        return null;
      }

      const response = await fetch(
        `${this.BASE_URL}/forecast/zipCode/?format=application/json&zipCode=${zipCode}&API_KEY=${this.API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`EPA Forecast API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data || data.length === 0) {
        return null;
      }

      return data.map((forecast: any) => ({
        date: forecast.DateForecast,
        aqi: forecast.AQI,
        category: this.getAQICategory(forecast.AQI),
        discussion: forecast.Discussion
      }));

    } catch (error) {
      console.error('Error fetching EPA forecast data:', error);
      return null;
    }
  }

  // Get historical air quality for trend analysis
  static async getHistoricalAirQuality(zipCode: string, startDate: string, endDate: string) {
    try {
      if (!this.API_KEY || this.API_KEY === 'your_epa_api_key_here') {
        return null;
      }

      const response = await fetch(
        `${this.BASE_URL}/observation/zipCode/historical/?format=application/json&zipCode=${zipCode}&date=${startDate}T00-0000&endDate=${endDate}T23-0000&API_KEY=${this.API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`EPA Historical API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data || data.length === 0) {
        return null;
      }

      // Calculate monthly averages
      const monthlyData = this.calculateMonthlyAverages(data);
      
      return {
        monthlyAverages: monthlyData,
        overallAverage: monthlyData.reduce((sum, month) => sum + month.aqi, 0) / monthlyData.length,
        trend: this.calculateTrend(monthlyData)
      };

    } catch (error) {
      console.error('Error fetching EPA historical data:', error);
      return null;
    }
  }

  private static calculateMonthlyAverages(data: any[]) {
    const monthlyGroups: Record<string, number[]> = {};
    
    data.forEach(measurement => {
      const date = new Date(measurement.DateObserved);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyGroups[monthKey]) {
        monthlyGroups[monthKey] = [];
      }
      
      monthlyGroups[monthKey].push(measurement.AQI || 0);
    });

    return Object.entries(monthlyGroups).map(([month, values]) => ({
      month,
      aqi: Math.round(values.reduce((sum, val) => sum + val, 0) / values.length),
      daysReported: values.length
    }));
  }

  private static calculateTrend(monthlyData: any[]): 'improving' | 'stable' | 'worsening' {
    if (monthlyData.length < 2) return 'stable';
    
    const recent = monthlyData.slice(-3).reduce((sum, month) => sum + month.aqi, 0) / 3;
    const older = monthlyData.slice(0, 3).reduce((sum, month) => sum + month.aqi, 0) / 3;
    
    const change = recent - older;
    
    if (change < -5) return 'improving';
    if (change > 5) return 'worsening';
    return 'stable';
  }

  // Test API connection
  static async testConnection(): Promise<boolean> {
    try {
      const testData = await this.getRealAirQuality('78746'); // Westlake ZIP
      return testData !== null;
    } catch (error) {
      console.error('EPA API test failed:', error);
      return false;
    }
  }

  // Get bulk air quality for multiple ZIP codes
  static async getBulkAirQuality(zipCodes: string[]) {
    try {
      const results = await Promise.all(
        zipCodes.map(zipCode => this.getRealAirQuality(zipCode))
      );
      
      return results.reduce((acc, data, index) => {
        if (data) {
          acc[zipCodes[index]] = data;
        }
        return acc;
      }, {} as Record<string, any>);
    } catch (error) {
      console.error('Error fetching bulk air quality data:', error);
      return {};
    }
  }
}
