import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Users, Target, Award, Heart, Shield, TrendingUp, Home, GraduationCap, Search } from 'lucide-react';

function AboutPage() {
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
              <Link to="/reports" className="text-gray-700 hover:text-blue-900 font-medium transition-colors duration-200">
                Reports
              </Link>
              <Link to="/about" className="text-blue-900 font-medium">
                About
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop')`
          }}
        ></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Back Button */}
          <Link 
            to="/" 
            className="inline-flex items-center text-white/90 hover:text-white mb-8 font-medium transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
              About TexasCommunities
            </h1>
            <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Your trusted guide to finding the perfect Texas community, powered by comprehensive data and local insights.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Mission Statement */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
            <Target className="h-8 w-8 text-blue-900" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We believe that choosing where to live is one of life's most important decisions. TexasCommunities exists to make that choice easier, more informed, and more confident by providing comprehensive, reliable data about Texas communities alongside the tools to compare and analyze what matters most to you.
          </p>
        </div>

        {/* What Makes Us Different */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">What Makes Us Different</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow duration-200">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Comprehensive Data</h3>
              <p className="text-gray-600 text-sm">
                We aggregate data from multiple trusted sources including schools, crime statistics, housing markets, and local amenities to give you the complete picture.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow duration-200">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Smart Comparisons</h3>
              <p className="text-gray-600 text-sm">
                Our advanced comparison tools let you evaluate up to 4 communities side-by-side with color-coded metrics that make differences clear at a glance.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow duration-200">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
                <Heart className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Personalized Experience</h3>
              <p className="text-gray-600 text-sm">
                Save your favorite communities, generate custom reports, and filter results based on what matters most to your family's unique needs.
              </p>
            </div>

          </div>
        </div>

        {/* Key Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Platform Features</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                    <Search className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Advanced Search & Filtering</h3>
                  <p className="text-gray-600">
                    Find communities that match your criteria with powerful filters for price range, school ratings, commute times, and more.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
                    <Home className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Detailed Community Profiles</h3>
                  <p className="text-gray-600">
                    Each community page includes comprehensive information about housing, schools, safety, demographics, and local amenities.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-lg">
                    <GraduationCap className="h-5 w-5 text-yellow-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">School District Information</h3>
                  <p className="text-gray-600">
                    Access detailed school ratings, test scores, and district boundaries to make informed decisions for your family's education needs.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-red-100 rounded-lg">
                    <Heart className="h-5 w-5 text-red-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Favorites & Saved Lists</h3>
                  <p className="text-gray-600">
                    Save communities you're interested in and easily access them later for comparison and detailed analysis.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-lg">
                    <Award className="h-5 w-5 text-indigo-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Custom Reports</h3>
                  <p className="text-gray-600">
                    Generate detailed PDF reports comparing multiple communities with all the data and insights you need to make your decision.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-teal-100 rounded-lg">
                    <MapPin className="h-5 w-5 text-teal-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Interactive Maps</h3>
                  <p className="text-gray-600">
                    Explore community boundaries, nearby amenities, schools, and points of interest with integrated mapping technology.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Data Sources */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Trusted Data Sources</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our platform aggregates information from reliable, authoritative sources to ensure you have access to accurate, up-to-date community data.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Schools</h4>
                <p className="text-sm text-gray-600">GreatSchools.org</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Real Estate</h4>
                <p className="text-sm text-gray-600">Zillow, Realtor.com</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Demographics</h4>
                <p className="text-sm text-gray-600">U.S. Census Bureau</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Safety</h4>
                <p className="text-sm text-gray-600">FBI Crime Data</p>
              </div>
            </div>
          </div>
        </div>

        {/* Our Story */}
        <div className="mb-16">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="prose prose-lg text-gray-600 max-w-none space-y-4">
              <p>
                TexasCommunities was born from a simple observation: finding the right place to live in Texas shouldn't be overwhelming. With hundreds of communities across the state, each with its own character, amenities, and advantages, families need a reliable way to cut through the noise and focus on what truly matters.
              </p>
              <p>
                Our team combines expertise in data science, real estate, and user experience design to create a platform that doesn't just show you numbers—it helps you understand what those numbers mean for your daily life, your family's future, and your long-term happiness.
              </p>
              <p>
                Whether you're a first-time homebuyer, relocating for work, or looking to upgrade to a community that better fits your lifestyle, TexasCommunities is here to guide you every step of the way.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Find Your Perfect Texas Community?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Start exploring our comprehensive database of Texas communities, compare your favorites, and generate detailed reports to make your next move with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/explore"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              Start Exploring Communities
            </Link>
            <Link
              to="/reports"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-800 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 border border-blue-700"
            >
              Generate a Report
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AboutPage;
