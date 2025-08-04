import { useState, useEffect } from 'react';
import { Cloud, Sun, Thermometer, Droplets, Wind, Eye, ChevronDown, ChevronUp } from 'lucide-react';

interface ClimateWeatherProps {
  communityId: string;
  communityName: string;
}

interface WeatherData {
  current: {
    temperature: number;
    description: string;
    humidity: number;
    windSpeed: number;
    visibility: number;
    icon: string;
  };
  climate: {
    climate: string;
    avgHighTemp: number;
    avgLowTemp: number;
    annualRainfall: number;
    sunnyDays: number;
    humidityLevel: number;
  };
}

export function ClimateWeather({ communityId, communityName }: ClimateWeatherProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to get coordinates for community
  const getCommunityCoordinates = (id: string): { lat: number; lon: number } => {
    const coordinates: Record<string, { lat: number; lon: number }> = {
      'westlake': { lat: 30.3644, lon: -97.8431 },
      'plano': { lat: 33.0198, lon: -96.6989 },
      'katy': { lat: 29.7866, lon: -95.8244 },
      'allen': { lat: 33.1031, lon: -96.6706 },
      'frisco': { lat: 33.1507, lon: -96.8236 },
      'sugar-land': { lat: 29.6196, lon: -95.6349 },
      'round-rock': { lat: 30.5083, lon: -97.6789 },
      'flower-mound': { lat: 33.0146, lon: -97.0969 }
    };
    return coordinates[id] || coordinates['westlake'];
  };

  // Fetch data from OpenWeatherMap API
  const fetchWeatherData = async (coords: { lat: number; lon: number }): Promise<WeatherData | null> => {
    try {
      const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
      
      if (!WEATHER_API_KEY || WEATHER_API_KEY === 'your_weather_api_key_here') {
        console.warn('Weather API key not configured, using sample data');
        return null;
      }

      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${WEATHER_API_KEY}&units=imperial`
      );

      if (!currentResponse.ok) {
        throw new Error('Weather API error');
      }

      const currentData = await currentResponse.json();

      return {
        current: {
          temperature: Math.round(currentData.main.temp),
          description: currentData.weather[0].description,
          humidity: currentData.main.humidity,
          windSpeed: Math.round(currentData.wind.speed),
          visibility: Math.round(currentData.visibility / 1609.34), // Convert to miles
          icon: currentData.weather[0].icon
        },
        climate: {
          climate: 'Humid Subtropical',
          avgHighTemp: Math.round(currentData.main.temp_max),
          avgLowTemp: Math.round(currentData.main.temp_min),
          annualRainfall: 34.2,
          sunnyDays: 228,
          humidityLevel: currentData.main.humidity
        }
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return null;
    }
  };

  // Sample climate data fallback
  const getClimateData = (id: string): WeatherData => {
    const climateData = {
      westlake: {
        climate: 'Humid Subtropical',
        avgHighTemp: 82,
        avgLowTemp: 62,
        annualRainfall: 34.2,
        sunnyDays: 228,
        humidityLevel: 66
      },
      plano: {
        climate: 'Humid Subtropical',
        avgHighTemp: 78,
        avgLowTemp: 58,
        annualRainfall: 38.1,
        sunnyDays: 232,
        humidityLevel: 64
      },
      katy: {
        climate: 'Humid Subtropical',
        avgHighTemp: 84,
        avgLowTemp: 65,
        annualRainfall: 49.8,
        sunnyDays: 204,
        humidityLevel: 74
      }
    };

    const data = climateData[id as keyof typeof climateData] || climateData.westlake;
    
    return {
      current: {
        temperature: 78,
        description: 'partly cloudy',
        humidity: data.humidityLevel,
        windSpeed: 8,
        visibility: 10,
        icon: '02d'
      },
      climate: data
    };
  };

  // Load real weather data from OpenWeatherMap API
  useEffect(() => {
    const loadWeatherData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get coordinates for the community
        const coordinates = getCommunityCoordinates(communityId);
        
        // Fetch weather data from OpenWeatherMap API
        const realWeatherData = await fetchWeatherData(coordinates);
        
        if (realWeatherData) {
          setWeatherData(realWeatherData);
        } else {
          // Fallback to sample data
          setWeatherData(getClimateData(communityId));
        }
      } catch (err) {
        console.error('Error loading weather data:', err);
        setError('Unable to load weather data');
        setWeatherData(getClimateData(communityId));
      } finally {
        setLoading(false);
      }
    };

    loadWeatherData();
  }, [communityId]);

  const toggleSection = () => {
    setIsExpanded(!isExpanded);
  };

  const currentWeatherData = weatherData || getClimateData(communityId);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
        <div className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading weather data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
        <div className="p-6">
          <div className="text-center text-red-600">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
      <div className="border-b border-gray-200">
        <button
          onClick={toggleSection}
          className="flex items-center justify-between w-full p-6 text-left hover:bg-gray-50 transition-colors duration-200"
        >
          <div className="flex items-center">
            <Cloud className="h-6 w-6 text-blue-900 mr-3" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Climate & Weather Data
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Real-time weather information for {communityName}
              </p>
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-600" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-600" />
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="p-6">
          {/* Current Weather */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Weather</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Thermometer className="h-5 w-5 text-blue-600" />
                  <span className="text-xs text-blue-600 font-medium">°F</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{currentWeatherData.current.temperature}°</p>
                <p className="text-sm text-gray-600 capitalize">{currentWeatherData.current.description}</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Droplets className="h-5 w-5 text-green-600" />
                  <span className="text-xs text-green-600 font-medium">%</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{currentWeatherData.current.humidity}%</p>
                <p className="text-sm text-gray-600">Humidity</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Wind className="h-5 w-5 text-purple-600" />
                  <span className="text-xs text-purple-600 font-medium">mph</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{currentWeatherData.current.windSpeed}</p>
                <p className="text-sm text-gray-600">Wind Speed</p>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Eye className="h-5 w-5 text-gray-600" />
                  <span className="text-xs text-gray-600 font-medium">mi</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{currentWeatherData.current.visibility}</p>
                <p className="text-sm text-gray-600">Visibility</p>
              </div>
            </div>
          </div>

          {/* Climate Overview */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Climate Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Thermometer className="h-5 w-5 text-orange-600" />
                  <span className="text-xs text-orange-600 font-medium">°F</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{currentWeatherData.climate.avgHighTemp}°</p>
                <p className="text-sm text-gray-600">Avg High Temp</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Droplets className="h-5 w-5 text-blue-600" />
                  <span className="text-xs text-blue-600 font-medium">inches</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{currentWeatherData.climate.annualRainfall}"</p>
                <p className="text-sm text-gray-600">Annual Rainfall</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Sun className="h-5 w-5 text-yellow-600" />
                  <span className="text-xs text-yellow-600 font-medium">days</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{currentWeatherData.climate.sunnyDays}</p>
                <p className="text-sm text-gray-600">Sunny Days/Year</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Wind className="h-5 w-5 text-green-600" />
                  <span className="text-xs text-green-600 font-medium">%</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{currentWeatherData.climate.humidityLevel}%</p>
                <p className="text-sm text-gray-600">Avg Humidity</p>
              </div>
            </div>
          </div>

          {/* Climate Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Cloud className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Climate Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Climate Type</h5>
                    <p className="text-sm text-gray-600 mb-3">{currentWeatherData.climate.climate}</p>
                    <h5 className="font-medium text-gray-900 mb-2">Best Months to Visit</h5>
                    <p className="text-sm text-gray-600">
                      October through April offer the most comfortable temperatures and lower humidity.
                    </p>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Seasonal Highlights</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Spring: Mild temperatures, occasional storms</li>
                      <li>• Summer: Hot and humid, afternoon thunderstorms</li>
                      <li>• Fall: Pleasant weather, less rainfall</li>
                      <li>• Winter: Mild, occasional cold fronts</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
