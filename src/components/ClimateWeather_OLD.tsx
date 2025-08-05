import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cloud, Sun, Thermometer, Droplets, Wind, AlertTriangle, Umbrella, Eye, ChevronDown, ChevronUp, Loader2, Calendar } from 'lucide-react';
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
          setWeatherData(getFallbackWeatherData(communityId));
        }
      } catch (err) {
        console.error('Weather data fetch error:', err);
        setError('Failed to load weather data');
        // Use fallback data on error
        setWeatherData(getFallbackWeatherData(communityId));
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [communityId]);

  const toggleSection = () => {
    setIsExpanded(!isExpanded);
  };

  // Fallback weather data for demo purposes
  const getFallbackWeatherData = (id: string): WeatherData => {
    const fallbackData = {
      westlake: {
        current: {
          temperature: 78,
          feelsLike: 82,
          humidity: 65,
          windSpeed: 8,
          visibility: 10,
          uvIndex: 7,
          condition: 'Clear',
          icon: '01d'
        },
        forecast: [
          { date: '2024-12-19', high: 82, low: 62, condition: 'Sunny', icon: '01d', precipitation: 0 },
          { date: '2024-12-20', high: 85, low: 65, condition: 'Partly Cloudy', icon: '02d', precipitation: 10 },
          { date: '2024-12-21', high: 79, low: 59, condition: 'Thunderstorms', icon: '11d', precipitation: 80 },
          { date: '2024-12-22', high: 75, low: 55, condition: 'Cloudy', icon: '04d', precipitation: 30 },
          { date: '2024-12-23', high: 80, low: 60, condition: 'Sunny', icon: '01d', precipitation: 0 }
        ],
        climate: {
          type: 'Humid Subtropical',
          avgHighTemp: 82,
          avgLowTemp: 62,
          annualRainfall: 34.2,
          sunnyDays: 228,
          humidityLevel: 66
        },
        airQuality: {
          aqi: 42,
          category: 'Good',
          pollutants: {
            pm25: 8.2,
            pm10: 15.4,
            o3: 65.1,
            no2: 12.3,
            so2: 2.1,
            co: 0.4
          }
        },
        monthlyData: [
          { month: 'Jan', high: 62, low: 41, rainfall: 1.9, sunny: true },
          { month: 'Feb', high: 67, low: 45, rainfall: 2.1, sunny: true },
          { month: 'Mar', high: 74, low: 52, rainfall: 2.8, sunny: true },
          { month: 'Apr', high: 81, low: 60, rainfall: 2.5, sunny: true },
          { month: 'May', high: 88, low: 68, rainfall: 4.2, sunny: false },
          { month: 'Jun', high: 95, low: 75, rainfall: 3.4, sunny: true },
          { month: 'Jul', high: 98, low: 78, rainfall: 2.1, sunny: true },
          { month: 'Aug', high: 99, low: 78, rainfall: 2.3, sunny: true },
          { month: 'Sep', high: 92, low: 71, rainfall: 3.1, sunny: true },
          { month: 'Oct', high: 83, low: 61, rainfall: 2.8, sunny: true },
          { month: 'Nov', high: 72, low: 50, rainfall: 2.2, sunny: true },
          { month: 'Dec', high: 64, low: 43, rainfall: 2.0, sunny: true }
        ],
        naturalDisasters: [
          { type: 'Flooding', risk: 'Moderate', frequency: 'Rare', lastEvent: '2018', severity: 'Minor' },
          { type: 'Severe Storms', risk: 'High', frequency: 'Annual', lastEvent: '2024', severity: 'Moderate' },
          { type: 'Drought', risk: 'Low', frequency: 'Periodic', lastEvent: '2022', severity: 'Minor' },
          { type: 'Wildfire', risk: 'Low', frequency: 'Rare', lastEvent: '2021', severity: 'Minor' }
        ],
        lastUpdated: new Date().toISOString()
      },
      plano: {
        current: {
          temperature: 76,
          feelsLike: 80,
          humidity: 68,
          windSpeed: 6,
          visibility: 9,
          uvIndex: 6,
          condition: 'Partly Cloudy',
          icon: '02d'
        },
        forecast: [
          { date: '2024-12-19', high: 80, low: 58, condition: 'Partly Cloudy', icon: '02d', precipitation: 15 },
          { date: '2024-12-20', high: 83, low: 61, condition: 'Sunny', icon: '01d', precipitation: 0 },
          { date: '2024-12-21', high: 77, low: 55, condition: 'Rain', icon: '10d', precipitation: 70 },
          { date: '2024-12-22', high: 73, low: 52, condition: 'Cloudy', icon: '04d', precipitation: 25 },
          { date: '2024-12-23', high: 78, low: 57, condition: 'Sunny', icon: '01d', precipitation: 5 }
        ],
        climate: {
          type: 'Humid Subtropical',
          avgHighTemp: 80,
          avgLowTemp: 58,
          annualRainfall: 38.5,
          sunnyDays: 234,
          humidityLevel: 68
        },
        airQuality: {
          aqi: 38,
          category: 'Good',
          pollutants: {
            pm25: 7.1,
            pm10: 13.8,
            o3: 62.4,
            no2: 10.9,
            so2: 1.8,
            co: 0.3
          }
        },
        monthlyData: [
          { month: 'Jan', high: 58, low: 37, rainfall: 2.2, sunny: true },
          { month: 'Feb', high: 63, low: 41, rainfall: 2.4, sunny: true },
          { month: 'Mar', high: 71, low: 49, rainfall: 3.2, sunny: true },
          { month: 'Apr', high: 79, low: 57, rainfall: 3.5, sunny: true },
          { month: 'May', high: 86, low: 66, rainfall: 4.8, sunny: false },
          { month: 'Jun', high: 93, low: 74, rainfall: 3.2, sunny: true },
          { month: 'Jul', high: 96, low: 77, rainfall: 2.4, sunny: true },
          { month: 'Aug', high: 96, low: 77, rainfall: 2.1, sunny: true },
          { month: 'Sep', high: 89, low: 69, rainfall: 2.9, sunny: true },
          { month: 'Oct', high: 80, low: 58, rainfall: 3.4, sunny: true },
          { month: 'Nov', high: 68, low: 47, rainfall: 2.6, sunny: true },
          { month: 'Dec', high: 60, low: 39, rainfall: 2.3, sunny: true }
        ],
        naturalDisasters: [
          { type: 'Tornadoes', risk: 'Moderate', frequency: 'Occasional', lastEvent: '2023', severity: 'Moderate' },
          { type: 'Severe Storms', risk: 'High', frequency: 'Annual', lastEvent: '2024', severity: 'Moderate' },
          { type: 'Hail', risk: 'High', frequency: 'Annual', lastEvent: '2024', severity: 'Minor' },
          { type: 'Flooding', risk: 'Low', frequency: 'Rare', lastEvent: '2019', severity: 'Minor' }
        ],
        lastUpdated: new Date().toISOString()
      },
      katy: {
        current: {
          temperature: 81,
          feelsLike: 87,
          humidity: 72,
          windSpeed: 9,
          visibility: 8,
          uvIndex: 8,
          condition: 'Humid',
          icon: '50d'
        },
        forecast: [
          { date: '2024-12-19', high: 84, low: 68, condition: 'Humid', icon: '50d', precipitation: 20 },
          { date: '2024-12-20', high: 87, low: 71, condition: 'Thunderstorms', icon: '11d', precipitation: 85 },
          { date: '2024-12-21', high: 82, low: 65, condition: 'Partly Cloudy', icon: '02d', precipitation: 30 },
          { date: '2024-12-22', high: 79, low: 62, condition: 'Sunny', icon: '01d', precipitation: 10 },
          { date: '2024-12-23', high: 83, low: 66, condition: 'Sunny', icon: '01d', precipitation: 0 }
        ],
        climate: {
          type: 'Humid Subtropical',
          avgHighTemp: 84,
          avgLowTemp: 68,
          annualRainfall: 49.8,
          sunnyDays: 204,
          humidityLevel: 72
        },
        airQuality: {
          aqi: 55,
          category: 'Moderate',
          pollutants: {
            pm25: 12.4,
            pm10: 22.1,
            o3: 78.2,
            no2: 18.7,
            so2: 4.2,
            co: 0.7
          }
        },
        monthlyData: [
          { month: 'Jan', high: 68, low: 47, rainfall: 3.1, sunny: true },
          { month: 'Feb', high: 72, low: 51, rainfall: 2.7, sunny: true },
          { month: 'Mar', high: 78, low: 58, rainfall: 2.9, sunny: true },
          { month: 'Apr', high: 84, low: 65, rainfall: 3.2, sunny: true },
          { month: 'May', high: 90, low: 73, rainfall: 5.8, sunny: false },
          { month: 'Jun', high: 95, low: 79, rainfall: 6.2, sunny: false },
          { month: 'Jul', high: 97, low: 81, rainfall: 3.8, sunny: true },
          { month: 'Aug', high: 97, low: 81, rainfall: 3.9, sunny: true },
          { month: 'Sep', high: 92, low: 75, rainfall: 4.8, sunny: true },
          { month: 'Oct', high: 85, low: 66, rainfall: 3.9, sunny: true },
          { month: 'Nov', high: 76, low: 56, rainfall: 3.2, sunny: true },
          { month: 'Dec', high: 70, low: 49, rainfall: 3.1, sunny: true }
        ],
        naturalDisasters: [
          { type: 'Hurricanes', risk: 'High', frequency: 'Periodic', lastEvent: '2022', severity: 'Major' },
          { type: 'Flooding', risk: 'High', frequency: 'Occasional', lastEvent: '2023', severity: 'Moderate' },
          { type: 'Severe Storms', risk: 'High', frequency: 'Annual', lastEvent: '2024', severity: 'Moderate' },
          { type: 'Tornadoes', risk: 'Moderate', frequency: 'Rare', lastEvent: '2021', severity: 'Minor' }
        ],
        lastUpdated: new Date().toISOString()
      }
    };
    
    return fallbackData[id as keyof typeof fallbackData] || fallbackData.westlake;
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
                <h2 className="text-xl font-semibold text-gray-900">Climate & Weather</h2>
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
  const currentWeatherData = weatherData || getFallbackWeatherData(communityId);

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return 'text-green-600 bg-green-100';
    if (aqi <= 100) return 'text-yellow-600 bg-yellow-100';
    if (aqi <= 150) return 'text-orange-600 bg-orange-100';
    if (aqi <= 200) return 'text-red-600 bg-red-100';
    return 'text-purple-600 bg-purple-100';
  };

  const getWeatherIcon = (icon: string) => {
    switch (icon) {
      case '01d': return <Sun className="h-6 w-6 text-yellow-500" />;
      case '02d': case '03d': case '04d': return <Cloud className="h-6 w-6 text-gray-500" />;
      case '09d': case '10d': return <Droplets className="h-6 w-6 text-blue-500" />;
      case '11d': return <AlertTriangle className="h-6 w-6 text-red-500" />;
      case '50d': return <Eye className="h-6 w-6 text-gray-400" />;
      default: return <Cloud className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
      <div className="border-b border-gray-200">
        <div className="flex items-center justify-between p-6">
          <button
            onClick={toggleSection}
            className="flex-1 flex items-center justify-between text-left hover:bg-gray-50 -m-2 p-2 rounded-lg transition-colors"
          >
            <div>
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Cloud className="h-6 w-6 text-blue-600 mr-2" />
                Climate & Weather
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                {error ? 'Using sample data - ' : 'Real-time data for '}{communityName} - {currentWeatherData.climate.type}
              </p>
            </div>
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-gray-600 ml-4" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-600 ml-4" />
            )}
          </button>
          <div className="text-right ml-4">
            <div className="flex items-center space-x-2">
              {getWeatherIcon(currentWeatherData.current.icon)}
              <span className="text-2xl font-bold text-gray-900">{currentWeatherData.current.temperature}°F</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">{currentWeatherData.current.condition}</p>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-6 space-y-8">
          {/* Current Weather */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Thermometer className="w-5 h-5 text-blue-600 mr-2" />
              Current Conditions
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-600">Temperature</h4>
                  <Thermometer className="w-4 h-4 text-blue-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{currentWeatherData.current.temperature}°F</p>
                <p className="text-sm text-gray-600 mt-1">Feels like {currentWeatherData.current.feelsLike}°F</p>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-600">Humidity</h4>
                  <Droplets className="w-4 h-4 text-green-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{currentWeatherData.current.humidity}%</p>
                <p className="text-sm text-gray-600 mt-1">Relative humidity</p>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-600">Wind Speed</h4>
                  <Wind className="w-4 h-4 text-purple-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{currentWeatherData.current.windSpeed} mph</p>
                <p className="text-sm text-gray-600 mt-1">Current wind</p>
              </div>

              <div className="bg-orange-50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
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
                  <p className="text-xs text-gray-600 mb-2">{day.condition}</p>
                  <div className="flex justify-between text-sm">
                    <span className="font-bold text-gray-900">{day.high}°</span>
                    <span className="text-gray-500">{day.low}°</span>
                  </div>
                  <div className="flex items-center justify-center mt-2">
                    <Droplets className="w-3 h-3 text-blue-500 mr-1" />
                    <span className="text-xs text-gray-600">{day.precipitation}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Air Quality */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Wind className="w-5 h-5 text-blue-600 mr-2" />
              Air Quality
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-gray-900">{currentWeatherData.airQuality.aqi}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAQIColor(currentWeatherData.airQuality.aqi)}`}>
                      {currentWeatherData.airQuality.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Air Quality Index</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="text-center">
                  <p className="text-xs text-gray-500">PM2.5</p>
                  <p className="text-sm font-medium">{currentWeatherData.airQuality.pollutants.pm25} μg/m³</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">PM10</p>
                  <p className="text-sm font-medium">{currentWeatherData.airQuality.pollutants.pm10} μg/m³</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">O₃</p>
                  <p className="text-sm font-medium">{currentWeatherData.airQuality.pollutants.o3} μg/m³</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">NO₂</p>
                  <p className="text-sm font-medium">{currentWeatherData.airQuality.pollutants.no2} μg/m³</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">SO₂</p>
                  <p className="text-sm font-medium">{currentWeatherData.airQuality.pollutants.so2} μg/m³</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">CO</p>
                  <p className="text-sm font-medium">{currentWeatherData.airQuality.pollutants.co} mg/m³</p>
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Climate Data */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Thermometer className="w-5 h-5 text-blue-600 mr-2" />
              Monthly Climate Averages
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 text-gray-600">Month</th>
                    <th className="text-center py-2 text-gray-600">High</th>
                    <th className="text-center py-2 text-gray-600">Low</th>
                    <th className="text-center py-2 text-gray-600">Rainfall</th>
                    <th className="text-center py-2 text-gray-600">Sunshine</th>
                  </tr>
                </thead>
                <tbody>
                  {currentWeatherData.monthlyData.map((month, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-2 font-medium text-gray-900">{month.month}</td>
                      <td className="text-center py-2 text-gray-700">{month.high}°F</td>
                      <td className="text-center py-2 text-gray-700">{month.low}°F</td>
                      <td className="text-center py-2 text-gray-700">{month.rainfall}"</td>
                      <td className="text-center py-2">
                        {month.sunny ? (
                          <Sun className="w-4 h-4 text-yellow-500 mx-auto" />
                        ) : (
                          <Cloud className="w-4 h-4 text-gray-400 mx-auto" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Climate Summary */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Sun className="w-5 h-5 text-blue-600 mr-2" />
              Climate Overview
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-yellow-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Climate Type</h4>
                <p className="text-lg font-bold text-gray-900">{currentWeatherData.climate.type}</p>
              </div>
              
              <div className="bg-red-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Avg High Temp</h4>
                <p className="text-lg font-bold text-gray-900">{currentWeatherData.climate.avgHighTemp}°F</p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Annual Rainfall</h4>
                <p className="text-lg font-bold text-gray-900">{currentWeatherData.climate.annualRainfall}"</p>
              </div>

              <div className="bg-orange-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Sunny Days</h4>
                <p className="text-lg font-bold text-gray-900">{currentWeatherData.climate.sunnyDays}</p>
                <p className="text-xs text-gray-600">per year</p>
              </div>
            </div>
          </div>

          {/* Natural Disaster Risk */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 text-orange-600 mr-2" />
              Natural Disaster Risk Assessment
            </h3>
            <div className="space-y-3">
              {currentWeatherData.naturalDisasters.map((disaster, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{disaster.type}</h4>
                    <p className="text-sm text-gray-600">
                      {disaster.frequency} occurrence • Last event: {disaster.lastEvent} • Severity: {disaster.severity}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(disaster.risk)}`}>
                    {disaster.risk} Risk
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weather Preparedness */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Umbrella className="w-5 h-5 text-blue-600 mr-2" />
              Weather Preparedness Tips
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Seasonal Preparation</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Summer: Stay hydrated during high heat/humidity</li>
                  <li>• Spring: Monitor severe weather alerts</li>
                  <li>• Winter: Prepare for occasional freezes</li>
                  <li>• Fall: Beautiful mild weather for outdoor activities</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Emergency Readiness</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Emergency kit with 3-day supplies</li>
                  <li>• Weather radio for severe storm alerts</li>
                  <li>• Know your evacuation routes</li>
                  <li>• Insurance coverage review annually</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Want detailed climate reports?</h3>
                <p className="text-sm text-gray-600">Get comprehensive weather patterns and climate analysis for {communityName}.</p>
              </div>
              <Link
                to="/contact"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium whitespace-nowrap ml-4"
              >
                Request Climate Report
              </Link>
            </div>
          </div>

          {/* Data Source */}
          <div className="text-xs text-gray-500 bg-gray-50 rounded p-3">
            <p className="font-medium mb-1">Data Sources:</p>
            <p>{error ? 'Sample data for demonstration purposes' : 'OpenWeatherMap API - Real-time weather data, National Weather Service - Climate normals'}</p>
            <p>Last updated: {new Date(currentWeatherData.lastUpdated).toLocaleDateString()}</p>
          </div>
        </div>
      )}
    </div>
  );
}
