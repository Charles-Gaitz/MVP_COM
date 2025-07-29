import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Coffee, Utensils, MapPin, Star, Clock, Car } from 'lucide-react';

interface NearbyAmenitiesProps {
  communityId: string;
  communityName: string;
}

export function NearbyAmenities({ communityId, communityName }: NearbyAmenitiesProps) {
  // Sample amenities data - in a real app, this would come from Google Places API or similar
  const getAmenitiesData = (id: string) => {
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

  const amenities = getAmenitiesData(communityId);

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
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <MapPin className="h-6 w-6 text-blue-900 mr-2" />
              Nearby Amenities & Services
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Essential services and entertainment within easy reach of {communityName}
            </p>
          </div>
          <Link 
            to={`/reports?community=${communityId}&section=amenities`}
            className="text-blue-900 hover:text-blue-800 font-medium text-sm transition-colors duration-200"
          >
            View All on Map
          </Link>
        </div>
      </div>

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
    </div>
  );
}
