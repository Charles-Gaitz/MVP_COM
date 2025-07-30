import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Cloud, Sun, Thermometer, Droplets, Wind, AlertTriangle, Umbrella, Eye, ChevronDown, ChevronUp } from 'lucide-react';

interface ClimateWeatherProps {
  communityId: string;
  communityName: string;
}

export function ClimateWeather({ communityId, communityName }: ClimateWeatherProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSection = () => {
    setIsExpanded(!isExpanded);
  };
  // Sample climate data - in a real app, this would come from NOAA/Weather APIs
  const getClimateData = (id: string) => {
    const climateData = {
      westlake: {
        climate: 'Humid Subtropical',
        avgHighTemp: 82,
        avgLowTemp: 62,
        annualRainfall: 34.2,
        sunnyDays: 228,
        humidityLevel: 66,
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
        airQuality: 'Good',
        uvIndex: 7.2
      },
      plano: {
        climate: 'Humid Subtropical',
        avgHighTemp: 78,
        avgLowTemp: 58,
        annualRainfall: 38.1,
        sunnyDays: 232,
        humidityLevel: 64,
        monthlyData: [
          { month: 'Jan', high: 58, low: 37, rainfall: 2.1, sunny: true },
          { month: 'Feb', high: 63, low: 42, rainfall: 2.4, sunny: true },
          { month: 'Mar', high: 71, low: 49, rainfall: 3.2, sunny: true },
          { month: 'Apr', high: 79, low: 58, rainfall: 3.1, sunny: true },
          { month: 'May', high: 87, low: 67, rainfall: 4.8, sunny: false },
          { month: 'Jun', high: 94, low: 75, rainfall: 3.9, sunny: true },
          { month: 'Jul', high: 98, low: 79, rainfall: 2.2, sunny: true },
          { month: 'Aug', high: 98, low: 79, rainfall: 2.1, sunny: true },
          { month: 'Sep', high: 90, low: 70, rainfall: 2.9, sunny: true },
          { month: 'Oct', high: 80, low: 59, rainfall: 3.4, sunny: true },
          { month: 'Nov', high: 68, low: 47, rainfall: 2.5, sunny: true },
          { month: 'Dec', high: 60, low: 39, rainfall: 2.3, sunny: true }
        ],
        naturalDisasters: [
          { type: 'Tornadoes', risk: 'Moderate', frequency: 'Occasional', lastEvent: '2023', severity: 'Minor' },
          { type: 'Hail Storms', risk: 'High', frequency: 'Annual', lastEvent: '2024', severity: 'Moderate' },
          { type: 'Flooding', risk: 'Low', frequency: 'Rare', lastEvent: '2019', severity: 'Minor' },
          { type: 'Ice Storms', risk: 'Low', frequency: 'Periodic', lastEvent: '2021', severity: 'Minor' }
        ],
        airQuality: 'Moderate',
        uvIndex: 6.8
      },
      katy: {
        climate: 'Humid Subtropical',
        avgHighTemp: 84,
        avgLowTemp: 65,
        annualRainfall: 49.8,
        sunnyDays: 204,
        humidityLevel: 74,
        monthlyData: [
          { month: 'Jan', high: 65, low: 44, rainfall: 3.2, sunny: true },
          { month: 'Feb', high: 69, low: 48, rainfall: 2.8, sunny: true },
          { month: 'Mar', high: 76, low: 55, rainfall: 2.9, sunny: true },
          { month: 'Apr', high: 82, low: 63, rainfall: 2.8, sunny: true },
          { month: 'May', high: 89, low: 71, rainfall: 5.2, sunny: false },
          { month: 'Jun', high: 94, low: 77, rainfall: 6.8, sunny: false },
          { month: 'Jul', high: 96, low: 79, rainfall: 3.2, sunny: true },
          { month: 'Aug', high: 97, low: 79, rainfall: 3.4, sunny: true },
          { month: 'Sep', high: 92, low: 74, rainfall: 5.1, sunny: false },
          { month: 'Oct', high: 85, low: 64, rainfall: 4.2, sunny: true },
          { month: 'Nov', high: 75, low: 53, rainfall: 3.1, sunny: true },
          { month: 'Dec', high: 67, low: 46, rainfall: 3.2, sunny: true }
        ],
        naturalDisasters: [
          { type: 'Hurricanes', risk: 'High', frequency: 'Periodic', lastEvent: '2024', severity: 'Major' },
          { type: 'Flooding', risk: 'High', frequency: 'Annual', lastEvent: '2024', severity: 'Moderate' },
          { type: 'Severe Storms', risk: 'High', frequency: 'Annual', lastEvent: '2024', severity: 'Moderate' },
          { type: 'Heat Waves', risk: 'Moderate', frequency: 'Annual', lastEvent: '2023', severity: 'Moderate' }
        ],
        airQuality: 'Moderate',
        uvIndex: 8.1
      }
    };
    
    return climateData[id as keyof typeof climateData] || climateData.westlake;
  };

  const climateInfo = getClimateData(communityId);

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'moderate': return 'text-orange-600 bg-orange-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'hurricanes': return '🌀';
      case 'tornadoes': return '🌪️';
      case 'flooding': return '🌊';
      case 'wildfire': return '🔥';
      case 'severe storms': return '⛈️';
      case 'hail storms': return '🧊';
      case 'drought': return '🌵';
      case 'ice storms': return '❄️';
      case 'heat waves': return '🌡️';
      default: return '⚠️';
    }
  };

  const getAirQualityColor = (quality: string) => {
    switch (quality.toLowerCase()) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'unhealthy': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
      <div className="border-b border-gray-200">
        <div className="flex items-center justify-between">
          <button
            onClick={toggleSection}
            className="flex items-center justify-between w-full p-6 text-left hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="flex items-center flex-1">
              <Cloud className="h-6 w-6 text-blue-900 mr-3" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Climate & Weather Data
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Weather patterns and climate information for {communityName}
                </p>
              </div>
            </div>
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-gray-600 ml-4" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-600 ml-4" />
            )}
          </button>
          <Link 
            to={`/reports?community=${communityId}&section=weather`}
            className="text-blue-900 hover:text-blue-800 font-medium text-sm transition-colors duration-200 ml-4 mr-6"
          >
            View Weather Forecast
          </Link>
        </div>
      </div>

      {isExpanded && (
        <div className="p-6">
        {/* Climate Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Thermometer className="h-5 w-5 text-orange-600" />
              <span className="text-xs text-orange-600 font-medium">°F</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{climateInfo.avgHighTemp}°</p>
            <p className="text-sm text-gray-600">Avg High Temp</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Droplets className="h-5 w-5 text-blue-600" />
              <span className="text-xs text-blue-600 font-medium">inches</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{climateInfo.annualRainfall}"</p>
            <p className="text-sm text-gray-600">Annual Rainfall</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Sun className="h-5 w-5 text-yellow-600" />
              <span className="text-xs text-yellow-600 font-medium">days</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{climateInfo.sunnyDays}</p>
            <p className="text-sm text-gray-600">Sunny Days/Year</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Wind className="h-5 w-5 text-green-600" />
              <span className="text-xs text-green-600 font-medium">%</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{climateInfo.humidityLevel}%</p>
            <p className="text-sm text-gray-600">Avg Humidity</p>
          </div>
        </div>

        {/* Monthly Weather Chart */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Temperature & Rainfall</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-12 gap-2">
              {climateInfo.monthlyData.map((month, index) => (
                <div key={index} className="text-center">
                  <div className="mb-2">
                    <div className="text-xs font-medium text-gray-700 mb-1">{month.month}</div>
                    <div className="relative h-24 bg-white rounded-lg border border-gray-200 overflow-hidden">
                      {/* Temperature bars */}
                      <div className="absolute bottom-0 left-0 w-1/2 bg-red-300 opacity-70" 
                           style={{ height: `${(month.high / 100) * 100}%` }}
                           title={`High: ${month.high}°F`}>
                      </div>
                      <div className="absolute bottom-0 right-0 w-1/2 bg-blue-300 opacity-70" 
                           style={{ height: `${(month.low / 100) * 100}%` }}
                           title={`Low: ${month.low}°F`}>
                      </div>
                      {/* Weather icon */}
                      <div className="absolute top-1 right-1 text-xs">
                        {month.sunny ? '☀️' : month.rainfall > 4 ? '🌧️' : '⛅'}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="font-semibold text-red-600">{month.high}°</div>
                    <div className="font-semibold text-blue-600">{month.low}°</div>
                    <div className="text-gray-600">{month.rainfall}"</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4 space-x-6 text-xs text-gray-600">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-300 rounded mr-1"></div>
                <span>High Temp</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-300 rounded mr-1"></div>
                <span>Low Temp</span>
              </div>
              <div className="flex items-center">
                <Umbrella className="h-3 w-3 mr-1" />
                <span>Rainfall (inches)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Natural Disaster Risk Assessment */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Natural Disaster Risk Assessment</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {climateInfo.naturalDisasters.map((disaster, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">{getRiskIcon(disaster.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{disaster.type}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(disaster.risk)}`}>
                        {disaster.risk} Risk
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Frequency:</span>
                        <span className="font-medium">{disaster.frequency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Event:</span>
                        <span className="font-medium">{disaster.lastEvent}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Severity:</span>
                        <span className="font-medium">{disaster.severity}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Environmental Quality */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Eye className="h-5 w-5 text-green-600" />
                <h4 className="font-semibold text-gray-900">Air Quality</h4>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getAirQualityColor(climateInfo.airQuality)}`}>
                {climateInfo.airQuality}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Current air quality index shows {climateInfo.airQuality.toLowerCase()} conditions for outdoor activities.
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Sun className="h-5 w-5 text-orange-600" />
                <h4 className="font-semibold text-gray-900">UV Index</h4>
              </div>
              <span className="text-2xl font-bold text-orange-600">{climateInfo.uvIndex}</span>
            </div>
            <p className="text-sm text-gray-600">
              {climateInfo.uvIndex < 3 ? 'Low UV exposure risk' : 
               climateInfo.uvIndex < 6 ? 'Moderate UV exposure - use sunscreen' :
               climateInfo.uvIndex < 8 ? 'High UV exposure - protection recommended' :
               'Very high UV exposure - limit sun exposure'}
            </p>
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
                  <p className="text-sm text-gray-600 mb-3">{climateInfo.climate}</p>
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

        {/* Weather Resources */}
        <div className="mt-4 text-center">
          <Link
            to={`/reports?community=${communityId}&section=climate`}
            className="inline-flex items-center px-4 py-2 text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-lg font-medium transition-colors duration-200"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            View Detailed Climate Report & Emergency Preparedness
          </Link>
        </div>
        </div>
      )}
    </div>
  );
}
