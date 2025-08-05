import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Building, TrendingUp, Users, DollarSign, Award, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { BLSService, type EmploymentData } from '../services/BLSService';

interface EmploymentDataProps {
  communityId: string;
  communityName: string;
}

export function EmploymentData({ communityId, communityName }: EmploymentDataProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [employmentData, setEmploymentData] = useState<EmploymentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const toggleSection = () => {
    setIsExpanded(!isExpanded);
  };

  // Fetch employment data from BLS API
  useEffect(() => {
    const fetchEmploymentData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await BLSService.getEmploymentData(communityId);
        
        if (data) {
          setEmploymentData(data);
        } else {
          setError('Employment data temporarily unavailable');
          // Fallback to sample data for demo
          setEmploymentData(getFallbackEmploymentData(communityId));
        }
      } catch (err) {
        console.error('Error fetching employment data:', err);
        setError('Error loading employment data');
        // Fallback to sample data
        setEmploymentData(getFallbackEmploymentData(communityId));
      } finally {
        setLoading(false);
      }
    };

    fetchEmploymentData();
  }, [communityId]);

  // Fallback data for demo purposes
  const getFallbackEmploymentData = (id: string): EmploymentData => {
    const fallbackData = {
      westlake: {
        unemploymentRate: 2.1,
        laborForce: 125000,
        totalEmployment: 122000,
        jobGrowthRate: 8.5,
        medianWage: 75000,
        topIndustries: [
          { name: 'Technology', percentage: 28, growth: '+12%', avgWage: 85000 },
          { name: 'Healthcare', percentage: 18, growth: '+7%', avgWage: 65000 },
          { name: 'Education', percentage: 15, growth: '+4%', avgWage: 55000 },
          { name: 'Finance', percentage: 12, growth: '+9%', avgWage: 75000 },
          { name: 'Professional Services', percentage: 10, growth: '+6%', avgWage: 70000 }
        ],
        lastUpdated: new Date().toISOString()
      },
      plano: {
        unemploymentRate: 2.8,
        laborForce: 180000,
        totalEmployment: 175000,
        jobGrowthRate: 6.2,
        medianWage: 68000,
        topIndustries: [
          { name: 'Technology', percentage: 32, growth: '+15%', avgWage: 80000 },
          { name: 'Telecommunications', percentage: 20, growth: '+8%', avgWage: 75000 },
          { name: 'Healthcare', percentage: 16, growth: '+6%', avgWage: 70000 },
          { name: 'Finance', percentage: 14, growth: '+7%', avgWage: 85000 },
          { name: 'Manufacturing', percentage: 8, growth: '+3%', avgWage: 60000 }
        ],
        lastUpdated: new Date().toISOString()
      },
      katy: {
        unemploymentRate: 3.2,
        laborForce: 95000,
        totalEmployment: 92000,
        jobGrowthRate: 7.1,
        medianWage: 62000,
        topIndustries: [
          { name: 'Energy', percentage: 35, growth: '+10%', avgWage: 95000 },
          { name: 'Healthcare', percentage: 18, growth: '+8%', avgWage: 68000 },
          { name: 'Education', percentage: 16, growth: '+5%', avgWage: 55000 },
          { name: 'Technology', percentage: 12, growth: '+14%', avgWage: 82000 },
          { name: 'Manufacturing', percentage: 9, growth: '+4%', avgWage: 65000 }
        ],
        lastUpdated: new Date().toISOString()
      }
    };
    
    return fallbackData[id as keyof typeof fallbackData] || fallbackData.westlake;
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Employment & Economy</h2>
                <p className="text-indigo-100 mt-1">Loading employment data for {communityName}...</p>
              </div>
            </div>
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  // Use employment data (either from API or fallback)
  const currentEmploymentData = employmentData || getFallbackEmploymentData(communityId);

  const getIndustryColor = (index: number) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-green-500 to-green-600', 
      'from-purple-500 to-purple-600',
      'from-orange-500 to-orange-600',
      'from-red-500 to-red-600'
    ];
    return colors[index] || colors[0];
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div 
        className="p-6 bg-gradient-to-r from-indigo-600 to-purple-700 text-white cursor-pointer hover:from-indigo-700 hover:to-purple-800 transition-all duration-300"
        onClick={toggleSection}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Employment & Economy</h2>
              <p className="text-indigo-100 mt-1">
                {error ? 'Using sample data - ' : 'Real-time data for '}{communityName}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-right">
              <div className="text-sm text-indigo-100">Unemployment</div>
              <div className="text-xl font-bold">{currentEmploymentData.unemploymentRate}%</div>
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
          {/* Key Employment Metrics */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 text-indigo-600 mr-2" />
              Key Employment Metrics
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-600">Unemployment Rate</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    currentEmploymentData.unemploymentRate < 3 ? 'bg-green-100 text-green-700' : 
                    currentEmploymentData.unemploymentRate < 5 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {currentEmploymentData.unemploymentRate < 3 ? 'Excellent' : currentEmploymentData.unemploymentRate < 5 ? 'Good' : 'Fair'}
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{currentEmploymentData.unemploymentRate}%</p>
                <p className="text-sm text-gray-600 mt-1">vs. National avg: 3.7%</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-600">Median Wage</h4>
                  <DollarSign className="w-4 h-4 text-green-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">${(currentEmploymentData.medianWage / 1000).toFixed(0)}k</p>
                <p className="text-sm text-gray-600 mt-1">Annual median income</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-600">Job Growth</h4>
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">+{currentEmploymentData.jobGrowthRate}%</p>
                <p className="text-sm text-gray-600 mt-1">Year-over-year growth</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-600">Labor Force</h4>
                  <Users className="w-4 h-4 text-purple-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{(currentEmploymentData.laborForce / 1000).toFixed(0)}k</p>
                <p className="text-sm text-gray-600 mt-1">Total workforce</p>
              </div>
            </div>
          </div>

          {/* Top Industries */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Building className="w-5 h-5 text-indigo-600 mr-2" />
              Top Industries
            </h3>
            <div className="space-y-3">
              {currentEmploymentData.topIndustries.map((industry, index) => (
                <div key={industry.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getIndustryColor(index)}`}></div>
                    <div>
                      <h4 className="font-medium text-gray-900">{industry.name}</h4>
                      <p className="text-sm text-gray-600">{industry.percentage}% of local employment</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">{industry.growth}</div>
                    <div className="text-xs text-gray-500">growth rate</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Economic Insights */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Award className="w-5 h-5 text-blue-600 mr-2" />
              Economic Strengths
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Employment Advantages</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Low unemployment rate ({currentEmploymentData.unemploymentRate}%)</li>
                  <li>• Strong job growth (+{currentEmploymentData.jobGrowthRate}% annually)</li>
                  <li>• Diverse industry base</li>
                  <li>• High median wage (${(currentEmploymentData.medianWage / 1000).toFixed(0)}k)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Work-Life Balance</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Large labor force ({(currentEmploymentData.laborForce / 1000).toFixed(0)}k workers)</li>
                  <li>• Growing remote work opportunities</li>
                  <li>• Proximity to major employment centers</li>
                  <li>• Strong professional networking</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Interested in the local job market?</h3>
                <p className="text-sm text-gray-600">Connect with local recruiters and explore career opportunities in {communityName}.</p>
              </div>
              <Link
                to="/contact"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 text-sm font-medium whitespace-nowrap ml-4"
              >
                Connect with Experts
              </Link>
            </div>
          </div>

          {/* Data Source */}
          <div className="text-xs text-gray-500 bg-gray-50 rounded p-3">
            <p className="font-medium mb-1">Data Sources:</p>
            <p>{error ? 'Sample data for demonstration purposes' : 'U.S. Bureau of Labor Statistics (BLS) - Real-time employment data'}</p>
            <p>Last updated: {new Date(currentEmploymentData.lastUpdated).toLocaleDateString()}</p>
          </div>
        </div>
      )}
    </div>
  );
}
