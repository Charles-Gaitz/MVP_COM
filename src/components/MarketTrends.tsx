import { useState } from 'react';
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown, BarChart } from 'lucide-react';

interface MarketTrendsProps {
  communityId?: string;
  communityName?: string;
}

export function MarketTrends({ communityId = '', communityName = 'Community' }: MarketTrendsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSection = () => {
    setIsExpanded(!isExpanded);
  };

  const marketData = [
    {
      metric: 'Median Home Price',
      value: '$485,000',
      change: '+5.2%',
      trend: 'up' as const,
      period: 'vs last year'
    },
    {
      metric: 'Price per Sq Ft',
      value: '$245',
      change: '+3.8%',
      trend: 'up' as const,
      period: 'vs last year'
    },
    {
      metric: 'Days on Market',
      value: '28 days',
      change: '-12%',
      trend: 'down' as const,
      period: 'vs last year'
    },
    {
      metric: 'Inventory',
      value: '2.1 months',
      change: '+15%',
      trend: 'up' as const,
      period: 'vs last year'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div 
        className="p-6 bg-gradient-to-r from-green-600 to-emerald-700 text-white cursor-pointer hover:from-green-700 hover:to-emerald-800 transition-all duration-300"
        onClick={toggleSection}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Market Trends</h2>
              <p className="text-green-100 mt-1">Real estate market insights for {communityName}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-right">
              <div className="text-sm text-green-100">Median Price</div>
              <div className="text-xl font-bold">$485K</div>
            </div>
            {isExpanded ? (
              <ChevronUp className="w-6 h-6 text-white ml-4" />
            ) : (
              <ChevronDown className="w-6 h-6 text-white ml-4" />
            )}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-6 space-y-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <BarChart className="w-5 h-5 text-green-600 mr-2" />
              Key Market Metrics
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {marketData.map((item, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-600">{item.metric}</h4>
                    {item.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{item.value}</div>
                  <div className={`text-sm flex items-center ${item.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    <span>{item.change}</span>
                    <span className="text-gray-500 ml-1">{item.period}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">Market Analysis</h3>
            <div className="space-y-3 text-sm text-blue-700">
              <p>• The local market is experiencing moderate appreciation with prices up 5.2% year-over-year</p>
              <p>• Inventory levels have increased, providing more options for buyers</p>
              <p>• Days on market decreased significantly, indicating strong buyer demand</p>
              <p>• Price per square foot growth suggests sustainable market conditions</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
