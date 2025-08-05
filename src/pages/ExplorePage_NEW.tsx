import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, ChevronLeft, ChevronRight, MapPin, Filter, ChevronDown, ChevronUp, Home, RefreshCw } from 'lucide-react';
import { useComparison } from '../contexts/ComparisonContext';
import { Navigation } from '../components/Navigation';
import { AuthModal } from '../components/AuthModal';
import { LeadCaptureModal } from '../components/LeadCaptureModal';
import { ComparisonLimitPopup } from '../components/ComparisonLimitPopup';
import { DemoDisclaimer, DataSourceDisclaimer, PricingDisclaimer } from '../components/DemoDisclaimers';
import { CommunityDataService, type CommunityConfig } from '../services/CommunityDataService_NEW';
import CommunityMap from '../components/CommunityMap';

function ExplorePage() {
  const { addCommunity, removeCommunity, isSelected, selectedCommunities } = useComparison();
  
  // State management
  const [communities, setCommunities] = useState<CommunityConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [schoolRating, setSchoolRating] = useState('Any');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [priceRange, setPriceRange] = useState('Any');
  const [selectedCity, setSelectedCity] = useState('Any');
  const [communityType, setCommunityType] = useState('Any');
  const [regionFilter, setRegionFilter] = useState('Any');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [populationFilter, setPopulationFilter] = useState('Any');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [commuteFilter, setCommuteFilter] = useState('Any');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Modal states
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [leadCaptureType, setLeadCaptureType] = useState<'contact_realtor' | 'schedule_tour' | 'get_pricing' | 'mortgage_calc'>('get_pricing');
  const [selectedCommunityName, setSelectedCommunityName] = useState('');
  const [showComparisonLimitPopup, setShowComparisonLimitPopup] = useState(false);
  
  // UI states
  const [showSuggestions, setShowSuggestions] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileMap, setShowMobileMap] = useState(false);
  const [searchType, setSearchType] = useState<'community' | 'neighborhood'>('community');

  // Load communities on mount
  useEffect(() => {
    loadCommunities();
  }, []);

  const loadCommunities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get all available communities
      const allCommunities = CommunityDataService.getAllCommunities();
      setCommunities(allCommunities);
    } catch (err) {
      setError('Failed to load communities. Please try again.');
      console.error('Error loading communities:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh communities data
  const refreshCommunities = () => {
    CommunityDataService.clearCache();
    loadCommunities();
  };

  // Filter and sort communities
  const getFilteredCommunities = useCallback(() => {
    let filtered = communities;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(community => 
        community.name.toLowerCase().includes(query) ||
        community.city.toLowerCase().includes(query) ||
        community.state.toLowerCase().includes(query) ||
        community.metroArea?.toLowerCase().includes(query)
      );
    }

    // City filter
    if (selectedCity !== 'Any') {
      filtered = filtered.filter(community => community.city === selectedCity);
    }

    // State filter (region)
    if (regionFilter !== 'Any') {
      filtered = filtered.filter(community => community.state === regionFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'city':
          return a.city.localeCompare(b.city);
        default:
          return 0;
      }
    });

    return filtered;
  }, [communities, searchQuery, selectedCity, regionFilter, sortBy]);

  // Get unique values for filters
  const getUniqueValues = (key: keyof CommunityConfig) => {
    return [...new Set(communities.map(c => c[key]).filter(Boolean))].sort();
  };

  // Pagination
  const communitiesPerPage = 12;
  const filteredCommunities = getFilteredCommunities();
  const totalPages = Math.ceil(filteredCommunities.length / communitiesPerPage);
  const paginatedCommunities = filteredCommunities.slice(
    (currentPage - 1) * communitiesPerPage,
    currentPage * communitiesPerPage
  );

  // Handle favorite toggle
  const toggleFavorite = (communityId: string) => {
    setFavorites(prev => 
      prev.includes(communityId)
        ? prev.filter(id => id !== communityId)
        : [...prev, communityId]
    );
  };

  // Handle comparison toggle
  const handleComparisonToggle = (community: CommunityConfig) => {
    if (isSelected(community.id)) {
      removeCommunity(community.id);
    } else {
      if (selectedCommunities.length >= 3) {
        setShowComparisonLimitPopup(true);
        return;
      }
      addCommunity({
        id: community.id,
        name: community.name,
        city: community.city,
        state: community.state,
        coordinates: community.coordinates
      });
    }
  };

  // Handle lead capture
  const handleLeadCapture = (type: typeof leadCaptureType, communityName: string) => {
    setLeadCaptureType(type);
    setSelectedCommunityName(communityName);
    setShowLeadCapture(true);
  };

  // Search suggestions
  const getSearchSuggestions = () => {
    if (!searchQuery) return [];
    
    const query = searchQuery.toLowerCase();
    const suggestions = communities
      .filter(community => 
        community.name.toLowerCase().includes(query) ||
        community.city.toLowerCase().includes(query)
      )
      .slice(0, 5);
    
    return suggestions;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center pt-32">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading communities...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center pt-32">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={refreshCommunities}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-20">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Explore Communities
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Discover your perfect neighborhood with real-time data and insights
              </p>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto relative">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by community, city, or metro area..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className="w-full pl-12 pr-4 py-4 text-lg rounded-xl border-0 text-gray-900 placeholder-gray-500 focus:ring-4 focus:ring-blue-300"
                  />
                  
                  {/* Search Type Toggle */}
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <select
                      value={searchType}
                      onChange={(e) => setSearchType(e.target.value as 'community' | 'neighborhood')}
                      className="text-sm bg-transparent border-none text-gray-600 focus:ring-0"
                    >
                      <option value="community">Communities</option>
                      <option value="neighborhood">Neighborhoods</option>
                    </select>
                  </div>
                </div>
                
                {/* Search Suggestions */}
                {showSuggestions && searchQuery && (
                  <div className="absolute top-full left-0 right-0 bg-white rounded-lg shadow-lg mt-2 z-50">
                    {getSearchSuggestions().map((community, index) => (
                      <button
                        key={community.id}
                        onClick={() => {
                          setSearchQuery(community.name);
                          setShowSuggestions(false);
                        }}
                        className={`w-full px-4 py-3 text-left hover:bg-gray-50 text-gray-900 ${
                          index === selectedSuggestionIndex ? 'bg-gray-50' : ''
                        }`}
                      >
                        <div className="font-medium">{community.name}</div>
                        <div className="text-sm text-gray-500">{community.city}, {community.state}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Quick Stats */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                <div className="bg-white bg-opacity-10 rounded-lg p-4">
                  <div className="text-2xl font-bold">{communities.length}</div>
                  <div className="text-blue-100">Communities</div>
                </div>
                <div className="bg-white bg-opacity-10 rounded-lg p-4">
                  <div className="text-2xl font-bold">{getUniqueValues('city').length}</div>
                  <div className="text-blue-100">Cities</div>
                </div>
                <div className="bg-white bg-opacity-10 rounded-lg p-4">
                  <div className="text-2xl font-bold">API</div>
                  <div className="text-blue-100">Real-time Data</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters and Controls */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                
                <button
                  onClick={refreshCommunities}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh Data
                </button>
                
                <span className="text-gray-600">
                  {filteredCommunities.length} communities found
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="name">Sort by Name</option>
                  <option value="city">Sort by City</option>
                </select>
                
                <button
                  onClick={() => setShowMobileMap(!showMobileMap)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  <MapPin className="w-4 h-4" />
                  {showMobileMap ? 'Hide Map' : 'Show Map'}
                </button>
              </div>
            </div>
            
            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="Any">Any City</option>
                      {getUniqueValues('city').map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    <select
                      value={regionFilter}
                      onChange={(e) => setRegionFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="Any">Any State</option>
                      {getUniqueValues('state').map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Metro Area</label>
                    <select
                      value={communityType}
                      onChange={(e) => setCommunityType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="Any">Any Metro</option>
                      {getUniqueValues('metroArea').map(metro => (
                        <option key={metro} value={metro}>{metro}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Map */}
          {showMobileMap && (
            <div className="lg:hidden mb-8">
              <div className="h-96 rounded-lg overflow-hidden">
                <CommunityMap
                  communities={[]} // Convert CommunityConfig to required format
                  height="h-96"
                />
              </div>
            </div>
          )}

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Community Cards */}
            <div className="lg:col-span-3">
              {paginatedCommunities.length === 0 ? (
                <div className="text-center py-12">
                  <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No communities found matching your criteria.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCity('Any');
                      setRegionFilter('Any');
                      setCurrentPage(1);
                    }}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {paginatedCommunities.map((community) => (
                    <div key={community.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative">
                        <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600"></div>
                        <button
                          onClick={() => toggleFavorite(community.id)}
                          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                        >
                          <Heart
                            className={`w-5 h-5 ${
                              favorites.includes(community.id)
                                ? 'text-red-500 fill-red-500'
                                : 'text-gray-400'
                            }`}
                          />
                        </button>
                      </div>
                      
                      <div className="p-6">
                        <div className="mb-4">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {community.name}
                          </h3>
                          <p className="text-gray-600 flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {community.city}, {community.state}
                          </p>
                          {community.metroArea && (
                            <p className="text-sm text-gray-500 mt-1">{community.metroArea}</p>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {community.zipCodes.length} ZIP{community.zipCodes.length > 1 ? 's' : ''}
                          </span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            API Data
                          </span>
                        </div>
                        
                        <div className="flex gap-2 mb-4">
                          <button
                            onClick={() => handleLeadCapture('get_pricing', community.name)}
                            className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                          >
                            Get Pricing
                          </button>
                          <button
                            onClick={() => handleLeadCapture('schedule_tour', community.name)}
                            className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200"
                          >
                            Tour
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Link
                            to={`/community/${community.id}`}
                            className="text-blue-600 text-sm font-medium hover:text-blue-700"
                          >
                            View Details →
                          </Link>
                          
                          <button
                            onClick={() => handleComparisonToggle(community)}
                            className={`px-3 py-1 text-xs rounded-full transition-colors ${
                              isSelected(community.id)
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {isSelected(community.id) ? 'Added' : 'Compare'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 rounded-lg ${
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Desktop Map Sidebar */}
            <div className="hidden lg:block">
              <div className="sticky top-24">
                <div className="h-96 rounded-lg overflow-hidden bg-gray-200">
                  <CommunityMap
                    communities={[]} // Convert CommunityConfig to required format
                    height="h-96"
                  />
                </div>
                
                <div className="mt-4 p-4 bg-white rounded-lg shadow">
                  <h3 className="font-bold text-gray-900 mb-2">Selected for Comparison</h3>
                  {selectedCommunities.length === 0 ? (
                    <p className="text-gray-500 text-sm">No communities selected</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedCommunities.map(community => (
                        <div key={community.id} className="flex items-center justify-between">
                          <span className="text-sm">{community.name}</span>
                          <button
                            onClick={() => removeCommunity(community.id)}
                            className="text-red-500 text-xs hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      {selectedCommunities.length >= 2 && (
                        <Link
                          to="/comparison-demo"
                          className="block mt-3 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg text-center hover:bg-blue-700"
                        >
                          Compare Now
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimers */}
      <div className="bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DemoDisclaimer />
          <DataSourceDisclaimer />
          <PricingDisclaimer />
        </div>
      </div>

      {/* Modals */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
      
      {showLeadCapture && (
        <LeadCaptureModal
          isOpen={showLeadCapture}
          onClose={() => setShowLeadCapture(false)}
          type={leadCaptureType}
          communityName={selectedCommunityName}
        />
      )}
      
      {showComparisonLimitPopup && (
        <ComparisonLimitPopup onClose={() => setShowComparisonLimitPopup(false)} />
      )}
    </div>
  );
}

export default ExplorePage;
