import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, ChevronLeft, ChevronRight, User, Scale, MapPin, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { ComparisonTool } from '../components/ComparisonTool';
import { AuthModal } from '../components/AuthModal';
import { LeadCaptureModal } from '../components/LeadCaptureModal';

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

const sampleCommunities: CommunityCard[] = [
  {
    id: 'westlake',
    name: 'Westlake',
    city: 'Austin',
    region: 'Central Texas',
    price: '$$$',
    schoolRating: 'A+',
    medianHomePrice: 485000,
    population: 3438,
    crimeRate: 0.8,
    avgCommute: 28,
    walkScore: 25,
    type: 'Suburban',
    image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'
  },
  {
    id: 'plano',
    name: 'Plano',
    city: 'Dallas',
    region: 'North Texas',
    price: '$$',
    schoolRating: 'A',
    medianHomePrice: 425000,
    population: 285494,
    crimeRate: 1.2,
    avgCommute: 26,
    walkScore: 42,
    type: 'Suburban',
    image: 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'
  },
  {
    id: 'katy',
    name: 'Katy',
    city: 'Houston',
    region: 'East Texas',
    price: '$$',
    schoolRating: 'A',
    medianHomePrice: 385000,
    population: 21894,
    crimeRate: 1.1,
    avgCommute: 32,
    walkScore: 28,
    type: 'Suburban',
    image: 'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'
  },
  {
    id: 'frisco',
    name: 'Frisco',
    city: 'Dallas',
    region: 'North Texas',
    price: '$$$',
    schoolRating: 'A+',
    medianHomePrice: 525000,
    population: 200490,
    crimeRate: 0.9,
    avgCommute: 29,
    walkScore: 35,
    type: 'Master-Planned',
    image: 'https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'
  },
  {
    id: 'sugar-land',
    name: 'Sugar Land',
    city: 'Houston',
    region: 'East Texas',
    price: '$$',
    schoolRating: 'A',
    medianHomePrice: 415000,
    population: 118488,
    crimeRate: 1.0,
    avgCommute: 31,
    walkScore: 32,
    type: 'Suburban',
    image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'
  },
  {
    id: 'round-rock',
    name: 'Round Rock',
    city: 'Austin',
    region: 'Central Texas',
    price: '$$',
    schoolRating: 'A',
    medianHomePrice: 365000,
    population: 133372,
    crimeRate: 1.3,
    avgCommute: 27,
    walkScore: 38,
    type: 'Suburban',
    image: 'https://images.pexels.com/photos/2089698/pexels-photo-2089698.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'
  },
  {
    id: 'allen',
    name: 'Allen',
    city: 'Dallas',
    region: 'North Texas',
    price: '$$',
    schoolRating: 'A+',
    medianHomePrice: 445000,
    population: 105623,
    crimeRate: 0.7,
    avgCommute: 24,
    walkScore: 29,
    type: 'Suburban',
    image: 'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'
  },
  {
    id: 'pearland',
    name: 'Pearland',
    city: 'Houston',
    region: 'East Texas',
    price: '$$',
    schoolRating: 'A',
    medianHomePrice: 395000,
    population: 125817,
    crimeRate: 1.2,
    avgCommute: 33,
    walkScore: 26,
    type: 'Suburban',
    image: 'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'
  },
  {
    id: 'cedar-park',
    name: 'Cedar Park',
    city: 'Austin',
    region: 'Central Texas',
    price: '$$',
    schoolRating: 'A',
    medianHomePrice: 375000,
    population: 77595,
    crimeRate: 1.1,
    avgCommute: 30,
    walkScore: 24,
    type: 'Suburban',
    image: 'https://images.pexels.com/photos/1396115/pexels-photo-1396115.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'
  },
  {
    id: 'mckinney',
    name: 'McKinney',
    city: 'Dallas',
    region: 'North Texas',
    price: '$$',
    schoolRating: 'A+',
    medianHomePrice: 455000,
    population: 199177,
    crimeRate: 1.0,
    avgCommute: 28,
    walkScore: 31,
    type: 'Historic',
    image: 'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'
  },
  {
    id: 'the-woodlands',
    name: 'The Woodlands',
    city: 'Houston',
    region: 'East Texas',
    price: '$$$',
    schoolRating: 'A+',
    medianHomePrice: 535000,
    population: 114436,
    crimeRate: 0.6,
    avgCommute: 35,
    walkScore: 22,
    type: 'Master-Planned',
    image: 'https://images.pexels.com/photos/1396117/pexels-photo-1396117.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'
  },
  {
    id: 'southlake',
    name: 'Southlake',
    city: 'Dallas',
    region: 'North Texas',
    price: '$$$',
    schoolRating: 'A+',
    medianHomePrice: 685000,
    population: 31684,
    crimeRate: 0.5,
    avgCommute: 32,
    walkScore: 18,
    type: 'Suburban',
    image: 'https://images.pexels.com/photos/1438834/pexels-photo-1438834.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'
  },
  {
    id: 'flower-mound',
    name: 'Flower Mound',
    city: 'Dallas',
    region: 'North Texas',
    price: '$$',
    schoolRating: 'A',
    medianHomePrice: 475000,
    population: 78854,
    crimeRate: 0.8,
    avgCommute: 31,
    walkScore: 20,
    type: 'Suburban',
    image: 'https://images.pexels.com/photos/280221/pexels-photo-280221.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'
  },
  {
    id: 'leander',
    name: 'Leander',
    city: 'Austin',
    region: 'Central Texas',
    price: '$',
    schoolRating: 'B+',
    medianHomePrice: 295000,
    population: 67124,
    crimeRate: 1.4,
    avgCommute: 35,
    walkScore: 21,
    type: 'Suburban',
    image: 'https://images.pexels.com/photos/1396119/pexels-photo-1396119.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'
  },
  {
    id: 'richardson',
    name: 'Richardson',
    city: 'Dallas',
    region: 'North Texas',
    price: '$$',
    schoolRating: 'A',
    medianHomePrice: 385000,
    population: 121323,
    crimeRate: 1.5,
    avgCommute: 25,
    walkScore: 45,
    type: 'Urban',
    image: 'https://images.pexels.com/photos/323776/pexels-photo-323776.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'
  },
  {
    id: 'spring',
    name: 'Spring',
    city: 'Houston',
    region: 'East Texas',
    price: '$',
    schoolRating: 'B+',
    medianHomePrice: 275000,
    population: 62559,
    crimeRate: 1.6,
    avgCommute: 36,
    walkScore: 23,
    type: 'Suburban',
    image: 'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'
  },
  {
    id: 'carrollton',
    name: 'Carrollton',
    city: 'Dallas',
    region: 'North Texas',
    price: '$',
    schoolRating: 'B+',
    medianHomePrice: 285000,
    population: 133168,
    crimeRate: 1.7,
    avgCommute: 27,
    walkScore: 41,
    type: 'Urban',
    image: 'https://images.pexels.com/photos/2089701/pexels-photo-2089701.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'
  },
  {
    id: 'league-city',
    name: 'League City',
    city: 'Houston',
    region: 'East Texas',
    price: '$$',
    schoolRating: 'A',
    medianHomePrice: 405000,
    population: 114140,
    crimeRate: 1.0,
    avgCommute: 34,
    walkScore: 25,
    type: 'Suburban',
    image: 'https://images.pexels.com/photos/1370298/pexels-photo-1370298.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'
  },
  {
    id: 'grapevine',
    name: 'Grapevine',
    city: 'Dallas',
    region: 'North Texas',
    price: '$$',
    schoolRating: 'A',
    medianHomePrice: 425000,
    population: 51031,
    crimeRate: 1.3,
    avgCommute: 26,
    walkScore: 34,
    type: 'Historic',
    image: 'https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'
  },
  {
    id: 'pflugerville',
    name: 'Pflugerville',
    city: 'Austin',
    region: 'Central Texas',
    price: '$',
    schoolRating: 'B+',
    medianHomePrice: 315000,
    population: 65191,
    crimeRate: 1.2,
    avgCommute: 32,
    walkScore: 27,
    type: 'Suburban',
    image: 'https://images.pexels.com/photos/1370300/pexels-photo-1370300.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'
  },
  {
    id: 'georgetown',
    name: 'Georgetown',
    city: 'Austin',
    region: 'Central Texas',
    price: '$$',
    schoolRating: 'A',
    medianHomePrice: 345000,
    population: 75420,
    crimeRate: 1.0,
    avgCommute: 33,
    walkScore: 22,
    type: 'Historic',
    image: 'https://images.pexels.com/photos/2089704/pexels-photo-2089704.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'
  },
  {
    id: 'garland',
    name: 'Garland',
    city: 'Dallas',
    region: 'North Texas',
    price: '$',
    schoolRating: 'B',
    medianHomePrice: 245000,
    population: 246018,
    crimeRate: 2.3,
    avgCommute: 29,
    walkScore: 43,
    type: 'Urban',
    image: 'https://images.pexels.com/photos/323784/pexels-photo-323784.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'
  }
];

