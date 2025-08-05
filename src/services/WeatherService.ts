/**
 * OpenWeatherMap API Service
 * Provides current weather, forecasts, and climate data
 */

export interface WeatherData {
  current: {
    temperature: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    description: string;
    icon: string;
    uvIndex: number;
    visibility: number;
  };
  forecast: Array<{
    date: string;
    high: number;
    low: number;
    description: string;
    icon: string;
    humidity: number;
    windSpeed: number;
  }>;
}

export interface ClimateData {
  avgHighTemp: number;
  avgLowTemp: number;
  annualRainfall: number;
  sunnyDays: number;
  humidityLevel: number;
  monthlyData: Array<{
    month: string;
    high: number;
    low: number;
    rainfall: number;
    sunny: boolean;
  }>;
  airQuality: string;
  uvIndex: number;
}

export class WeatherService {
  private static readonly CURRENT_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';
  private static readonly FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';
  private static readonly ONECALL_URL = 'https://api.openweathermap.org/data/3.0/onecall';
  private static readonly AIR_QUALITY_URL = 'https://api.openweathermap.org/data/2.5/air_pollution';
  private static readonly API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

  // Geographic coordinates for Texas communities
  private static readonly COORDINATES = {
    'austin': { lat: 30.2672, lon: -97.7431 },
    'westlake': { lat: 30.3991, lon: -97.8300 },
    'plano': { lat: 33.0198, lon: -96.6989 },
    'frisco': { lat: 33.1507, lon: -96.8236 },
    'dallas': { lat: 32.7767, lon: -96.7970 },
    'houston': { lat: 29.7604, lon: -95.3698 },
    'katy': { lat: 29.7858, lon: -95.8244 },
    'sugar-land': { lat: 29.6196, lon: -95.6349 }
  };

  /**
   * Get current weather data for a community
   */
  static async getCurrentWeather(communityId: string): Promise<WeatherData | null> {
    const coords = this.COORDINATES[communityId as keyof typeof this.COORDINATES];
    if (!coords) {
      console.warn(`No coordinates found for ${communityId}`);
      return null;
    }

    try {
      // Get current weather
      const currentUrl = `${this.CURRENT_WEATHER_URL}?lat=${coords.lat}&lon=${coords.lon}&appid=${this.API_KEY}&units=imperial`;
      const currentResponse = await fetch(currentUrl);
      
      if (!currentResponse.ok) {
        throw new Error(`Weather API request failed: ${currentResponse.status}`);
      }

      const currentData = await currentResponse.json();

      // Get 5-day forecast
      const forecastUrl = `${this.FORECAST_URL}?lat=${coords.lat}&lon=${coords.lon}&appid=${this.API_KEY}&units=imperial`;
      const forecastResponse = await fetch(forecastUrl);
      const forecastData = forecastResponse.ok ? await forecastResponse.json() : null;

      // Get UV index (requires OneCall API)
      const uvUrl = `${this.ONECALL_URL}?lat=${coords.lat}&lon=${coords.lon}&appid=${this.API_KEY}&units=imperial&exclude=minutely,hourly,alerts`;
      const uvResponse = await fetch(uvUrl);
      const uvData = uvResponse.ok ? await uvResponse.json() : null;

      return this.parseWeatherData(currentData, forecastData, uvData);
    } catch (error) {
      console.error('Weather API Error:', error);
      return null;
    }
  }

  /**
   * Get air quality data
   */
  static async getAirQuality(communityId: string): Promise<any> {
    const coords = this.COORDINATES[communityId as keyof typeof this.COORDINATES];
    if (!coords) return null;

    try {
      const url = `${this.AIR_QUALITY_URL}?lat=${coords.lat}&lon=${coords.lon}&appid=${this.API_KEY}`;
      const response = await fetch(url);
      
      if (!response.ok) return null;
      
      const data = await response.json();
      return this.parseAirQualityData(data);
    } catch (error) {
      console.error('Air Quality API Error:', error);
      return null;
    }
  }

  /**
   * Get historical climate data (simplified version)
   */
  static async getClimateData(communityId: string): Promise<ClimateData | null> {
    const coords = this.COORDINATES[communityId as keyof typeof this.COORDINATES];
    if (!coords) return null;

    // For demo purposes, return typical climate data for Texas regions
    // In production, you'd use historical weather APIs
    return this.getTypicalClimateData(communityId);
  }

