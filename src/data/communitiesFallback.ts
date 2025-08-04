// Fallback community service for when Supabase is not available
export const communityService = {
  // Get all communities
  async getAllCommunities() {
    // Return hardcoded communities as fallback
    return [
      {
        id: 'westlake',
        name: 'Westlake',
        city: 'Austin',
        region: 'Central Texas',
        price: '$$$',
        schoolRating: 'A+',
        medianHomePrice: 485000,
        population: 3438,
        crimeRate: 0.8,
        avgCommute: 28,
        walkScore: 25,
        type: 'Suburban',
        image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'
      },
      {
        id: 'plano',
        name: 'Plano',
        city: 'Dallas',
        region: 'North Texas',
        price: '$$',
        schoolRating: 'A',
        medianHomePrice: 425000,
        population: 285494,
        crimeRate: 1.2,
        avgCommute: 26,
        walkScore: 42,
        type: 'Suburban',
        image: 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'
      },
      {
        id: 'katy',
        name: 'Katy',
        city: 'Houston',
        region: 'East Texas',
        price: '$$',
        schoolRating: 'A',
        medianHomePrice: 385000,
        population: 21894,
        crimeRate: 1.1,
        avgCommute: 32,
        walkScore: 35,
        type: 'Suburban',
        image: 'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop'
      }
    ];
  },

  // Get featured communities
  async getFeaturedCommunities() {
    const allCommunities = await this.getAllCommunities();
    return allCommunities.slice(0, 3);
  },

  // Search communities with filters
  async searchCommunities(filters: any) {
    const allCommunities = await this.getAllCommunities();
    return allCommunities.filter(community => {
      if (filters.minPrice && community.medianHomePrice < filters.minPrice) return false;
      if (filters.maxPrice && community.medianHomePrice > filters.maxPrice) return false;
      if (filters.cities && filters.cities.length > 0 && !filters.cities.includes(community.city)) return false;
      return true;
    });
  },

  // Get community by slug
  async getCommunityBySlug(slug: string) {
    const allCommunities = await this.getAllCommunities();
    return allCommunities.find(community => community.id === slug) || null;
  },

  // Get communities by price range
  async getCommunitiesByPriceRange(minPrice: number, maxPrice: number) {
    const allCommunities = await this.getAllCommunities();
    return allCommunities.filter(community => 
      community.medianHomePrice >= minPrice && community.medianHomePrice <= maxPrice
    );
  },

  // Get unique cities
  async getUniqueCities() {
    const allCommunities = await this.getAllCommunities();
    return [...new Set(allCommunities.map(c => c.city))].sort();
  },

  // Get price ranges
  async getPriceRanges() {
    const allCommunities = await this.getAllCommunities();
    const prices = allCommunities.map(c => c.medianHomePrice);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }
};

export default communityService;
