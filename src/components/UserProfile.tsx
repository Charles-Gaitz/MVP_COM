import { useState, useEffect } from 'react';
import { User, Settings, Search, FileText, Bell, Smartphone, Download, Edit, Save, X } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  preferences: {
    priceRange: [number, number];
    bedrooms: number;
    location: string[];
    amenities: string[];
    notifications: {
      email: boolean;
      sms: boolean;
      newListings: boolean;
      priceChanges: boolean;
      marketUpdates: boolean;
    };
  };
  searchHistory: SearchHistoryItem[];
  savedCommunities: string[];
  notes: CommunityNote[];
}

interface SearchHistoryItem {
  id: string;
  query: string;
  filters: any;
  timestamp: string;
  results: number;
}

interface CommunityNote {
  id: string;
  communityId: string;
  communityName: string;
  note: string;
  timestamp: string;
}

export function UserProfileModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user, updateUser } = useUser();
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'history' | 'notes'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (user) {
      setEditedProfile(user as UserProfile);
    }
  }, [user]);

  if (!isOpen || !user || !editedProfile) return null;

  const handleSave = () => {
    updateUser(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(user as UserProfile);
    setIsEditing(false);
  };

  const addNote = (communityId: string, communityName: string, note: string) => {
    const newNote: CommunityNote = {
      id: Math.random().toString(36).substr(2, 9),
      communityId,
      communityName,
      note,
      timestamp: new Date().toISOString()
    };
    
    setEditedProfile(prev => prev ? {
      ...prev,
      notes: [newNote, ...prev.notes]
    } : null);
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'preferences', name: 'Preferences', icon: Settings },
    { id: 'history', name: 'Search History', icon: Search },
    { id: 'notes', name: 'My Notes', icon: FileText }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">My Account</h2>
          <div className="flex items-center space-x-2">
            {activeTab === 'profile' && (
              <button
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                {isEditing ? <Save className="h-4 w-4 mr-1" /> : <Edit className="h-4 w-4 mr-1" />}
                {isEditing ? 'Save' : 'Edit'}
              </button>
            )}
            {isEditing && (
              <button
                onClick={handleCancel}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 p-4">
            <div className="space-y-2">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {tab.name}
                  </button>
                );
              })}
            </div>

            {/* Quick Stats */}
            <div className="mt-6 p-4 bg-white rounded-lg">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Stats</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Saved Communities</span>
                  <span className="font-medium">{editedProfile.savedCommunities.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Recent Searches</span>
                  <span className="font-medium">{editedProfile.searchHistory.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Notes</span>
                  <span className="font-medium">{editedProfile.notes.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                    {editedProfile.avatar ? (
                      <img src={editedProfile.avatar} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
                    ) : (
                      <User className="h-10 w-10 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">{editedProfile.name}</h3>
                    <p className="text-gray-600">{editedProfile.email}</p>
                    <p className="text-sm text-gray-500 mt-1">Member since January 2024</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={editedProfile.name}
                      onChange={(e) => setEditedProfile(prev => prev ? { ...prev, name: e.target.value } : null)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={editedProfile.email}
                      onChange={(e) => setEditedProfile(prev => prev ? { ...prev, email: e.target.value } : null)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={editedProfile.phone || ''}
                      onChange={(e) => setEditedProfile(prev => prev ? { ...prev, phone: e.target.value } : null)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none disabled:bg-gray-50"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                {/* Account Actions */}
                <div className="pt-6 border-t border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Download className="h-5 w-5 mr-2 text-gray-600" />
                      <span className="text-sm font-medium">Export Data</span>
                    </button>
                    <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Smartphone className="h-5 w-5 mr-2 text-gray-600" />
                      <span className="text-sm font-medium">Get Mobile App</span>
                    </button>
                    <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Bell className="h-5 w-5 mr-2 text-gray-600" />
                      <span className="text-sm font-medium">Notification Settings</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Preferences</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                      <div className="flex items-center space-x-4">
                        <input
                          type="number"
                          value={editedProfile.preferences.priceRange[0]}
                          onChange={(e) => setEditedProfile(prev => prev ? {
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              priceRange: [parseInt(e.target.value), prev.preferences.priceRange[1]]
                            }
                          } : null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                          placeholder="Min price"
                        />
                        <span className="text-gray-500">to</span>
                        <input
                          type="number"
                          value={editedProfile.preferences.priceRange[1]}
                          onChange={(e) => setEditedProfile(prev => prev ? {
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              priceRange: [prev.preferences.priceRange[0], parseInt(e.target.value)]
                            }
                          } : null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                          placeholder="Max price"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Bedrooms</label>
                      <select
                        value={editedProfile.preferences.bedrooms}
                        onChange={(e) => setEditedProfile(prev => prev ? {
                          ...prev,
                          preferences: {
                            ...prev.preferences,
                            bedrooms: parseInt(e.target.value)
                          }
                        } : null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                      >
                        <option value={1}>1+ Bedroom</option>
                        <option value={2}>2+ Bedrooms</option>
                        <option value={3}>3+ Bedrooms</option>
                        <option value={4}>4+ Bedrooms</option>
                        <option value={5}>5+ Bedrooms</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium text-gray-900">Email Notifications</h5>
                        <p className="text-sm text-gray-600">Receive updates via email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editedProfile.preferences.notifications.email}
                          onChange={(e) => setEditedProfile(prev => prev ? {
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              notifications: {
                                ...prev.preferences.notifications,
                                email: e.target.checked
                              }
                            }
                          } : null)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium text-gray-900">SMS Notifications</h5>
                        <p className="text-sm text-gray-600">Receive updates via text message</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editedProfile.preferences.notifications.sms}
                          onChange={(e) => setEditedProfile(prev => prev ? {
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              notifications: {
                                ...prev.preferences.notifications,
                                sms: e.target.checked
                              }
                            }
                          } : null)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium text-gray-900">New Listings</h5>
                        <p className="text-sm text-gray-600">Get notified of new properties</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editedProfile.preferences.notifications.newListings}
                          onChange={(e) => setEditedProfile(prev => prev ? {
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              notifications: {
                                ...prev.preferences.notifications,
                                newListings: e.target.checked
                              }
                            }
                          } : null)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Search History</h3>
                  <button className="text-sm text-blue-600 hover:text-blue-800">Clear All</button>
                </div>

                <div className="space-y-3">
                  {editedProfile.searchHistory.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Search className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>No search history yet.</p>
                      <p className="text-sm">Your searches will appear here.</p>
                    </div>
                  ) : (
                    editedProfile.searchHistory.map((search) => (
                      <div key={search.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{search.query}</h4>
                            <p className="text-sm text-gray-600">{search.results} results found</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">
                              {new Date(search.timestamp).toLocaleDateString()}
                            </p>
                            <button className="text-sm text-blue-600 hover:text-blue-800">
                              Search Again
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Community Notes</h3>
                  <button className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors text-sm font-medium">
                    Add Note
                  </button>
                </div>

                <div className="space-y-3">
                  {editedProfile.notes.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>No notes yet.</p>
                      <p className="text-sm">Add notes about communities you're interested in.</p>
                    </div>
                  ) : (
                    editedProfile.notes.map((note) => (
                      <div key={note.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-1">{note.communityName}</h4>
                            <p className="text-gray-700 mb-2">{note.note}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(note.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                          <button className="text-red-600 hover:text-red-800 ml-4">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
