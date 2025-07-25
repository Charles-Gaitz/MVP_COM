import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Search } from 'lucide-react';

interface CommunityCard {
  id: string;
  name: string;
  city: string;
  price: string;
  schoolRating: string;
  image: string;
}

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
  }
];

function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [schoolRating, setSchoolRating] = useState('Any');
  const [priceRange, setPriceRange] = useState('Any');

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
            <Link to="/about" className="text-gray-700 hover:text-blue-900 font-medium transition-colors duration-200">
              About
            </Link>
          </div>
        </div>
      </nav>

      {/* Sticky Filter Bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search cities, regions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all duration-200"
              />
            </div>

            {/* School Rating Dropdown */}
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={schoolRating}
                onChange={(e) => setSchoolRating(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all duration-200 bg-white"
              >
                <option value="Any">School Rating</option>
                <option value="A+">A+</option>
                <option value="A">A</option>
                <option value="B+">B+</option>
                <option value="B">B</option>
              </select>

              {/* Price Range Dropdown */}
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all duration-200 bg-white"
              >
                <option value="Any">Price Range</option>
                <option value="$">$</option>
                <option value="$$">$$</option>
                <option value="$$$">$$$</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Map */}
          <div className="lg:w-[70%]">
            <div 
              className="bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-lg font-medium"
              style={{ width: '100%', height: '600px' }}
            >
              Interactive Map Here
            </div>
          </div>

          {/* Right Column - Community Cards */}
          <div className="lg:w-[30%]">
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {sampleCommunities.map((community) => (
                <div key={community.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                  {/* Community Image */}
                  <div className="w-full h-[180px] bg-gray-200 overflow-hidden">
                    <img
                      src={community.image}
                      alt={`${community.name} community`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Community Info */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {community.name}
                    </h3>
                    <p className="text-gray-600 mb-2">{community.city}</p>
                    
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium text-gray-700">
                        Price: <span className="text-blue-900">{community.price}</span>
                      </span>
                      <span className="text-sm font-medium text-gray-700">
                        School: <span className="text-green-600">{community.schoolRating}</span>
                      </span>
                    </div>
                    
                    <Link
                      to={`/community/${community.id}`}
                      className="w-full inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-white bg-blue-900 hover:bg-blue-800 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExplorePage;