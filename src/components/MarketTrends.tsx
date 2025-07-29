import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, DollarSign, Calendar, BarChart3, Home } from 'lucide-react';

interface MarketTrendsProps {
  communityId: string;
  communityName: string;
}

export function MarketTrends({ communityId, communityName }: MarketTrendsProps) {
  // Sample market data - in a real app, this would come from an API
  const getMarketData = (id: string) => {
    const baseData = {
      westlake: {
        currentMedian: 485000,
        yearOverYear: 5.2,
        trend: 'up',
        forecast: 'rising',
        priceHistory: [
          { period: '2020', price: 420000 },
          { period: '2021', price: 445000 },
          { period: '2022', price: 465000 },
          { period: '2023', price: 475000 },
          { period: '2024', price: 485000 },
        ],
        daysOnMarket: 25,
        inventory: 'low',
        competitiveness: 'high'
      },
      plano: {
        currentMedian: 450000,
        yearOverYear: 3.8,
        trend: 'up',
        forecast: 'stable',
        priceHistory: [
          { period: '2020', price: 395000 },
          { period: '2021', price: 415000 },
          { period: '2022', price: 435000 },
          { period: '2023', price: 445000 },
          { period: '2024', price: 450000 },
        ],
        daysOnMarket: 32,
        inventory: 'balanced',
        competitiveness: 'moderate'
      },
      katy: {
        currentMedian: 425000,
        yearOverYear: 4.1,
        trend: 'up',
        forecast: 'rising',
        priceHistory: [
          { period: '2020', price: 375000 },
          { period: '2021', price: 395000 },
          { period: '2022', price: 410000 },
          { period: '2023', price: 420000 },
          { period: '2024', price: 425000 },
        ],
        daysOnMarket: 28,
        inventory: 'low',
        competitiveness: 'high'
      }
    };
    
    return baseData[id as keyof typeof baseData] || baseData.westlake;
  };

  const marketData = getMarketData(communityId);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <BarChart3 className="h-6 w-6 text-blue-900 mr-2" />
              Market Trends & Analysis
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Real estate market insights for {communityName}
            </p>
          </div>
          <Link 
            to={`/reports?community=${communityId}&section=market`} 
            className="text-blue-900 hover:text-blue-800 font-medium text-sm transition-colors duration-200"
          >
            View Full Report
          </Link>
        </div>
      </div>

      <div className="p-6">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <span className={`flex items-center text-sm font-medium ${
                marketData.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {marketData.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                {marketData.yearOverYear}%
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ${marketData.currentMedian.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Median Home Price</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="h-5 w-5 text-green-600" />
              <span className={`text-sm font-medium ${
                marketData.daysOnMarket < 30 ? 'text-green-600' : 'text-orange-600'
              }`}>
                {marketData.daysOnMarket < 30 ? 'Fast' : 'Moderate'}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{marketData.daysOnMarket}</p>
            <p className="text-sm text-gray-600">Days on Market</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Home className="h-5 w-5 text-purple-600" />
              <span className={`text-sm font-medium capitalize ${
                marketData.inventory === 'low' ? 'text-red-600' : 
                marketData.inventory === 'balanced' ? 'text-green-600' : 'text-blue-600'
              }`}>
                {marketData.inventory}
              </span>
            </div>
            <p className="text-lg font-bold text-gray-900 capitalize">{marketData.inventory}</p>
            <p className="text-sm text-gray-600">Inventory Level</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              <span className={`text-sm font-medium capitalize ${
                marketData.competitiveness === 'high' ? 'text-red-600' : 
                marketData.competitiveness === 'moderate' ? 'text-orange-600' : 'text-green-600'
              }`}>
                {marketData.competitiveness}
              </span>
            </div>
            <p className="text-lg font-bold text-gray-900 capitalize">{marketData.competitiveness}</p>
            <p className="text-sm text-gray-600">Competition</p>
          </div>
        </div>

        {/* Price History Chart */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">5-Year Price History</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-end justify-between h-32 space-x-2">
              {marketData.priceHistory.map((data, index) => {
                const maxPrice = Math.max(...marketData.priceHistory.map(d => d.price));
                const height = (data.price / maxPrice) * 100;
                
                return (
                  <div key={data.period} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex items-end justify-center mb-2">
                      <div 
                        className="bg-blue-500 rounded-t-sm transition-all duration-300 hover:bg-blue-600 w-8"
                        style={{ height: `${height}%` }}
                        title={`${data.period}: $${data.price.toLocaleString()}`}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600 font-medium">{data.period}</span>
                    <span className="text-xs text-gray-500">${(data.price / 1000).toFixed(0)}k</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Market Forecast */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Market Forecast</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-gray-900 mb-1">Next 12 Months</h5>
                  <p className="text-sm text-gray-600">
                    {marketData.forecast === 'rising' 
                      ? '📈 Prices expected to continue rising by 3-5%'
                      : marketData.forecast === 'stable'
                      ? '📊 Market expected to remain stable with 1-2% growth'
                      : '📉 Market may see slight cooling with 0-1% growth'
                    }
                  </p>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 mb-1">Market Drivers</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Low inventory driving competition</li>
                    <li>• Strong local job market</li>
                    <li>• Excellent school ratings</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
