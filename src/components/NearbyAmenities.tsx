import { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Coffee, Utensils, MapPin, Star, Clock, Car, ChevronDown, ChevronUp } from 'lucide-react';

interface AmenityPlace {
  name: string;
  type: string;
  distance: string;
  driveTime: string;
  rating: number;
  address: string;
  hours?: string;
  priceLevel?: string;
  place_id?: string;
}

interface AmenitiesData {
  grocery: AmenityPlace[];
  healthcare: AmenityPlace[];
  dining: AmenityPlace[];
  entertainment: AmenityPlace[];
}

interface NearbyAmenitiesProps {
  communityId: string;
  communityName: string;
}

export function NearbyAmenities({ communityId }: NearbyAmenitiesProps) {
  const [amenitiesData, setAmenitiesData] = useState<AmenitiesData | null>(null);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const getCommunityCoordinates = (id: string): { lat: number; lng: number } => {
    const coordinates = {
      westlake: { lat: 32.9933, lng: -97.2014 },
      plano: { lat: 33.0198, lng: -96.6989 },
      katy: { lat: 29.7866, lng: -95.8244 },
      frisco: { lat: 33.1507, lng: -96.8236 },
      allen: { lat: 33.1031, lng: -96.6706 },
      mckinney: { lat: 33.1972, lng: -96.6397 },
      prosper: { lat: 33.2362, lng: -96.8011 },
      celina: { lat: 33.3248, lng: -96.7847 }
    };
    return coordinates[id as keyof typeof coordinates] || coordinates.westlake;
  };

  const fetchNearbyPlaces = async (lat: number, lng: number, type: string, keyword?: string): Promise<AmenityPlace[]> => {
    const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    try {
      const radius = 8000; // 5 miles in meters
      let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${API_KEY}`;
      
      if (keyword) {
        url += `&keyword=${encodeURIComponent(keyword)}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.status !== 'OK') {
        throw new Error(`Google Places API error: ${data.status}`);
      }

      return data.results.slice(0, 3).map((place: any) => ({
        name: place.name,
        type: getPlaceType(place.types),
        distance: calculateDistance(lat, lng, place.geometry.location.lat, place.geometry.location.lng),
        driveTime: estimateDriveTime(calculateDistanceInMiles(lat, lng, place.geometry.location.lat, place.geometry.location.lng)),
        rating: place.rating || 4.0,
        address: place.vicinity || place.formatted_address || 'Address not available',
        place_id: place.place_id,
        priceLevel: getPriceLevel(place.price_level)
      }));
    } catch (error) {
      console.error(`Error fetching ${type} places:`, error);
      return [];
    }
  };

  const getPlaceType = (types: string[]): string => {
    const typeMap: { [key: string]: string } = {
      'grocery_or_supermarket': 'Grocery Store',
      'supermarket': 'Supermarket',
      'hospital': 'Hospital',
      'pharmacy': 'Pharmacy',
      'doctor': 'Medical Center',
      'restaurant': 'Restaurant',
      'food': 'Restaurant',
      'shopping_mall': 'Shopping Mall',
      'movie_theater': 'Movie Theater',
      'park': 'Park',
      'gas_station': 'Gas Station'
    };

    for (const type of types) {
      if (typeMap[type]) {
        return typeMap[type];
      }
    }
    
    return types[0]?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Business';
  };

  const calculateDistanceInMiles = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): string => {
    const miles = calculateDistanceInMiles(lat1, lng1, lat2, lng2);
    return `${miles.toFixed(1)} miles`;
  };

  const estimateDriveTime = (distanceInMiles: number): string => {
    // Estimate drive time at average speed of 30 mph in urban areas
    const timeInMinutes = Math.round((distanceInMiles / 30) * 60);
    return `${timeInMinutes} min`;
  };

  const getPriceLevel = (priceLevel?: number): string => {
    if (!priceLevel) return '';
    const levels = ['', '$', '$$', '$$$', '$$$$'];
    return levels[priceLevel] || '';
  };

  const fetchAllAmenities = async (): Promise<AmenitiesData> => {
    const coords = getCommunityCoordinates(communityId);
    
    const [grocery, healthcare, dining, entertainment] = await Promise.all([
      fetchNearbyPlaces(coords.lat, coords.lng, 'grocery_or_supermarket'),
      fetchNearbyPlaces(coords.lat, coords.lng, 'hospital'),
      fetchNearbyPlaces(coords.lat, coords.lng, 'restaurant'),
      fetchNearbyPlaces(coords.lat, coords.lng, 'shopping_mall')
    ]);

    return {
      grocery,
      healthcare,
      dining,
      entertainment
    };
  };

  useEffect(() => {
    const loadAmenities = async () => {
      setLoading(true);
      try {
        const data = await fetchAllAmenities();
        setAmenitiesData(data);
      } catch (error) {
        console.error('Failed to load amenities data:', error);
        // Fall back to sample data
        setAmenitiesData(getAmenitiesData(communityId));
      } finally {
        setLoading(false);
      }
    };

    loadAmenities();
  }, [communityId]);

  const toggleSection = () => {
    setIsExpanded(!isExpanded);
  };

  // Sample amenities data fallback
  const getAmenitiesData = (id: string): AmenitiesData => {
    const amenitiesData = {
      westlake: {
        grocery: [
          { name: 'H-E-B Plus!', type: 'Grocery Store', distance: '1.2 miles', driveTime: '4 min', rating: 4.5, address: '4821 Bee Cave Rd', hours: '6AM-12AM' },
          { name: 'Whole Foods Market', type: 'Organic Grocery', distance: '2.1 miles', driveTime: '6 min', rating: 4.3, address: '4301 W William Cannon Dr', hours: '7AM-10PM' },
          { name: 'Randalls', type: 'Grocery Store', distance: '1.8 miles', driveTime: '5 min', rating: 4.1, address: '3300 Bee Cave Rd', hours: '6AM-11PM' }
        ],
        healthcare: [
          { name: 'St. David\'s South Austin Medical Center', type: 'Hospital', distance: '3.2 miles', driveTime: '8 min', rating: 4.2, address: '901 W Ben White Blvd' },
          { name: 'Austin Regional Clinic', type: 'Primary Care', distance: '1.5 miles', driveTime: '4 min', rating: 4.4, address: '2800 Bee Cave Rd' },
          { name: 'CVS Pharmacy', type: 'Pharmacy', distance: '1.1 miles', driveTime: '3 min', rating: 4.0, address: '4301 Bee Cave Rd', hours: '8AM-10PM' }
        ],
        dining: [
          { name: 'Salt Traders Coastal Cooking', type: 'Seafood Restaurant', distance: '1.3 miles', driveTime: '4 min', rating: 4.6, priceLevel: '$$', address: '4006 S Lamar Blvd' },
          { name: 'Torchy\'s Tacos', type: 'Tex-Mex', distance: '2.0 miles', driveTime: '6 min', rating: 4.4, priceLevel: '$', address: '2801 W Bee Cave Rd' },
          { name: 'Hillside Farmacy', type: 'American Cuisine', distance: '1.8 miles', driveTime: '5 min', rating: 4.5, priceLevel: '$$', address: '1209 Barton Springs Rd' }
        ],
        entertainment: [
          { name: 'Barton Creek Square Mall', type: 'Shopping Mall', distance: '2.5 miles', driveTime: '7 min', rating: 4.3, address: '2901 Capital of Texas Hwy', hours: '10AM-9PM' },
          { name: 'Austin Film Society Cinema', type: 'Movie Theater', distance: '2.8 miles', driveTime: '8 min', rating: 4.5, address: '1901 E 51st St' },
          { name: 'Zilker Park', type: 'Public Park', distance: '4.1 miles', driveTime: '12 min', rating: 4.7, address: '2100 Barton Springs Rd' }
        ]
      },
      plano: {
        grocery: [
          { name: 'Tom Thumb', type: 'Grocery Store', distance: '0.8 miles', driveTime: '3 min', rating: 4.2, address: '1100 E 15th St', hours: '6AM-12AM' },
          { name: 'Kroger', type: 'Grocery Store', distance: '1.5 miles', driveTime: '4 min', rating: 4.3, address: '701 Central Pkwy E', hours: '6AM-1AM' },
          { name: 'Market Street', type: 'Upscale Grocery', distance: '2.1 miles', driveTime: '6 min', rating: 4.4, address: '4100 W 15th St', hours: '6AM-11PM' }
        ],
        healthcare: [
          { name: 'Medical Center of Plano', type: 'Hospital', distance: '2.8 miles', driveTime: '7 min', rating: 4.3, address: '3901 W 15th St' },
          { name: 'Baylor Scott & White - Plano', type: 'Medical Center', distance: '3.2 miles', driveTime: '8 min', rating: 4.5, address: '4708 Alliance Blvd' },
          { name: 'Walgreens', type: 'Pharmacy', distance: '1.2 miles', driveTime: '3 min', rating: 4.1, address: '1201 E 15th St', hours: '8AM-10PM' }
        ],
        dining: [
          { name: 'Whiskey Cake Kitchen', type: 'American Cuisine', distance: '1.8 miles', driveTime: '5 min', rating: 4.5, priceLevel: '$$', address: '1251 Legacy Dr' },
          { name: 'Seasons 52', type: 'Fine Dining', distance: '2.2 miles', driveTime: '6 min', rating: 4.4, priceLevel: '$$$', address: '4410 W Boy Scout Blvd' },
          { name: 'In-N-Out Burger', type: 'Fast Food', distance: '1.5 miles', driveTime: '4 min', rating: 4.6, priceLevel: '$', address: '3220 Preston Rd' }
        ],
        entertainment: [
          { name: 'Legacy West', type: 'Shopping District', distance: '2.0 miles', driveTime: '5 min', rating: 4.5, address: '7501 Windrose Ave', hours: '10AM-10PM' },
          { name: 'Cinemark Legacy', type: 'Movie Theater', distance: '2.1 miles', driveTime: '6 min', rating: 4.3, address: '7201 Bishop Rd' },
          { name: 'Arbor Hills Nature Preserve', type: 'Nature Park', distance: '3.5 miles', driveTime: '9 min', rating: 4.6, address: '6701 W Parker Rd' }
        ]
      },
      katy: {
        grocery: [
          { name: 'H-E-B', type: 'Grocery Store', distance: '1.0 miles', driveTime: '3 min', rating: 4.5, address: '25025 Katy Fwy', hours: '6AM-1AM' },
          { name: 'Kroger', type: 'Grocery Store', distance: '1.8 miles', driveTime: '5 min', rating: 4.2, address: '1035 S Mason Rd', hours: '6AM-12AM' },
          { name: 'Whole Foods Market', type: 'Organic Grocery', distance: '2.5 miles', driveTime: '7 min', rating: 4.4, address: '1200 Ci Centre Blvd', hours: '7AM-10PM' }
        ],
        healthcare: [
          { name: 'Houston Methodist West Hospital', type: 'Hospital', distance: '2.2 miles', driveTime: '6 min', rating: 4.4, address: '18500 Katy Fwy' },
          { name: 'Memorial Hermann Katy Hospital', type: 'Hospital', distance: '3.1 miles', driveTime: '8 min', rating: 4.3, address: '23900 Katy Fwy' },
          { name: 'CVS Pharmacy', type: 'Pharmacy', distance: '1.3 miles', driveTime: '4 min', rating: 4.0, address: '1548 S Mason Rd', hours: '8AM-10PM' }
        ],
        dining: [
          { name: 'Local Foods', type: 'Healthy Fast Casual', distance: '1.6 miles', driveTime: '4 min', rating: 4.5, priceLevel: '$', address: '1936 S Mason Rd' },
          { name: 'North Italia', type: 'Italian Restaurant', distance: '2.8 miles', driveTime: '7 min', rating: 4.6, priceLevel: '$$', address: '23501 Cinco Ranch Blvd' },
          { name: 'Grub Burger Bar', type: 'Gourmet Burgers', distance: '2.1 miles', driveTime: '6 min', rating: 4.3, priceLevel: '$', address: '25025 Katy Fwy' }
        ],
        entertainment: [
          { name: 'Katy Mills', type: 'Outlet Mall', distance: '3.8 miles', driveTime: '10 min', rating: 4.2, address: '5000 Katy Mills Cir', hours: '10AM-9PM' },
          { name: 'iPic Theaters', type: 'Premium Cinema', distance: '2.5 miles', driveTime: '7 min', rating: 4.4, address: '23501 Cinco Ranch Blvd' },
          { name: 'Mary Jo Peckham Park', type: 'Recreation Center', distance: '2.0 miles', driveTime: '6 min', rating: 4.5, address: '5597 Gardiner Rd' }
        ]
      }
    };
    
    return amenitiesData[id as keyof typeof amenitiesData] || amenitiesData.westlake;
  };

  const amenities = amenitiesData || getAmenitiesData(communityId);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'grocery': return <ShoppingCart className="h-5 w-5" />;
      case 'healthcare': return <Heart className="h-5 w-5" />;
      case 'dining': return <Utensils className="h-5 w-5" />;
      case 'entertainment': return <Coffee className="h-5 w-5" />;
      default: return <MapPin className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'grocery': return 'from-green-500 to-green-600';
      case 'healthcare': return 'from-red-500 to-red-600';
      case 'dining': return 'from-orange-500 to-orange-600';
      case 'entertainment': return 'from-purple-500 to-purple-600';
      default: return 'from-blue-500 to-blue-600';
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3 w-3 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-xs text-gray-600">({rating})</span>
      </div>
    );
  };

  const categories = [
    { key: 'grocery', name: 'Grocery & Shopping', data: amenities.grocery },
    { key: 'healthcare', name: 'Healthcare & Pharmacies', data: amenities.healthcare },
    { key: 'dining', name: 'Restaurants & Dining', data: amenities.dining },
    { key: 'entertainment', name: 'Entertainment & Recreation', data: amenities.entertainment }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
      <div className="border-b border-gray-200">
        <div className="flex items-center justify-between">
          <button
            onClick={toggleSection}
            className="flex items-center justify-between w-full p-6 text-left hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="flex items-center flex-1">
              <MapPin className="h-6 w-6 text-blue-900 mr-3" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Nearby Amenities & Services
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Essential services and entertainment within easy reach
                </p>
              </div>
            </div>
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-gray-600 ml-4" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-600 ml-4" />
            )}
          </button>
          <div className="text-blue-900 hover:text-blue-800 font-medium text-sm transition-colors duration-200 ml-4 mr-6">
            View All on Map
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-6">
        {categories.map((category) => (
          <div key={category.key} className="mb-8 last:mb-0">
            <div className="flex items-center mb-4">
              <div className={`w-8 h-8 bg-gradient-to-r ${getCategoryColor(category.key)} rounded-lg flex items-center justify-center text-white mr-3`}>
                {getCategoryIcon(category.key)}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.data.map((amenity, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-blue-300">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 text-sm leading-tight">{amenity.name}</h4>
                    {(amenity as any).priceLevel && (
                      <span className="text-xs text-green-600 font-semibold">{(amenity as any).priceLevel}</span>
                    )}
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-2">{amenity.type}</p>
                  
                  {renderStars(amenity.rating)}
                  
                  <div className="flex items-center justify-between mt-3 text-xs text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{amenity.distance}</span>
                    </div>
                    <div className="flex items-center">
                      <Car className="h-3 w-3 mr-1" />
                      <span>{amenity.driveTime}</span>
                    </div>
                  </div>
                  
                  {(amenity as any).hours && (
                    <div className="flex items-center mt-2 text-xs text-gray-600">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{(amenity as any).hours}</span>
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-2 truncate">{amenity.address}</p>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Quick Stats Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mt-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Convenience Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">3</div>
                  <div className="text-xs text-gray-600">Grocery Stores</div>
                  <div className="text-xs text-gray-500">within 2 miles</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">2</div>
                  <div className="text-xs text-gray-600">Hospitals</div>
                  <div className="text-xs text-gray-500">within 5 miles</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">15+</div>
                  <div className="text-xs text-gray-600">Restaurants</div>
                  <div className="text-xs text-gray-500">within 3 miles</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">5+</div>
                  <div className="text-xs text-gray-600">Entertainment</div>
                  <div className="text-xs text-gray-500">venues nearby</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      )}
    </div>
  );
}
