import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Home, GraduationCap, Users, Clock, Heart } from 'lucide-react';
import { CommunityReviews } from '../components/CommunityReviews';
import { LeadCaptureModal } from '../components/LeadCaptureModal';
import { SimilarCommunities } from '../components/SimilarCommunities';
import { MarketTrends } from '../components/MarketTrends';
import { SchoolDistrictDetails } from '../components/SchoolDistrictDetails';
import { TrafficPatterns } from '../components/TrafficPatterns';
import { NearbyAmenities } from '../components/NearbyAmenities';
import { EmploymentData } from '../components/EmploymentData';
import { ClimateWeather } from '../components/ClimateWeather';
import { PhotoGalleries } from '../components/PhotoGalleries';
import { VirtualTours } from '../components/VirtualTours';
import { CommunityEvents } from '../components/CommunityEvents';
import { updatePageSEO, generateCommunityStructuredData } from '../utils/seo';

function CommunityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [leadCaptureType, setLeadCaptureType] = useState<'contact_realtor' | 'schedule_tour' | 'get_pricing' | 'mortgage_calc'>('contact_realtor');

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('texasCommunities_favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Update SEO when component mounts or ID changes
  useEffect(() => {
    if (id) {
      const communityName = communityData.name;
      const cityName = communityData.city;
      
      // Update page SEO
      updatePageSEO({
        title: `${communityName}, ${cityName} Texas - Community Guide & Real Estate | TexasCommunities`,
        description: `Discover ${communityName} in ${cityName}, Texas. View schools, housing market trends, amenities, and community insights. Find homes and connect with local experts.`,
        keywords: `${communityName} Texas, ${cityName} real estate, ${communityName} homes, ${cityName} schools, Texas communities, ${communityName} housing market`,
        url: `https://texascommunities.com/community/${id}`,
        image: communityData.heroImage,
        type: 'website'
      });

      // Add structured data
      generateCommunityStructuredData({
        name: communityName,
        city: cityName,
        state: 'Texas',
        description: `${communityName} is a vibrant community in ${cityName}, Texas, offering excellent schools, diverse housing options, and rich amenities.`,
        medianPrice: 485000, // This would come from real data
        schoolRating: 'A+',
        population: 42850,
        amenities: ['Schools', 'Parks', 'Shopping', 'Healthcare', 'Recreation']
      });
    }
  }, [id]); // Simplified dependency array

  const toggleFavorite = (communityId: string) => {
    const newFavorites = favorites.includes(communityId)
      ? favorites.filter(fav => fav !== communityId)
      : [...favorites, communityId];
    
    setFavorites(newFavorites);
    localStorage.setItem('texasCommunities_favorites', JSON.stringify(newFavorites));
  };

  const isFavorite = id ? favorites.includes(id) : false;

  // Community data lookup
  const communityDataMap: Record<string, { name: string; city: string; heroImage: string }> = {
    'westlake': {
      name: 'Westlake',
      city: 'Austin',
      heroImage: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop'
    },
    'plano': {
      name: 'Plano',
      city: 'Dallas',
      heroImage: 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop'
    },
    'katy': {
      name: 'Katy',
      city: 'Houston',
      heroImage: 'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop'
    },
    'frisco': {
      name: 'Frisco',
      city: 'Dallas',
      heroImage: 'https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop'
    },
    'sugar-land': {
      name: 'Sugar Land',
      city: 'Houston',
      heroImage: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop'
    },
    'round-rock': {
      name: 'Round Rock',
      city: 'Austin',
      heroImage: 'https://images.pexels.com/photos/2089698/pexels-photo-2089698.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop'
    },
    'allen': {
      name: 'Allen',
      city: 'Dallas',
      heroImage: 'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop'
    },
    'pearland': {
      name: 'Pearland',
      city: 'Houston',
      heroImage: 'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop'
    },
    'cedar-park': {
      name: 'Cedar Park',
      city: 'Austin',
      heroImage: 'https://images.pexels.com/photos/1396115/pexels-photo-1396115.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop'
    },
    'mckinney': {
      name: 'McKinney',
      city: 'Dallas',
      heroImage: 'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop'
    },
    'the-woodlands': {
      name: 'The Woodlands',
      city: 'Houston',
      heroImage: 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop'
    }
  };

  // Get community data based on ID, with fallback
  const communityData = id && communityDataMap[id] 
    ? communityDataMap[id]
    : { name: 'Community', city: 'Texas', heroImage: 'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop' };

  // Update SEO when component mounts or ID changes
  useEffect(() => {
    if (id) {
      const communityName = communityData.name;
      const cityName = communityData.city;
      
      // Update page SEO
      updatePageSEO({
        title: `${communityName}, ${cityName} Texas - Community Guide & Real Estate | TexasCommunities`,
        description: `Discover ${communityName} in ${cityName}, Texas. View schools, housing market trends, amenities, and community insights. Find homes and connect with local experts.`,
        keywords: `${communityName} Texas, ${cityName} real estate, ${communityName} homes, ${cityName} schools, Texas communities, ${communityName} housing market`,
        url: `https://texascommunities.com/community/${id}`,
        image: communityData.heroImage,
        type: 'website'
      });

      // Add structured data
      generateCommunityStructuredData({
        name: communityName,
        city: cityName,
        state: 'Texas',
        description: `${communityName} is a vibrant community in ${cityName}, Texas, offering excellent schools, diverse housing options, and rich amenities.`,
        medianPrice: 485000, // This would come from real data
        schoolRating: 'A+',
        population: 42850,
        amenities: ['Schools', 'Parks', 'Shopping', 'Healthcare', 'Recreation']
      });
    }
  }, [id, communityData.name, communityData.city, communityData.heroImage]);

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
                Compare
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-blue-900 font-medium transition-colors duration-200">
                About
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-blue-900 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: `url('${communityData.heroImage}')`
          }}
          role="img"
          aria-label={`Scenic view of ${communityData.name} community in ${communityData.city}, Texas`}
        ></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Back Button */}
          <Link 
            to="/explore" 
            className="inline-flex items-center text-white/90 hover:text-white mb-8 font-medium transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Explore
          </Link>
          
          {/* Community Title and Actions */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
                {communityData.name}
              </h1>
              {/* Favorite Button */}
              <button
                onClick={() => id && toggleFavorite(id)}
                className={`p-3 rounded-full transition-all duration-200 ${
                  isFavorite
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart 
                  className={`h-6 w-6 ${isFavorite ? 'fill-current' : ''}`} 
                />
              </button>
            </div>
            <p className="text-xl sm:text-2xl text-white/90 mb-6">
              {communityData.city}, Texas
            </p>
            <div className="flex items-center justify-center text-white/80 text-sm">
              <MapPin className="h-4 w-4 mr-2" />
              <span>Discover everything this community has to offer</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Action Buttons */}
        <div className="text-center mb-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to={`/reports?community=${id}`}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-900 to-blue-800 text-white font-semibold rounded-lg hover:from-blue-800 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Compare Communities
            </Link>
            
            <Link
              to={`/explore?type=neighborhoods&community=${id}`}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Home className="h-5 w-5 mr-2" />
              Explore {communityData.name} Neighborhoods
            </Link>
          </div>
          
          <p className="text-sm text-gray-600 mt-3">
            Compare communities side-by-side or explore neighborhoods within {communityData.name}
          </p>
        </div>

        {/* Interactive Map Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Community Location & Area Map</h2>
            <p className="text-gray-600 text-sm mt-1">Explore the neighborhood, nearby schools, shopping, and amenities</p>
          </div>
          
          {/* Map Container */}
          <div className="relative">
            <div 
              className="w-full h-[400px] bg-gray-100 flex items-center justify-center text-gray-500 relative"
              style={{ minHeight: '400px' }}
            >
              {/* Placeholder for actual map integration */}
              <div className="text-center">
                <MapPin className="h-12 w-12 text-blue-900 mx-auto mb-3" />
                <p className="text-lg font-medium text-gray-700 mb-2">Interactive Map Loading...</p>
                <p className="text-sm text-gray-500 max-w-md">
                  This will show {communityData.name} location, nearby schools, shopping centers, 
                  parks, and other community amenities using Google Maps or Mapbox.
                </p>
              </div>
              
              {/* Map Controls Overlay (for when real map is integrated) */}
              <div className="absolute top-4 left-4 bg-white rounded-lg shadow-sm border border-gray-200 p-2">
                <div className="space-y-2">
                  <button className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded w-full text-left">
                    <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                    <span>Schools</span>
                  </button>
                  <button className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded w-full text-left">
                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    <span>Parks</span>
                  </button>
                  <button className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded w-full text-left">
                    <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                    <span>Shopping</span>
                  </button>
                  <button className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded w-full text-left">
                    <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                    <span>Healthcare</span>
                  </button>
                </div>
              </div>
              
              {/* Map Legend */}
              <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-sm border border-gray-200 p-3">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Community Boundaries</h4>
                <div className="flex items-center space-x-2 text-xs text-gray-600">
                  <div className="w-4 h-1 bg-blue-900 rounded"></div>
                  <span>{communityData.name} Area</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Facts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <Home className="h-8 w-8 text-blue-900 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Median Home Price</h3>
            <p className="text-2xl font-bold text-blue-900">$485,000</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <GraduationCap className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">School Rating</h3>
            <p className="text-2xl font-bold text-green-600">A+</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <Clock className="h-8 w-8 text-orange-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Average Commute</h3>
            <p className="text-2xl font-bold text-orange-500">28 min</p>
          </div>
        </div>



        {/* Enhanced Community Data & Insights */}
        
        {/* Market Trends */}
        <MarketTrends 
          communityId={id || ''} 
          communityName={communityData.name}
        />

        {/* School District Details */}
        <SchoolDistrictDetails 
          communityId={id || ''} 
          communityName={communityData.name}
        />

        {/* Traffic Patterns */}
        <TrafficPatterns 
          communityId={id || ''} 
          communityName={communityData.name}
        />

        {/* Nearby Amenities */}
        <NearbyAmenities 
          communityId={id || ''} 
          communityName={communityData.name}
        />

        {/* Employment Data */}
        <EmploymentData 
          communityId={id || ''} 
          communityName={communityData.name}
        />

        {/* Climate & Weather */}
        <ClimateWeather 
          communityId={id || ''} 
          communityName={communityData.name}
        />

        {/* Interactive Features */}
        
        {/* Photo Galleries */}
        <PhotoGalleries 
          communityId={id || ''} 
          communityName={communityData.name}
        />

        {/* Virtual Tours */}
        <VirtualTours 
          communityId={id || ''} 
          communityName={communityData.name}
        />

        {/* Community Events */}
        <CommunityEvents 
          communityId={id || ''} 
          communityName={communityData.name}
        />

        {/* Community Reviews */}
        <CommunityReviews 
          communityId={id || ''} 
          communityName={communityData.name}
        />

        {/* Similar Communities */}
        <SimilarCommunities 
          currentCommunityId={id || ''} 
          currentCommunityName={communityData.name}
        />

        {/* CTA Panel - Lead Generation Hub */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg text-white p-8">
          <div className="text-center mb-8">
            <Users className="h-12 w-12 text-blue-200 mx-auto mb-4" />
            <h3 className="text-3xl font-bold mb-2">Ready to Explore {communityData.name}?</h3>
            <p className="text-blue-100 text-lg">Connect with local experts and get the information you need</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {/* Explore Neighborhoods Button - Featured */}
            <div className="md:col-span-2 lg:col-span-1">
              <Link
                to={`/explore?type=neighborhoods&community=${id}`}
                className="bg-indigo-600 text-white p-6 rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-sm group block text-center h-full"
              >
                <div className="flex items-center justify-center mb-3">
                  <Home className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-bold text-lg mb-2">Explore {communityData.name} Neighborhoods</h4>
                <p className="text-sm text-indigo-100">Browse specific neighborhoods within this community and find your perfect area</p>
                <div className="mt-3 text-xs bg-white bg-opacity-20 text-white px-2 py-1 rounded-full inline-block">
                  🏘️ Neighborhood Explorer
                </div>
              </Link>
            </div>

            <button
              onClick={() => {
                setLeadCaptureType('contact_realtor');
                setShowLeadCapture(true);
              }}
              className="bg-white text-blue-700 p-6 rounded-lg hover:bg-blue-50 transition-all duration-200 shadow-sm group"
            >
              <div className="flex items-center justify-center mb-3">
                <Users className="h-8 w-8 text-blue-600 group-hover:text-blue-700" />
              </div>
              <h4 className="font-bold text-lg mb-2">Talk to Local Realtor</h4>
              <p className="text-sm text-blue-600">Get expert insights about {communityData.name} and schedule a personal tour</p>
              <div className="mt-3 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full inline-block">
                🎯 Generates Qualified Lead
              </div>
            </button>

            <button
              onClick={() => {
                setLeadCaptureType('get_pricing');
                setShowLeadCapture(true);
              }}
              className="bg-white text-blue-700 p-6 rounded-lg hover:bg-blue-50 transition-all duration-200 shadow-sm group"
            >
              <div className="flex items-center justify-center mb-3">
                <Home className="h-8 w-8 text-blue-600 group-hover:text-blue-700" />
              </div>
              <h4 className="font-bold text-lg mb-2">Get Current Prices</h4>
              <p className="text-sm text-blue-600">View available homes and current market prices in this community</p>
              <div className="mt-3 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full inline-block">
                💰 High-Value Lead
              </div>
            </button>

            <button
              onClick={() => {
                setLeadCaptureType('schedule_tour');
                setShowLeadCapture(true);
              }}
              className="bg-white text-blue-700 p-6 rounded-lg hover:bg-blue-50 transition-all duration-200 shadow-sm group"
            >
              <div className="flex items-center justify-center mb-3">
                <MapPin className="h-8 w-8 text-blue-600 group-hover:text-blue-700" />
              </div>
              <h4 className="font-bold text-lg mb-2">Schedule Community Tour</h4>
              <p className="text-sm text-blue-600">Book a guided tour to see homes and amenities in person</p>
              <div className="mt-3 text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full inline-block">
                🔥 Hot Lead Alert
              </div>
            </button>

            <button
              onClick={() => {
                setLeadCaptureType('mortgage_calc');
                setShowLeadCapture(true);
              }}
              className="bg-white text-blue-700 p-6 rounded-lg hover:bg-blue-50 transition-all duration-200 shadow-sm group"
            >
              <div className="flex items-center justify-center mb-3">
                <GraduationCap className="h-8 w-8 text-blue-600 group-hover:text-blue-700" />
              </div>
              <h4 className="font-bold text-lg mb-2">Mortgage Consultation</h4>
              <p className="text-sm text-blue-600">Speak with a mortgage specialist about financing options</p>
              <div className="mt-3 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full inline-block">
                🏦 Finance Lead
              </div>
            </button>
          </div>

          <div className="text-center mt-6">
            <p className="text-blue-200 text-sm">
              ✅ Free consultations • ✅ No obligations • ✅ Local market experts
            </p>
          </div>
        </div>
      </div>

      {/* Lead Capture Modal */}
      <LeadCaptureModal
        isOpen={showLeadCapture}
        onClose={() => setShowLeadCapture(false)}
        communityName={communityData.name}
        trigger={leadCaptureType}
      />
    </div>
  );
}

export default CommunityDetailPage;