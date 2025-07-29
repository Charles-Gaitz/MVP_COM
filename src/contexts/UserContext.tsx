import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  preferences: {
    favoriteRegion?: string;
    maxBudget?: string;
    familySize?: number;
    priorities?: string[];
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
  savedSearches: Array<{
    id: string;
    name: string;
    filters: any;
    createdAt: string;
  }>;
  savedComparisons: Array<{
    id: string;
    name: string;
    communities: string[];
    createdAt: string;
  }>;
  searchHistory: SearchHistoryItem[];
  savedCommunities: string[];
  notes: CommunityNote[];
}

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: User) => void;
  updatePreferences: (preferences: Partial<User['preferences']>) => void;
  saveSearch: (name: string, filters: any) => void;
  deleteSavedSearch: (searchId: string) => void;
  saveComparison: (comparison: { name: string; communities: string[]; createdAt: string }) => void;
  syncFavorites: (favorites: string[]) => void;
  getFavorites: () => string[];
  addToSearchHistory: (search: Omit<SearchHistoryItem, 'id' | 'timestamp'>) => void;
  addCommunityNote: (communityId: string, communityName: string, note: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('texasCommunities_user');
    const savedAuth = localStorage.getItem('texasCommunities_authenticated');
    
    if (savedUser && savedAuth === 'true') {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // Save user data to localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('texasCommunities_user', JSON.stringify(user));
      localStorage.setItem('texasCommunities_authenticated', 'true');
    } else {
      localStorage.removeItem('texasCommunities_user');
      localStorage.removeItem('texasCommunities_authenticated');
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call - In real app, this would be an actual API request
    if (email && password.length >= 6) {
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: email.split('@')[0],
        email,
        preferences: {
          priceRange: [200000, 800000],
          bedrooms: 2,
          location: [],
          amenities: [],
          notifications: {
            email: true,
            sms: false,
            newListings: true,
            priceChanges: true,
            marketUpdates: false,
          },
        },
        savedSearches: [],
        savedComparisons: [],
        searchHistory: [],
        savedCommunities: [],
        notes: []
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate API call
    if (name && email && password.length >= 6) {
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        preferences: {
          priceRange: [200000, 800000],
          bedrooms: 2,
          location: [],
          amenities: [],
          notifications: {
            email: true,
            sms: false,
            newListings: true,
            priceChanges: true,
            marketUpdates: false,
          },
        },
        savedSearches: [],
        savedComparisons: [],
        searchHistory: [],
        savedCommunities: [],
        notes: []
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (userData: User) => {
    setUser(userData);
  };

  const updatePreferences = (preferences: Partial<User['preferences']>) => {
    if (user) {
      setUser({
        ...user,
        preferences: { ...user.preferences, ...preferences }
      });
    }
  };

  const addToSearchHistory = (search: Omit<SearchHistoryItem, 'id' | 'timestamp'>) => {
    if (!user) return;

    const newSearch: SearchHistoryItem = {
      ...search,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
    };

    const updatedUser = {
      ...user,
      searchHistory: [newSearch, ...user.searchHistory.slice(0, 9)], // Keep last 10 searches
    };

    setUser(updatedUser);
  };

  const addCommunityNote = (communityId: string, communityName: string, note: string) => {
    if (!user) return;

    const newNote: CommunityNote = {
      id: Math.random().toString(36).substr(2, 9),
      communityId,
      communityName,
      note,
      timestamp: new Date().toISOString(),
    };

    const updatedUser = {
      ...user,
      notes: [newNote, ...user.notes],
    };

    setUser(updatedUser);
  };

  const saveSearch = (name: string, filters: any) => {
    if (user) {
      const newSearch = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        filters,
        createdAt: new Date().toISOString()
      };
      
      setUser({
        ...user,
        savedSearches: [...user.savedSearches, newSearch]
      });
    }
  };

  const deleteSavedSearch = (searchId: string) => {
    if (user) {
      setUser({
        ...user,
        savedSearches: user.savedSearches.filter(search => search.id !== searchId)
      });
    }
  };

  const saveComparison = (comparison: { name: string; communities: string[]; createdAt: string }) => {
    if (user) {
      const newComparison = {
        id: Math.random().toString(36).substr(2, 9),
        ...comparison
      };
      
      setUser({
        ...user,
        savedComparisons: [...user.savedComparisons, newComparison]
      });
    }
  };

  const syncFavorites = (favorites: string[]) => {
    if (isAuthenticated) {
      localStorage.setItem('texasCommunities_favorites', JSON.stringify(favorites));
      // In a real app, this would sync to the server
    }
  };

  const getFavorites = (): string[] => {
    const saved = localStorage.getItem('texasCommunities_favorites');
    return saved ? JSON.parse(saved) : [];
  };

  const value: UserContextType = {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    updatePreferences,
    saveSearch,
    deleteSavedSearch,
    saveComparison,
    syncFavorites,
    getFavorites,
    addToSearchHistory,
    addCommunityNote
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