function ExplorePage() {
  const { user, isAuthenticated, logout } = useUser();
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
  
  // New modal states
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<CommunityCard[]>([]);
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [leadCaptureType, setLeadCaptureType] = useState<'contact_realtor' | 'schedule_tour' | 'get_pricing' | 'mortgage_calc'>('get_pricing');
  const [selectedCommunityName, setSelectedCommunityName] = useState('');
  
  // Autocomplete states
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  
  // Filter visibility state
  const [showFilters, setShowFilters] = useState(false);
  
  const communitiesPerPage = 12;

  // Load favorites from localStorage on component mount
  React.useEffect(() => {
    const savedFavorites = localStorage.getItem('texasCommunities_favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

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
    setSelectedForComparison(prev => {
      const isSelected = prev.find(c => c.id === community.id);
      if (isSelected) {
        return prev.filter(c => c.id !== community.id);
      } else if (prev.length < 4) {
        return [...prev, community];
      }
      return prev;
    });
  };

  const startComparison = () => {
    if (selectedForComparison.length > 0) {
      setShowComparison(true);
    }
  };

  // Convert CommunityCard to Community format for comparison
  const convertToComparisonCommunity = (community: CommunityCard) => ({
    id: community.id,
    name: community.name,
    location: `${community.city}, TX`,
    region: community.region as 'North Texas' | 'Central Texas' | 'East Texas',
    medianHomePrice: community.medianHomePrice,
    population: community.population,
    crimeRate: community.crimeRate,
    avgCommute: community.avgCommute,
    walkScore: community.walkScore,
    type: community.type as 'City' | 'Suburb' | 'Small Town',
    description: `Great community in ${community.city}`,
    keyFeatures: ['Family-friendly', 'Good schools'],
    schools: { elementary: 85, middle: 88, high: 90 },
    amenities: { parks: 85, restaurants: 78, shopping: 80, healthcare: 85 }
  });

  // Generate search suggestions
  const generateSuggestions = (query: string) => {
    if (!query.trim() || query.length < 2) return [];
    
    const suggestions: Array<{type: string, value: string, label: string}> = [];
    const lowerQuery = query.toLowerCase();
    
    // Community name suggestions
    sampleCommunities.forEach(community => {
      if (community.name.toLowerCase().includes(lowerQuery)) {
        suggestions.push({
          type: 'community',
          value: community.name,
          label: `${community.name} - ${community.city}`
        });
      }
    });
    
    // City suggestions
    const cities = [...new Set(sampleCommunities.map(c => c.city))];
    cities.forEach(city => {
      if (city.toLowerCase().includes(lowerQuery)) {
        suggestions.push({
          type: 'city',
          value: city,
          label: `${city} Area`
        });
      }
    });
    
    // Region suggestions
    const regions = [...new Set(sampleCommunities.map(c => c.region))];
    regions.forEach(region => {
      if (region.toLowerCase().includes(lowerQuery)) {
        suggestions.push({
          type: 'region',
          value: region,
          label: region
        });
      }
    });
    
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
    if (suggestion.type === 'community' || suggestion.type === 'city') {
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
  const filteredCommunities = sampleCommunities.filter(community => {
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
  }).sort((a, b) => {
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

  // Pagination logic
  const totalPages = Math.ceil(filteredCommunities.length / communitiesPerPage);
  const startIndex = (currentPage - 1) * communitiesPerPage;
  const paginatedCommunities = filteredCommunities.slice(startIndex, startIndex + communitiesPerPage);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, schoolRating, priceRange, selectedCity, communityType, regionFilter, populationFilter, commuteFilter, sortBy]);

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
              <Link to="/explore" className="text-blue-900 font-medium">
                Explore
              </Link>
              <Link to="/favorites" className="text-gray-700 hover:text-blue-900 font-medium transition-colors duration-200">
                Favorites
              </Link>
              <Link to="/reports" className="text-gray-700 hover:text-blue-900 font-medium transition-colors duration-200">
                Reports
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-blue-900 font-medium transition-colors duration-200">
                About
              </Link>
              
              {/* Comparison Button */}
              {selectedForComparison.length > 0 && (
                <button
                  onClick={startComparison}
                  className="flex items-center space-x-2 bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors duration-200"
                >
                  <Scale className="h-4 w-4" />
                  <span>Compare ({selectedForComparison.length})</span>
                </button>
              )}

              {/* User Authentication */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3 bg-blue-50 px-4 py-2 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">Welcome back!</span>
                      <span className="text-xs text-gray-600">{user?.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        // Show saved communities count or other user stats
                        alert(`You have ${user?.savedCommunities?.length || 0} saved communities and ${user?.searchHistory?.length || 0} searches in your history.`);
                      }}
                      className="text-sm text-blue-600 hover:text-blue-700 px-3 py-1 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                    >
                      My Profile
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to sign out?')) {
                          logout();
                        }
                      }}
                      className="text-sm text-gray-600 hover:text-gray-700 px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors duration-200 font-medium shadow-sm"
                >
                  Sign In / Register
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

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
                placeholder="Search communities, cities, regions..."
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
                        {suggestion.type === 'city' && <Search className="h-4 w-4 text-green-600" />}
                        {suggestion.type === 'region' && <MapPin className="h-4 w-4 text-purple-600" />}
                        <span className="font-medium">{suggestion.label}</span>
                        <span className="text-xs text-gray-500 capitalize">({suggestion.type})</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Filters Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm"
            >
              <Filter className="h-5 w-5" />
              Filters
              {showFilters ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Collapsible Filters Panel */}
          {showFilters && (
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
                {/* Metro Area Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Metro Area</label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all duration-200 bg-white"
                  >
                    <option value="Any">Any Metro Area</option>
                    <option value="Austin">Austin Area</option>
                    <option value="Dallas">Dallas Area</option>
                    <option value="Houston">Houston Area</option>
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
                  {filteredCommunities.length} communities found
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

      {/* Main Content - Zillow-style Layout */}
      <div className="flex h-screen">
        {/* Left Side - Map */}
        <div className="w-1/2 relative">
          <div 
            className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-lg font-medium"
          >
            <div className="text-center">
              <div className="mb-4">🗺️</div>
              <p>Interactive Map</p>
              <p className="text-sm mt-2">Map will show {filteredCommunities.length} communities</p>
            </div>
          </div>
          
          {/* Map Results Counter */}
          <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg px-3 py-2 border">
            <span className="text-sm font-medium text-gray-900">
              {paginatedCommunities.length} of {filteredCommunities.length} communities
            </span>
          </div>
        </div>

        {/* Right Side - Community Cards */}
        <div className="w-1/2 flex flex-col bg-white">
          {/* Results Header */}
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {filteredCommunities.length > 0 ? 'Texas Communities' : 'No Communities Found'}
              </h2>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
            </div>
          </div>
          {/* Scrollable Community Cards */}
          <div className="flex-1 overflow-y-auto">
            {filteredCommunities.length > 0 ? (
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  {paginatedCommunities.map((community) => (
                    <div key={community.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200">
                      {/* Community Image */}
                      <div className="w-full h-32 bg-gray-200 overflow-hidden relative">
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
                              checked={selectedForComparison.some(c => c.id === community.id)}
                              onChange={() => toggleComparisonSelection(community)}
                              disabled={!selectedForComparison.some(c => c.id === community.id) && selectedForComparison.length >= 4}
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
                    }}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Pagination Footer */}
          {filteredCommunities.length > 0 && totalPages > 1 && (
            <div className="border-t border-gray-200 bg-white px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {startIndex + 1} to {Math.min(startIndex + communitiesPerPage, filteredCommunities.length)} of {filteredCommunities.length} communities
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
                  
                  {/* Page Numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNumber = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
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

      {/* Comparison Tool */}
      {showComparison && (
        <ComparisonTool
          initialCommunities={selectedForComparison.map(convertToComparisonCommunity)}
          onClose={() => setShowComparison(false)}
        />
      )}

      {/* Lead Capture Modal */}
      <LeadCaptureModal
        isOpen={showLeadCapture}
        onClose={() => setShowLeadCapture(false)}
        communityName={selectedCommunityName}
        trigger={leadCaptureType}
      />
    </div>
  );
}

export default ExplorePage;