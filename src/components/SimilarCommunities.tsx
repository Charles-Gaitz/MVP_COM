import { Link } from 'react-router-dom';
import { MapPin, Home, GraduationCap, Users, ArrowRight, Heart } from 'lucide-react';

interface Community {
  id: string;
  name: string;
  city: string;
  medianPrice: string;
  schoolRating: string;
  population: string;
  image: string;
  matchScore: number;
  matchReasons: string[];
}

interface SimilarCommunitiesProps {
  currentCommunityId: string;
  currentCommunityName: string;
}

export function SimilarCommunities({ currentCommunityId, currentCommunityName }: SimilarCommunitiesProps) {
  // Sample similar communities data - in a real app, this would come from an API
  const getSimilarCommunities = (currentId: string): Community[] => {
    const allCommunities: Community[] = [
      {
        id: 'westlake',
        name: 'Westlake',
        city: 'Austin',
        medianPrice: '$485,000',
        schoolRating: 'A+',
        population: '42,850',
        image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
        matchScore: 95,
        matchReasons: ['Similar home prices', 'Excellent schools', 'Family-friendly']
      },
      {
        id: 'plano',
        name: 'Plano',
        city: 'Dallas',
        medianPrice: '$450,000',
        schoolRating: 'A+',
        population: '285,494',
        image: 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
        matchScore: 88,
        matchReasons: ['Top-rated schools', 'Growing tech sector', 'Safe neighborhoods']
      },
      {
        id: 'katy',
        name: 'Katy',
        city: 'Houston',
        medianPrice: '$425,000',
        schoolRating: 'A',
        population: '21,894',
        image: 'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
        matchScore: 85,
        matchReasons: ['Similar community size', 'Great amenities', 'Family-oriented']
      },
      {
        id: 'frisco',
        name: 'Frisco',
        city: 'Dallas',
        medianPrice: '$520,000',
        schoolRating: 'A+',
        population: '200,509',
        image: 'https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
        matchScore: 92,
        matchReasons: ['Premium location', 'Top schools', 'Modern amenities']
      },
      {
        id: 'allen',
        name: 'Allen',
        city: 'Dallas',
        medianPrice: '$470,000',
        schoolRating: 'A',
        population: '105,623',
        image: 'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
        matchScore: 87,
        matchReasons: ['Comparable prices', 'Family community', 'Good schools']
      },
      {
        id: 'sugarland',
        name: 'Sugar Land',
        city: 'Houston',
        medianPrice: '$510,000',
        schoolRating: 'A+',
        population: '118,486',
        image: 'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
        matchScore: 90,
        matchReasons: ['Diverse community', 'Excellent schools', 'Safe area']
      }
    ];

    // Filter out current community and return top 3 similar ones
    return allCommunities
      .filter(community => community.id !== currentId)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3);
  };

  const similarCommunities = getSimilarCommunities(currentCommunityId);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Similar Communities</h2>
            <p className="text-gray-600 text-sm mt-1">
              Communities like {currentCommunityName} you might also love
            </p>
          </div>
          <Link 
            to="/explore" 
            className="inline-flex items-center text-blue-900 hover:text-blue-800 font-medium text-sm transition-colors duration-200"
          >
            View All
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {similarCommunities.map((community) => (
            <div key={community.id} className="group relative">
              <Link to={`/community/${community.id}`} className="block">
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
                  {/* Community Image */}
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={community.image}
                      alt={community.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    {/* Match Score Badge */}
                    <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                      {community.matchScore}% match
                    </div>
                    {/* Favorite Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        // Handle favorite toggle
                        console.log('Toggle favorite for', community.id);
                      }}
                      className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                    >
                      <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
                    </button>
                  </div>

                  {/* Community Info */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-900 transition-colors duration-200">
                        {community.name}
                      </h3>
                    </div>
                    
                    <div className="flex items-center text-gray-600 text-sm mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{community.city}, Texas</span>
                    </div>

                    {/* Quick Stats */}
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-600">
                          <Home className="h-4 w-4 mr-2" />
                          <span>Median Price</span>
                        </div>
                        <span className="font-semibold text-gray-900">{community.medianPrice}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-600">
                          <GraduationCap className="h-4 w-4 mr-2" />
                          <span>Schools</span>
                        </div>
                        <span className="font-semibold text-green-600">{community.schoolRating}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-600">
                          <Users className="h-4 w-4 mr-2" />
                          <span>Population</span>
                        </div>
                        <span className="font-semibold text-gray-900">{community.population}</span>
                      </div>
                    </div>

                    {/* Match Reasons */}
                    <div className="border-t border-gray-100 pt-3">
                      <p className="text-xs text-gray-500 mb-2">Why it's similar:</p>
                      <div className="flex flex-wrap gap-1">
                        {community.matchReasons.slice(0, 2).map((reason, index) => (
                          <span
                            key={index}
                            className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full"
                          >
                            {reason}
                          </span>
                        ))}
                        {community.matchReasons.length > 2 && (
                          <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                            +{community.matchReasons.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* View More Link */}
        <div className="text-center mt-6">
          <Link
            to="/explore"
            className="inline-flex items-center px-4 py-2 text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-lg font-medium transition-colors duration-200"
          >
            Explore More Communities
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}
