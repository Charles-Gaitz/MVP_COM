import { useState } from 'react';
import { ChevronDown, ChevronUp, MapPin, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NeighborhoodCard } from './NeighborhoodCard';
import { getNeighborhoodsByCommunity } from '../data/neighborhoods';

interface CommunityNeighborhoodsProps {
  communityId: string;
  communityName: string;
}

export function CommunityNeighborhoods({ communityId, communityName }: CommunityNeighborhoodsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const neighborhoods = getNeighborhoodsByCommunity(communityId);

  if (neighborhoods.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
      {/* Header */}
      <div 
        className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
            <MapPin className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {communityName} Neighborhoods
            </h2>
            <p className="text-sm text-gray-600">
              Explore {neighborhoods.length} neighborhood{neighborhoods.length !== 1 ? 's' : ''} in this area
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {isExpanded ? 'Hide' : 'Show'} Details
          </span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {neighborhoods.map((neighborhood) => (
              <NeighborhoodCard 
                key={neighborhood.id} 
                neighborhood={neighborhood}
                showCommunity={false}
              />
            ))}
          </div>
          
          {/* View All in Search Button */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <Link
              to={`/explore?searchType=neighborhoods&community=${communityId}`}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Search className="w-4 h-4 mr-2" />
              View All {communityName} Neighborhoods in Search
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
