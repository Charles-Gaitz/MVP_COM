import { useState, useEffect } from 'react';
import { Mail, Calendar, TrendingUp, Home, Star, Clock, ArrowRight, X, Settings } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface DigestItem {
  id: string;
  type: 'new_listing' | 'price_change' | 'market_update' | 'saved_search' | 'recommendation';
  title: string;
  description: string;
  data: any;
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
}

interface EmailDigestPreferences {
  frequency: 'daily' | 'weekly' | 'monthly';
  timeOfDay: string;
  includePriceChanges: boolean;
  includeNewListings: boolean;
  includeMarketUpdates: boolean;
  includeRecommendations: boolean;
  maxItems: number;
}

export function EmailDigestModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user, updateUser } = useUser();
  const [activeTab, setActiveTab] = useState<'preview' | 'settings'>('preview');
  const [digestItems, setDigestItems] = useState<DigestItem[]>([]);
  const [preferences, setPreferences] = useState<EmailDigestPreferences>({
    frequency: 'weekly',
    timeOfDay: '08:00',
    includePriceChanges: true,
    includeNewListings: true,
    includeMarketUpdates: true,
    includeRecommendations: true,
    maxItems: 10
  });

  useEffect(() => {
    // Generate sample digest items
    const sampleItems: DigestItem[] = [
      {
        id: '1',
        type: 'new_listing',
        title: 'New Properties in Your Preferred Areas',
        description: '5 new properties matching your criteria in Downtown District and Westside Village',
        data: {
          count: 5,
          locations: ['Downtown District', 'Westside Village'],
          priceRange: '$450K - $680K'
        },
        timestamp: new Date().toISOString(),
        priority: 'high'
      },
      {
        id: '2',
        type: 'price_change',
        title: 'Price Reductions in Your Watchlist',
        description: '3 properties you\'re watching have reduced their prices',
        data: {
          properties: [
            { address: '123 Oak Street', oldPrice: '$550K', newPrice: '$525K', reduction: '$25K' },
            { address: '456 Pine Avenue', oldPrice: '$425K', newPrice: '$399K', reduction: '$26K' },
            { address: '789 Elm Drive', oldPrice: '$650K', newPrice: '$615K', reduction: '$35K' }
          ]
        },
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        priority: 'high'
      },
      {
        id: '3',
        type: 'market_update',
        title: 'Market Trends This Week',
        description: 'Average home prices increased 2.1% while inventory grew by 15%',
        data: {
          priceChange: '+2.1%',
          inventoryChange: '+15%',
          daysOnMarket: 28,
          hotNeighborhoods: ['Riverside Park', 'Tech District']
        },
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        priority: 'medium'
      },
      {
        id: '4',
        type: 'saved_search',
        title: 'Your Saved Search: "Family Homes"',
        description: '12 new matches for your saved search criteria',
        data: {
          searchName: 'Family Homes',
          newMatches: 12,
          criteria: '3+ bedrooms, $300K-600K, good schools'
        },
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        priority: 'medium'
      },
      {
        id: '5',
        type: 'recommendation',
        title: 'Communities You Might Like',
        description: 'Based on your preferences, we found 3 communities similar to those you\'ve saved',
        data: {
          recommendations: [
            { name: 'Harbor View', similarity: '92%', avgPrice: '$485K' },
            { name: 'Green Valley', similarity: '88%', avgPrice: '$520K' },
            { name: 'Maple Heights', similarity: '85%', avgPrice: '$445K' }
          ]
        },
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        priority: 'low'
      }
    ];

    setDigestItems(sampleItems);
  }, []);

  if (!isOpen) return null;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-green-600 bg-green-50';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'new_listing': return Home;
      case 'price_change': return TrendingUp;
      case 'market_update': return Calendar;
      case 'saved_search': return Star;
      case 'recommendation': return ArrowRight;
      default: return Mail;
    }
  };

  const handlePreferencesUpdate = (newPrefs: Partial<EmailDigestPreferences>) => {
    setPreferences(prev => ({ ...prev, ...newPrefs }));
  };

  const savePreferences = () => {
    if (user) {
      const updatedUser = {
        ...user,
        preferences: {
          ...user.preferences,
          emailDigest: preferences
        }
      };
      updateUser(updatedUser);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Email Digest</h2>
              <p className="text-sm text-gray-600">Personalized community and market updates</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'preview'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Preview Digest
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'settings'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Settings className="h-4 w-4 mr-2 inline" />
              Settings
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {activeTab === 'preview' && (
            <div className="space-y-6">
              {/* Digest Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Your Weekly Digest</h3>
                    <p className="text-gray-600">Updates for the week of {new Date().toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Delivered {preferences.frequency}</p>
                    <p className="text-sm text-gray-500">at {preferences.timeOfDay}</p>
                  </div>
                </div>
              </div>

              {/* Digest Items */}
              <div className="space-y-4">
                {digestItems.slice(0, preferences.maxItems).map((item) => {
                  const Icon = getTypeIcon(item.type);
                  
                  return (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                          <Icon className="h-5 w-5 text-blue-600" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">{item.title}</h4>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(item.priority)}`}>
                                {item.priority}
                              </span>
                              <span className="text-xs text-gray-500 flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-gray-700 mb-3">{item.description}</p>
                          
                          {/* Type-specific content */}
                          {item.type === 'price_change' && (
                            <div className="bg-green-50 rounded-lg p-3">
                              <h5 className="font-medium text-green-900 mb-2">Price Reductions:</h5>
                              <div className="space-y-2">
                                {item.data.properties.map((property: any, index: number) => (
                                  <div key={index} className="flex justify-between items-center text-sm">
                                    <span className="text-gray-700">{property.address}</span>
                                    <span className="text-green-600 font-medium">
                                      {property.oldPrice} → {property.newPrice} ({property.reduction} off)
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {item.type === 'market_update' && (
                            <div className="bg-blue-50 rounded-lg p-3">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-600">Price Change:</span>
                                  <span className="ml-2 font-medium text-blue-600">{item.data.priceChange}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Inventory:</span>
                                  <span className="ml-2 font-medium text-blue-600">{item.data.inventoryChange}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Days on Market:</span>
                                  <span className="ml-2 font-medium text-blue-600">{item.data.daysOnMarket}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Hot Areas:</span>
                                  <span className="ml-2 font-medium text-blue-600">{item.data.hotNeighborhoods.join(', ')}</span>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          <button className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium">
                            View Details →
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 pt-4 text-center text-sm text-gray-500">
                <p>This digest was generated based on your preferences and activity.</p>
                <p>To modify your digest settings, switch to the Settings tab above.</p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Digest Frequency
                  </label>
                  <select
                    value={preferences.frequency}
                    onChange={(e) => handlePreferencesUpdate({ frequency: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Time
                  </label>
                  <input
                    type="time"
                    value={preferences.timeOfDay}
                    onChange={(e) => handlePreferencesUpdate({ timeOfDay: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Items per Digest
                  </label>
                  <select
                    value={preferences.maxItems}
                    onChange={(e) => handlePreferencesUpdate({ maxItems: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                  >
                    <option value={5}>5 items</option>
                    <option value={10}>10 items</option>
                    <option value={15}>15 items</option>
                    <option value={20}>20 items</option>
                  </select>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Content Preferences</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-gray-900">New Listings</h5>
                      <p className="text-sm text-gray-600">Properties matching your search criteria</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.includeNewListings}
                        onChange={(e) => handlePreferencesUpdate({ includeNewListings: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-gray-900">Price Changes</h5>
                      <p className="text-sm text-gray-600">Updates on saved properties and watchlist</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.includePriceChanges}
                        onChange={(e) => handlePreferencesUpdate({ includePriceChanges: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-gray-900">Market Updates</h5>
                      <p className="text-sm text-gray-600">Trends and analytics for your areas of interest</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.includeMarketUpdates}
                        onChange={(e) => handlePreferencesUpdate({ includeMarketUpdates: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-gray-900">Recommendations</h5>
                      <p className="text-sm text-gray-600">Suggested communities and properties</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.includeRecommendations}
                        onChange={(e) => handlePreferencesUpdate({ includeRecommendations: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">
                      Your next digest will be delivered on {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()} at {preferences.timeOfDay}
                    </p>
                  </div>
                  <div className="space-x-3">
                    <button
                      onClick={onClose}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => { savePreferences(); onClose(); }}
                      className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
                    >
                      Save Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
