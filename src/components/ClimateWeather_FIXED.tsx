import { useState, useEffect } from 'react';
import { Cloud, Sun, Thermometer, Droplets, Wind, Eye, Calendar, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { WeatherService, type WeatherData } from '../services/WeatherService';

interface ClimateWeatherProps {
  communityId: string;
  communityName: string;
}

export function ClimateWeather({ communityId, communityName }: ClimateWeatherProps) {
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
          // Use fallback data
          setWeatherData(getFallbackWeatherData());
        }
      } catch (err) {
        console.error('Weather data fetch error:', err);
        setError('Failed to load weather data');
        // Use fallback data on error
        setWeatherData(getFallbackWeatherData());
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [communityId]);

  // Fallback weather data when API is unavailable
  const getFallbackWeatherData = (): WeatherData => {
    return {
      current: {
        temperature: 78,
        feelsLike: 82,
        humidity: 65,
        windSpeed: 8,
        description: 'Partly cloudy',
        icon: '02d',
        uvIndex: 6,
        visibility: 10
      },
      forecast: [
        { date: new Date().toISOString(), high: 82, low: 68, description: 'Sunny', icon: '01d', humidity: 60, windSpeed: 5 },
        { date: new Date(Date.now() + 86400000).toISOString(), high: 84, low: 70, description: 'Partly cloudy', icon: '02d', humidity: 65, windSpeed: 7 },
        { date: new Date(Date.now() + 172800000).toISOString(), high: 80, low: 66, description: 'Scattered showers', icon: '10d', humidity: 75, windSpeed: 10 },
        { date: new Date(Date.now() + 259200000).toISOString(), high: 76, low: 62, description: 'Thunderstorms', icon: '11d', humidity: 80, windSpeed: 12 },
        { date: new Date(Date.now() + 345600000).toISOString(), high: 79, low: 65, description: 'Partly cloudy', icon: '02d', humidity: 70, windSpeed: 6 }
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

  // Use weather data (either from API or fallback)
  const currentWeatherData = weatherData || getFallbackWeatherData();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Cloud className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Weather</h2>
              <p className="text-gray-600 text-sm mt-1">
                {error ? 'Sample data - ' : 'Current weather for '}{communityName}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        {/* Current Weather */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="col-span-1">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                {getWeatherIcon(currentWeatherData.current.icon)}
              </div>
              <p className="text-3xl font-bold text-gray-900">{Math.round(currentWeatherData.current.temperature)}°F</p>
              <p className="text-xs text-gray-500 mt-1">{currentWeatherData.current.description}</p>
              <p className="text-xs text-gray-500">Feels like {Math.round(currentWeatherData.current.feelsLike)}°F</p>
            </div>
          </div>

          {/* Weather Details */}
          <div className="col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-600">Humidity</h4>
                <Droplets className="w-4 h-4 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{currentWeatherData.current.humidity}%</p>
              <p className="text-sm text-gray-600 mt-1">Relative humidity</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-600">Wind Speed</h4>
                <Wind className="w-4 h-4 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{Math.round(currentWeatherData.current.windSpeed)} mph</p>
              <p className="text-sm text-gray-600 mt-1">Current wind</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-600">Visibility</h4>
                <Eye className="w-4 h-4 text-purple-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{currentWeatherData.current.visibility} mi</p>
              <p className="text-sm text-gray-600 mt-1">Visibility range</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-600">UV Index</h4>
                <Sun className="w-4 h-4 text-orange-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{currentWeatherData.current.uvIndex}</p>
              <p className="text-sm text-gray-600 mt-1">UV exposure level</p>
            </div>
          </div>
        </div>

        {/* 5-Day Forecast */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Calendar className="w-5 h-5 text-blue-600 mr-2" />
            5-Day Forecast
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {currentWeatherData.forecast.map((day, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-sm font-medium text-gray-600 mb-2">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </p>
                <div className="flex justify-center mb-2">
                  {getWeatherIcon(day.icon)}
                </div>
                <p className="text-xs text-gray-600 mb-2">{day.description}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold">{Math.round(day.high)}°</span>
                  <span className="text-gray-500">{Math.round(day.low)}°</span>
                </div>
                <div className="flex justify-center items-center mt-2 text-xs text-gray-500">
                  <Droplets className="w-3 h-3 mr-1" />
                  <span className="text-xs text-gray-600">{day.humidity}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Thermometer className="w-5 h-5 text-red-600 mr-2" />
              Additional Weather Information
            </h3>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-sm text-gray-600">
                Weather data is provided by OpenWeatherMap API. This includes current conditions, 
                5-day forecasts, and detailed weather metrics for {communityName}.
              </p>
              {error && (
                <p className="text-sm text-amber-600 mt-2">
                  Currently showing sample data due to API unavailability.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>
              Data provided by{' '}
              <a href="https://openweathermap.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                OpenWeatherMap
              </a>
            </span>
            <span>
              {error && 'Sample data - '}
              Last updated: {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
