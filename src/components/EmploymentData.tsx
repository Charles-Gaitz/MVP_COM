import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Building, TrendingUp, Users, DollarSign, MapPin, Award, ChevronDown, ChevronUp } from 'lucide-react';

interface EmploymentDataProps {
  communityId: string;
  communityName: string;
}

export function EmploymentData({ communityId, communityName }: EmploymentDataProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSection = () => {
    setIsExpanded(!isExpanded);
  };
  // Sample employment data - in a real app, this would come from Bureau of Labor Statistics API
  const getEmploymentData = (id: string) => {
    const employmentData = {
      westlake: {
        unemploymentRate: 2.1,
        medianIncome: 125000,
        jobGrowth: 8.5,
        topIndustries: [
          { name: 'Technology', percentage: 28, growth: '+12%' },
          { name: 'Healthcare', percentage: 18, growth: '+7%' },
          { name: 'Education', percentage: 15, growth: '+4%' },
          { name: 'Finance', percentage: 12, growth: '+9%' },
          { name: 'Professional Services', percentage: 10, growth: '+6%' }
        ],
        majorEmployers: [
          { name: 'Apple Inc.', industry: 'Technology', employees: '6,000+', distance: '8.2 miles', type: 'Corporate Campus' },
          { name: 'IBM', industry: 'Technology', employees: '5,500+', distance: '12.1 miles', type: 'Regional Office' },
          { name: 'Dell Technologies', industry: 'Technology', employees: '13,000+', distance: '15.8 miles', type: 'Global HQ' },
          { name: 'St. David\'s HealthCare', industry: 'Healthcare', employees: '12,000+', distance: '6.5 miles', type: 'Hospital System' },
          { name: 'University of Texas', industry: 'Education', employees: '24,000+', distance: '10.2 miles', type: 'Public University' }
        ],
        avgCommute: 28,
        remoteWorkRate: 35
      },
      plano: {
        unemploymentRate: 2.8,
        medianIncome: 98000,
        jobGrowth: 6.2,
        topIndustries: [
          { name: 'Technology', percentage: 32, growth: '+15%' },
          { name: 'Telecommunications', percentage: 20, growth: '+8%' },
          { name: 'Healthcare', percentage: 16, growth: '+6%' },
          { name: 'Finance', percentage: 14, growth: '+7%' },
          { name: 'Manufacturing', percentage: 8, growth: '+3%' }
        ],
        majorEmployers: [
          { name: 'Toyota Motor North America', industry: 'Automotive', employees: '4,000+', distance: '3.2 miles', type: 'North American HQ' },
          { name: 'JPMorgan Chase', industry: 'Finance', employees: '5,000+', distance: '5.1 miles', type: 'Operations Center' },
          { name: 'Frito-Lay', industry: 'Manufacturing', employees: '3,500+', distance: '8.5 miles', type: 'Manufacturing Facility' },
          { name: 'AT&T', industry: 'Telecommunications', employees: '8,000+', distance: '12.3 miles', type: 'Corporate Office' },
          { name: 'Texas Instruments', industry: 'Technology', employees: '10,000+', distance: '15.2 miles', type: 'Global HQ' }
        ],
        avgCommute: 26,
        remoteWorkRate: 28
      },
      katy: {
        unemploymentRate: 3.2,
        medianIncome: 89000,
        jobGrowth: 7.1,
        topIndustries: [
          { name: 'Energy', percentage: 35, growth: '+10%' },
          { name: 'Healthcare', percentage: 18, growth: '+8%' },
          { name: 'Education', percentage: 16, growth: '+5%' },
          { name: 'Technology', percentage: 12, growth: '+14%' },
          { name: 'Manufacturing', percentage: 9, growth: '+4%' }
        ],
        majorEmployers: [
          { name: 'BP America', industry: 'Energy', employees: '2,000+', distance: '12.5 miles', type: 'Regional Office' },
          { name: 'Chevron Phillips Chemical', industry: 'Energy', employees: '1,800+', distance: '18.2 miles', type: 'Chemical Plant' },
          { name: 'Memorial Hermann Health System', industry: 'Healthcare', employees: '25,000+', distance: '8.3 miles', type: 'Hospital Network' },
          { name: 'Katy ISD', industry: 'Education', employees: '18,000+', distance: '2.1 miles', type: 'School District' },
          { name: 'Academy Sports + Outdoors', industry: 'Retail', employees: '1,500+', distance: '15.8 miles', type: 'Corporate HQ' }
        ],
        avgCommute: 32,
        remoteWorkRate: 22
      }
    };
    
    return employmentData[id as keyof typeof employmentData] || employmentData.westlake;
  };

  const employmentInfo = getEmploymentData(communityId);

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

  const getEmployerTypeIcon = (type: string) => {
    switch (type) {
      case 'Corporate Campus':
      case 'Global HQ':
      case 'Corporate HQ': return '🏢';
      case 'Hospital System':
      case 'Hospital Network': return '🏥';
      case 'Public University': return '🎓';
      case 'Manufacturing Facility':
      case 'Chemical Plant': return '🏭';
      case 'School District': return '🏫';
      default: return '🏢';
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
              <Briefcase className="h-6 w-6 text-blue-900 mr-3" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Employment Data & Job Market
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Economic indicators and major employers in {communityName}
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
            to={`/reports?community=${communityId}&section=employment`}
            className="text-blue-900 hover:text-blue-800 font-medium text-sm transition-colors duration-200 ml-4 mr-6"
          >
            View Full Report
          </Link>
        </div>
      </div>

      {isExpanded && (
        <div className="p-6">
        {/* Key Economic Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-600">
                {employmentInfo.unemploymentRate < 3 ? 'Excellent' : employmentInfo.unemploymentRate < 5 ? 'Good' : 'Fair'}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{employmentInfo.unemploymentRate}%</p>
            <p className="text-sm text-gray-600">Unemployment Rate</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">Median</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">${(employmentInfo.medianIncome / 1000).toFixed(0)}k</p>
            <p className="text-sm text-gray-600">Household Income</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Award className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-600">Annual</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">+{employmentInfo.jobGrowth}%</p>
            <p className="text-sm text-gray-600">Job Growth</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium text-orange-600">Remote</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{employmentInfo.remoteWorkRate}%</p>
            <p className="text-sm text-gray-600">Work from Home</p>
          </div>
        </div>

        {/* Top Industries */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Industries by Employment</h3>
          <div className="space-y-3">
            {employmentInfo.topIndustries.map((industry, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className={`w-10 h-10 bg-gradient-to-r ${getIndustryColor(index)} rounded-lg flex items-center justify-center text-white font-bold text-sm`}>
                  {industry.percentage}%
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-gray-900">{industry.name}</h4>
                    <span className="text-sm font-medium text-green-600">{industry.growth}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`bg-gradient-to-r ${getIndustryColor(index)} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${industry.percentage * 2}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Major Employers */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Major Employers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {employmentInfo.majorEmployers.map((employer, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">{getEmployerTypeIcon(employer.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 text-sm leading-tight">{employer.name}</h4>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {employer.employees}
                      </span>
                    </div>
                    
                    <div className="space-y-1 text-xs text-gray-600">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{employer.industry}</span>
                        <span>{employer.type}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{employer.distance} from {communityName}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Employment Insights */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Employment Outlook</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Market Strengths</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Low unemployment rate ({employmentInfo.unemploymentRate}%)</li>
                    <li>• Strong job growth (+{employmentInfo.jobGrowth}% annually)</li>
                    <li>• Diverse industry base</li>
                    <li>• High median income (${(employmentInfo.medianIncome / 1000).toFixed(0)}k)</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Work-Life Balance</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Average commute: {employmentInfo.avgCommute} minutes</li>
                    <li>• Remote work adoption: {employmentInfo.remoteWorkRate}%</li>
                    <li>• Multiple major employers nearby</li>
                    <li>• Growing tech sector presence</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Job Market Resources */}
        <div className="mt-4 text-center">
          <Link
            to={`/reports?community=${communityId}&section=jobs`}
            className="inline-flex items-center px-4 py-2 text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-lg font-medium transition-colors duration-200"
          >
            <Building className="h-4 w-4 mr-2" />
            View Current Job Openings & Salary Data
          </Link>
        </div>
        </div>
      )}
    </div>
  );
}
