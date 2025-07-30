import { useState } from 'react';
import { Search, Filter, MapPin, Home, Building } from 'lucide-react';

interface SearchResult {
  id: string;
  name: string;
  type: 'community' | 'neighborhood' | 'city';
  location: string;
  price?: number;
  description: string;
}

interface EnhancedSearchProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  onResultSelect: (result: SearchResult) => void;
  results: SearchResult[];
  isLoading?: boolean;
}

interface SearchFilters {
  type: 'all' | 'community' | 'neighborhood';
  priceRange: {
    min: number;
    max: number;
  };
  region: string;
}

export function EnhancedSearch({ onSearch, onResultSelect, results, isLoading = false }: EnhancedSearchProps) {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    type: 'all',
    priceRange: { min: 0, max: 2000000 },
    region: 'all'
  });

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    onSearch(newQuery, filters);
  };

  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onSearch(query, updatedFilters);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'neighborhood': return <Home className="w-4 h-4 text-green-600" />;
      case 'community': return <Building className="w-4 h-4 text-blue-600" />;
      case 'city': return <MapPin className="w-4 h-4 text-purple-600" />;
      default: return <MapPin className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'neighborhood': return 'Neighborhood';
      case 'community': return 'Community';
      case 'city': return 'City';
      default: return '';
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    }
    return `$${(price / 1000).toFixed(0)}K`;
  };

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          placeholder="Search communities, neighborhoods, or cities..."
        />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <Filter className={`h-5 w-5 transition-colors ${showFilters ? 'text-blue-600' : 'text-gray-400'}`} />
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange({ type: e.target.value as any })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="neighborhood">Neighborhoods</option>
                <option value="community">Communities</option>
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <select
                onChange={(e) => {
                  const [min, max] = e.target.value.split('-').map(Number);
                  handleFilterChange({ priceRange: { min, max } });
                }}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="0-2000000">Any Price</option>
                <option value="0-400000">Under $400K</option>
                <option value="400000-600000">$400K - $600K</option>
                <option value="600000-800000">$600K - $800K</option>
                <option value="800000-2000000">$800K+</option>
              </select>
            </div>

            {/* Region */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
              <select
                value={filters.region}
                onChange={(e) => handleFilterChange({ region: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Regions</option>
                <option value="north-texas">North Texas</option>
                <option value="central-texas">Central Texas</option>
                <option value="east-texas">East Texas</option>
                <option value="south-texas">South Texas</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Search Results */}
      {query && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-20">
          {results.map((result) => (
            <button
              key={`${result.type}-${result.id}`}
              onClick={() => onResultSelect(result)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {getTypeIcon(result.type)}
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-gray-900 truncate">{result.name}</h4>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {getTypeLabel(result.type)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{result.location}</p>
                  {result.description && (
                    <p className="text-xs text-gray-500 truncate mt-1">{result.description}</p>
                  )}
                </div>
                {result.price && (
                  <div className="flex-shrink-0 text-sm font-medium text-gray-900">
                    {formatPrice(result.price)}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-20">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-sm text-gray-600">Searching...</span>
          </div>
        </div>
      )}
    </div>
  );
}
