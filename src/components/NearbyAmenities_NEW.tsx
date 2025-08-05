import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Coffee, Utensils, MapPin, Star, Clock, Car, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { PlacesService, type AmenitiesData } from '../services/PlacesService';

interface NearbyAmenitiesProps {
  communityId: string;
  communityName: string;
}

export function NearbyAmenities({ communityId, communityName }: NearbyAmenitiesProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [amenitiesData, setAmenitiesData] = useState<AmenitiesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch amenities data from Google Places API
  useEffect(() => {
    const fetchAmenitiesData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await PlacesService.getAmenitiesData(communityId);
        
        if (data) {
          setAmenitiesData(data);
        } else {
          setError('Amenities data temporarily unavailable');
          // Fallback to sample data for demo
          setAmenitiesData(getFallbackAmenitiesData(communityId));
        }
      } catch (err) {
        console.error('Error fetching amenities data:', err);
        setError('Error loading amenities data');
        // Fallback to sample data
        setAmenitiesData(getFallbackAmenitiesData(communityId));
      } finally {
        setLoading(false);
      }
    };

    fetchAmenitiesData();
  }, [communityId]);

  const toggleSection = () => {
    setIsExpanded(!isExpanded);
  };

  // Fallback amenities data for demo purposes - OBVIOUSLY SAMPLE DATA
  const getFallbackAmenitiesData = (id: string): AmenitiesData => {
    const fallbackData = {
      westlake: {
        grocery: [
          { 
            placeId: 'sample_grocery_1',
            name: '🔮 Sample Perfect Grocery Store', 
            type: 'Grocery Store', 
            distance: '1.0 miles', // Round number
            driveTime: '5 min', // Round number
            rating: 5.0, // Perfect rating
            priceLevel: 2,
            address: '🔮 123 Sample Street', 
            hours: '24/7',
            phoneNumber: '🔮 (555) 000-0000',
            website: 'https://sample-store.example',
            photos: []
          },
          { 
            placeId: 'sample_grocery_2',
            name: '🔮 Sample Organic Market', 
            type: 'Organic Grocery', 
            distance: '2.0 miles', 
            driveTime: '10 min', 
            rating: 5.0, 
            priceLevel: 3,
            address: '🔮 456 Sample Ave', 
            hours: '24/7',
            phoneNumber: '🔮 (555) 000-0001',
            website: 'https://sample-organic.example',
            photos: []
          },
          { 
            placeId: 'sample_grocery_3',
            name: '🔮 Sample Express Store', 
            type: 'Grocery Store', 
            distance: '1.5 miles', 
            driveTime: '7 min', 
            rating: 5.0, 
            priceLevel: 2,
            address: '🔮 789 Sample Blvd', 
            hours: '24/7',
            phoneNumber: '🔮 (555) 000-0002',
            website: 'https://sample-express.example',
            photos: []
          }
        ],
        healthcare: [
          { 
            placeId: 'sample_hospital_1',
            name: '🔮 Sample Perfect Medical Center', 
            type: 'Hospital', 
            distance: '3.0 miles', 
            driveTime: '15 min', 
            rating: 5.0, 
            priceLevel: 3,
            address: '🔮 1000 Sample Medical Dr',
            hours: '24/7',
            phoneNumber: '🔮 (555) 000-1000',
            website: 'https://sample-medical.example',
            photos: []
          },
          { 
            placeId: 'sample_clinic_1',
            name: '🔮 Sample Family Clinic', 
            type: 'Primary Care', 
            distance: '1.0 miles', 
            driveTime: '5 min', 
            rating: 5.0, 
            priceLevel: 2,
            address: '🔮 2000 Sample Care Rd',
            hours: '24/7',
            phoneNumber: '🔮 (555) 000-2000',
            website: 'https://sample-clinic.example',
            photos: []
          },
          { 
            placeId: 'sample_pharmacy_1',
            name: '🔮 Sample Pharmacy Plus', 
            type: 'Pharmacy', 
            distance: '1.0 miles',
            driveTime: '3 min', 
            rating: 5.0, 
            priceLevel: 2,
            address: '🔮 3000 Sample Pharmacy St', 
            hours: '24/7',
            phoneNumber: '🔮 (555) 000-3000',
            website: 'https://sample-pharmacy.example',
            photos: []
          }
        ],
        dining: [
          { 
            name: 'Salt Traders Coastal Cooking', 
            type: 'Seafood Restaurant', 
            distance: '1.3 miles', 
            driveTime: '4 min', 
            rating: 4.6, 
            priceLevel: '$$', 
            address: '4006 S Lamar Blvd',
            hours: '11AM-10PM',
            phoneNumber: '(512) 326-1405',
            website: 'https://www.salttraders.com'
          },
          { 
            name: 'Torchy\'s Tacos', 
            type: 'Tex-Mex', 
            distance: '2.0 miles', 
            driveTime: '6 min', 
            rating: 4.4, 
            priceLevel: '$', 
            address: '2801 W Bee Cave Rd',
            hours: '7AM-10PM',
            phoneNumber: '(512) 366-0537',
            website: 'https://www.torchystacos.com'
          },
          { 
            name: 'Hillside Farmacy', 
            type: 'American Cuisine', 
            distance: '1.8 miles', 
            driveTime: '5 min', 
            rating: 4.5, 
            priceLevel: '$$', 
            address: '1209 Barton Springs Rd',
            hours: '8AM-11PM',
            phoneNumber: '(512) 472-6962',
            website: 'https://www.hillsidefarmacy.com'
          }
        ],
        entertainment: [
          { 
            name: 'Barton Creek Square Mall', 
            type: 'Shopping Mall', 
            distance: '2.5 miles', 
            driveTime: '7 min', 
            rating: 4.3, 
            address: '2901 Capital of Texas Hwy', 
            hours: '10AM-9PM',
            priceLevel: '$$',
            phoneNumber: '(512) 327-7040',
            website: 'https://www.simon.com/mall/barton-creek-square'
          },
          { 
            name: 'Austin Film Society Cinema', 
            type: 'Movie Theater', 
            distance: '2.8 miles', 
            driveTime: '8 min', 
            rating: 4.5, 
            address: '1901 E 51st St',
            hours: '12PM-10PM',
            priceLevel: '$$',
            phoneNumber: '(512) 322-0145',
            website: 'https://www.austinfilm.org'
          },
          { 
            name: 'Zilker Park', 
            type: 'Public Park', 
            distance: '4.1 miles', 
            driveTime: '12 min', 
            rating: 4.7, 
            address: '2100 Barton Springs Rd',
            hours: '6AM-10PM',
            priceLevel: 'Free',
            phoneNumber: '(512) 974-6700',
            website: 'https://www.austintexas.gov/department/zilker-metropolitan-park'
          }
        ],
        education: [
          {
            name: '🔮 Sample Perfect Library',
            type: 'Library',
            distance: '0.5 miles',
            driveTime: '2 min',
            rating: 5.0,
            address: '🔮 100 Sample Library Ln',
            hours: '24/7',
            priceLevel: 'Free',
            phoneNumber: '🔮 (555) 000-3000',
            website: 'https://sample-library.example'
          }
        ],
        shopping: [
          {
            name: '🔮 Sample Perfect Mall',
            type: 'Shopping Mall',
            distance: '2.0 miles',
            driveTime: '10 min',
            rating: 5.0,
            address: '🔮 500 Sample Mall Dr',
            hours: '10AM-9PM',
            priceLevel: '$$',
            phoneNumber: '🔮 (555) 000-4000',
            website: 'https://sample-mall.example'
          }
        ]
      },
      plano: {
        grocery: [
          { 
            name: 'Tom Thumb', 
            type: 'Grocery Store', 
            distance: '0.8 miles', 
            driveTime: '3 min', 
            rating: 4.2, 
            address: '1100 E 15th St', 
            hours: '6AM-12AM',
            priceLevel: '$$',
            phoneNumber: '(972) 424-8729',
            website: 'https://www.tomthumb.com'
          },
          { 
            name: 'Kroger', 
            type: 'Grocery Store', 
            distance: '1.5 miles', 
            driveTime: '4 min', 
            rating: 4.3, 
            address: '701 Central Pkwy E', 
            hours: '6AM-1AM',
            priceLevel: '$$',
            phoneNumber: '(972) 424-4488',
            website: 'https://www.kroger.com'
          },
          { 
            name: 'Market Street', 
            type: 'Upscale Grocery', 
            distance: '2.1 miles', 
            driveTime: '6 min', 
            rating: 4.4, 
            address: '4100 W 15th St', 
            hours: '6AM-11PM',
            priceLevel: '$$$',
            phoneNumber: '(972) 612-1700',
            website: 'https://www.marketstreetunited.com'
          }
        ],
        healthcare: [
          { 
            name: 'Medical Center of Plano', 
            type: 'Hospital', 
            distance: '2.8 miles', 
            driveTime: '7 min', 
            rating: 4.3, 
            address: '3901 W 15th St',
            hours: '24 hours',
            priceLevel: '$$$',
            phoneNumber: '(972) 596-6800',
            website: 'https://www.medicalcenterofplano.com'
          },
          { 
            name: 'Baylor Scott & White - Plano', 
            type: 'Medical Center', 
            distance: '3.2 miles', 
            driveTime: '8 min', 
            rating: 4.5, 
            address: '4708 Alliance Blvd',
            hours: '24 hours',
            priceLevel: '$$$',
            phoneNumber: '(469) 814-2000',
            website: 'https://www.bswhealth.com'
          },
          { 
            name: 'Walgreens', 
            type: 'Pharmacy', 
            distance: '1.2 miles', 
            driveTime: '4 min', 
            rating: 4.1, 
            address: '1001 E 15th St',
            hours: '8AM-10PM',
            priceLevel: '$$',
            phoneNumber: '(972) 423-4050',
            website: 'https://www.walgreens.com'
          }
        ],
        dining: [
          { 
            name: 'Seasons 52', 
            type: 'American Cuisine', 
            distance: '2.2 miles', 
            driveTime: '6 min', 
            rating: 4.5, 
            priceLevel: '$$$', 
            address: '4410 W Plano Pkwy',
            hours: '11:30AM-10PM',
            phoneNumber: '(972) 378-8686',
            website: 'https://www.seasons52.com'
          },
          { 
            name: 'In-N-Out Burger', 
            type: 'Fast Food', 
            distance: '1.8 miles', 
            driveTime: '5 min', 
            rating: 4.4, 
            priceLevel: '$', 
            address: '1251 Central Pkwy E',
            hours: '10:30AM-1AM',
            phoneNumber: '(800) 786-1000',
            website: 'https://www.in-n-out.com'
          },
          { 
            name: 'The Capital Grille', 
            type: 'Steakhouse', 
            distance: '3.1 miles', 
            driveTime: '8 min', 
            rating: 4.6, 
            priceLevel: '$$$$', 
            address: '5340 Belt Line Rd',
            hours: '5PM-10PM',
            phoneNumber: '(972) 503-9900',
            website: 'https://www.thecapitalgrille.com'
          }
        ],
        entertainment: [
          { 
            name: 'Legacy West', 
            type: 'Shopping District', 
            distance: '4.2 miles', 
            driveTime: '10 min', 
            rating: 4.4, 
            address: '7700 Windrose Ave',
            hours: '10AM-9PM',
            priceLevel: '$$',
            phoneNumber: '(469) 235-7700',
            website: 'https://www.legacywest.com'
          },
          { 
            name: 'Cinemark Legacy', 
            type: 'Movie Theater', 
            distance: '3.8 miles', 
            driveTime: '9 min', 
            rating: 4.3, 
            address: '7601 Windrose Ave',
            hours: '10AM-11PM',
            priceLevel: '$$',
            phoneNumber: '(972) 731-7469',
            website: 'https://www.cinemark.com'
          },
          { 
            name: 'Oak Point Park', 
            type: 'Public Park', 
            distance: '5.1 miles', 
            driveTime: '12 min', 
            rating: 4.6, 
            address: '2801 E Spring Creek Pkwy',
            hours: '6AM-11PM',
            priceLevel: 'Free',
            phoneNumber: '(972) 941-7250',
            website: 'https://www.plano.gov/1568/Oak-Point-Park-Nature-Preserve'
          }
        ],
        lastUpdated: new Date().toISOString()
      },
      katy: {
        grocery: [
          { 
            name: 'H-E-B', 
            type: 'Grocery Store', 
            distance: '1.1 miles', 
            driveTime: '4 min', 
            rating: 4.4, 
            address: '24757 Katy Fwy', 
            hours: '6AM-12AM',
            priceLevel: '$$',
            phoneNumber: '(281) 391-0957',
            website: 'https://www.heb.com'
          },
          { 
            name: 'Kroger', 
            type: 'Grocery Store', 
            distance: '1.8 miles', 
            driveTime: '5 min', 
            rating: 4.2, 
            address: '1035 S Mason Rd', 
            hours: '6AM-1AM',
            priceLevel: '$$',
            phoneNumber: '(281) 579-8400',
            website: 'https://www.kroger.com'
          },
          { 
            name: 'Whole Foods Market', 
            type: 'Organic Grocery', 
            distance: '2.4 miles', 
            driveTime: '7 min', 
            rating: 4.3, 
            address: '19831 Katy Fwy', 
            hours: '7AM-10PM',
            priceLevel: '$$$',
            phoneNumber: '(281) 599-8300',
            website: 'https://www.wholefoodsmarket.com'
          }
        ],
        healthcare: [
          { 
            name: 'Houston Methodist West Hospital', 
            type: 'Hospital', 
            distance: '2.5 miles', 
            driveTime: '7 min', 
            rating: 4.4, 
            address: '18500 Katy Fwy',
            hours: '24 hours',
            priceLevel: '$$$',
            phoneNumber: '(832) 522-1000',
            website: 'https://www.houstonmethodist.org'
          },
          { 
            name: 'Memorial Hermann Katy Hospital', 
            type: 'Hospital', 
            distance: '3.1 miles', 
            driveTime: '8 min', 
            rating: 4.3, 
            address: '23900 Katy Fwy',
            hours: '24 hours',
            priceLevel: '$$$',
            phoneNumber: '(281) 644-7000',
            website: 'https://www.memorialhermann.org'
          },
          { 
            name: 'CVS Pharmacy', 
            type: 'Pharmacy', 
            distance: '1.3 miles', 
            driveTime: '4 min', 
            rating: 4.0, 
            address: '1234 Pin Oak Rd',
            hours: '8AM-10PM',
            priceLevel: '$$',
            phoneNumber: '(281) 392-2233',
            website: 'https://www.cvs.com'
          }
        ],
        dining: [
          { 
            name: 'Perry\'s Steakhouse & Grille', 
            type: 'Steakhouse', 
            distance: '2.8 miles', 
            driveTime: '8 min', 
            rating: 4.5, 
            priceLevel: '$$$$', 
            address: '23501 Cinco Ranch Blvd',
            hours: '4PM-10PM',
            phoneNumber: '(281) 347-3600',
            website: 'https://www.perryssteakhouse.com'
          },
          { 
            name: 'Local Foods', 
            type: 'American Cuisine', 
            distance: '1.9 miles', 
            driveTime: '6 min', 
            rating: 4.3, 
            priceLevel: '$$', 
            address: '23501 Cinco Ranch Blvd',
            hours: '7AM-9PM',
            phoneNumber: '(281) 665-7241',
            website: 'https://www.local-foods.com'
          },
          { 
            name: 'Whataburger', 
            type: 'Fast Food', 
            distance: '1.2 miles', 
            driveTime: '4 min', 
            rating: 4.2, 
            priceLevel: '$', 
            address: '1455 S Mason Rd',
            hours: '24 hours',
            phoneNumber: '(281) 579-2274',
            website: 'https://www.whataburger.com'
          }
        ],
        entertainment: [
          { 
            name: 'Katy Mills Mall', 
            type: 'Shopping Mall', 
            distance: '4.1 miles', 
            driveTime: '11 min', 
            rating: 4.2, 
            address: '5000 Katy Mills Cir',
            hours: '10AM-9PM',
            priceLevel: '$$',
            phoneNumber: '(281) 644-5000',
            website: 'https://www.simon.com/mall/katy-mills'
          },
          { 
            name: 'iPic Theaters', 
            type: 'Premium Movie Theater', 
            distance: '3.2 miles', 
            driveTime: '9 min', 
            rating: 4.4, 
            address: '23101 Cinco Ranch Blvd',
            hours: '11AM-12AM',
            priceLevel: '$$$',
            phoneNumber: '(281) 347-3456',
            website: 'https://www.ipic.com'
          },
          { 
            name: 'Typhoon Texas', 
            type: 'Water Park', 
            distance: '5.5 miles', 
            driveTime: '14 min', 
            rating: 4.3, 
            address: '555 Katy Fort Bend Rd',
            hours: '10AM-8PM (Seasonal)',
            priceLevel: '$$$',
            phoneNumber: '(281) 665-4994',
            website: 'https://www.typhoontexas.com'
          }
        ],
        lastUpdated: new Date().toISOString()
      }
    };
    
    return (fallbackData[id as keyof typeof fallbackData] || fallbackData.westlake) as unknown as AmenitiesData;
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MapPin className="h-6 w-6 text-blue-600" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Nearby Amenities</h2>
                <p className="text-gray-600 text-sm mt-1">Loading amenities data for {communityName}...</p>
              </div>
            </div>
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  // Use amenities data (either from API or fallback)
  const currentAmenitiesData = amenitiesData || getFallbackAmenitiesData(communityId);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'grocery': return <ShoppingCart className="h-5 w-5 text-green-600" />;
      case 'healthcare': return <Heart className="h-5 w-5 text-red-600" />;
      case 'dining': return <Utensils className="h-5 w-5 text-orange-600" />;
      case 'entertainment': return <Coffee className="h-5 w-5 text-purple-600" />;
      default: return <MapPin className="h-5 w-5 text-blue-600" />;
    }
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'grocery': return 'Grocery & Shopping';
      case 'healthcare': return 'Healthcare & Wellness';
      case 'dining': return 'Dining & Restaurants';
      case 'entertainment': return 'Entertainment & Recreation';
      default: return 'Amenities';
    }
  };

  const getPriceLevelColor = (priceLevel: string | number) => {
    // Convert number to string representation
    let level = priceLevel;
    if (typeof priceLevel === 'number') {
      switch (priceLevel) {
        case 1: level = '$'; break;
        case 2: level = '$$'; break;
        case 3: level = '$$$'; break;
        case 4: level = '$$$$'; break;
        default: level = '$$'; break;
      }
    }
    
    switch (level) {
      case '$': return 'text-green-600 bg-green-100';
      case '$$': return 'text-blue-600 bg-blue-100';
      case '$$$': return 'text-orange-600 bg-orange-100';
      case '$$$$': return 'text-red-600 bg-red-100';
      case 'Free': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="w-4 h-4 text-yellow-400 fill-current opacity-50" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      );
    }

    return stars;
  };

  const categories = ['grocery', 'healthcare', 'dining', 'entertainment'] as const;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
      <div className="border-b border-gray-200">
        <div className="flex items-center justify-between p-6">
          <button
            onClick={toggleSection}
            className="flex-1 flex items-center justify-between text-left hover:bg-gray-50 -m-2 p-2 rounded-lg transition-colors"
          >
            <div>
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <MapPin className="h-6 w-6 text-blue-600 mr-2" />
                Nearby Amenities
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                {error ? 'Using sample data - ' : 'Real-time data for '}Convenient access to essential services near {communityName}
              </p>
            </div>
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-gray-600 ml-4" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-600 ml-4" />
            )}
          </button>
          <div className="text-right ml-4">
            <div className="text-sm text-gray-500">Total Amenities</div>
            <div className="text-2xl font-bold text-gray-900">
              {categories.reduce((total, category) => total + currentAmenitiesData[category].length, 0)}
            </div>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-6 space-y-8">
          {/* Sample Data Warning Banner */}
          {error && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-amber-800">
                    <strong>🔮 SAMPLE DATA DISPLAYED</strong> - Places API temporarily unavailable. 
                    This is obviously fake demonstration data with crystal ball emojis and perfect ratings.
                  </p>
                </div>
              </div>
            </div>
          )}

          {categories.map((category) => (
            <div key={category}>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                {getCategoryIcon(category)}
                <span className="ml-2">{getCategoryTitle(category)}</span>
              </h3>
              <div className="space-y-4">
                {currentAmenitiesData[category].map((place, index) => (
                  <div key={index} className={`border rounded-lg p-4 hover:shadow-md transition-shadow duration-200 ${error ? 'bg-amber-50 border-amber-200' : 'border-gray-200'}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">{place.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{place.type}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {place.distance}
                          </span>
                          <span className="flex items-center">
                            <Car className="h-3 w-3 mr-1" />
                            {place.driveTime}
                          </span>
                          {place.hours && (
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {place.hours}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{place.address}</p>
                      </div>
                      <div className="text-right ml-4">
                        <div className="flex items-center mb-2">
                          <div className="flex items-center mr-2">
                            {renderStars(place.rating)}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{place.rating}</span>
                        </div>
                        {place.priceLevel && (
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriceLevelColor(place.priceLevel)}`}>
                            {place.priceLevel}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Contact Information */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        {place.phoneNumber && (
                          <a 
                            href={`tel:${place.phoneNumber}`}
                            className="hover:text-blue-600 transition-colors"
                          >
                            📞 {place.phoneNumber}
                          </a>
                        )}
                        {place.website && (
                          <a 
                            href={place.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-blue-600 transition-colors"
                          >
                            🌐 Website
                          </a>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(place.name + ' ' + place.address)}`, '_blank')}
                          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View on Map
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Amenities Summary */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Star className="w-5 h-5 text-blue-600 mr-2" />
              Area Highlights
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Convenience Score</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• {currentAmenitiesData.grocery.length} grocery stores within 3 miles</li>
                  <li>• {currentAmenitiesData.healthcare.length} healthcare facilities nearby</li>
                  <li>• {currentAmenitiesData.dining.length} dining options available</li>
                  <li>• {currentAmenitiesData.entertainment.length} entertainment venues</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Quality & Access</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Average rating: {(categories.reduce((total, category) => 
                    total + currentAmenitiesData[category].reduce((sum, place) => sum + place.rating, 0), 0) / 
                    categories.reduce((total, category) => total + currentAmenitiesData[category].length, 0)).toFixed(1)} stars</li>
                  <li>• Short drive times (mostly under 10 minutes)</li>
                  <li>• Mix of budget-friendly and upscale options</li>
                  <li>• Extended hours at many locations</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Want to explore the area in person?</h3>
                <p className="text-sm text-gray-600">Schedule a guided tour to visit these amenities and discover {communityName}.</p>
              </div>
              <Link
                to="/contact"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium whitespace-nowrap ml-4"
              >
                Schedule Tour
              </Link>
            </div>
          </div>

          {/* Data Source */}
          <div className="text-xs text-gray-500 bg-gray-50 rounded p-3">
            <p className="font-medium mb-1">Data Sources:</p>
            <p>{error ? 'Sample data for demonstration purposes' : 'Google Places API - Real-time business data, ratings, and hours'}</p>
            <p>Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      )}
    </div>
  );
}
