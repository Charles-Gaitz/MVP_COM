import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Search, Users, TrendingUp, Heart, Shield, Star } from 'lucide-react';
import LocalNewsSection from './components/LocalNewsSection';
import { APIUsageDashboard } from './components/APIUsageDashboard';

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
      <div className="relative overflow-hidden">
        {/* Hero Background with Animated Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
          <div className="absolute inset-0 bg-black/20"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
            style={{
              backgroundImage: `url('https://images.pexels.com/photos/1634016/pexels-photo-1634016.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop')`
            }}
          />
          {/* Animated background elements */}
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative min-h-[90vh] flex items-center justify-center">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Main Content */}
              <div className="text-center lg:text-left">
                {/* Badge */}
                <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/90 text-sm font-medium mb-6">
                  <Star className="h-4 w-4 mr-2 text-yellow-400" />
                  Trusted by 10,000+ Families
                </div>
                
                {/* Main Headline */}
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                  Find Your
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                    Perfect
                  </span>
                  Texas Home
                </h1>
                
                {/* Sub-tagline */}
                <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Discover communities that match your lifestyle with comprehensive data, local insights, and smart comparisons.
                </p>
                
                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link
                    to="/explore"
                    className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
                  >
                    Start Exploring
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/reports"
                    className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 rounded-xl transition-all duration-200"
                  >
                    Compare Communities
                  </Link>
                </div>
              </div>
              
              {/* Right Column - Interactive Stats */}
              <div className="lg:block hidden">
                <div className="relative">
                  {/* Floating Cards */}
                  <div className="space-y-4">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 transform hover:scale-105 transition-all duration-300">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center">
                          <Search className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold text-lg">Smart Search</h3>
                          <p className="text-white/70">Find communities by lifestyle</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 transform hover:scale-105 transition-all duration-300 ml-8">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
                          <TrendingUp className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold text-lg">Live Data</h3>
                          <p className="text-white/70">Real-time market insights</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 transform hover:scale-105 transition-all duration-300">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
                          <Heart className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold text-lg">Save Favorites</h3>
                          <p className="text-white/70">Track your top choices</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Value Proposition Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Families Choose TexasCommunities
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We make finding your dream community simple with data-driven insights and personalized recommendations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Comprehensive Data */}
            <div className="group text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 border border-blue-100">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Trusted Data</h3>
              <p className="text-gray-600">Comprehensive information from verified sources including schools, safety, and market trends.</p>
            </div>
            
            {/* Smart Comparisons */}
            <div className="group text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-all duration-300 border border-green-100">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Insights</h3>
              <p className="text-gray-600">Advanced analytics and side-by-side comparisons to help you make informed decisions.</p>
            </div>
            
            {/* Personalized Experience */}
            <div className="group text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all duration-300 border border-purple-100">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Personal Touch</h3>
              <p className="text-gray-600">Save favorites, get recommendations, and track communities that match your family's needs.</p>
            </div>
            
            {/* Community Focus */}
            <div className="group text-center p-8 rounded-2xl bg-gradient-to-br from-orange-50 to-yellow-50 hover:from-orange-100 hover:to-yellow-100 transition-all duration-300 border border-orange-100">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Local Focus</h3>
              <p className="text-gray-600">Deep neighborhood insights, local events, and community reviews from real residents.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-900 to-indigo-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Find Your Dream Community?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of families who've found their perfect Texas home using our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/explore"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-blue-900 bg-white hover:bg-gray-100 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Start Your Search
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 rounded-xl transition-all duration-200"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* Personal Recommendations Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Featured Communities
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Discover some of the most popular communities in Texas.
            </p>
            <Link
              to="/explore"
              className="inline-flex items-center px-8 py-3 text-lg font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-200"
            >
              Explore All Communities
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
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

      {/* API Usage Dashboard - Developer Panel */}
      <APIUsageDashboard />
    </div>
  );
}

export default App;