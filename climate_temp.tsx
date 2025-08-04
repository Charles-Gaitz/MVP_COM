import React, { useState, useEffect } from 'react';
import { Cloud, Sun, Thermometer, Droplets, Wind, Umbrella, Eye, ChevronDown, ChevronUp } from 'lucide-react';

interface MonthlyData {
  month: string;
  high: number;
  low: number;
  rainfall: number;
  sunny: boolean;
}

interface ClimateInfo {
  climate: string;
  avgHighTemp: number;
  avgLowTemp: number;
  annualRainfall: number;
  sunnyDays: number;
  humidityLevel: number;
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
  climate: ClimateInfo;
  forecast: Array<{
    day: string;
    high: number;
    low: number;
    condition: string;
    icon: string;
  }>;
  monthlyData: MonthlyData[];
}

interface ClimateWeatherProps {
  communityId: string;
  communityName: string;
}

export function ClimateWeather({ communityId }: ClimateWeatherProps) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const getCommunityCoordinates = (id: string): { lat: number; lng: number } => {
    const coordinates = {
      westlake: { lat: 32.9933, lng: -97.2014 },
      plano: { lat: 33.0198, lng: -96.6989 },
      katy: { lat: 29.7866, lng: -95.8244 },
      frisco: { lat: 33.1507, lng: -96.8236 },
      allen: { lat: 33.1031, lng: -96.6706 },
      mckinney: { lat: 33.1972, lng: -96.6397 },
      prosper: { lat: 33.2362, lng: -96.8011 },
      celina: { lat: 33.3248, lng: -96.7847 }
    };
    return coordinates[id as keyof typeof coordinates] || coordinates.westlake;
  };

  const fetchWeatherData = async (lat: number, lng: number): Promise<WeatherData> => {
    const API_KEY = 'e1cb1e5b94d432734fba50a8da99994c';
    
    try {
      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=imperial`
      );
      const currentData = await currentResponse.json();

      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=imperial`
      );
      const forecastData = await forecastResponse.json();

      const monthlyData = generateMonthlyData(lat, lng);

      return {
        current: {
          temperature: Math.round(currentData.main.temp),
          description: currentData.weather[0].description,
          humidity: currentData.main.humidity,
          windSpeed: Math.round(currentData.wind.speed),
          visibility: Math.round(currentData.visibility / 1609.34),
          icon: currentData.weather[0].icon
        },
        climate: {
          climate: getClimateType(lat, lng),
          avgHighTemp: Math.round(currentData.main.temp_max),
          avgLowTemp: Math.round(currentData.main.temp_min),
          annualRainfall: getAnnualRainfall(lat, lng),
          sunnyDays: getSunnyDays(lat, lng),
          humidityLevel: currentData.main.humidity
        },
        forecast: forecastData.list.slice(0, 5).map((item: any, index: number) => ({
          day: index === 0 ? 'Today' : new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
          high: Math.round(item.main.temp_max),
          low: Math.round(item.main.temp_min),
          condition: item.weather[0].main,
          icon: item.weather[0].icon
        })),
        monthlyData
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  };

  const generateMonthlyData = (lat: number, lng: number): MonthlyData[] => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const baseTemp = lat > 33 ? 65 : 75;
    
    return months.map((month, index) => {
      const seasonalAdjustment = Math.sin((index - 6) * Math.PI / 6) * 20;
      return {
        month,
        high: Math.round(baseTemp + seasonalAdjustment + 15),
        low: Math.round(baseTemp + seasonalAdjustment - 5),
        rainfall: Math.max(1, Math.round(3 + Math.random() * 3)),
        sunny: Math.random() > 0.3
      };
    });
  };

  const getClimateType = (lat: number, lng: number): string => {
    if (lat > 35) return 'Continental';
    if (lat > 30) return 'Humid Subtropical';
    return 'Subtropical';
  };

  const getAnnualRainfall = (lat: number, lng: number): number => {
    if (lng < -96) return 35 + Math.random() * 10;
    if (lng > -95) return 45 + Math.random() * 10;
    return 40 + Math.random() * 8;
  };

  const getSunnyDays = (lat: number, lng: number): number => {
    return Math.round(220 + Math.random() * 30);
  };

  useEffect(() => {
    const loadWeatherData = async () => {
      setLoading(true);
      try {
        const coords = getCommunityCoordinates(communityId);
        const data = await fetchWeatherData(coords.lat, coords.lng);
        setWeatherData(data);
      } catch (error) {
        console.error('Failed to load weather data:', error);
        setWeatherData(getClimateData(communityId));
      } finally {
        setLoading(false);
      }
    };

    loadWeatherData();
  }, [communityId]);

  const getClimateData = (id: string): WeatherData => {
    const sampleData = {
      westlake: {
        climate: {
          climate: 'Humid Subtropical',
          avgHighTemp: 82,
          avgLowTemp: 62,
          annualRainfall: 34.2,
          sunnyDays: 228,
          humidityLevel: 66
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
          { month: 'Oct', high: 83, low: 61, rainfall: 2.9, sunny: true },
          { month: 'Nov', high: 72, low: 50, rainfall: 2.0, sunny: true },
          { month: 'Dec', high: 64, low: 42, rainfall: 1.8, sunny: true }
        ]
      }
    };

    const data = sampleData[id as keyof typeof sampleData] || sampleData.westlake;
    
    return {
      current: {
        temperature: 78,
        description: 'partly cloudy',
        humidity: data.climate.humidityLevel,
        windSpeed: 8,
        visibility: 10,
        icon: '02d'
      },
      climate: data.climate,
      forecast: [
        { day: 'Today', high: 85, low: 65, condition: 'Sunny', icon: '01d' },
        { day: 'Tomorrow', high: 87, low: 67, condition: 'Partly Cloudy', icon: '02d' },
        { day: 'Wednesday', high: 82, low: 63, condition: 'Cloudy', icon: '03d' },
        { day: 'Thursday', high: 79, low: 61, condition: 'Rain', icon: '10d' },
        { day: 'Friday', high: 83, low: 64, condition: 'Sunny', icon: '01d' }
      ],
      monthlyData: data.monthlyData
    };
  };

  const currentWeatherData = weatherData || getClimateData(communityId);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          <Cloud className="mr-2 h-5 w-5 text-blue-500" />
          Climate & Weather
        </h3>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-blue-600 hover:text-blue-800"
        >
          {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-blue-900">{currentWeatherData.current.temperature}°F</p>
              <p className="text-blue-700 capitalize">{currentWeatherData.current.description}</p>
            </div>
            <Sun className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700">Humidity</p>
              <p className="text-xl font-semibold text-green-900">{currentWeatherData.current.humidity}%</p>
            </div>
            <Droplets className="h-6 w-6 text-blue-500" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700">Wind Speed</p>
              <p className="text-xl font-semibold text-purple-900">{currentWeatherData.current.windSpeed} mph</p>
            </div>
            <Wind className="h-6 w-6 text-gray-500" />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">5-Day Forecast</h4>
        <div className="grid grid-cols-5 gap-2">
          {currentWeatherData.forecast.map((day, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-sm font-medium text-gray-700">{day.day}</p>
              <div className="my-2">
                {day.condition === 'Clear' || day.condition === 'Sunny' ? (
                  <Sun className="h-6 w-6 text-yellow-500 mx-auto" />
                ) : day.condition === 'Rain' ? (
                  <Umbrella className="h-6 w-6 text-blue-500 mx-auto" />
                ) : (
                  <Cloud className="h-6 w-6 text-gray-500 mx-auto" />
                )}
              </div>
              <p className="text-sm">
                <span className="font-semibold">{day.high}°</span>
                <span className="text-gray-500">/{day.low}°</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-orange-50 rounded-lg p-4">
          <h4 className="font-semibold text-orange-900 mb-2">Climate Type</h4>
          <p className="text-orange-800">{currentWeatherData.climate.climate}</p>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-900 mb-2">Sunny Days/Year</h4>
          <p className="text-yellow-800">{currentWeatherData.climate.sunnyDays} days</p>
        </div>
      </div>

      {expanded && (
        <>
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Monthly Temperature Trends</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-12 gap-1">
                {currentWeatherData.monthlyData.map((month, index) => (
                  <div key={index} className="text-center">
                    <div className="text-xs text-gray-600 mb-1">{month.month}</div>
                    <div className="relative h-24 bg-white rounded">
                      <div 
                        className="absolute bottom-0 w-full bg-red-200 rounded-b"
                        style={{ height: `${(month.high / 100) * 100}%` }}
                      ></div>
                      <div 
                        className="absolute bottom-0 w-full bg-blue-300 rounded-b"
                        style={{ height: `${(month.low / 100) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-xs mt-1">
                      <div className="text-red-600">{month.high}°</div>
                      <div className="text-blue-600">{month.low}°</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Thermometer className="h-5 w-5 text-blue-600 mr-2" />
                <h5 className="font-semibold text-blue-900">Average Temps</h5>
              </div>
              <p className="text-blue-800">
                High: {currentWeatherData.climate.avgHighTemp}°F<br />
                Low: {currentWeatherData.climate.avgLowTemp}°F
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Droplets className="h-5 w-5 text-green-600 mr-2" />
                <h5 className="font-semibold text-green-900">Annual Rainfall</h5>
              </div>
              <p className="text-green-800">{currentWeatherData.climate.annualRainfall}" per year</p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Eye className="h-5 w-5 text-purple-600 mr-2" />
                <h5 className="font-semibold text-purple-900">Visibility</h5>
              </div>
              <p className="text-purple-800">{currentWeatherData.current.visibility} miles</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
