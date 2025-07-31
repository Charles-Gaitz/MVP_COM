import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CommunityForComparison {
  id: string;
  name: string;
  city: string;
  price: string;
  schoolRating: string;
  image: string;
}

interface ComparisonContextType {
  selectedCommunities: CommunityForComparison[];
  addCommunity: (community: CommunityForComparison) => boolean;
  removeCommunity: (communityId: string) => void;
  clearAll: () => void;
  isSelected: (communityId: string) => boolean;
  triggerNavAnimation: boolean;
  resetNavAnimation: () => void;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export const useComparison = () => {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
};

interface ComparisonProviderProps {
  children: ReactNode;
}

export const ComparisonProvider: React.FC<ComparisonProviderProps> = ({ children }) => {
  const [selectedCommunities, setSelectedCommunities] = useState<CommunityForComparison[]>([]);
  const [triggerNavAnimation, setTriggerNavAnimation] = useState(false);

  const addCommunity = (community: CommunityForComparison): boolean => {
    if (selectedCommunities.length >= 4) {
      return false; // Will trigger popup in component
    }

    if (!selectedCommunities.find(c => c.id === community.id)) {
      setSelectedCommunities(prev => [...prev, community]);
      setTriggerNavAnimation(true);
      return true;
    }
    return true;
  };

  const removeCommunity = (communityId: string) => {
    setSelectedCommunities(prev => prev.filter(c => c.id !== communityId));
  };

  const clearAll = () => {
    setSelectedCommunities([]);
  };

  const isSelected = (communityId: string): boolean => {
    return selectedCommunities.some(c => c.id === communityId);
  };

  const resetNavAnimation = () => {
    setTriggerNavAnimation(false);
  };

  const value: ComparisonContextType = {
    selectedCommunities,
    addCommunity,
    removeCommunity,
    clearAll,
    isSelected,
    triggerNavAnimation,
    resetNavAnimation
  };

  return (
    <ComparisonContext.Provider value={value}>
      {children}
    </ComparisonContext.Provider>
  );
};

export default ComparisonContext;
