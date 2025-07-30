import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Home, Users, DollarSign, GraduationCap, Star } from 'lucide-react';
import { Neighborhood } from '../data/neighborhoods';

interface NeighborhoodCardProps {
  neighborhood: Neighborhood;
  showCommunity?: boolean;
}

export function NeighborhoodCard({ neighborhood, showCommunity = true }: NeighborhoodCardProps) {
  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    }
    return `$${(price / 1000).toFixed(0)}K`;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Gated Community': return 'bg-purple-100 text-purple-800';
      case 'Master-Planned': return 'bg-blue-100 text-blue-800';
      case 'Mixed-Use': return 'bg-green-100 text-green-800';
      case 'Historic District': return 'bg-amber-100 text-amber-800';
      case 'Subdivision': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={neighborhood.image}
          alt={`${neighborhood.name} neighborhood`}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
        />
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(neighborhood.type)}`}>
            {neighborhood.type}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1">
            <span className="text-sm font-bold text-gray-900">
              {formatPrice(neighborhood.medianHomePrice)}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Header */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {neighborhood.name}
          </h3>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-1" />
            <span>
              {showCommunity && (
                <>
                  <Link 
                    to={`/community/${neighborhood.community}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {neighborhood.community.split('-').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </Link>
                  <span className="mx-1">•</span>
                </>
              )}
              {neighborhood.city}, TX
            </span>
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Home className="w-4 h-4 mr-2 text-blue-600" />
            <div>
              <div className="font-medium text-gray-900">{neighborhood.homes.total}</div>
              <div className="text-xs">Total Homes</div>
            </div>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Users className="w-4 h-4 mr-2 text-green-600" />
            <div>
              <div className="font-medium text-gray-900">{neighborhood.demographics.households}</div>
              <div className="text-xs">Households</div>
            </div>
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Price Range:</span>
            <span className="font-medium text-gray-900">
              {formatPrice(neighborhood.priceRange.min)} - {formatPrice(neighborhood.priceRange.max)}
            </span>
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {neighborhood.keyFeatures.slice(0, 3).map((feature, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md"
              >
                {feature}
              </span>
            ))}
            {neighborhood.keyFeatures.length > 3 && (
              <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-md">
                +{neighborhood.keyFeatures.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Market Activity */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <span>{neighborhood.homes.forSale} for sale</span>
          <span>{neighborhood.homes.recentSold} recently sold</span>
        </div>

        {/* Action Button */}
        <Link
          to={`/neighborhood/${neighborhood.id}`}
          className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
        >
          View Neighborhood Details
        </Link>
      </div>
    </div>
  );
}