  /**
   * Parse current weather and forecast data
   */
  private static parseWeatherData(current: any, forecast: any, uv: any): WeatherData {
    // Parse current weather
    const currentWeather = {
      temperature: Math.round(current.main.temp),
      feelsLike: Math.round(current.main.feels_like),
      humidity: current.main.humidity,
      windSpeed: Math.round(current.wind.speed),
      description: current.weather[0].description,
      icon: current.weather[0].icon,
      uvIndex: uv?.current?.uvi || 6.5,
      visibility: Math.round((current.visibility || 10000) / 1609.34) // Convert meters to miles
    };

    // Parse 5-day forecast
    const forecastData = [];
    if (forecast?.list) {
      const dailyForecasts = forecast.list.filter((_: any, index: number) => index % 8 === 0); // Every 24 hours
      
      for (let i = 0; i < Math.min(5, dailyForecasts.length); i++) {
        const day = dailyForecasts[i];
        forecastData.push({
          date: new Date(day.dt * 1000).toISOString().split('T')[0],
          high: Math.round(day.main.temp_max),
          low: Math.round(day.main.temp_min),
          description: day.weather[0].description,
          icon: day.weather[0].icon,
          humidity: day.main.humidity,
          windSpeed: Math.round(day.wind.speed)
        });
      }
    }

    return {
      current: currentWeather,
      forecast: forecastData
    };
  }

  /**
   * Parse air quality data
   */
  private static parseAirQualityData(data: any): string {
    if (!data?.list?.[0]?.main?.aqi) return 'Good';
    
    const aqi = data.list[0].main.aqi;
    const qualityLevels = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];
    return qualityLevels[aqi - 1] || 'Good';
  }

  /**
   * Get typical climate data for Texas communities
   */
  private static getTypicalClimateData(communityId: string): ClimateData {
    const climateProfiles = {
      'austin': {
        avgHighTemp: 82,
        avgLowTemp: 62,
        annualRainfall: 34.2,
        sunnyDays: 228,
        humidityLevel: 66,
        airQuality: 'Good',
        uvIndex: 7.2
      },
      'plano': {
        avgHighTemp: 78,
        avgLowTemp: 58,
        annualRainfall: 38.1,
        sunnyDays: 232,
        humidityLevel: 64,
        airQuality: 'Moderate',
        uvIndex: 6.8
      },
      'houston': {
        avgHighTemp: 84,
        avgLowTemp: 64,
        annualRainfall: 49.8,
        sunnyDays: 204,
        humidityLevel: 75,
        airQuality: 'Moderate',
        uvIndex: 7.5
      }
    };

    const profile = climateProfiles[communityId as keyof typeof climateProfiles] || climateProfiles.austin;

    return {
      ...profile,
      monthlyData: [
        { month: 'Jan', high: profile.avgHighTemp - 20, low: profile.avgLowTemp - 20, rainfall: 1.9, sunny: true },
        { month: 'Feb', high: profile.avgHighTemp - 15, low: profile.avgLowTemp - 17, rainfall: 2.1, sunny: true },
        { month: 'Mar', high: profile.avgHighTemp - 8, low: profile.avgLowTemp - 10, rainfall: 2.8, sunny: true },
        { month: 'Apr', high: profile.avgHighTemp - 1, low: profile.avgLowTemp - 2, rainfall: 2.5, sunny: true },
        { month: 'May', high: profile.avgHighTemp + 6, low: profile.avgLowTemp + 6, rainfall: 4.2, sunny: false },
        { month: 'Jun', high: profile.avgHighTemp + 13, low: profile.avgLowTemp + 13, rainfall: 3.4, sunny: true },
        { month: 'Jul', high: profile.avgHighTemp + 16, low: profile.avgLowTemp + 16, rainfall: 2.1, sunny: true },
        { month: 'Aug', high: profile.avgHighTemp + 17, low: profile.avgLowTemp + 16, rainfall: 2.3, sunny: true },
        { month: 'Sep', high: profile.avgHighTemp + 10, low: profile.avgLowTemp + 9, rainfall: 3.1, sunny: true },
        { month: 'Oct', high: profile.avgHighTemp + 1, low: profile.avgLowTemp - 1, rainfall: 2.8, sunny: true },
        { month: 'Nov', high: profile.avgHighTemp - 10, low: profile.avgLowTemp - 12, rainfall: 2.2, sunny: true },
        { month: 'Dec', high: profile.avgHighTemp - 18, low: profile.avgLowTemp - 19, rainfall: 2.0, sunny: true }
      ]
    };
  }
}
