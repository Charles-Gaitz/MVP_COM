// Weather API service for climate data
const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export interface WeatherData {
  current: {
    temperature: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    uvIndex: number;
  };
  forecast: {
    date: string;
    high: number;
    low: number;
    condition: string;
    precipitation: number;
  }[];
  averages: {
    highTemp: number;
    lowTemp: number;
    precipitation: number;
    sunnyDays: number;
  };
}

export interface ClimateData {
  temperature: {
    average: number;
    high: number;
    low: number;
  };
  precipitation: {
    annual: number;
    rainyDays: number;
  };
  sunshine: {
    hours: number;
    percentage: number;
  };
  humidity: number;
  airQuality: {
    index: number;
    status: string;
  };
}

export class WeatherService {
  // Get current weather for a location
  static async getCurrentWeather(lat: number, lng: number): Promise<WeatherData | null> {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${WEATHER_API_KEY}&units=imperial`
      );
      const current = await response.json();

      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${WEATHER_API_KEY}&units=imperial`
      );
      const forecast = await forecastResponse.json();

      return {
        current: {
          temperature: Math.round(current.main.temp),
          condition: current.weather[0].main,
          humidity: current.main.humidity,
          windSpeed: Math.round(current.wind.speed),
          uvIndex: 0 // Would need UV API call
        },
        forecast: forecast.list.slice(0, 5).map((item: any) => ({
          date: new Date(item.dt * 1000).toLocaleDateString(),
          high: Math.round(item.main.temp_max),
          low: Math.round(item.main.temp_min),
          condition: item.weather[0].main,
          precipitation: item.rain?.['3h'] || 0
        })),
        averages: {
          highTemp: 85,
          lowTemp: 65,
          precipitation: 32,
          sunnyDays: 250
        }
      };
    } catch (error) {
      console.error('Weather API error:', error);
      return null;
    }
  }

  // Get climate data for a specific location
  static async getClimateData(cityName: string): Promise<ClimateData | null> {
    try {
      // This would typically use a climate data API
      // For now, returning sample data based on Texas climate
      const climateMapping: Record<string, ClimateData> = {
        'Austin': {
          temperature: { average: 75, high: 85, low: 65 },
          precipitation: { annual: 32, rainyDays: 85 },
          sunshine: { hours: 2650, percentage: 73 },
          humidity: 65,
          airQuality: { index: 45, status: 'Good' }
        },
        'Dallas': {
          temperature: { average: 73, high: 83, low: 63 },
          precipitation: { annual: 38, rainyDays: 95 },
          sunshine: { hours: 2580, percentage: 71 },
          humidity: 63,
          airQuality: { index: 52, status: 'Moderate' }
        },
        'Houston': {
          temperature: { average: 77, high: 87, low: 67 },
          precipitation: { annual: 50, rainyDays: 110 },
          sunshine: { hours: 2500, percentage: 69 },
          humidity: 75,
          airQuality: { index: 58, status: 'Moderate' }
        }
      };

      return climateMapping[cityName] || climateMapping['Austin'];
    } catch (error) {
      console.error('Climate data error:', error);
      return null;
    }
  }

  // Get air quality data
  static async getAirQuality(lat: number, lng: number): Promise<{ index: number; status: string } | null> {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lng}&appid=${WEATHER_API_KEY}`
      );
      const data = await response.json();
      
      const aqi = data.list[0].main.aqi;
      const statusMap = {
        1: 'Good',
        2: 'Fair',
        3: 'Moderate',
        4: 'Poor',
        5: 'Very Poor'
      };

      return {
        index: aqi * 20, // Convert to 0-100 scale
        status: statusMap[aqi as keyof typeof statusMap] || 'Unknown'
      };
    } catch (error) {
      console.error('Air quality error:', error);
      return null;
    }
  }

  // Get historical weather patterns
  static async getWeatherPatterns(lat: number, lng: number): Promise<any> {
    // This would integrate with historical weather data APIs
    // For now, return sample data
    return {
      seasonalTrends: {
        spring: { avgTemp: 72, precipitation: 3.2 },
        summer: { avgTemp: 85, precipitation: 2.8 },
        fall: { avgTemp: 68, precipitation: 2.1 },
        winter: { avgTemp: 55, precipitation: 1.8 }
      },
      extremes: {
        recordHigh: 105,
        recordLow: 18,
        maxPrecipitation: 8.5
      }
    };
  }
}
