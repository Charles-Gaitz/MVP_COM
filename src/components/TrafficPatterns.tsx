import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Car, Clock, MapPin, TrendingUp, Navigation, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

interface TrafficPatternsProps {
  communityId: string;
  communityName: string;
}

export function TrafficPatterns({ communityId, communityName }: TrafficPatternsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSection = () => {
    setIsExpanded(!isExpanded);
  };
  // Sample traffic data - OBVIOUSLY SAMPLE DATA with crystal ball emojis and perfect round numbers
  const getTrafficData = (id: string) => {
    const trafficData = {
      westlake: {
        averageCommute: 30, // Perfect round number
        peakTimes: {
          morning: { time: '🔮 Sample 7:00-9:00 AM', duration: 40, traffic: 'perfect' },
          evening: { time: '🔮 Sample 5:00-7:00 PM', duration: 35, traffic: 'perfect' }
        },
        majorRoutes: [
          { name: '🔮 Sample Perfect Highway', distance: '2.0 miles', peakTime: 40, offPeakTime: 20 },
          { name: '🔮 Sample Express Route', distance: '3.0 miles', peakTime: 30, offPeakTime: 15 },
          { name: '🔮 Sample Main Road', distance: '2.0 miles', peakTime: 25, offPeakTime: 10 }
        ],
        destinations: [
          { name: '🔮 Sample Downtown', peakTime: 40, offPeakTime: 25, distance: '15.0 miles' },
          { name: '🔮 Sample Airport', peakTime: 50, offPeakTime: 30, distance: '30.0 miles' },
          { name: '🔮 Sample District', peakTime: 25, offPeakTime: 20, distance: '12.0 miles' },
          { name: '🔮 Sample Mall', peakTime: 15, offPeakTime: 10, distance: '5.0 miles' }
        ]
      },
      plano: {
        averageCommute: 25, // Perfect round number
        peakTimes: {
          morning: { time: '🔮 Sample 7:30-9:30 AM', duration: 35, traffic: 'perfect' },
          evening: { time: '🔮 Sample 5:00-6:30 PM', duration: 30, traffic: 'perfect' }
        },
        majorRoutes: [
          { name: '🔮 Sample Central Express', distance: '1.5 miles', peakTime: 35, offPeakTime: 20 },
          { name: '🔮 Sample Tollway', distance: '3.0 miles', peakTime: 30, offPeakTime: 20 },
          { name: '🔮 Sample Highway 121', distance: '2.0 miles', peakTime: 25, offPeakTime: 15 }
        ],
        destinations: [
          { name: '🔮 Sample Downtown Dallas', peakTime: 35, offPeakTime: 25, distance: '22.0 miles' },
          { name: '🔮 Sample DFW Airport', peakTime: 30, offPeakTime: 25, distance: '20.0 miles' },
          { name: '🔮 Sample Legacy West', peakTime: 10, offPeakTime: 10, distance: '3.0 miles' },
          { name: '🔮 Sample Frisco', peakTime: 15, offPeakTime: 12, distance: '8.0 miles' }
        ]
      },
      katy: {
        averageCommute: 30, // Perfect round number
        peakTimes: {
          morning: { time: '🔮 Sample 6:30-8:30 AM', duration: 40, traffic: 'perfect' },
          evening: { time: '🔮 Sample 4:30-6:30 PM', duration: 35, traffic: 'perfect' }
        },
        majorRoutes: [
          { name: 'I-10 (Katy Freeway)', distance: '2.5 miles', peakTime: 38, offPeakTime: 22 },
          { name: 'Highway 99 (Grand Parkway)', distance: '3.1 miles', peakTime: 30, offPeakTime: 20 },
          { name: 'Westpark Tollway', distance: '4.2 miles', peakTime: 28, offPeakTime: 18 }
        ],
        destinations: [
          { name: 'Downtown Houston', peakTime: 38, offPeakTime: 28, distance: '28.3 miles' },
          { name: 'Houston Hobby Airport', peakTime: 35, offPeakTime: 25, distance: '32.1 miles' },
          { name: 'Energy Corridor', peakTime: 20, offPeakTime: 15, distance: '8.5 miles' },
          { name: 'Galleria Area', peakTime: 25, offPeakTime: 18, distance: '15.2 miles' }
        ]
      }
    };
    
    return trafficData[id as keyof typeof trafficData] || trafficData.westlake;
  };

  const trafficInfo = getTrafficData(communityId);

  const getTrafficColor = (level: string) => {
    switch (level) {
      case 'heavy': return 'text-red-600 bg-red-100';
      case 'moderate': return 'text-orange-600 bg-orange-100';
      case 'light': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrafficIcon = (level: string) => {
    switch (level) {
      case 'heavy': return <AlertTriangle className="h-4 w-4" />;
      case 'moderate': return <Clock className="h-4 w-4" />;
      case 'light': return <TrendingUp className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
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
              <Car className="h-6 w-6 text-blue-900 mr-3" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Traffic Patterns & Commute Data
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Real-time traffic analysis for {communityName}
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
            to={`/reports?community=${communityId}&section=traffic`} 
            className="text-blue-900 hover:text-blue-800 font-medium text-sm transition-colors duration-200 ml-4 mr-6"
          >
            View Full Report
          </Link>
        </div>
      </div>

      {isExpanded && (
        <div className="p-6">
          {/* Average Commute Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-900">{trafficInfo.averageCommute} min</div>
                <p className="text-sm text-gray-600">Average Commute Time</p>
              </div>
            </div>
          </div>

          {/* Peak Traffic Times */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Peak Traffic Times</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-4 border border-orange-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                    ☀️
                  </div>
                  <span className="font-semibold text-gray-900">Morning Rush</span>
                </div>
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTrafficColor(trafficInfo.peakTimes.morning.traffic)}`}>
                  {getTrafficIcon(trafficInfo.peakTimes.morning.traffic)}
                  <span className="ml-1 capitalize">{trafficInfo.peakTimes.morning.traffic}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">{trafficInfo.peakTimes.morning.time}</p>
              <p className="text-lg font-bold text-gray-900">{trafficInfo.peakTimes.morning.duration} min average</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    🌆
                  </div>
                  <span className="font-semibold text-gray-900">Evening Rush</span>
                </div>
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTrafficColor(trafficInfo.peakTimes.evening.traffic)}`}>
                  {getTrafficIcon(trafficInfo.peakTimes.evening.traffic)}
                  <span className="ml-1 capitalize">{trafficInfo.peakTimes.evening.traffic}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">{trafficInfo.peakTimes.evening.time}</p>
              <p className="text-lg font-bold text-gray-900">{trafficInfo.peakTimes.evening.duration} min average</p>
            </div>
          </div>
        </div>

        {/* Major Routes */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Major Routes & Access Points</h3>
          <div className="space-y-3">
            {trafficInfo.majorRoutes.map((route, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Navigation className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{route.name}</h4>
                    <p className="text-sm text-gray-600">{route.distance} to access</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-900">
                    <span className="font-semibold text-red-600">{route.peakTime} min</span> peak
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold text-green-600">{route.offPeakTime} min</span> off-peak
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Common Destinations */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Commute Times to Popular Destinations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trafficInfo.destinations.map((destination, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5" />
                    <h4 className="font-medium text-gray-900">{destination.name}</h4>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">{destination.distance}</p>
                <div className="flex justify-between text-sm">
                  <div>
                    <span className="text-red-600 font-semibold">{destination.peakTime} min</span>
                    <span className="text-gray-500 ml-1">peak</span>
                  </div>
                  <div>
                    <span className="text-green-600 font-semibold">{destination.offPeakTime} min</span>
                    <span className="text-gray-500 ml-1">off-peak</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Traffic Widget */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Car className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Live Traffic Updates</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Current Conditions</h5>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center justify-between">
                      <span>I-10 Westbound</span>
                      <span className="text-green-600 font-medium">Light Traffic</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>MoPac Southbound</span>
                      <span className="text-orange-600 font-medium">Moderate Traffic</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Highway 360</span>
                      <span className="text-green-600 font-medium">Light Traffic</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Traffic Tips</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Leave before 7:00 AM to avoid morning rush</li>
                    <li>• Consider alternate routes during peak hours</li>
                    <li>• Use toll roads for faster commute times</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Traffic Link */}
        <div className="mt-4 text-center">
          <Link
            to={`/reports?community=${communityId}&section=traffic`}
            className="inline-flex items-center px-4 py-2 text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-lg font-medium transition-colors duration-200"
          >
            <Navigation className="h-4 w-4 mr-2" />
            View Live Traffic Map & Detailed Routes
          </Link>
        </div>
        </div>
      )}
    </div>
  );
}
