import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Heart, ChevronLeft, ChevronRight, MapPin, Filter, ChevronDown, ChevronUp, Home } from 'lucide-react';
import { useComparison } from '../contexts/ComparisonContext';
import { Navigation } from '../components/Navigation';
import { AuthModal } from '../components/AuthModal';
import { LeadCaptureModal } from '../components/LeadCaptureModal';
import { ComparisonLimitPopup } from '../components/ComparisonLimitPopup';
import { sampleNeighborhoods } from '../data/neighborhoods';
import { DatabaseService } from '../lib/supabase-enhanced';
import { InteractiveMap } from '../components/InteractiveMap';

interface CommunityCard {
  id: string;
  name: string;
  city: string;
  region: string;
  price: string;
  schoolRating: string;
  medianHomePrice: number;
  population: number;
  crimeRate: number;
  avgCommute: number;
  walkScore: number;
  type: string;
  image: string;
}

function ExplorePage() {
  const { addCommunity, removeCommunity, isSelected, selectedCommunities } = useComparison();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [schoolRating, setSchoolRating] = useState('Any');
  const [priceRange, setPriceRange] = useState('Any');
  const [selectedCity, setSelectedCity] = useState('Any');
  const [communityType, setCommunityType] = useState('Any');
  const [regionFilter, setRegionFilter] = useState('Any');
  const [populationFilter, setPopulationFilter] = useState('Any');
  const [commuteFilter, setCommuteFilter] = useState('Any');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Database state
  const [communities, setCommunities] = useState<CommunityCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  
  // New modal states
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [leadCaptureType, setLeadCaptureType] = useState<'contact_realtor' | 'schedule_tour' | 'get_pricing' | 'mortgage_calc'>('get_pricing');
  const [selectedCommunityName, setSelectedCommunityName] = useState('');
  const [showComparisonLimitPopup, setShowComparisonLimitPopup] = useState(false);
  
  // Autocomplete states
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  
  // Filter visibility state
  const [showFilters, setShowFilters] = useState(false);
  
  // Mobile view state
  const [showMobileMap, setShowMobileMap] = useState(false);
  
  // Search type state
  const [searchType, setSearchType] = useState<'communities' | 'neighborhoods'>('communities');
  
  // Community filter for neighborhoods
  const [selectedCommunity, setSelectedCommunity] = useState('Any');
  
  const communitiesPerPage = 12;

  // Load communities from database
  useEffect(() => {
    const loadCommunities = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load from enhanced database service with real-time API integration
        const [communitiesData, citiesData] = await Promise.all([
          DatabaseService.getAllCommunities(),
          DatabaseService.getUniqueCities()
        ]);
        
        // Transform enhanced community data to CommunityCard format
        const transformedCommunities: CommunityCard[] = communitiesData.map(community => ({
          id: community.id,
          name: community.name,
          city: community.city,
          region: community.state,
          price: `$${(community.median_home_price / 1000).toFixed(0)}K`,
          schoolRating: community.school_rating.toString(),
          medianHomePrice: community.median_home_price,
          population: community.population,
          crimeRate: community.crime_rate,
          avgCommute: community.commute_time_downtown,
          walkScore: community.walkability_score,
          type: 'Community',
          image: community.images[0] || '/api/placeholder/400/300'
        }));
        
        setCommunities(transformedCommunities);
        setAvailableCities(citiesData);
        console.log('✅ Communities loaded:', communitiesData.length);
      } catch (err) {
        console.error('Error loading communities:', err);
        setError('Failed to load communities. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadCommunities();
  }, []);

  // Initialize from URL parameters
  useEffect(() => {
    const type = searchParams.get('type');
    const community = searchParams.get('community');
    
    console.log('URL params - type:', type, 'community:', community);
    
    if (type === 'neighborhoods') {
      setSearchType('neighborhoods');
      console.log('Set search type to neighborhoods');
    }
    
    if (community && community !== 'Any') {
      setSelectedCommunity(community);
      setSearchType('neighborhoods');
      console.log('Set selected community to:', community);
    }
  }, [searchParams]);

  // Load favorites from localStorage on component mount
  React.useEffect(() => {
    const savedFavorites = localStorage.getItem('texasCommunities_favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Reset page when search type changes
  React.useEffect(() => {
    setCurrentPage(1);
    // Reset community filter when switching to communities mode
    if (searchType === 'communities') {
      setSelectedCommunity('Any');
    }
  }, [searchType]);

  // Save favorites to localStorage whenever it changes
  React.useEffect(() => {
    localStorage.setItem('texasCommunities_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (communityId: string) => {
    setFavorites(prev => 
      prev.includes(communityId)
        ? prev.filter(id => id !== communityId)
        : [...prev, communityId]
    );
  };

  // Handle comparison selection
  const toggleComparisonSelection = (community: CommunityCard) => {
    const comparisonCommunity = {
      id: community.id,
      name: community.name,
      city: community.city,
      price: community.price,
      schoolRating: community.schoolRating,
      image: community.image
    };

    if (isSelected(community.id)) {
      removeCommunity(community.id);
    } else {
      // Check if we can add more communities
      if (selectedCommunities.length >= 4) {
        setShowComparisonLimitPopup(true);
        return;
      }
      addCommunity(comparisonCommunity);
    }
  };

  // Generate search suggestions
  const generateSuggestions = (query: string) => {
    if (!query.trim() || query.length < 2) return [];
    
    const suggestions: Array<{type: string, value: string, label: string}> = [];
    const lowerQuery = query.toLowerCase();
    
    if (searchType === 'communities') {
      // Community name suggestions
      communities.forEach((community: CommunityCard) => {
        if (community.name.toLowerCase().includes(lowerQuery)) {
          suggestions.push({
            type: 'community',
            value: community.name,
            label: `${community.name} - ${community.city}`
          });
        }
      });
      
      // City suggestions
      const cities = [...new Set(communities.map((c: CommunityCard) => c.city))];
      cities.forEach((city: string) => {
        if (city.toLowerCase().includes(lowerQuery)) {
          suggestions.push({
            type: 'city',
            value: city,
            label: `${city} Area`
          });
        }
      });
      
      // Region suggestions
      const regions = [...new Set(communities.map((c: CommunityCard) => c.region))];
      regions.forEach((region: string) => {
        if (region.toLowerCase().includes(lowerQuery)) {
          suggestions.push({
            type: 'region',
            value: region,
            label: region
          });
        }
      });
    } else {
      // Neighborhood suggestions
      sampleNeighborhoods.forEach((neighborhood: any) => {
        if (neighborhood.name.toLowerCase().includes(lowerQuery)) {
          suggestions.push({
            type: 'neighborhood',
            value: neighborhood.name,
            label: `${neighborhood.name} - ${neighborhood.city}`
          });
        }
      });
      
      // Community suggestions for neighborhoods
      const communityNames = [...new Set(sampleNeighborhoods.map((n: any) => n.community))];
      communities.forEach((community: CommunityCard) => {
        if (communityNames.includes(community.id) && community.name.toLowerCase().includes(lowerQuery)) {
          suggestions.push({
            type: 'community',
            value: community.name,
            label: `${community.name} Community`
          });
        }
      });
    }
    
    return suggestions.slice(0, 8); // Limit to 8 suggestions
  };

  const searchSuggestions = generateSuggestions(searchQuery);

  // Handle search input changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setShowSuggestions(value.length >= 2);
    setSelectedSuggestionIndex(-1);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: {type: string, value: string, label: string}) => {
    if (suggestion.type === 'community' || suggestion.type === 'city' || suggestion.type === 'neighborhood') {
      setSearchQuery(suggestion.value);
    } else if (suggestion.type === 'region') {
      setRegionFilter(suggestion.value);
      setSearchQuery('');
    }
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
  };

  // Handle keyboard navigation
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || searchSuggestions.length === 0) return;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestionIndex(prev => 
        prev < searchSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : prev);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedSuggestionIndex >= 0) {
        handleSuggestionSelect(searchSuggestions[selectedSuggestionIndex]);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
    }
  };

  // Filter communities based on all criteria
  const filteredCommunities = communities.filter((community: CommunityCard) => {
    const matchesSearch = community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         community.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSchool = schoolRating === 'Any' || community.schoolRating === schoolRating;
    const matchesPrice = priceRange === 'Any' || community.price === priceRange;
    const matchesCity = selectedCity === 'Any' || community.city === selectedCity;
    const matchesType = communityType === 'Any' || community.type === communityType;
    const matchesRegion = regionFilter === 'Any' || community.region === regionFilter;
    const matchesPopulation = populationFilter === 'Any' || (
      populationFilter === 'Small (Under 50K)' && community.population < 50000 ||
      populationFilter === 'Medium (50K - 150K)' && community.population >= 50000 && community.population <= 150000 ||
      populationFilter === 'Large (Over 150K)' && community.population > 150000
    );
    const matchesCommute = commuteFilter === 'Any' || (
      commuteFilter === 'Short (Under 25 min)' && community.avgCommute < 25 ||
      commuteFilter === 'Medium (25-35 min)' && community.avgCommute >= 25 && community.avgCommute <= 35 ||
      commuteFilter === 'Long (Over 35 min)' && community.avgCommute > 35
    );
    
    return matchesSearch && matchesSchool && matchesPrice && matchesCity && 
           matchesType && matchesRegion && matchesPopulation && matchesCommute;
  }).sort((a: CommunityCard, b: CommunityCard) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'city':
        return a.city.localeCompare(b.city);
      case 'price-low':
        return a.price.length - b.price.length;
      case 'price-high':
        return b.price.length - a.price.length;
      case 'school':
        const schoolOrder = { 'A+': 4, 'A': 3, 'B+': 2, 'B': 1 };
        return (schoolOrder[b.schoolRating as keyof typeof schoolOrder] || 0) - 
               (schoolOrder[a.schoolRating as keyof typeof schoolOrder] || 0);
      default:
        return 0;
    }
  });

  // Filter neighborhoods based on search criteria (when in neighborhood mode)
  const filteredNeighborhoods = sampleNeighborhoods.filter(neighborhood => {
    const matchesSearch = neighborhood.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         neighborhood.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         neighborhood.community.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = selectedCity === 'Any' || neighborhood.city === selectedCity;
    const matchesRegion = regionFilter === 'Any' || neighborhood.region === regionFilter;
    
    // Community filter for neighborhoods
    const matchesCommunity = selectedCommunity === 'Any' || neighborhood.community === selectedCommunity;
    
    // Price filtering for neighborhoods (convert community price symbols to ranges)
    const matchesPrice = priceRange === 'Any' || (
      priceRange === '$' && neighborhood.medianHomePrice < 400000 ||
      priceRange === '$$' && neighborhood.medianHomePrice >= 400000 && neighborhood.medianHomePrice < 600000 ||
      priceRange === '$$$' && neighborhood.medianHomePrice >= 600000
    );
    
    return matchesSearch && matchesCity && matchesRegion && matchesPrice && matchesCommunity;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'city':
        return a.city.localeCompare(b.city);
      case 'price-low':
        return a.medianHomePrice - b.medianHomePrice;
      case 'price-high':
        return b.medianHomePrice - a.medianHomePrice;
      default:
        return 0;
    }
  });

  // Pagination logic
  const totalPages = searchType === 'communities' 
    ? Math.ceil(filteredCommunities.length / communitiesPerPage)
    : Math.ceil(filteredNeighborhoods.length / communitiesPerPage);
  const startIndex = (currentPage - 1) * communitiesPerPage;
  const paginatedCommunities = filteredCommunities.slice(startIndex, startIndex + communitiesPerPage);
  const paginatedNeighborhoods = filteredNeighborhoods.slice(startIndex, startIndex + communitiesPerPage);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, schoolRating, priceRange, selectedCity, communityType, regionFilter, populationFilter, commuteFilter, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navigation />

      {/* Enhanced Filter Bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Top Row - Search and Main Filters */}
          <div className="flex flex-col lg:flex-row gap-4 items-center mb-4">
            {/* Search Input with Autocomplete */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={searchType === 'communities' ? "Search communities, cities, regions..." : "Search neighborhoods in your area..."}
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all duration-200"
              />
              
              {/* Autocomplete Suggestions */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-50 max-h-64 overflow-y-auto">
                  {searchSuggestions.map((suggestion, index) => (
                    <div
                      key={`${suggestion.type}-${suggestion.value}`}
                      className={`px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors duration-150 ${
                        index === selectedSuggestionIndex ? 'bg-blue-50 text-blue-900' : 'text-gray-700'
                      }`}
                      onClick={() => handleSuggestionSelect(suggestion)}
                    >
                      <div className="flex items-center space-x-2">
                        {suggestion.type === 'community' && <MapPin className="h-4 w-4 text-blue-600" />}
                        {suggestion.type === 'neighborhood' && <Home className="h-4 w-4 text-green-600" />}
                        {suggestion.type === 'city' && <Search className="h-4 w-4 text-orange-600" />}
                        {suggestion.type === 'region' && <MapPin className="h-4 w-4 text-purple-600" />}
                        <span className="font-medium">{suggestion.label}</span>
                        <span className="text-xs text-gray-500 capitalize">({suggestion.type})</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Search Type Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setSearchType('communities')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  searchType === 'communities'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Communities
              </button>
              <button
                onClick={() => setSearchType('neighborhoods')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  searchType === 'neighborhoods'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Neighborhoods
              </button>
            </div>

            {/* Filters Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm touch-manipulation"
              aria-expanded={showFilters}
              aria-controls="filters-panel"
            >
              <Filter className="h-5 w-5" />
              <span className="hidden sm:inline">Filters</span>
              {showFilters ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Collapsible Filters Panel */}
          {showFilters && (
            <div 
              id="filters-panel"
              className="bg-gray-50 rounded-lg p-4 sm:p-6 border border-gray-200 mb-4 animate-fade-in"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
                {/* Metro Area Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Metro Area</label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full px-3 py-2.5 text-base sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all duration-200 bg-white touch-manipulation"
                  >
                    <option value="Any">Any Metro Area</option>
                    {availableCities.map((city: string) => (
                      <option key={city} value={city}>{city} Area</option>
                    ))}
                  </select>
                </div>

                {/* Price Range Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Price Range</label>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all duration-200 bg-white"
                  >
                    <option value="Any">Any Price Range</option>
                    <option value="$">$ Budget</option>
                    <option value="$$">$$ Mid-Range</option>
                    <option value="$$$">$$$ Premium</option>
                  </select>
                </div>

                {/* School Rating Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">School Rating</label>
                  <select
                    value={schoolRating}
                    onChange={(e) => setSchoolRating(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all duration-200 bg-white"
                  >
                    <option value="Any">Any Rating</option>
                    <option value="A+">A+ Schools</option>
                    <option value="A">A Schools</option>
                    <option value="B+">B+ Schools</option>
                    <option value="B">B Schools</option>
                  </select>
                </div>

                {/* Region Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Region</label>
                  <select
                    value={regionFilter}
                    onChange={(e) => setRegionFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all duration-200 bg-white"
                  >
                    <option value="Any">Any Region</option>
                    <option value="North Texas">North Texas</option>
                    <option value="Central Texas">Central Texas</option>
                    <option value="East Texas">East Texas</option>
                    <option value="South Texas">South Texas</option>
                    <option value="West Texas">West Texas</option>
                  </select>
                </div>

                {/* Community Type Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Community Type</label>
                  <select
                    value={communityType}
                    onChange={(e) => setCommunityType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all duration-200 bg-white"
                  >
                    <option value="Any">Any Type</option>
                    <option value="Suburban">Suburban</option>
                    <option value="Urban">Urban</option>
                    <option value="Master-Planned">Master-Planned</option>
                    <option value="Historic">Historic</option>
                  </select>
                </div>

                {/* Population Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Population Size</label>
                  <select
                    value={populationFilter}
                    onChange={(e) => setPopulationFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all duration-200 bg-white"
                  >
                    <option value="Any">Any Size</option>
                    <option value="Small (Under 50K)">Small (Under 50K)</option>
                    <option value="Medium (50K - 150K)">Medium (50K - 150K)</option>
                    <option value="Large (Over 150K)">Large (Over 150K)</option>
                  </select>
                </div>

                {/* Commute Time Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Commute Time</label>
                  <select
                    value={commuteFilter}
                    onChange={(e) => setCommuteFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all duration-200 bg-white"
                  >
                    <option value="Any">Any Commute</option>
                    <option value="Short (Under 25 min)">Short (Under 25 min)</option>
                    <option value="Medium (25-35 min)">Medium (25-35 min)</option>
                    <option value="Long (Over 35 min)">Long (Over 35 min)</option>
                  </select>
                </div>

                {/* Community Filter (only show in neighborhood mode) */}
                {searchType === 'neighborhoods' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Community</label>
                    <select
                      value={selectedCommunity}
                      onChange={(e) => {
                        console.log('Community filter changed to:', e.target.value);
                        setSelectedCommunity(e.target.value);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all duration-200 bg-white"
                    >
                      <option value="Any">All Communities</option>
                      {[...new Set(sampleNeighborhoods.map((n: any) => n.community))].map((communityId: string) => {
                        const community = communities.find((c: CommunityCard) => c.id === communityId);
                        console.log('Rendering option - ID:', communityId, 'Name:', community?.name, 'Selected:', selectedCommunity === communityId);
                        return community ? (
                          <option key={communityId} value={communityId}>
                            {community.name}
                          </option>
                        ) : null;
                      })}
                    </select>
                  </div>
                )}

                {/* Sort Options */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all duration-200 bg-white"
                  >
                    <option value="name">Name</option>
                    <option value="city">Metro Area</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="school">Best Schools First</option>
                  </select>
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-600">
                  {searchType === 'communities' 
                    ? `${filteredCommunities.length} communities found`
                    : `${filteredNeighborhoods.length} neighborhoods found`
                  }
                </span>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCity('Any');
                      setPriceRange('Any');
                      setSchoolRating('Any');
                      setCommunityType('Any');
                      setRegionFilter('Any');
                      setPopulationFilter('Any');
                      setCommuteFilter('Any');
                      setSelectedCommunity('Any');
                      setSortBy('name');
                    }}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
                  >
                    Clear All Filters
                  </button>
                  
                  <button
                    onClick={() => setShowFilters(false)}
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content - Responsive Layout */}
      <div className="lg:flex lg:h-screen">
        {/* Mobile View Toggle Buttons */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex space-x-2">
            <button
              onClick={() => setShowMobileMap(false)}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                !showMobileMap
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📋 List View
            </button>
            <button
              onClick={() => setShowMobileMap(true)}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                showMobileMap
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🗺️ Map View
            </button>
          </div>
        </div>

        {/* Left Side - Map (Desktop: always visible, Mobile: conditional) */}
        <div className={`lg:w-1/2 relative ${showMobileMap ? 'block' : 'hidden lg:block'}`}>
          <InteractiveMap
            communities={filteredCommunities.map(community => ({
              id: community.id,
              name: community.name,
              city: community.city,
              latitude: 30.2672 + (Math.random() - 0.5) * 2, // Spread around Texas
              longitude: -97.7431 + (Math.random() - 0.5) * 4,
              median_home_price: community.medianHomePrice,
              school_rating: parseFloat(community.schoolRating),
              walkability_score: community.walkScore
            }))}
            className="w-full h-64 lg:h-full"
            onCommunitySelect={(community) => {
              // Handle community selection from map
              console.log('Selected community from map:', community.name);
            }}
          />
          
          {/* Map Results Counter */}
          <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg px-3 py-2 border">
            <span className="text-sm font-medium text-gray-900">
              {searchType === 'communities' ? (
                <>{paginatedCommunities.length} of {filteredCommunities.length} communities</>
              ) : (
                <>{paginatedNeighborhoods.length} of {filteredNeighborhoods.length} neighborhoods</>
              )}
            </span>
          </div>
        </div>

        {/* Right Side - Community/Neighborhood Cards (Desktop: always visible, Mobile: conditional) */}
        <div className={`lg:w-1/2 flex flex-col bg-white ${!showMobileMap ? 'block' : 'hidden lg:flex'}`}>
          {/* Results Header */}
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {searchType === 'communities' 
                  ? (filteredCommunities.length > 0 ? 'Texas Communities' : 'No Communities Found')
                  : (filteredNeighborhoods.length > 0 ? 'Texas Neighborhoods' : 'No Neighborhoods Found')
                }
              </h2>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
            </div>
          </div>
          {/* Scrollable Cards */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              // Loading State
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading communities...</p>
              </div>
            ) : error ? (
              // Error State
              <div className="p-8 text-center">
                <div className="text-red-500 text-4xl mb-4">⚠️</div>
                <p className="text-red-600 mb-4">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Try Again
                </button>
              </div>
            ) : searchType === 'communities' ? (
              // Community Cards Display
              filteredCommunities.length > 0 ? (
                <div className="p-2 sm:p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {paginatedCommunities.map((community: CommunityCard) => (
                    <div key={community.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200">
                      {/* Community Image */}
                      <div className="w-full h-32 sm:h-32 bg-gray-200 overflow-hidden relative">
                        <img
                          src={community.image}
                          alt={`${community.name} community`}
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Comparison Checkbox */}
                        <div className="absolute top-2 left-2">
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isSelected(community.id)}
                              onChange={() => toggleComparisonSelection(community)}
                              disabled={!isSelected(community.id) && selectedCommunities.length >= 4}
                              className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                            />
                            <span className="ml-1 text-xs text-white bg-black/50 px-1 rounded">Compare</span>
                          </label>
                        </div>
                        
                        {/* Favorite Button */}
                        <button
                          onClick={() => toggleFavorite(community.id)}
                          className={`absolute top-2 right-2 p-1.5 rounded-full transition-all duration-200 ${
                            favorites.includes(community.id)
                              ? 'bg-red-500 text-white hover:bg-red-600'
                              : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
                          }`}
                        >
                          <Heart 
                            className={`h-4 w-4 ${
                              favorites.includes(community.id) ? 'fill-current' : ''
                            }`} 
                          />
                        </button>
                      </div>
                      
                      {/* Community Info */}
                      <div className="p-3">
                        <h3 className="text-base font-semibold text-gray-900 mb-1 leading-tight">
                          {community.name}
                        </h3>
                        <p className="text-xs text-gray-600 mb-2">{community.city} Metro Area</p>
                        
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-medium text-gray-700">
                            <span className="text-blue-900 font-semibold">{community.price}</span>
                          </span>
                          <span className="text-xs font-medium text-gray-700">
                            <span className="text-green-600 font-semibold">{community.schoolRating}</span>
                          </span>
                        </div>
                        
                        <div className="flex gap-2">
                          <Link
                            to={`/community/${community.id}`}
                            className="flex-1 inline-flex justify-center items-center px-2 py-1.5 text-xs font-medium text-blue-900 bg-white border border-blue-200 hover:bg-blue-50 rounded transition-colors duration-200"
                          >
                            View Details
                          </Link>
                          <button
                            onClick={() => {
                              setSelectedCommunityName(community.name);
                              setLeadCaptureType('get_pricing');
                              setShowLeadCapture(true);
                            }}
                            className="flex-1 inline-flex justify-center items-center px-2 py-1.5 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded transition-colors duration-200"
                          >
                            💰 Get Info
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="text-gray-400 mb-4">
                    <Search className="h-12 w-12 mx-auto mb-4" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No communities match your criteria</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCity('Any');
                      setPriceRange('Any');
                      setSchoolRating('Any');
                      setCommunityType('Any');
                      setSelectedCommunity('Any');
                    }}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )
            ) : (
              // Neighborhood Cards Display
              filteredNeighborhoods.length > 0 ? (
                <div className="p-2 sm:p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {paginatedNeighborhoods.map((neighborhood) => (
                      <div key={neighborhood.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200">
                        {/* Neighborhood Image */}
                        <div className="w-full h-32 sm:h-32 bg-gray-200 overflow-hidden relative">
                          <img
                            src={neighborhood.image}
                            alt={`${neighborhood.name} neighborhood`}
                            className="w-full h-full object-cover"
                          />
                          
                          {/* Type Badge */}
                          <div className="absolute top-2 left-2">
                            <span className="text-xs text-white bg-blue-600/80 px-2 py-1 rounded">
                              {neighborhood.type}
                            </span>
                          </div>
                          
                          {/* Price Badge */}
                          <div className="absolute top-2 right-2">
                            <span className="text-xs text-white bg-green-600/80 px-2 py-1 rounded">
                              ${(neighborhood.medianHomePrice / 1000).toFixed(0)}K
                            </span>
                          </div>
                        </div>
                        
                        {/* Neighborhood Info */}
                        <div className="p-3">
                          <h3 className="text-base font-semibold text-gray-900 mb-1 leading-tight">
                            {neighborhood.name}
                          </h3>
                          <p className="text-xs text-gray-600 mb-2">{neighborhood.city}, {neighborhood.region}</p>
                          
                          <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                            <div className="text-gray-600">
                              <span className="font-medium">{neighborhood.homes.forSale}</span> for sale
                            </div>
                            <div className="text-gray-600">
                              <span className="font-medium">{neighborhood.demographics.households}</span> homes
                            </div>
                            <div className="text-gray-600">
                              Walk Score: <span className="font-medium">{neighborhood.walkScore}</span>
                            </div>
                            <div className="text-gray-600">
                              Avg Income: <span className="font-medium">${(neighborhood.demographics.medianIncome / 1000).toFixed(0)}K</span>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedCommunityName(neighborhood.name);
                                setLeadCaptureType('get_pricing');
                                setShowLeadCapture(true);
                              }}
                              className="flex-1 inline-flex justify-center items-center px-2 py-1.5 text-xs font-medium text-blue-900 bg-white border border-blue-200 hover:bg-blue-50 rounded transition-colors duration-200"
                            >
                              View Details
                            </button>
                            <button
                              onClick={() => {
                                setSelectedCommunityName(neighborhood.name);
                                setLeadCaptureType('schedule_tour');
                                setShowLeadCapture(true);
                              }}
                              className="flex-1 inline-flex justify-center items-center px-2 py-1.5 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded transition-colors duration-200"
                            >
                              🏠 Tour
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="text-gray-400 mb-4">
                      <Home className="h-12 w-12 mx-auto mb-4" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No neighborhoods match your criteria</h3>
                    <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCity('Any');
                        setPriceRange('Any');
                        setRegionFilter('Any');
                        setSelectedCommunity('Any');
                      }}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>
              )
            )}
          </div>

          {/* Pagination Footer */}
          {((searchType === 'communities' && filteredCommunities.length > 0) || 
            (searchType === 'neighborhoods' && filteredNeighborhoods.length > 0)) && totalPages > 1 && (
            <div className="border-t border-gray-200 bg-white px-4 py-3">
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
                <div className="text-sm text-gray-700 text-center sm:text-left">
                  {searchType === 'communities' ? (
                    <>Showing {startIndex + 1} to {Math.min(startIndex + communitiesPerPage, filteredCommunities.length)} of {filteredCommunities.length} communities</>
                  ) : (
                    <>Showing {startIndex + 1} to {Math.min(startIndex + communitiesPerPage, filteredNeighborhoods.length)} of {filteredNeighborhoods.length} neighborhoods</>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg border transition-colors duration-200 ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                    }`}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  
                  {/* Page Numbers - Show fewer on mobile */}
                  {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                    const pageNumber = Math.max(1, Math.min(totalPages - 2, currentPage - 1)) + i;
                    if (pageNumber > totalPages) return null;
                    
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`px-3 py-2 rounded-lg border text-sm transition-colors duration-200 ${
                          currentPage === pageNumber
                            ? 'bg-blue-900 text-white border-blue-900'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                  
                  {/* Show more pages on larger screens */}
                  <div className="hidden sm:flex items-center space-x-2">
                    {Array.from({ length: Math.min(2, Math.max(0, totalPages - 3)) }, (_, i) => {
                      const pageNumber = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i + 3;
                      if (pageNumber > totalPages || pageNumber <= 3) return null;
                      
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => setCurrentPage(pageNumber)}
                          className={`px-3 py-2 rounded-lg border text-sm transition-colors duration-200 ${
                            currentPage === pageNumber
                              ? 'bg-blue-900 text-white border-blue-900'
                              : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg border transition-colors duration-200 ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                    }`}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Authentication Modal */}
      {showAuthModal && (
        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)} 
        />
      )}

      {/* Lead Capture Modal */}
      <LeadCaptureModal
        isOpen={showLeadCapture}
        onClose={() => setShowLeadCapture(false)}
        communityName={selectedCommunityName}
        trigger={leadCaptureType}
      />

      {/* Comparison Limit Popup */}
      <ComparisonLimitPopup
        isOpen={showComparisonLimitPopup}
        onClose={() => setShowComparisonLimitPopup(false)}
      />
    </div>
  );
}

export default ExplorePage;