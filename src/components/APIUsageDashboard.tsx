import { useState, useEffect } from 'react';
import { Activity, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { FreeTierManager } from '../services/freeTierManager';

interface UsageData {
  service: string;
  usage: {
    calls_today: number;
    calls_this_month: number;
    limits: {
      daily: number;
      monthly: number;
    };
  };
  dailyPercent: number;
  monthlyPercent: number;
  status: 'ok' | 'warning' | 'critical';
}

export function APIUsageDashboard() {
  const [usageData, setUsageData] = useState<UsageData[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateUsage = () => {
      const dashboard = FreeTierManager.getUsageDashboard();
      setUsageData(dashboard as UsageData[]);
    };

    updateUsage();
    const interval = setInterval(updateUsage, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ok':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'critical':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatServiceName = (service: string) => {
    return service.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Only show in development or when there are warnings
  const shouldShow = import.meta.env.DEV || usageData.some(data => data.status !== 'ok');

  if (!shouldShow && !isVisible) return null;

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
        title="API Usage Dashboard"
      >
        <Activity className="w-5 h-5" />
      </button>

      {/* Dashboard Panel */}
      {isVisible && (
        <div className="fixed bottom-20 right-4 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-80 z-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">API Usage (Free Tier)</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <div className="space-y-3">
            {usageData.map((data) => (
              <div key={data.service} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(data.status)}
                    <span className="text-sm font-medium text-gray-700">
                      {formatServiceName(data.service)}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {data.usage.calls_today}/{data.usage.limits.daily} today
                  </span>
                </div>

                {/* Daily Usage Bar */}
                <div className="mb-2">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Daily</span>
                    <span>{data.dailyPercent}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        data.status === 'critical'
                          ? 'bg-red-500'
                          : data.status === 'warning'
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(data.dailyPercent, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Monthly Usage Bar */}
                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Monthly</span>
                    <span>{data.monthlyPercent}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        data.monthlyPercent > 90
                          ? 'bg-red-500'
                          : data.monthlyPercent > 70
                          ? 'bg-yellow-500'
                          : 'bg-blue-500'
                      }`}
                      style={{ width: `${Math.min(data.monthlyPercent, 100)}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {data.usage.calls_this_month}/{data.usage.limits.monthly} this month
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tips */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <h4 className="text-xs font-semibold text-blue-900 mb-1">💡 Free Tier Tips</h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Data is cached to minimize API calls</li>
              <li>• Critical data (schools, prices) prioritized</li>
              <li>• Fallback data used when limits reached</li>
            </ul>
          </div>

          {/* Clear Cache Button */}
          <button
            onClick={() => {
              FreeTierManager.clearExpiredCache();
              alert('Expired cache cleared!');
            }}
            className="w-full mt-3 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200 transition-colors"
          >
            Clear Expired Cache
          </button>
        </div>
      )}
    </>
  );
}
