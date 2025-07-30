import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import LocalNewsSection from './components/LocalNewsSection';

function App() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="relative z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 text-gray-900 hover:text-blue-900 transition-colors duration-200">
              <MapPin className="h-8 w-8 text-blue-900" />
              <span className="text-xl font-bold">TexasCommunities</span>
            </Link>
            
            {/* Navigation Links */}
            <div className="flex items-center space-x-6">
              <Link 
                to="/explore" 
                className="text-gray-700 hover:text-blue-900 font-medium transition-colors duration-200"
              >
                Explore
              </Link>
              <Link 
                to="/favorites" 
                className="text-gray-700 hover:text-blue-900 font-medium transition-colors duration-200"
              >
                Favorites
              </Link>
              <Link 
                to="/reports" 
                className="text-gray-700 hover:text-blue-900 font-medium transition-colors duration-200"
              >
                Compare
              </Link>
              <Link 
                to="/about" 
                className="text-gray-700 hover:text-blue-900 font-medium transition-colors duration-200"
              >
                About
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative">
        {/* Hero Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 62, 144, 0.3), rgba(0, 62, 144, 0.4)), url('https://images.pexels.com/photos/1634016/pexels-photo-1634016.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop')`
          }}
        />
        
        {/* Hero Content */}
        <div className="relative min-h-[85vh] flex items-center justify-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Discover Your Ideal Texas Community
            </h1>
            
            {/* Sub-tagline */}
            <p className="text-xl sm:text-2xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
              Compare schools, prices, and vibes before you move.
            </p>
            
            {/* Primary CTA Button */}
            <Link
              to="/explore"
              className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-900/50"
            >
              Explore Communities
            </Link>
          </div>
        </div>
      </div>

      {/* Features Preview Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* School Ratings */}
            <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏫</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">School Ratings</h3>
              <p className="text-gray-600">Compare academic performance and school district quality across Texas communities.</p>
            </div>
            
            {/* Housing Prices */}
            <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏠</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Housing Prices</h3>
              <p className="text-gray-600">Get real-time market data and price trends for homes in your target areas.</p>
            </div>
            
            {/* Community Vibes */}
            <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌟</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Vibes</h3>
              <p className="text-gray-600">Discover the unique character and lifestyle of each Texas neighborhood.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Local News Section */}
      <LocalNewsSection />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <MapPin className="h-6 w-6 text-blue-400" />
              <span className="text-lg font-bold">TexasCommunities</span>
            </div>
            <p className="text-gray-400 text-center md:text-right">
              © 2025 TexasCommunities. Helping you find your perfect Texas home.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;