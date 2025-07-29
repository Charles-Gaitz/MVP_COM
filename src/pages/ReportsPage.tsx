import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MapPin, FileText, Plus, X, Download, BarChart3, TrendingUp, Home, GraduationCap, Shield, DollarSign, Heart } from 'lucide-react';

// Import community data (you might want to move this to a shared file)
const sampleCommunities = [
  {
    id: 'westlake',
    name: 'Westlake',
    city: 'Austin',
    price: '$$$',
    schoolRating: 'A+',
    medianHomePrice: 485000,
    population: 3438,
    crimeRate: 0.8,
    avgCommute: 28,
    walkScore: 25,
    image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'
  },
  {
    id: 'plano',
    name: 'Plano',
    city: 'Dallas',
    price: '$$',
    schoolRating: 'A',
    medianHomePrice: 425000,
    population: 285494,
    crimeRate: 1.2,
    avgCommute: 26,
    walkScore: 42,
    image: 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'
  },
  {
    id: 'katy',
    name: 'Katy',
    city: 'Houston',
    price: '$$',
    schoolRating: 'A',
    medianHomePrice: 385000,
    population: 21894,
    crimeRate: 1.1,
    avgCommute: 32,
    walkScore: 28,
    image: 'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'
  },
  {
    id: 'frisco',
    name: 'Frisco',
    city: 'Dallas',
    price: '$$$',
    schoolRating: 'A+',
    medianHomePrice: 520000,
    population: 200509,
    crimeRate: 0.9,
    avgCommute: 24,
    walkScore: 35,
    image: 'https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'
  },
  {
    id: 'sugar-land',
    name: 'Sugar Land',
    city: 'Houston',
    price: '$$',
    schoolRating: 'A',
    medianHomePrice: 445000,
    population: 118486,
    crimeRate: 1.0,
    avgCommute: 29,
    walkScore: 38,
    image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'
  },
  {
    id: 'round-rock',
    name: 'Round Rock',
    city: 'Austin',
    price: '$$',
    schoolRating: 'A',
    medianHomePrice: 395000,
    population: 133372,
    crimeRate: 1.3,
    avgCommute: 25,
    walkScore: 31,
    image: 'https://images.pexels.com/photos/2089698/pexels-photo-2089698.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'
  }
];

interface Community {
  id: string;
  name: string;
  city: string;
  price: string;
  schoolRating: string;
  medianHomePrice: number;
  population: number;
  crimeRate: number;
  avgCommute: number;
  walkScore: number;
  image: string;
}

function ReportsPage() {
  const [searchParams] = useSearchParams();
  const [selectedCommunities, setSelectedCommunities] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Check if a community ID was passed in the URL
  useEffect(() => {
    const communityId = searchParams.get('community');
    if (communityId && !selectedCommunities.includes(communityId)) {
      setSelectedCommunities([communityId]);
    }
  }, [searchParams, selectedCommunities]);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('texasCommunities_favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const addCommunity = (communityId: string) => {
    if (!selectedCommunities.includes(communityId) && selectedCommunities.length < 4) {
      setSelectedCommunities([...selectedCommunities, communityId]);
    }
  };

  const removeCommunity = (communityId: string) => {
    setSelectedCommunities(selectedCommunities.filter(id => id !== communityId));
  };

  const selectedCommunitiesData = selectedCommunities
    .map(id => sampleCommunities.find(c => c.id === id))
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
                Reports
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Reports & Comparison</h1>
              <p className="text-gray-600">
                Generate detailed reports and compare up to 4 Texas communities side by side.
              </p>
            </div>
            {selectedCommunitiesData.length > 0 && (
              <button
                onClick={generatePDF}
                className="inline-flex items-center px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors duration-200"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF Report
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
                  .filter(community => !selectedCommunities.includes(community.id))
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
                    .filter(community => !selectedCommunities.includes(community.id))
                    .map((community) => (
                      <button
                        key={community.id}
                        onClick={() => addCommunity(community.id)}
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
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportsPage;
