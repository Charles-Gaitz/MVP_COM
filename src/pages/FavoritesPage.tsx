import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Heart, Search } from 'lucide-react';

interface CommunityCard {
  id: string;
  name: string;
  city: string;
  price: string;
  schoolRating: string;
  image: string;
}

// Import the same communities data (you might want to move this to a shared file)
const sampleCommunities: CommunityCard[] = [
  {
    id: 'westlake',
    name: 'Westlake',
    city: 'Austin',
    price: '$$$',
    schoolRating: 'A+',
    image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'
  },
  {
    id: 'plano',
    name: 'Plano',
    city: 'Dallas',
    price: '$$',
    schoolRating: 'A',
    image: 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'
  },
  {
    id: 'katy',
    name: 'Katy',
    city: 'Houston',
    price: '$$',
    schoolRating: 'A',
    image: 'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'
  },
  {
    id: 'frisco',
    name: 'Frisco',
    city: 'Dallas',
    price: '$$$',
    schoolRating: 'A+',
    image: 'https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'
  },
  {
    id: 'sugar-land',
    name: 'Sugar Land',
    city: 'Houston',
    price: '$$',
    schoolRating: 'A',
    image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'
  },
  {
    id: 'round-rock',
    name: 'Round Rock',
    city: 'Austin',
    price: '$$',
    schoolRating: 'A',
    image: 'https://images.pexels.com/photos/2089698/pexels-photo-2089698.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'
  },
  {
    id: 'allen',
    name: 'Allen',
    city: 'Dallas',
    price: '$$',
    schoolRating: 'A+',
    image: 'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'
  },
  {
    id: 'pearland',
    name: 'Pearland',
    city: 'Houston',
    price: '$$',
    schoolRating: 'A',
    image: 'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'
  },
  {
    id: 'cedar-park',
    name: 'Cedar Park',
    city: 'Austin',
    price: '$$',
    schoolRating: 'A',
    image: 'https://images.pexels.com/photos/1396115/pexels-photo-1396115.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'
  },
  {
    id: 'mckinney',
    name: 'McKinney',
    city: 'Dallas',
    price: '$$',
    schoolRating: 'A+',
    image: 'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'
  },
  {
    id: 'the-woodlands',
    name: 'The Woodlands',
    city: 'Houston',
    price: '$$$',
    schoolRating: 'A+',
    image: 'https://images.pexels.com/photos/1396117/pexels-photo-1396117.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'
  },
  {
    id: 'southlake',
    name: 'Southlake',
    city: 'Dallas',
    price: '$$$',
    schoolRating: 'A+',
    image: 'https://images.pexels.com/photos/1438834/pexels-photo-1438834.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'
  },
  {
    id: 'flower-mound',
    name: 'Flower Mound',
    city: 'Dallas',
    price: '$$',
    schoolRating: 'A',
    image: 'https://images.pexels.com/photos/280221/pexels-photo-280221.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'
  },
  {
    id: 'leander',
    name: 'Leander',
    city: 'Austin',
    price: '$',
    schoolRating: 'B+',
    image: 'https://images.pexels.com/photos/1396119/pexels-photo-1396119.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'
  },
  {
    id: 'richardson',
    name: 'Richardson',
    city: 'Dallas',
    price: '$$',
    schoolRating: 'A',
    image: 'https://images.pexels.com/photos/323776/pexels-photo-323776.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'
  },
  {
    id: 'spring',
    name: 'Spring',
    city: 'Houston',
    price: '$',
    schoolRating: 'B+',
    image: 'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'
  },
  {
    id: 'carrollton',
    name: 'Carrollton',
    city: 'Dallas',
    price: '$',
    schoolRating: 'B+',
    image: 'https://images.pexels.com/photos/2089701/pexels-photo-2089701.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'
  },
  {
    id: 'league-city',
    name: 'League City',
    city: 'Houston',
    price: '$$',
    schoolRating: 'A',
    image: 'https://images.pexels.com/photos/1370298/pexels-photo-1370298.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'
  },
  {
    id: 'grapevine',
    name: 'Grapevine',
    city: 'Dallas',
    price: '$$',
    schoolRating: 'A',
    image: 'https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'
  },
  {
    id: 'pflugerville',
    name: 'Pflugerville',
    city: 'Austin',
    price: '$',
    schoolRating: 'B+',
    image: 'https://images.pexels.com/photos/1370300/pexels-photo-1370300.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'
  },
  {
    id: 'cypress',
    name: 'Cypress',
    city: 'Houston',
    price: '$',
    schoolRating: 'B',
    image: 'https://images.pexels.com/photos/323783/pexels-photo-323783.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'
  },
  {
    id: 'coppell',
    name: 'Coppell',
    city: 'Dallas',
    price: '$$$',
    schoolRating: 'A+',
    image: 'https://images.pexels.com/photos/1438835/pexels-photo-1438835.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'
  },
  {
    id: 'humble',
    name: 'Humble',
    city: 'Houston',
    price: '$',
    schoolRating: 'B',
    image: 'https://images.pexels.com/photos/1029600/pexels-photo-1029600.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'
  },
  {
    id: 'georgetown',
    name: 'Georgetown',
    city: 'Austin',
    price: '$$',
    schoolRating: 'A',
    image: 'https://images.pexels.com/photos/2089704/pexels-photo-2089704.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'
  },
  {
    id: 'garland',
    name: 'Garland',
    city: 'Dallas',
    price: '$',
    schoolRating: 'B',
    image: 'https://images.pexels.com/photos/323784/pexels-photo-323784.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'
  }
];

