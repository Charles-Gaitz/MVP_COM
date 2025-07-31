import { useState, useEffect } from 'react';
import { useComparison } from '../contexts/ComparisonContext';
import { Link, useSearchParams } from 'react-router-dom';
import { MapPin, FileText, Plus, X, Download, BarChart3, TrendingUp, Home, GraduationCap, Shield, DollarSign, Heart, Users, TreePine, Briefcase, Cloud, ChevronDown, ChevronUp } from 'lucide-react';
import { MarketTrends } from '../components/MarketTrends';
import { SchoolDistrictDetails } from '../components/SchoolDistrictDetails';
import { TrafficPatterns } from '../components/TrafficPatterns';
import { NearbyAmenities } from '../components/NearbyAmenities';
import { EmploymentData } from '../components/EmploymentData';
import { ClimateWeather } from '../components/ClimateWeather';
import { LeadCaptureModal } from '../components/LeadCaptureModal';
import { sampleCommunities as allCommunities, type CommunityDetailed } from '../data/communities';

const sampleCommunities = allCommunities;
type Community = CommunityDetailed;


function ReportsPage() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  // Accordion state management
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']));
  // Lead capture state
  const [showLeadCapture, setShowLeadCapture] = useState(false);

  // Use global comparison context
  const { selectedCommunities, addCommunity, removeCommunity } = useComparison();

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  // Check if a community ID was passed in the URL
  useEffect(() => {
    const communityId = searchParams.get('community');
    if (communityId && !selectedCommunities.some(c => c.id === communityId)) {
      // Find the community in sampleCommunities
      const comm = sampleCommunities.find(c => c.id === communityId);
      if (comm) addCommunity(comm);
    }
  }, [searchParams, selectedCommunities, addCommunity]);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('texasCommunities_favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const selectedCommunitiesData = selectedCommunities
    .map(sel => sampleCommunities.find(c => c.id === sel.id))
    .filter(Boolean) as Community[];

  const filteredCommunities = sampleCommunities.filter(community => {
    const matchesSearch = community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFavorites = showFavoritesOnly ? favorites.includes(community.id) : true;
    return matchesSearch && matchesFavorites;
  });

  const generatePDF = () => {
    // In a real app, this would generate and download a PDF report
    alert('PDF report generation would be implemented here!');
  };

  const getScoreColor = (value: number, type: 'price' | 'crime' | 'commute' | 'walk' | 'school') => {
    switch (type) {
      case 'price':
        if (value < 350000) return 'text-green-600';
        if (value < 450000) return 'text-yellow-600';
        return 'text-red-600';
      case 'crime':
        if (value < 1.0) return 'text-green-600';
        if (value < 1.5) return 'text-yellow-600';
        return 'text-red-600';
      case 'commute':
        if (value < 25) return 'text-green-600';
        if (value < 35) return 'text-yellow-600';
        return 'text-red-600';
      case 'walk':
        if (value > 60) return 'text-green-600';
        if (value > 40) return 'text-yellow-600';
        return 'text-red-600';
      case 'school':
        return 'text-green-600'; // All our sample data has good schools
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2 text-gray-900 hover:text-blue-900 transition-colors duration-200">
              <MapPin className="h-8 w-8 text-blue-900" />
              <span className="text-xl font-bold">TexasCommunities</span>
            </Link>
            <div className="flex items-center space-x-6">
              <Link to="/explore" className="text-gray-700 hover:text-blue-900 font-medium transition-colors duration-200">
                Explore
              </Link>
              <Link to="/favorites" className="text-gray-700 hover:text-blue-900 font-medium transition-colors duration-200">
                Favorites
              </Link>
              <Link to="/reports" className="text-blue-900 font-medium">
                Compare
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-blue-900 font-medium transition-colors duration-200">
                About
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Comparison</h1>
              <p className="text-gray-600">
                Compare up to 4 Texas communities side by side with key data and insights.
              </p>
            </div>
            {selectedCommunitiesData.length > 0 && (
              <button
                onClick={generatePDF}
                className="inline-flex items-center px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors duration-200"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Comparison
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Community Selector */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Communities to Compare</h2>
              
              {/* Favorites Filter Toggle */}
              <div className="mb-4">
                <button
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    showFavoritesOnly
                      ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                      : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <Heart className={`h-4 w-4 mr-2 ${showFavoritesOnly ? 'fill-current' : ''}`} />
                  {showFavoritesOnly ? 'Show All Communities' : 'Show Favorites Only'}
                </button>
                {showFavoritesOnly && favorites.length === 0 && (
                  <p className="text-xs text-gray-500 mt-2">
                    No favorites saved yet. Visit community pages to add favorites.
                  </p>
                )}
              </div>
              
              {/* Search */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search communities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                />
              </div>

              {/* Selected Communities */}
              {selectedCommunities.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Communities:</h3>
                  <div className="space-y-2">
                    {selectedCommunitiesData.map((community) => (
                      <div key={community.id} className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded">
                        <span className="text-sm font-medium text-blue-900">{community.name}</span>
                        <button
                          onClick={() => removeCommunity(community.id)}
                          className="text-blue-700 hover:text-blue-900"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Available Communities */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredCommunities
                  .filter(community => !selectedCommunities.some(c => c.id === community.id))
                  .length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-2">
                      {showFavoritesOnly ? (
                        <Heart className="h-8 w-8 mx-auto mb-2" />
                      ) : (
                        <MapPin className="h-8 w-8 mx-auto mb-2" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {showFavoritesOnly 
                        ? 'No favorite communities match your search.'
                        : 'No communities match your search.'
                      }
                    </p>
                  </div>
                ) : (
                  filteredCommunities
                    .filter(community => !selectedCommunities.some(c => c.id === community.id))
                    .map((community) => (
                      <button
                        key={community.id}
                        onClick={() => addCommunity(community)}
                        disabled={selectedCommunities.length >= 4}
                        className={`w-full text-left p-3 rounded-lg border transition-colors duration-200 ${
                          selectedCommunities.length >= 4
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white hover:bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-center">
                          <Plus className="h-4 w-4 mr-2 text-gray-500" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="font-medium text-gray-900">{community.name}</div>
                              {favorites.includes(community.id) && (
                                <Heart className="h-3 w-3 text-red-500 fill-current" />
                              )}
                            </div>
                            <div className="text-xs text-gray-500">{community.city} Metro</div>
                          </div>
                        </div>
                      </button>
                    ))
                )}
              </div>

              {selectedCommunities.length >= 4 && (
                <p className="text-xs text-gray-500 mt-2">
                  Maximum of 4 communities can be compared at once.
                </p>
              )}
            </div>
          </div>

          {/* Comparison Report */}
          <div className="lg:col-span-3">
            {selectedCommunitiesData.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Select Communities to Compare</h3>
                <p className="text-gray-600">
                  Choose communities from the left panel to generate a detailed comparison report.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {selectedCommunitiesData.map((community) => (
                    <div key={community.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                      <div className="h-24 bg-gray-200 overflow-hidden">
                        <img
                          src={community.image}
                          alt={community.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900">{community.name}</h3>
                        <p className="text-sm text-gray-600">{community.city} Metro</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Detailed Comparison Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2" />
                      Detailed Comparison
                    </h3>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Metric
                          </th>
                          {selectedCommunitiesData.map((community) => (
                            <th key={community.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {community.name}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Home className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-sm font-medium text-gray-900">Median Home Price</span>
                            </div>
                          </td>
                          {selectedCommunitiesData.map((community) => (
                            <td key={community.id} className="px-6 py-4 whitespace-nowrap">
                              <span className={`text-sm font-semibold ${getScoreColor(community.medianHomePrice, 'price')}`}>
                                ${community.medianHomePrice.toLocaleString()}
                              </span>
                            </td>
                          ))}
                        </tr>

                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <GraduationCap className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-sm font-medium text-gray-900">School Rating</span>
                            </div>
                          </td>
                          {selectedCommunitiesData.map((community) => (
                            <td key={community.id} className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm font-semibold text-green-600">
                                {community.schoolRating}
                              </span>
                            </td>
                          ))}
                        </tr>

                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Shield className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-sm font-medium text-gray-900">Crime Rate (per 100k)</span>
                            </div>
                          </td>
                          {selectedCommunitiesData.map((community) => (
                            <td key={community.id} className="px-6 py-4 whitespace-nowrap">
                              <span className={`text-sm font-semibold ${getScoreColor(community.crimeRate, 'crime')}`}>
                                {community.crimeRate}k
                              </span>
                            </td>
                          ))}
                        </tr>

                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <TrendingUp className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-sm font-medium text-gray-900">Population</span>
                            </div>
                          </td>
                          {selectedCommunitiesData.map((community) => (
                            <td key={community.id} className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm font-semibold text-gray-700">
                                {community.population.toLocaleString()}
                              </span>
                            </td>
                          ))}
                        </tr>

                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-sm font-medium text-gray-900">Avg Commute (min)</span>
                            </div>
                          </td>
                          {selectedCommunitiesData.map((community) => (
                            <td key={community.id} className="px-6 py-4 whitespace-nowrap">
                              <span className={`text-sm font-semibold ${getScoreColor(community.avgCommute, 'commute')}`}>
                                {community.avgCommute} min
                              </span>
                            </td>
                          ))}
                        </tr>

                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-sm font-medium text-gray-900">Walk Score</span>
                            </div>
                          </td>
                          {selectedCommunitiesData.map((community) => (
                            <td key={community.id} className="px-6 py-4 whitespace-nowrap">
                              <span className={`text-sm font-semibold ${getScoreColor(community.walkScore, 'walk')}`}>
                                {community.walkScore}/100
                              </span>
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Detailed Sections Header */}
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-blue-900 mb-1">Detailed Analysis Sections</h3>
                      <p className="text-sm text-blue-700">
                        Click on each section below to expand and view detailed comparisons. 
                        Currently showing {expandedSections.size} of 5 sections expanded.
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setExpandedSections(new Set(['demographics', 'housing', 'amenities', 'employment', 'climate']))}
                        className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        Expand All
                      </button>
                      <button
                        onClick={() => setExpandedSections(new Set())}
                        className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                      >
                        Collapse All
                      </button>
                    </div>
                  </div>
                </div>

                {/* Demographics Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => toggleSection('demographics')}
                    className="w-full px-6 py-4 border-b border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Demographics & Lifestyle
                    </h3>
                    {expandedSections.has('demographics') ? (
                      <ChevronUp className="h-5 w-5 text-gray-600" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-600" />
                    )}
                  </button>
                  
                  {expandedSections.has('demographics') && (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Metric
                            </th>
                            {selectedCommunitiesData.map((community) => (
                              <th key={community.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {community.name}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Median Age</td>
                            {selectedCommunitiesData.map((community) => (
                              <td key={community.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {community.demographics.medianAge} years
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Median Household Income</td>
                            {selectedCommunitiesData.map((community) => (
                              <td key={community.id} className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                                ${community.demographics.medianHouseholdIncome.toLocaleString()}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">College Educated (%)</td>
                            {selectedCommunitiesData.map((community) => (
                              <td key={community.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {community.demographics.collegeEducated}%
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Married Couples (%)</td>
                            {selectedCommunitiesData.map((community) => (
                              <td key={community.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {community.demographics.marriedCouples}%
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Housing Market Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => toggleSection('housing')}
                    className="w-full px-6 py-4 border-b border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Home className="h-5 w-5 mr-2" />
                      Housing Market Analysis
                    </h3>
                    {expandedSections.has('housing') ? (
                      <ChevronUp className="h-5 w-5 text-gray-600" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-600" />
                    )}
                  </button>
                  
                  {expandedSections.has('housing') && (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Metric
                            </th>
                            {selectedCommunitiesData.map((community) => (
                              <th key={community.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {community.name}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Home Ownership Rate</td>
                            {selectedCommunitiesData.map((community) => (
                              <td key={community.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {community.housing.homeOwnership}%
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Average Home Size</td>
                            {selectedCommunitiesData.map((community) => (
                              <td key={community.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {community.housing.avgHomeSize.toLocaleString()} sq ft
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Property Tax Rate</td>
                            {selectedCommunitiesData.map((community) => (
                              <td key={community.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {community.housing.propertyTax}%
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Average Rent</td>
                            {selectedCommunitiesData.map((community) => (
                              <td key={community.id} className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                                ${community.housing.avgRent.toLocaleString()}/month
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Amenities & Lifestyle Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => toggleSection('amenities')}
                    className="w-full px-6 py-4 border-b border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <TreePine className="h-5 w-5 mr-2" />
                      Amenities & Recreation
                    </h3>
                    {expandedSections.has('amenities') ? (
                      <ChevronUp className="h-5 w-5 text-gray-600" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-600" />
                    )}
                  </button>
                  
                  {expandedSections.has('amenities') && (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Amenity Type
                            </th>
                            {selectedCommunitiesData.map((community) => (
                              <th key={community.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {community.name}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Parks & Recreation</td>
                            {selectedCommunitiesData.map((community) => (
                              <td key={community.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {community.amenities.parks} facilities
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Restaurants & Dining</td>
                            {selectedCommunitiesData.map((community) => (
                              <td key={community.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {community.amenities.restaurants} establishments
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Shopping Centers</td>
                            {selectedCommunitiesData.map((community) => (
                              <td key={community.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {community.amenities.shopping} centers
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Healthcare Facilities</td>
                            {selectedCommunitiesData.map((community) => (
                              <td key={community.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {community.amenities.healthcare} facilities
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Entertainment Venues</td>
                            {selectedCommunitiesData.map((community) => (
                              <td key={community.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {community.amenities.entertainment} venues
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Employment & Economy Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => toggleSection('employment')}
                    className="w-full px-6 py-4 border-b border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Briefcase className="h-5 w-5 mr-2" />
                      Employment & Economy
                    </h3>
                    {expandedSections.has('employment') ? (
                      <ChevronUp className="h-5 w-5 text-gray-600" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-600" />
                    )}
                  </button>
                  
                  {expandedSections.has('employment') && (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Economic Indicator
                            </th>
                            {selectedCommunitiesData.map((community) => (
                              <th key={community.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {community.name}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Unemployment Rate</td>
                            {selectedCommunitiesData.map((community) => (
                              <td key={community.id} className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                                {community.employment.unemploymentRate}%
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Average Wage</td>
                            {selectedCommunitiesData.map((community) => (
                              <td key={community.id} className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                                ${community.employment.averageWage.toLocaleString()}/year
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">Major Employers</td>
                            {selectedCommunitiesData.map((community) => (
                              <td key={community.id} className="px-6 py-4 text-sm text-gray-700">
                                <div className="space-y-1">
                                  {community.employment.majorEmployers.map((employer: string, index: number) => (
                                    <div key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                      {employer}
                                    </div>
                                  ))}
                                </div>
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Climate & Weather Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => toggleSection('climate')}
                    className="w-full px-6 py-4 border-b border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Cloud className="h-5 w-5 mr-2" />
                      Climate & Weather
                    </h3>
                    {expandedSections.has('climate') ? (
                      <ChevronUp className="h-5 w-5 text-gray-600" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-600" />
                    )}
                  </button>
                  
                  {expandedSections.has('climate') && (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Weather Metric
                            </th>
                            {selectedCommunitiesData.map((community) => (
                              <th key={community.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {community.name}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Average Temperature</td>
                            {selectedCommunitiesData.map((community) => (
                              <td key={community.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {community.climate.avgTemp}°F
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Sunny Days per Year</td>
                            {selectedCommunitiesData.map((community) => (
                              <td key={community.id} className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-yellow-600">
                                {community.climate.sunnyDays} days
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Rainy Days per Year</td>
                            {selectedCommunitiesData.map((community) => (
                              <td key={community.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {community.climate.rainyDays} days
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Interactive Components from Community Detail Page */}
                {selectedCommunitiesData.length === 1 && (
                  <div className="space-y-6">
                    <MarketTrends 
                      communityId={selectedCommunitiesData[0].id}
                      communityName={selectedCommunitiesData[0].name}
                    />
                    
                    <SchoolDistrictDetails 
                      communityId={selectedCommunitiesData[0].id}
                      communityName={selectedCommunitiesData[0].name}
                    />
                    
                    <TrafficPatterns 
                      communityId={selectedCommunitiesData[0].id}
                      communityName={selectedCommunitiesData[0].name}
                    />
                    
                    <NearbyAmenities 
                      communityId={selectedCommunitiesData[0].id}
                      communityName={selectedCommunitiesData[0].name}
                    />
                    
                    <EmploymentData 
                      communityId={selectedCommunitiesData[0].id}
                      communityName={selectedCommunitiesData[0].name}
                    />
                    
                    <ClimateWeather 
                      communityId={selectedCommunitiesData[0].id}
                      communityName={selectedCommunitiesData[0].name}
                    />
                  </div>
                )}

                {/* Summary Insights */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-2">Most Affordable</h4>
                      <p className="text-sm text-green-700">
                        {selectedCommunitiesData.reduce((min, community) => 
                          community.medianHomePrice < min.medianHomePrice ? community : min
                        ).name} has the lowest median home price at ${selectedCommunitiesData.reduce((min, community) => 
                          community.medianHomePrice < min.medianHomePrice ? community : min
                        ).medianHomePrice.toLocaleString()}.
                      </p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Best Schools</h4>
                      <p className="text-sm text-blue-700">
                        {selectedCommunitiesData.filter(c => c.schoolRating === 'A+').length > 0 
                          ? `${selectedCommunitiesData.filter(c => c.schoolRating === 'A+').map(c => c.name).join(', ')} ${selectedCommunitiesData.filter(c => c.schoolRating === 'A+').length === 1 ? 'has' : 'have'} A+ rated schools.`
                          : `${selectedCommunitiesData.filter(c => c.schoolRating === 'A').map(c => c.name).join(', ')} ${selectedCommunitiesData.filter(c => c.schoolRating === 'A').length === 1 ? 'has' : 'have'} the highest school ratings.`
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Lead Capture for Engaged Users */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Ready to Take the Next Step?</h3>
                      <p className="text-blue-100 mb-4">
                        You've done the research. Now get personalized guidance from a local expert who knows these communities inside and out.
                      </p>
                      <div className="flex flex-wrap gap-2 text-sm">
                        <span className="bg-blue-500 px-2 py-1 rounded">✓ Free consultation</span>
                        <span className="bg-blue-500 px-2 py-1 rounded">✓ Market insights</span>
                        <span className="bg-blue-500 px-2 py-1 rounded">✓ Property search</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <button
                        onClick={() => setShowLeadCapture(true)}
                        className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                      >
                        Get Expert Help
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Lead Capture Modal */}
      <LeadCaptureModal
        isOpen={showLeadCapture}
        onClose={() => setShowLeadCapture(false)}
        communityName={selectedCommunitiesData.length > 0 ? selectedCommunitiesData.map(c => c.name).join(' vs ') : 'Multiple Communities'}
        trigger="contact_realtor"
      />
    </div>
  );
}

export default ReportsPage;
