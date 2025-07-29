import React, { useState } from 'react';
import { X, Star, MapPin, DollarSign, Users, Car, TreePine, Shield, Plus } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface Community {
  id: string;
  name: string;
  location: string;
  region: 'North Texas' | 'Central Texas' | 'East Texas';
  medianHomePrice: number;
  population: number;
  crimeRate: number;
  avgCommute: number;
  walkScore: number;
  type: 'City' | 'Suburb' | 'Small Town';
  description: string;
  averageRating?: number;
  totalReviews?: number;
  keyFeatures: string[];
  schools: {
    elementary: number;
    middle: number;
    high: number;
  };
  amenities: {
    parks: number;
    restaurants: number;
    shopping: number;
    healthcare: number;
  };
}

interface ComparisonToolProps {
  initialCommunities?: Community[];
  onClose: () => void;
}

export const ComparisonTool: React.FC<ComparisonToolProps> = ({ 
  initialCommunities = [], 
  onClose 
}) => {
  const [selectedCommunities, setSelectedCommunities] = useState<Community[]>(initialCommunities);
  const [showAddModal, setShowAddModal] = useState(false);
  const [comparisonName, setComparisonName] = useState('');
  const { user, saveComparison } = useUser();

  // Sample communities data (in real app, this would come from API)
  const availableCommunities: Community[] = [
    {
      id: '1',
      name: 'Plano',
      location: 'Plano, TX',
      region: 'North Texas',
      medianHomePrice: 450000,
      population: 285000,
      crimeRate: 2.1,
      avgCommute: 28,
      walkScore: 35,
      type: 'City',
      description: 'Family-friendly city with excellent schools',
      averageRating: 4.2,
      totalReviews: 156,
      keyFeatures: ['Great schools', 'Low crime', 'Corporate headquarters'],
      schools: { elementary: 85, middle: 88, high: 92 },
      amenities: { parks: 85, restaurants: 78, shopping: 90, healthcare: 88 }
    },
    {
      id: '2',
      name: 'Austin',
      location: 'Austin, TX',
      region: 'Central Texas',
      medianHomePrice: 520000,
      population: 965000,
      crimeRate: 3.8,
      avgCommute: 32,
      walkScore: 42,
      type: 'City',
      description: 'Vibrant tech hub with live music scene',
      averageRating: 4.5,
      totalReviews: 289,
      keyFeatures: ['Tech jobs', 'Music scene', 'Food culture'],
      schools: { elementary: 78, middle: 82, high: 85 },
      amenities: { parks: 90, restaurants: 95, shopping: 85, healthcare: 82 }
    },
    {
      id: '3',
      name: 'The Woodlands',
      location: 'The Woodlands, TX',
      region: 'North Texas',
      medianHomePrice: 425000,
      population: 118000,
      crimeRate: 1.8,
      avgCommute: 35,
      walkScore: 28,
      type: 'Suburb',
      description: 'Master-planned community with natural beauty',
      averageRating: 4.6,
      totalReviews: 94,
      keyFeatures: ['Master-planned', 'Nature trails', 'Low crime'],
      schools: { elementary: 90, middle: 92, high: 94 },
      amenities: { parks: 95, restaurants: 70, shopping: 75, healthcare: 85 }
    }
  ];

  const addCommunity = (community: Community) => {
    if (selectedCommunities.length < 4 && !selectedCommunities.find(c => c.id === community.id)) {
      setSelectedCommunities([...selectedCommunities, community]);
    }
    setShowAddModal(false);
  };

  const removeCommunity = (communityId: string) => {
    setSelectedCommunities(selectedCommunities.filter(c => c.id !== communityId));
  };

  const saveCurrentComparison = () => {
    if (comparisonName && selectedCommunities.length > 0 && user) {
      saveComparison({
        name: comparisonName,
        communities: selectedCommunities.map(c => c.id),
        createdAt: new Date().toISOString()
      });
      setComparisonName('');
      alert('Comparison saved successfully!');
    }
  };

  const getScoreColor = (score: number, isInverted = false) => {
    if (isInverted) {
      if (score <= 2) return 'text-green-600';
      if (score <= 4) return 'text-yellow-600';
      return 'text-red-600';
    } else {
      if (score >= 80) return 'text-green-600';
      if (score >= 60) return 'text-yellow-600';
      return 'text-red-600';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Community Comparison</h2>
              <p className="text-gray-600 mt-1">Compare up to 4 communities side by side</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Save Comparison */}
          {user && selectedCommunities.length > 0 && (
            <div className="mt-4 flex items-center space-x-3">
              <input
                type="text"
                value={comparisonName}
                onChange={(e) => setComparisonName(e.target.value)}
                placeholder="Name this comparison..."
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
              />
              <button
                onClick={saveCurrentComparison}
                disabled={!comparisonName}
                className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm font-medium"
              >
                Save Comparison
              </button>
            </div>
          )}
        </div>

        <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
          {/* Community Cards Header */}
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {selectedCommunities.map((community) => (
                <div key={community.id} className="bg-white rounded-lg border border-gray-200 p-4 relative">
                  <button
                    onClick={() => removeCommunity(community.id)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  
                  <div className="mb-3">
                    <h3 className="font-semibold text-gray-900">{community.name}</h3>
                    <p className="text-sm text-gray-600 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {community.location}
                    </p>
                  </div>

                  {community.averageRating && (
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-3 w-3 ${
                              star <= community.averageRating! ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {community.averageRating.toFixed(1)} ({community.totalReviews})
                      </span>
                    </div>
                  )}

                  <p className="text-xs text-gray-500">{community.description}</p>
                </div>
              ))}

              {selectedCommunities.length < 4 && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center hover:border-blue-400 hover:bg-blue-50 transition-colors duration-200 min-h-[120px]"
                >
                  <Plus className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600 font-medium">Add Community</span>
                </button>
              )}
            </div>
          </div>

          {/* Comparison Table */}
          {selectedCommunities.length > 0 && (
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 bg-gray-50">
                        Criteria
                      </th>
                      {selectedCommunities.map((community) => (
                        <th key={community.id} className="text-center py-3 px-4 font-semibold text-gray-900 bg-gray-50 min-w-[150px]">
                          {community.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {/* Basic Info */}
                    <tr>
                      <td className="py-3 px-4 font-medium text-gray-900 bg-gray-50">Type</td>
                      {selectedCommunities.map((community) => (
                        <td key={community.id} className="py-3 px-4 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            community.type === 'City' ? 'bg-blue-100 text-blue-800' :
                            community.type === 'Suburb' ? 'bg-green-100 text-green-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {community.type}
                          </span>
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="py-3 px-4 font-medium text-gray-900 bg-gray-50">Region</td>
                      {selectedCommunities.map((community) => (
                        <td key={community.id} className="py-3 px-4 text-center text-gray-700">
                          {community.region}
                        </td>
                      ))}
                    </tr>

                    {/* Housing */}
                    <tr>
                      <td className="py-3 px-4 font-medium text-gray-900 bg-gray-50">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-2 text-green-600" />
                          Median Home Price
                        </div>
                      </td>
                      {selectedCommunities.map((community) => (
                        <td key={community.id} className="py-3 px-4 text-center font-semibold text-gray-900">
                          {formatPrice(community.medianHomePrice)}
                        </td>
                      ))}
                    </tr>

                    {/* Demographics */}
                    <tr>
                      <td className="py-3 px-4 font-medium text-gray-900 bg-gray-50">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-blue-600" />
                          Population
                        </div>
                      </td>
                      {selectedCommunities.map((community) => (
                        <td key={community.id} className="py-3 px-4 text-center text-gray-700">
                          {formatNumber(community.population)}
                        </td>
                      ))}
                    </tr>

                    {/* Safety */}
                    <tr>
                      <td className="py-3 px-4 font-medium text-gray-900 bg-gray-50">
                        <div className="flex items-center">
                          <Shield className="h-4 w-4 mr-2 text-red-600" />
                          Crime Rate (per 1000)
                        </div>
                      </td>
                      {selectedCommunities.map((community) => (
                        <td key={community.id} className="py-3 px-4 text-center">
                          <span className={`font-semibold ${getScoreColor(community.crimeRate, true)}`}>
                            {community.crimeRate}
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* Transportation */}
                    <tr>
                      <td className="py-3 px-4 font-medium text-gray-900 bg-gray-50">
                        <div className="flex items-center">
                          <Car className="h-4 w-4 mr-2 text-gray-600" />
                          Avg Commute (min)
                        </div>
                      </td>
                      {selectedCommunities.map((community) => (
                        <td key={community.id} className="py-3 px-4 text-center text-gray-700">
                          {community.avgCommute}
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="py-3 px-4 font-medium text-gray-900 bg-gray-50">
                        <div className="flex items-center">
                          <TreePine className="h-4 w-4 mr-2 text-green-600" />
                          Walk Score
                        </div>
                      </td>
                      {selectedCommunities.map((community) => (
                        <td key={community.id} className="py-3 px-4 text-center">
                          <span className={`font-semibold ${getScoreColor(community.walkScore)}`}>
                            {community.walkScore}
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* Schools */}
                    <tr>
                      <td className="py-3 px-4 font-medium text-gray-900 bg-gray-50">Elementary Schools</td>
                      {selectedCommunities.map((community) => (
                        <td key={community.id} className="py-3 px-4 text-center">
                          <span className={`font-semibold ${getScoreColor(community.schools.elementary)}`}>
                            {community.schools.elementary}
                          </span>
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="py-3 px-4 font-medium text-gray-900 bg-gray-50">Middle Schools</td>
                      {selectedCommunities.map((community) => (
                        <td key={community.id} className="py-3 px-4 text-center">
                          <span className={`font-semibold ${getScoreColor(community.schools.middle)}`}>
                            {community.schools.middle}
                          </span>
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="py-3 px-4 font-medium text-gray-900 bg-gray-50">High Schools</td>
                      {selectedCommunities.map((community) => (
                        <td key={community.id} className="py-3 px-4 text-center">
                          <span className={`font-semibold ${getScoreColor(community.schools.high)}`}>
                            {community.schools.high}
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* Amenities */}
                    <tr>
                      <td className="py-3 px-4 font-medium text-gray-900 bg-gray-50">Parks & Recreation</td>
                      {selectedCommunities.map((community) => (
                        <td key={community.id} className="py-3 px-4 text-center">
                          <span className={`font-semibold ${getScoreColor(community.amenities.parks)}`}>
                            {community.amenities.parks}
                          </span>
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="py-3 px-4 font-medium text-gray-900 bg-gray-50">Restaurants</td>
                      {selectedCommunities.map((community) => (
                        <td key={community.id} className="py-3 px-4 text-center">
                          <span className={`font-semibold ${getScoreColor(community.amenities.restaurants)}`}>
                            {community.amenities.restaurants}
                          </span>
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="py-3 px-4 font-medium text-gray-900 bg-gray-50">Shopping</td>
                      {selectedCommunities.map((community) => (
                        <td key={community.id} className="py-3 px-4 text-center">
                          <span className={`font-semibold ${getScoreColor(community.amenities.shopping)}`}>
                            {community.amenities.shopping}
                          </span>
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="py-3 px-4 font-medium text-gray-900 bg-gray-50">Healthcare</td>
                      {selectedCommunities.map((community) => (
                        <td key={community.id} className="py-3 px-4 text-center">
                          <span className={`font-semibold ${getScoreColor(community.amenities.healthcare)}`}>
                            {community.amenities.healthcare}
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* Key Features */}
                    <tr>
                      <td className="py-3 px-4 font-medium text-gray-900 bg-gray-50">Key Features</td>
                      {selectedCommunities.map((community) => (
                        <td key={community.id} className="py-3 px-4 text-center">
                          <div className="flex flex-wrap justify-center gap-1">
                            {community.keyFeatures.map((feature, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Add Community Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Add Community to Compare</h3>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid gap-4">
                  {availableCommunities
                    .filter(community => !selectedCommunities.find(c => c.id === community.id))
                    .map((community) => (
                      <div
                        key={community.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 cursor-pointer transition-colors duration-200"
                        onClick={() => addCommunity(community)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{community.name}</h4>
                            <p className="text-sm text-gray-600 flex items-center mb-2">
                              <MapPin className="h-3 w-3 mr-1" />
                              {community.location} • {community.region}
                            </p>
                            <p className="text-sm text-gray-700">{community.description}</p>
                            
                            <div className="flex items-center space-x-4 mt-3 text-sm text-gray-600">
                              <span>{formatPrice(community.medianHomePrice)}</span>
                              <span>{formatNumber(community.population)} residents</span>
                              {community.averageRating && (
                                <div className="flex items-center">
                                  <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                                  {community.averageRating.toFixed(1)}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <button className="bg-blue-900 text-white px-3 py-1 rounded text-sm font-medium hover:bg-blue-800 transition-colors duration-200">
                            Add
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