function FavoritesPage() {
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('texasCommunities_favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const toggleFavorite = (communityId: string) => {
    const newFavorites = favorites.filter(id => id !== communityId);
    setFavorites(newFavorites);
    localStorage.setItem('texasCommunities_favorites', JSON.stringify(newFavorites));
  };

  // Get favorite communities
  const favoriteCommunities = sampleCommunities.filter(community => 
    favorites.includes(community.id)
  );

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
              <Link to="/favorites" className="text-blue-900 font-medium">
                Favorites
              </Link>
              <Link to="/reports" className="text-gray-700 hover:text-blue-900 font-medium transition-colors duration-200">
                Compare
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-blue-900 font-medium transition-colors duration-200">
                About
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Favorite Communities</h1>
          <p className="text-gray-600">
            {favoriteCommunities.length} {favoriteCommunities.length === 1 ? 'community' : 'communities'} saved
          </p>
        </div>

        {/* Favorites Grid */}
        {favoriteCommunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteCommunities.map((community) => (
              <div key={community.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                {/* Community Image */}
                <div className="relative w-full h-[200px] bg-gray-200 overflow-hidden">
                  <img
                    src={community.image}
                    alt={`${community.name} community`}
                    className="w-full h-full object-cover"
                  />
                  {/* Remove from Favorites Button */}
                  <button
                    onClick={() => toggleFavorite(community.id)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200"
                    title="Remove from favorites"
                  >
                    <Heart className="h-4 w-4 fill-current" />
                  </button>
                </div>
                
                {/* Community Info */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {community.name}
                  </h3>
                  <p className="text-gray-600 mb-3">{community.city} Metro Area</p>
                  
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-medium text-gray-700">
                      Price: <span className="text-blue-900 font-semibold">{community.price}</span>
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      School: <span className="text-green-600 font-semibold">{community.schoolRating}</span>
                    </span>
                  </div>
                  
                  <Link
                    to={`/community/${community.id}`}
                    className="w-full inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-white bg-blue-900 hover:bg-blue-800 rounded-lg transition-colors duration-200"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-6">
              <Heart className="h-16 w-16 mx-auto mb-4" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">No Favorite Communities Yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start exploring Texas communities and click the heart icon to save your favorites here.
            </p>
            <Link
              to="/explore"
              className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-blue-900 hover:bg-blue-800 rounded-lg transition-colors duration-200"
            >
              <Search className="h-5 w-5 mr-2" />
              Explore Communities
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default FavoritesPage;
