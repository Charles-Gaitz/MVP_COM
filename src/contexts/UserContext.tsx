import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  preferences: {
    favoriteRegion?: string;
    maxBudget?: string;
    familySize?: number;
    priorities?: string[];
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
}

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updatePreferences: (preferences: Partial<User['preferences']>) => void;
  saveSearch: (name: string, filters: any) => void;
  deleteSavedSearch: (searchId: string) => void;
  saveComparison: (comparison: { name: string; communities: string[]; createdAt: string }) => void;
  syncFavorites: (favorites: string[]) => void;
  getFavorites: () => string[];
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
        preferences: {},
        savedSearches: [],
        savedComparisons: []
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
        preferences: {},
        savedSearches: [],
        savedComparisons: []
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

  const updatePreferences = (preferences: Partial<User['preferences']>) => {
    if (user) {
      setUser({
        ...user,
        preferences: { ...user.preferences, ...preferences }
      });
    }
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
    updatePreferences,
    saveSearch,
    deleteSavedSearch,
    saveComparison,
    syncFavorites,
    getFavorites
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
