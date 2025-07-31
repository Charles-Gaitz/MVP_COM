import { useUser } from '../contexts/UserContext';

export interface CommunityData {
  id: string;
  name: string;
  city: string;
  price: string;
  schoolRating: string;
  priceRange: [number, number];
  demographics: {
    familyFriendly: boolean;
    youngProfessionals: boolean;
    retirees: boolean;
  };
  amenities: string[];
  commute: {
    downtown: number; // minutes
    airport: number;
  };
  lifestyle: string[];
  crimeRating: number; // 1-10 scale
  walkability: number; // 1-10 scale
}

export interface UserPreferences {
  priceRange: [number, number];
  bedrooms: number;
  location: string[];
  amenities: string[];
  lifestyle?: string[];
  familySize?: number;
  priorities?: string[];
  maxCommute?: number;
}

export interface MatchScore {
  overall: number;
  breakdown: {
    price: number;
    location: number;
    amenities: number;
    lifestyle: number;
    schools: number;
    commute: number;
  };
  reasons: string[];
}

export class SmartMatchingEngine {
  static calculateMatch(community: CommunityData, preferences: UserPreferences): MatchScore {
    const breakdown = {
      price: this.calculatePriceMatch(community, preferences),
      location: this.calculateLocationMatch(community, preferences),
      amenities: this.calculateAmenitiesMatch(community, preferences),
      lifestyle: this.calculateLifestyleMatch(community, preferences),
      schools: this.calculateSchoolsMatch(community, preferences),
      commute: this.calculateCommuteMatch(community, preferences)
    };

    // Weighted average based on importance
    const weights = {
      price: 0.25,
      location: 0.15,
      amenities: 0.20,
      lifestyle: 0.15,
      schools: 0.15,
      commute: 0.10
    };

    const overall = Object.entries(breakdown).reduce((sum, [key, score]) => {
      return sum + (score * weights[key as keyof typeof weights]);
    }, 0);

    const reasons = this.generateMatchReasons(community, preferences, breakdown);

    return {
      overall: Math.round(overall),
      breakdown,
      reasons
    };
  }

  private static calculatePriceMatch(community: CommunityData, preferences: UserPreferences): number {
    const [userMin, userMax] = preferences.priceRange;
    const [communityMin, communityMax] = community.priceRange;

    // Perfect match if ranges overlap
    if (communityMax >= userMin && communityMin <= userMax) {
      // Calculate overlap percentage
      const overlapStart = Math.max(userMin, communityMin);
      const overlapEnd = Math.min(userMax, communityMax);
      const overlapSize = overlapEnd - overlapStart;
      const userRangeSize = userMax - userMin;
      const overlapPercentage = overlapSize / userRangeSize;
      
      return Math.min(100, overlapPercentage * 100);
    }

    // Partial match if close
    const gap = communityMin > userMax 
      ? communityMin - userMax 
      : userMin - communityMax;
    
    const tolerance = (userMax - userMin) * 0.2; // 20% tolerance
    
    if (gap <= tolerance) {
      return Math.max(0, 70 - (gap / tolerance) * 40);
    }

    return 0;
  }

  private static calculateLocationMatch(community: CommunityData, preferences: UserPreferences): number {
    if (!preferences.location || preferences.location.length === 0) return 50;

    const cityMatch = preferences.location.some(loc => 
      loc.toLowerCase().includes(community.city.toLowerCase()) ||
      community.city.toLowerCase().includes(loc.toLowerCase())
    );

    return cityMatch ? 100 : 30;
  }

  private static calculateAmenitiesMatch(community: CommunityData, preferences: UserPreferences): number {
    if (!preferences.amenities || preferences.amenities.length === 0) return 50;

    const matchingAmenities = preferences.amenities.filter(amenity =>
      community.amenities.some(communityAmenity =>
        communityAmenity.toLowerCase().includes(amenity.toLowerCase())
      )
    );

    const matchPercentage = matchingAmenities.length / preferences.amenities.length;
    return Math.round(matchPercentage * 100);
  }

  private static calculateLifestyleMatch(community: CommunityData, preferences: UserPreferences): number {
    if (!preferences.lifestyle || preferences.lifestyle.length === 0) {
      // Infer lifestyle from other preferences
      return this.inferLifestyleMatch(community, preferences);
    }

    const matchingLifestyle = preferences.lifestyle.filter(lifestyle =>
      community.lifestyle.some(communityLifestyle =>
        communityLifestyle.toLowerCase().includes(lifestyle.toLowerCase())
      )
    );

    const matchPercentage = matchingLifestyle.length / preferences.lifestyle.length;
    return Math.round(matchPercentage * 100);
  }

  private static inferLifestyleMatch(community: CommunityData, preferences: UserPreferences): number {
    let score = 50; // baseline

    // Family-oriented preferences
    if (preferences.bedrooms >= 3 || preferences.familySize && preferences.familySize > 2) {
      score += community.demographics.familyFriendly ? 30 : -20;
    }

    // Young professional indicators
    if (preferences.bedrooms <= 2 && preferences.maxCommute && preferences.maxCommute <= 30) {
      score += community.demographics.youngProfessionals ? 25 : -15;
    }

    return Math.max(0, Math.min(100, score));
  }

