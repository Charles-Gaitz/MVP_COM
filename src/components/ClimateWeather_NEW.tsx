import { useState, useEffect } from 'react';
import { Cloud, Sun, Thermometer, Droplets, Wind, Eye, Calendar, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { WeatherService, type WeatherData } from '../services/WeatherService';

interface ClimateWeatherProps {
  communityId: string;
  communityName: string;
}

export function ClimateWeather_NEW({ communityId, communityName }: ClimateWeatherProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch weather data from OpenWeatherMap API
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await WeatherService.getCurrentWeather(communityId);
        
        if (data) {
          setWeatherData(data);
        } else {
          setError('Unable to fetch weather data');
          // Use fallback data with crystal ball indicators
          setWeatherData(getFallbackWeatherData());
        }
      } catch (err) {
        console.error('Weather data fetch error:', err);
        setError('Failed to load weather data');
        // Use fallback data on error with crystal ball indicators
        setWeatherData(getFallbackWeatherData());
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [communityId]);

  // Fallback weather data when API is unavailable - OBVIOUSLY SAMPLE DATA
  const getFallbackWeatherData = (): WeatherData => {
    return {
      current: {
        temperature: 99, // 🔮 Obviously fake round number
        feelsLike: 101,
        humidity: 50, // 🔮 Round number
        windSpeed: 10, // 🔮 Round number
        description: '🔮 Sample Perfect Weather',
        icon: '01d',
        uvIndex: 5, // 🔮 Round number
        visibility: 10 // 🔮 Round number
      },
      forecast: [
        { date: '2024-12-19', high: 99, low: 70, description: '🔮 Sample Sunny', icon: '01d', humidity: 50, windSpeed: 10 },
        { date: '2024-12-20', high: 95, low: 75, description: '🔮 Sample Cloudy', icon: '02d', humidity: 55, windSpeed: 15 },
        { date: '2024-12-21', high: 90, low: 65, description: '🔮 Sample Rain', icon: '10d', humidity: 80, windSpeed: 20 },
        { date: '2024-12-22', high: 85, low: 60, description: '🔮 Sample Storms', icon: '11d', humidity: 85, windSpeed: 25 },
        { date: '2024-12-23', high: 100, low: 80, description: '🔮 Sample Hot', icon: '01d', humidity: 40, windSpeed: 5 }
      ]
    };
  };

  const getWeatherIcon = (icon: string) => {
    switch (icon) {
      case '01d': return <Sun className="h-6 w-6 text-yellow-500" />;
      case '01n': return <Sun className="h-6 w-6 text-blue-500" />;
      case '02d': case '02n': return <Cloud className="h-6 w-6 text-gray-500" />;
      case '03d': case '03n': case '04d': case '04n': return <Cloud className="h-6 w-6 text-gray-600" />;
      case '09d': case '09n': case '10d': case '10n': return <Cloud className="h-6 w-6 text-blue-600" />;
      case '11d': case '11n': return <Cloud className="h-6 w-6 text-purple-600" />;
      case '13d': case '13n': return <Cloud className="h-6 w-6 text-blue-300" />;
      case '50d': case '50n': return <Cloud className="h-6 w-6 text-gray-400" />;
      default: return <Sun className="h-6 w-6 text-yellow-500" />;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Cloud className="h-6 w-6 text-blue-600" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Weather</h2>
                <p className="text-gray-600 text-sm mt-1">Loading weather data for {communityName}...</p>
              </div>
            </div>
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  const currentData = weatherData?.current;
  const forecastData = weatherData?.forecast || [];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
      {/* Sample Data Warning */}
      {error && (
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-t-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-amber-400">🔮</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-amber-700">
                <strong>Sample Data:</strong> Weather information below uses placeholder data for demonstration
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Cloud className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Weather</h2>
              <p className="text-gray-600 text-sm mt-1">Current conditions in {communityName}</p>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <span className="text-sm font-medium">{isExpanded ? 'Show Less' : 'Show More'}</span>
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>

        {/* Current Weather */}
        {currentData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className={`bg-gray-50 rounded-lg p-4 ${error ? 'bg-amber-50 border border-amber-200' : ''}`}>
              <div className="flex items-center space-x-3">
                <Thermometer className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm text-gray-600">Temperature</p>
                  <p className={`text-lg font-semibold ${error ? 'text-amber-700' : 'text-gray-900'}`}>
                    {currentData.temperature}°F
                  </p>
                  <p className="text-xs text-gray-500">Feels like {currentData.feelsLike}°F</p>
                </div>
              </div>
            </div>

            <div className={`bg-gray-50 rounded-lg p-4 ${error ? 'bg-amber-50 border border-amber-200' : ''}`}>
              <div className="flex items-center space-x-3">
                <Droplets className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Humidity</p>
                  <p className={`text-lg font-semibold ${error ? 'text-amber-700' : 'text-gray-900'}`}>
                    {currentData.humidity}%
                  </p>
                </div>
              </div>
            </div>

            <div className={`bg-gray-50 rounded-lg p-4 ${error ? 'bg-amber-50 border border-amber-200' : ''}`}>
              <div className="flex items-center space-x-3">
                <Wind className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Wind Speed</p>
                  <p className={`text-lg font-semibold ${error ? 'text-amber-700' : 'text-gray-900'}`}>
                    {currentData.windSpeed} mph
                  </p>
                </div>
              </div>
            </div>

            <div className={`bg-gray-50 rounded-lg p-4 ${error ? 'bg-amber-50 border border-amber-200' : ''}`}>
              <div className="flex items-center space-x-3">
                <Eye className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600">Visibility</p>
                  <p className={`text-lg font-semibold ${error ? 'text-amber-700' : 'text-gray-900'}`}>
                    {currentData.visibility} mi
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Current Condition */}
        {currentData && (
          <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6 ${error ? 'from-amber-50 to-orange-50' : ''}`}>
            <div className="flex items-center space-x-4">
              {getWeatherIcon(currentData.icon)}
              <div>
                <p className={`text-lg font-semibold ${error ? 'text-amber-700' : 'text-gray-900'}`}>
                  {currentData.description}
                </p>
                <p className="text-sm text-gray-600">UV Index: {currentData.uvIndex}</p>
              </div>
            </div>
          </div>
        )}

        {/* 5-Day Forecast */}
        {isExpanded && forecastData.length > 0 && (
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">5-Day Forecast</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {forecastData.map((day, index) => (
                <div key={index} className={`bg-gray-50 rounded-lg p-4 text-center ${error ? 'bg-amber-50 border border-amber-200' : ''}`}>
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </p>
                  <div className="flex justify-center mb-2">
                    {getWeatherIcon(day.icon)}
                  </div>
                  <p className={`text-xs mb-2 ${error ? 'text-amber-700' : 'text-gray-700'}`}>{day.description}</p>
                  <div className={`text-sm ${error ? 'text-amber-700' : 'text-gray-900'}`}>
                    <span className="font-semibold">{day.high}°</span>
                    <span className="text-gray-500 mx-1">/</span>
                    <span>{day.low}°</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    <div>{day.humidity}% humidity</div>
                    <div>{day.windSpeed} mph wind</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Data Source */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            {error ? (
              <>🔮 Sample weather data for demonstration purposes</>
            ) : (
              <>Weather data provided by OpenWeatherMap • Updated: {new Date().toLocaleString()}</>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}