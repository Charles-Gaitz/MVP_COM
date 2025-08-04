import React, { useState, useEffect } from 'react';
import { RealDataService } from '../services/realDataService';

interface DataSourceStatus {
  name: string;
  connected: boolean;
  error?: any;
}

interface TestResult {
  zipCode: string;
  success: boolean;
  data?: any;
  error?: string;
  timestamp: string;
}

export const RealDataDashboard: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<DataSourceStatus[]>([]);
  const [configurationStatus, setConfigurationStatus] = useState<any>({});
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [testZipCode, setTestZipCode] = useState('78701'); // Austin ZIP
  const [loading, setLoading] = useState(false);
  const [selectedSource, setSelectedSource] = useState<string>('all');

  useEffect(() => {
    loadDataSourceStatus();
    testAllConnections();
  }, []);

  const loadDataSourceStatus = () => {
    const status = RealDataService.getDataSourceStatus();
    setConfigurationStatus(status);
  };

  const testAllConnections = async () => {
    setLoading(true);
    try {
      const results = await RealDataService.testAllConnections();
      setConnectionStatus(results);
    } catch (error) {
      console.error('Failed to test connections:', error);
    } finally {
      setLoading(false);
    }
  };

  const testSpecificZipCode = async () => {
    if (!testZipCode.match(/^\d{5}$/)) {
      alert('Please enter a valid 5-digit ZIP code');
      return;
    }

    setLoading(true);
    try {
      let data;
      if (selectedSource === 'all') {
        data = await RealDataService.getRealCommunityData(testZipCode);
      } else {
        data = await RealDataService.getSpecificData(testZipCode, selectedSource as any);
      }

      const result: TestResult = {
        zipCode: testZipCode,
        success: !!data,
        data: data ? JSON.stringify(data, null, 2) : undefined,
        error: data ? undefined : 'No data returned',
        timestamp: new Date().toLocaleString()
      };

      setTestResults(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 results
    } catch (error: any) {
      const result: TestResult = {
        zipCode: testZipCode,
        success: false,
        error: error.message || 'Unknown error',
        timestamp: new Date().toLocaleString()
      };
      setTestResults(prev => [result, ...prev.slice(0, 9)]);
    } finally {
      setLoading(false);
    }
  };

  const clearCache = () => {
    RealDataService.clearCache();
    alert('Cache cleared successfully');
    loadDataSourceStatus();
  };

  const getStatusIcon = (connected: boolean) => {
    return connected ? '✅' : '❌';
  };

  const getConfigStatusIcon = (configured: boolean) => {
    return configured ? '🔑' : '⚠️';
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Real Data Integration Dashboard</h1>
        <p className="text-gray-600">Test and monitor government API integrations for authentic community data</p>
      </div>

      {/* Configuration Status */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">API Configuration Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(configurationStatus.configurationStatus || {}).map(([source, configured]) => (
            <div key={source} className="flex items-center justify-between p-3 border rounded">
              <span className="font-medium capitalize">{source}</span>
              <span className="text-2xl">
                {getConfigStatusIcon(configured as boolean)}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <p>🔑 = API key configured | ⚠️ = API key missing or default</p>
          <p>Cache size: {configurationStatus.cacheSize || 0} entries</p>
          <p>Available sources: {configurationStatus.availableSources?.join(', ') || 'None'}</p>
        </div>
      </div>

      {/* Connection Status */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Connection Status</h2>
          <button
            onClick={testAllConnections}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test All Connections'}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {connectionStatus.map((status, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded">
              <div>
                <span className="font-medium">{status.name}</span>
                {status.error && (
                  <p className="text-sm text-red-500 mt-1">
                    Error: {status.error.toString()}
                  </p>
                )}
              </div>
              <span className="text-2xl">
                {getStatusIcon(status.connected)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ZIP Code Testing */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Test Real Data Retrieval</h2>
        <div className="flex flex-wrap gap-4 mb-4">
          <input
            type="text"
            value={testZipCode}
            onChange={(e) => setTestZipCode(e.target.value)}
            placeholder="Enter ZIP code (e.g., 78701)"
            className="px-3 py-2 border rounded"
            maxLength={5}
          />
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="px-3 py-2 border rounded"
          >
            <option value="all">All Sources</option>
            <option value="census">Census Data</option>
            <option value="epa">Air Quality</option>
            <option value="schools">School Data</option>
            <option value="crime">Crime Data</option>
          </select>
          <button
            onClick={testSpecificZipCode}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test ZIP Code'}
          </button>
          <button
            onClick={clearCache}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Clear Cache
          </button>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Test Results</h3>
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`p-4 border rounded ${
                  result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-medium">ZIP: {result.zipCode}</span>
                    <span className={`ml-2 px-2 py-1 rounded text-sm ${
                      result.success ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                    }`}>
                      {result.success ? 'Success' : 'Failed'}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">{result.timestamp}</span>
                </div>
                
                {result.error && (
                  <p className="text-red-600 text-sm mb-2">Error: {result.error}</p>
                )}
                
                {result.data && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                      View Data
                    </summary>
                    <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto max-h-96">
                      {result.data}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* API Setup Instructions */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">API Setup Instructions</h2>
        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-semibold">1. US Census Bureau API (FREE)</h3>
            <p>• Visit: <a href="https://api.census.gov/data/key_signup.html" className="text-blue-600" target="_blank" rel="noopener noreferrer">https://api.census.gov/data/key_signup.html</a></p>
            <p>• Sign up for a free API key</p>
            <p>• Add to .env: VITE_CENSUS_API_KEY=your_key_here</p>
          </div>
          
          <div>
            <h3 className="font-semibold">2. EPA AirNow API (FREE)</h3>
            <p>• Visit: <a href="https://docs.airnowapi.org/account/request/" className="text-blue-600" target="_blank" rel="noopener noreferrer">https://docs.airnowapi.org/account/request/</a></p>
            <p>• Request a free API key</p>
            <p>• Add to .env: VITE_EPA_AIR_QUALITY_API_KEY=your_key_here</p>
          </div>
          
          <div>
            <h3 className="font-semibold">3. Department of Education API (FREE)</h3>
            <p>• URL: <a href="https://data.ed.gov/" className="text-blue-600" target="_blank" rel="noopener noreferrer">https://data.ed.gov/</a></p>
            <p>• Uses Education Data Urban Institute API (FREE)</p>
            <p>• No API key required - completely FREE</p>
            <p>• Add to .env: VITE_DEPT_EDUCATION_API_KEY=DEMO_KEY</p>
          </div>
          
          <div>
            <h3 className="font-semibold">4. FBI Crime Data API (FREE)</h3>
            <p>• Visit: <a href="https://api.data.gov/signup/" className="text-blue-600" target="_blank" rel="noopener noreferrer">https://api.data.gov/signup/</a></p>
            <p>• Sign up for a free Data.gov API key</p>
            <p>• Add to .env: VITE_FBI_CRIME_API_KEY=your_key_here</p>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-yellow-100 rounded">
          <p className="text-sm font-medium text-yellow-800">
            💡 Tip: All these APIs are completely FREE and provide official government data. 
            Once configured, your app will display real, authoritative information instead of sample data.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RealDataDashboard;