  private static calculateSchoolsMatch(community: CommunityData, preferences: UserPreferences): number {
    // High importance for families
    const isFamilyOriented = preferences.bedrooms >= 3 || 
                           (preferences.familySize && preferences.familySize > 2) ||
                           (preferences.priorities && preferences.priorities.includes('schools'));

    if (!isFamilyOriented) return 50; // Neutral for non-families

    const schoolGrade = community.schoolRating;
    const gradeMap: { [key: string]: number } = {
      'A+': 100,
      'A': 90,
      'A-': 85,
      'B+': 80,
      'B': 70,
      'B-': 65,
      'C+': 60,
      'C': 50,
      'C-': 40,
      'D': 30,
      'F': 10
    };

    return gradeMap[schoolGrade] || 50;
  }

  private static calculateCommuteMatch(community: CommunityData, preferences: UserPreferences): number {
    if (!preferences.maxCommute) return 50; // No preference

    const commuteTime = community.commute.downtown; // Assume downtown commute
    
    if (commuteTime <= preferences.maxCommute) {
      // Bonus for being well under the limit
      const cushion = preferences.maxCommute - commuteTime;
      return Math.min(100, 80 + (cushion / preferences.maxCommute) * 20);
    }

    // Penalty for exceeding limit
    const overage = commuteTime - preferences.maxCommute;
    const tolerance = preferences.maxCommute * 0.2; // 20% tolerance
    
    if (overage <= tolerance) {
      return Math.max(0, 60 - (overage / tolerance) * 40);
    }

    return 0;
  }

  private static generateMatchReasons(
    community: CommunityData, 
    preferences: UserPreferences, 
    breakdown: MatchScore['breakdown']
  ): string[] {
    const reasons: string[] = [];

    if (breakdown.price >= 80) {
      reasons.push('Perfect price match for your budget');
    } else if (breakdown.price >= 60) {
      reasons.push('Close to your price range');
    }

    if (breakdown.schools >= 90) {
      reasons.push('Excellent schools for families');
    }

    if (breakdown.amenities >= 80) {
      reasons.push('Has most of your desired amenities');
    }

    if (breakdown.commute >= 80) {
      reasons.push('Great commute times');
    }

    if (breakdown.lifestyle >= 80) {
      reasons.push('Matches your lifestyle preferences');
    }

    if (breakdown.location >= 90) {
      reasons.push('In your preferred location');
    }

    // Add specific community highlights
    if (community.walkability >= 8) {
      reasons.push('Highly walkable neighborhood');
    }

    if (community.crimeRating >= 8) {
      reasons.push('Very safe community');
    }

    return reasons.slice(0, 4); // Top 4 reasons
  }

  static rankCommunities(communities: CommunityData[], userPreferences: UserPreferences): Array<CommunityData & { matchScore: MatchScore }> {
    return communities
      .map(community => ({
        ...community,
        matchScore: this.calculateMatch(community, userPreferences)
      }))
      .sort((a, b) => b.matchScore.overall - a.matchScore.overall);
  }

  static getTopRecommendations(
    communities: CommunityData[], 
    userPreferences: UserPreferences, 
    limit: number = 5
  ): Array<CommunityData & { matchScore: MatchScore }> {
    const ranked = this.rankCommunities(communities, userPreferences);
    return ranked
      .filter(community => community.matchScore.overall >= 60) // Minimum threshold
      .slice(0, limit);
  }
}

// Hook for using smart matching
export function useSmartMatching() {
  const { user } = useUser();

  const getRecommendations = (communities: CommunityData[], limit?: number) => {
    if (!user || !user.preferences) {
      return [];
    }

    const preferences: UserPreferences = {
      priceRange: user.preferences.priceRange,
      bedrooms: user.preferences.bedrooms,
      location: user.preferences.location,
      amenities: user.preferences.amenities,
      lifestyle: user.preferences.priorities,
      familySize: user.preferences.familySize,
      priorities: user.preferences.priorities,
      maxCommute: 45 // Default max commute
    };

    return SmartMatchingEngine.getTopRecommendations(communities, preferences, limit);
  };

  const calculateMatch = (community: CommunityData) => {
    if (!user || !user.preferences) {
      return null;
    }

    const preferences: UserPreferences = {
      priceRange: user.preferences.priceRange,
      bedrooms: user.preferences.bedrooms,
      location: user.preferences.location,
      amenities: user.preferences.amenities,
      lifestyle: user.preferences.priorities,
      familySize: user.preferences.familySize,
      priorities: user.preferences.priorities,
      maxCommute: 45
    };

    return SmartMatchingEngine.calculateMatch(community, preferences);
  };

  return {
    getRecommendations,
    calculateMatch,
    hasValidPreferences: !!(user && user.preferences && user.preferences.priceRange[1] > 0)
  };
}
