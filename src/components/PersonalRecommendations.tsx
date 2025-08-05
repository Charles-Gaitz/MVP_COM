import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Heart, TrendingUp, Star, MapPin, ArrowRight, Filter } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface RecommendationReason {
  type: 'preference_match' | 'behavior_based' | 'similar_users' | 'trending';
  reason: string;
  score: number;
}

interface CommunityRecommendation {
  id: string;
  name: string;
  city: string;
  price: string;
  schoolRating: string;
  image: string;
  matchScore: number;
  reasons: RecommendationReason[];
  isNew?: boolean;
  isTrending?: boolean;
}

interface PersonalRecommendationsProps {
  maxRecommendations?: number;
  showHeader?: boolean;
  className?: string;
}

export function PersonalRecommendations({ 
  maxRecommendations = 6, 
  showHeader = true,
  className = ""
}: PersonalRecommendationsProps) {
  const { user, isAuthenticated, getFavorites } = useUser();
  const [recommendations, setRecommendations] = useState<CommunityRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generatePersonalizedRecommendations();
  }, [user, isAuthenticated, generatePersonalizedRecommendations]);

  const generatePersonalizedRecommendations = useCallback(() => {
    setLoading(true);
    
    // Simulated recommendation algorithm
    setTimeout(() => {
      if (!user || !isAuthenticated) {
        // Generate generic popular recommendations for non-authenticated users
        const genericRecommendations = getGenericRecommendations();
        setRecommendations(genericRecommendations.slice(0, maxRecommendations));
      } else {
        // Generate personalized recommendations based on user data
        const personalizedRecs = getPersonalizedRecommendations();
        setRecommendations(personalizedRecs.slice(0, maxRecommendations));
      }
      setLoading(false);
    }, 800);
  }, [user, isAuthenticated, maxRecommendations, getFavorites]);

  const getPersonalizedRecommendations = (): CommunityRecommendation[] => {
    if (!user) return [];

    const favorites = getFavorites();
    const { preferences, searchHistory } = user;
    
    // Sample communities data (in real app, this would come from API)
    const allCommunities = [
      {
        id: 'austin-hills',
        name: 'Austin Hills',
        city: 'Austin',
        price: '$$',
        schoolRating: 'A',
        image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
        demographics: { familyFriendly: true, youngProfessionals: false },
        priceRange: [400000, 600000],
        amenities: ['schools', 'parks', 'shopping']
      },
      {
        id: 'tech-ridge',
        name: 'Tech Ridge',
        city: 'Austin',
        price: '$$$',
        schoolRating: 'A+',
        image: 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg',
        demographics: { familyFriendly: false, youngProfessionals: true },
        priceRange: [600000, 800000],
        amenities: ['tech_hub', 'nightlife', 'restaurants']
      },
      {
        id: 'family-grove',
        name: 'Family Grove',
        city: 'Houston',
        price: '$',
        schoolRating: 'B+',
        image: 'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg',
        demographics: { familyFriendly: true, youngProfessionals: false },
        priceRange: [250000, 400000],
        amenities: ['schools', 'parks', 'playgrounds']
      },
      {
        id: 'downtown-lofts',
        name: 'Downtown Lofts',
        city: 'Dallas',
        price: '$$$',
        schoolRating: 'B',
        image: 'https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg',
        demographics: { familyFriendly: false, youngProfessionals: true },
        priceRange: [500000, 900000],
        amenities: ['nightlife', 'restaurants', 'transit']
      }
    ];

    const recommendations: CommunityRecommendation[] = [];

    allCommunities.forEach(community => {
      const reasons: RecommendationReason[] = [];
      let matchScore = 0;

      // Price preference matching
      const userMinPrice = preferences.priceRange[0];
      const userMaxPrice = preferences.priceRange[1];
      const communityInRange = community.priceRange[0] <= userMaxPrice && community.priceRange[1] >= userMinPrice;
      
      if (communityInRange) {
        reasons.push({
          type: 'preference_match',
          reason: 'Matches your price range',
          score: 25
        });
        matchScore += 25;
      }

      // Search history analysis
      const searchedCities = searchHistory
        .map(search => search.query.toLowerCase())
        .filter(query => query.includes(community.city.toLowerCase()));
      
      if (searchedCities.length > 0) {
        reasons.push({
          type: 'behavior_based',
          reason: `You've searched for ${community.city} communities before`,
          score: 20
        });
        matchScore += 20;
      }

      // Favorite communities similarity
      if (favorites.length > 0) {
        // In real app, you'd analyze characteristics of favorited communities
        reasons.push({
          type: 'similar_users',
          reason: 'Similar to your favorited communities',
          score: 15
        });
        matchScore += 15;
      }

      // School rating preference (inferred from behavior)
      if (preferences.bedrooms >= 3 && community.schoolRating === 'A+') {
        reasons.push({
          type: 'preference_match',
          reason: 'Excellent schools for families',
          score: 20
        });
        matchScore += 20;
      }

      // Trending communities
      if (['tech-ridge', 'austin-hills'].includes(community.id)) {
        reasons.push({
          type: 'trending',
          reason: 'Popular with users like you',
          score: 10
        });
        matchScore += 10;
      }

      if (matchScore > 0) {
        recommendations.push({
          ...community,
          matchScore,
          reasons,
          isNew: Math.random() > 0.7,
          isTrending: matchScore > 40
        });
      }
    });

    // Sort by match score
    return recommendations.sort((a, b) => b.matchScore - a.matchScore);
  };

  const getGenericRecommendations = (): CommunityRecommendation[] => {
    // Popular communities for non-authenticated users
    return [
      {
        id: 'westlake',
        name: 'Westlake',
        city: 'Austin',
        price: '$$$',
        schoolRating: 'A+',
        image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
        matchScore: 85,
        reasons: [
          { type: 'trending', reason: 'Most popular this month', score: 85 }
        ],
        isTrending: true
      },
      {
        id: 'plano',
        name: 'Plano',
        city: 'Dallas',
        price: '$$',
        schoolRating: 'A',
        image: 'https://images.pexels.com/photos/1438834/pexels-photo-1438834.jpeg',
        matchScore: 80,
        reasons: [
          { type: 'trending', reason: 'Highly rated by families', score: 80 }
        ]
      }
    ];
  };

  const getReasonIcon = (type: RecommendationReason['type']) => {
    switch (type) {
      case 'preference_match': return <Filter className="h-3 w-3" />;
      case 'behavior_based': return <TrendingUp className="h-3 w-3" />;
      case 'similar_users': return <Heart className="h-3 w-3" />;
      case 'trending': return <Star className="h-3 w-3" />;
    }
  };

  const getReasonColor = (type: RecommendationReason['type']) => {
    switch (type) {
      case 'preference_match': return 'text-blue-600 bg-blue-50';
      case 'behavior_based': return 'text-green-600 bg-green-50';
      case 'similar_users': return 'text-purple-600 bg-purple-50';
      case 'trending': return 'text-orange-600 bg-orange-50';
    }
  };

  if (loading) {
    return (
      <div className={className}>
        {showHeader && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isAuthenticated ? 'Recommended for You' : 'Popular Communities'}
            </h2>
            <p className="text-gray-600">
              {isAuthenticated 
                ? 'Communities that match your preferences and interests'
                : 'Discover the most popular Texas communities'
              }
            </p>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(maxRecommendations)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
              <div className="w-full h-48 bg-gray-200"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3 mb-3"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className={className}>
        {showHeader && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Discover Communities</h2>
            <p className="text-gray-600">Start exploring to get personalized recommendations</p>
          </div>
        )}
        <div className="text-center py-12">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No recommendations available yet</p>
          <Link
            to="/explore"
            className="inline-flex items-center px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
          >
            Start Exploring
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {showHeader && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isAuthenticated ? 'Recommended for You' : 'Popular Communities'}
          </h2>
          <p className="text-gray-600">
            {isAuthenticated 
              ? 'Communities that match your preferences and interests'
              : 'Discover the most popular Texas communities'
            }
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((community) => (
          <div key={community.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 group">
            {/* Community Image */}
            <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
              <img
                src={community.image}
                alt={`${community.name} community`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {community.isTrending && (
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Trending
                  </span>
                )}
                {community.isNew && (
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    New
                  </span>
                )}
              </div>

              {/* Match Score */}
              {isAuthenticated && (
                <div className="absolute top-2 right-2">
                  <div className="bg-blue-900 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {community.matchScore}% match
                  </div>
                </div>
              )}
            </div>
            
            {/* Community Info */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {community.name}
              </h3>
              <p className="text-gray-600 mb-3">{community.city} Metro Area</p>
              
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-gray-700">
                  Price: <span className="text-blue-900 font-semibold">{community.price}</span>
                </span>
                <span className="text-sm font-medium text-gray-700">
                  School: <span className="text-green-600 font-semibold">{community.schoolRating}</span>
                </span>
              </div>

              {/* Recommendation Reasons */}
              {isAuthenticated && community.reasons.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-700 mb-2">Why we recommend this:</p>
                  <div className="space-y-1">
                    {community.reasons.slice(0, 2).map((reason, index) => (
                      <div
                        key={index}
                        className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${getReasonColor(reason.type)}`}
                      >
                        {getReasonIcon(reason.type)}
                        <span className="ml-1">{reason.reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <Link
                to={`/community/${community.id}`}
                className="w-full inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-white bg-blue-900 hover:bg-blue-800 rounded-lg transition-colors duration-200"
              >
                View Details
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {isAuthenticated && (
        <div className="mt-6 text-center">
          <button
            onClick={generatePersonalizedRecommendations}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Refresh Recommendations
          </button>
        </div>
      )}
    </div>
  );
}

export default PersonalRecommendations;
