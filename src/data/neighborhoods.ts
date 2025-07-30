export interface Neighborhood {
  id: string;
  name: string;
  community: string; // Parent community ID
  city: string;
  region: string;
  type: 'Subdivision' | 'Historic District' | 'Mixed-Use' | 'Gated Community' | 'Master-Planned';
  medianHomePrice: number;
  priceRange: {
    min: number;
    max: number;
  };
  homes: {
    total: number;
    forSale: number;
    recentSold: number;
  };
  demographics: {
    households: number;
    avgHouseholdSize: number;
    medianAge: number;
    medianIncome: number;
  };
  amenities: string[];
  schoolDistrict: string;
  walkScore: number;
  image: string;
  description: string;
  keyFeatures: string[];
}

// Sample neighborhoods for Westlake (Austin area)
export const sampleNeighborhoods: Neighborhood[] = [
  {
    id: 'westlake-hills',
    name: 'Westlake Hills',
    community: 'westlake',
    city: 'Austin',
    region: 'Central Texas',
    type: 'Gated Community',
    medianHomePrice: 650000,
    priceRange: { min: 450000, max: 1200000 },
    homes: {
      total: 234,
      forSale: 8,
      recentSold: 12
    },
    demographics: {
      households: 234,
      avgHouseholdSize: 2.8,
      medianAge: 42,
      medianIncome: 145000
    },
    amenities: ['Golf Course', 'Private Beach Club', 'Tennis Courts', 'Walking Trails'],
    schoolDistrict: 'Eanes ISD',
    walkScore: 28,
    image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop',
    description: 'Exclusive gated community with luxury homes and Lake Austin access.',
    keyFeatures: ['Lake Austin Views', 'Gated Security', 'Private Amenities', 'Top-Rated Schools']
  },
  {
    id: 'westbank',
    name: 'Westbank',
    community: 'westlake',
    city: 'Austin',
    region: 'Central Texas',
    type: 'Subdivision',
    medianHomePrice: 485000,
    priceRange: { min: 350000, max: 750000 },
    homes: {
      total: 456,
      forSale: 15,
      recentSold: 23
    },
    demographics: {
      households: 456,
      avgHouseholdSize: 3.1,
      medianAge: 38,
      medianIncome: 125000
    },
    amenities: ['Community Pool', 'Playground', 'Green Belts', 'Hiking Trails'],
    schoolDistrict: 'Eanes ISD',
    walkScore: 25,
    image: 'https://images.pexels.com/photos/1396115/pexels-photo-1396115.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop',
    description: 'Family-friendly subdivision with excellent schools and outdoor recreation.',
    keyFeatures: ['Family-Oriented', 'Excellent Schools', 'Nature Access', 'New Construction']
  },
  
  // Sample neighborhoods for Plano (Dallas area)
  {
    id: 'legacy-west',
    name: 'Legacy West',
    community: 'plano',
    city: 'Plano',
    region: 'North Texas',
    type: 'Mixed-Use',
    medianHomePrice: 525000,
    priceRange: { min: 400000, max: 800000 },
    homes: {
      total: 342,
      forSale: 12,
      recentSold: 18
    },
    demographics: {
      households: 342,
      avgHouseholdSize: 2.6,
      medianAge: 35,
      medianIncome: 135000
    },
    amenities: ['Shopping Center', 'Restaurants', 'Office Complex', 'Entertainment'],
    schoolDistrict: 'Plano ISD',
    walkScore: 65,
    image: 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop',
    description: 'Modern mixed-use development with shopping, dining, and entertainment.',
    keyFeatures: ['Walkable Lifestyle', 'Modern Amenities', 'Shopping & Dining', 'Young Professionals']
  },
  {
    id: 'willow-bend',
    name: 'Willow Bend',
    community: 'plano',
    city: 'Plano',
    region: 'North Texas',
    type: 'Master-Planned',
    medianHomePrice: 465000,
    priceRange: { min: 320000, max: 650000 },
    homes: {
      total: 678,
      forSale: 22,
      recentSold: 35
    },
    demographics: {
      households: 678,
      avgHouseholdSize: 3.2,
      medianAge: 41,
      medianIncome: 118000
    },
    amenities: ['Golf Course', 'Community Center', 'Multiple Pools', 'Tennis Courts'],
    schoolDistrict: 'Plano ISD',
    walkScore: 42,
    image: 'https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop',
    description: 'Established master-planned community with golf course and family amenities.',
    keyFeatures: ['Golf Course Community', 'Mature Trees', 'Family-Friendly', 'Established Neighborhood']
  },
  
  // Sample neighborhoods for Frisco (Dallas area)
  {
    id: 'starwood',
    name: 'Starwood',
    community: 'frisco',
    city: 'Frisco',
    region: 'North Texas',
    type: 'Master-Planned',
    medianHomePrice: 575000,
    priceRange: { min: 450000, max: 850000 },
    homes: {
      total: 524,
      forSale: 18,
      recentSold: 28
    },
    demographics: {
      households: 524,
      avgHouseholdSize: 3.4,
      medianAge: 39,
      medianIncome: 142000
    },
    amenities: ['Golf Course', 'Country Club', 'Swimming Complex', 'Event Center'],
    schoolDistrict: 'Frisco ISD',
    walkScore: 38,
    image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop',
    description: 'Prestigious golf course community with luxury amenities and top schools.',
    keyFeatures: ['Golf Course Living', 'Luxury Amenities', 'Top Schools', 'Country Club']
  },
  {
    id: 'richwoods',
    name: 'Richwoods',
    community: 'frisco',
    city: 'Frisco',
    region: 'North Texas',
    type: 'Subdivision',
    medianHomePrice: 485000,
    priceRange: { min: 380000, max: 620000 },
    homes: {
      total: 398,
      forSale: 14,
      recentSold: 21
    },
    demographics: {
      households: 398,
      avgHouseholdSize: 3.3,
      medianAge: 37,
      medianIncome: 128000
    },
    amenities: ['Community Pool', 'Playground', 'Walking Trails', 'Sports Courts'],
    schoolDistrict: 'Frisco ISD',
    walkScore: 35,
    image: 'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop',
    description: 'Family-oriented neighborhood with excellent schools and community amenities.',
    keyFeatures: ['Family-Friendly', 'Great Schools', 'Community Pool', 'Safe Neighborhood']
  },

  // Katy neighborhoods (Houston area)
  {
    id: 'cinco-ranch',
    name: 'Cinco Ranch',
    community: 'katy',
    city: 'Katy',
    region: 'East Texas',
    type: 'Master-Planned',
    medianHomePrice: 425000,
    priceRange: { min: 320000, max: 650000 },
    homes: {
      total: 1245,
      forSale: 38,
      recentSold: 67
    },
    demographics: {
      households: 1245,
      avgHouseholdSize: 3.4,
      medianAge: 40,
      medianIncome: 135000
    },
    amenities: ['Golf Course', 'Recreation Center', 'Multiple Pools', 'Tennis Courts', 'Lake'],
    schoolDistrict: 'Katy ISD',
    walkScore: 32,
    image: 'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop',
    description: 'Premier master-planned community with resort-style amenities and top-rated schools.',
    keyFeatures: ['Master-Planned', 'Golf Course', 'Top Schools', 'Family Recreation']
  },
  {
    id: 'grand-lakes',
    name: 'Grand Lakes',
    community: 'katy',
    city: 'Katy',
    region: 'East Texas',
    type: 'Gated Community',
    medianHomePrice: 385000,
    priceRange: { min: 280000, max: 550000 },
    homes: {
      total: 678,
      forSale: 22,
      recentSold: 34
    },
    demographics: {
      households: 678,
      avgHouseholdSize: 3.2,
      medianAge: 38,
      medianIncome: 118000
    },
    amenities: ['Gated Entry', 'Community Pool', 'Clubhouse', 'Playground', 'Walking Trails'],
    schoolDistrict: 'Katy ISD',
    walkScore: 28,
    image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop',
    description: 'Secure gated community with family-friendly amenities and excellent schools.',
    keyFeatures: ['Gated Security', 'Family-Friendly', 'New Construction', 'Great Schools']
  },

  // Sugar Land neighborhoods (Houston area)
  {
    id: 'telfair',
    name: 'Telfair',
    community: 'sugar-land',
    city: 'Sugar Land',
    region: 'East Texas',
    type: 'Master-Planned',
    medianHomePrice: 465000,
    priceRange: { min: 350000, max: 700000 },
    homes: {
      total: 892,
      forSale: 28,
      recentSold: 45
    },
    demographics: {
      households: 892,
      avgHouseholdSize: 3.1,
      medianAge: 42,
      medianIncome: 142000
    },
    amenities: ['Golf Course', 'Country Club', 'Multiple Pools', 'Tennis Courts', 'Event Center'],
    schoolDistrict: 'Fort Bend ISD',
    walkScore: 35,
    image: 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop',
    description: 'Upscale master-planned community with golf course and luxury amenities.',
    keyFeatures: ['Golf Course Living', 'Luxury Amenities', 'Country Club', 'Mature Community']
  },
  {
    id: 'riverstone',
    name: 'Riverstone',
    community: 'sugar-land',
    city: 'Sugar Land',
    region: 'East Texas',
    type: 'Master-Planned',
    medianHomePrice: 415000,
    priceRange: { min: 300000, max: 600000 },
    homes: {
      total: 1156,
      forSale: 35,
      recentSold: 52
    },
    demographics: {
      households: 1156,
      avgHouseholdSize: 3.0,
      medianAge: 39,
      medianIncome: 125000
    },
    amenities: ['Community Center', 'Multiple Pools', 'Fitness Center', 'Parks', 'Walking Trails'],
    schoolDistrict: 'Fort Bend ISD',
    walkScore: 38,
    image: 'https://images.pexels.com/photos/2089698/pexels-photo-2089698.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop',
    description: 'Modern master-planned community with extensive amenities and family focus.',
    keyFeatures: ['Modern Design', 'Family-Oriented', 'Extensive Amenities', 'Great Schools']
  },

  // Round Rock neighborhoods (Austin area)
  {
    id: 'avery-ranch',
    name: 'Avery Ranch',
    community: 'round-rock',
    city: 'Round Rock',
    region: 'Central Texas',
    type: 'Master-Planned',
    medianHomePrice: 385000,
    priceRange: { min: 290000, max: 550000 },
    homes: {
      total: 1034,
      forSale: 32,
      recentSold: 48
    },
    demographics: {
      households: 1034,
      avgHouseholdSize: 3.3,
      medianAge: 38,
      medianIncome: 118000
    },
    amenities: ['Golf Course', 'Community Center', 'Multiple Pools', 'Tennis Courts', 'Trails'],
    schoolDistrict: 'Round Rock ISD',
    walkScore: 35,
    image: 'https://images.pexels.com/photos/1396115/pexels-photo-1396115.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop',
    description: 'Established master-planned community with golf course and family amenities.',
    keyFeatures: ['Golf Course Community', 'Established', 'Family-Friendly', 'Great Schools']
  },
  {
    id: 'forest-creek',
    name: 'Forest Creek',
    community: 'round-rock',
    city: 'Round Rock',
    region: 'Central Texas',
    type: 'Subdivision',
    medianHomePrice: 345000,
    priceRange: { min: 250000, max: 480000 },
    homes: {
      total: 567,
      forSale: 18,
      recentSold: 26
    },
    demographics: {
      households: 567,
      avgHouseholdSize: 3.1,
      medianAge: 35,
      medianIncome: 105000
    },
    amenities: ['Community Pool', 'Playground', 'Green Spaces', 'Walking Trails'],
    schoolDistrict: 'Round Rock ISD',
    walkScore: 32,
    image: 'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop',
    description: 'Affordable family neighborhood with nature access and good schools.',
    keyFeatures: ['Affordable', 'Family-Friendly', 'Nature Access', 'Growing Community']
  },

  // Allen neighborhoods (Dallas area)
  {
    id: 'watters-creek',
    name: 'Watters Creek',
    community: 'allen',
    city: 'Allen',
    region: 'North Texas',
    type: 'Mixed-Use',
    medianHomePrice: 485000,
    priceRange: { min: 380000, max: 650000 },
    homes: {
      total: 324,
      forSale: 12,
      recentSold: 18
    },
    demographics: {
      households: 324,
      avgHouseholdSize: 2.8,
      medianAge: 36,
      medianIncome: 145000
    },
    amenities: ['Shopping Center', 'Restaurants', 'Entertainment', 'Office Complex', 'Events'],
    schoolDistrict: 'Allen ISD',
    walkScore: 68,
    image: 'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop',
    description: 'Modern mixed-use development with shopping, dining, and entertainment.',
    keyFeatures: ['Walkable Lifestyle', 'Shopping & Dining', 'Modern Living', 'Entertainment']
  },
  {
    id: 'twin-creeks',
    name: 'Twin Creeks',
    community: 'allen',
    city: 'Allen',
    region: 'North Texas',
    type: 'Master-Planned',
    medianHomePrice: 435000,
    priceRange: { min: 320000, max: 580000 },
    homes: {
      total: 678,
      forSale: 21,
      recentSold: 32
    },
    demographics: {
      households: 678,
      avgHouseholdSize: 3.2,
      medianAge: 40,
      medianIncome: 128000
    },
    amenities: ['Golf Course', 'Country Club', 'Community Pool', 'Tennis Courts', 'Playground'],
    schoolDistrict: 'Allen ISD',
    walkScore: 35,
    image: 'https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop',
    description: 'Prestigious golf course community with country club amenities.',
    keyFeatures: ['Golf Course Living', 'Country Club', 'Prestigious', 'Top Schools']
  },

  // Pearland neighborhoods (Houston area)
  {
    id: 'shadow-creek-ranch',
    name: 'Shadow Creek Ranch',
    community: 'pearland',
    city: 'Pearland',
    region: 'East Texas',
    type: 'Master-Planned',
    medianHomePrice: 425000,
    priceRange: { min: 320000, max: 600000 },
    homes: {
      total: 2145,
      forSale: 65,
      recentSold: 98
    },
    demographics: {
      households: 2145,
      avgHouseholdSize: 3.4,
      medianAge: 39,
      medianIncome: 132000
    },
    amenities: ['Golf Course', 'Recreation Center', 'Multiple Pools', 'Sports Complex', 'Trails'],
    schoolDistrict: 'Pearland ISD',
    walkScore: 28,
    image: 'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop',
    description: 'Large master-planned community with comprehensive amenities and family focus.',
    keyFeatures: ['Large Community', 'Golf Course', 'Family Recreation', 'Great Schools']
  },
  {
    id: 'silverlake',
    name: 'Silverlake',
    community: 'pearland',
    city: 'Pearland',
    region: 'East Texas',
    type: 'Subdivision',
    medianHomePrice: 375000,
    priceRange: { min: 280000, max: 520000 },
    homes: {
      total: 445,
      forSale: 14,
      recentSold: 22
    },
    demographics: {
      households: 445,
      avgHouseholdSize: 3.2,
      medianAge: 37,
      medianIncome: 115000
    },
    amenities: ['Community Pool', 'Clubhouse', 'Playground', 'Walking Trails', 'Parks'],
    schoolDistrict: 'Pearland ISD',
    walkScore: 25,
    image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop',
    description: 'Family-oriented subdivision with community amenities and good schools.',
    keyFeatures: ['Family-Friendly', 'Community Pool', 'Affordable', 'Good Schools']
  },

  // Cedar Park neighborhoods (Austin area)
  {
    id: 'buttercup-creek',
    name: 'Buttercup Creek',
    community: 'cedar-park',
    city: 'Cedar Park',
    region: 'Central Texas',
    type: 'Subdivision',
    medianHomePrice: 395000,
    priceRange: { min: 300000, max: 550000 },
    homes: {
      total: 567,
      forSale: 18,
      recentSold: 28
    },
    demographics: {
      households: 567,
      avgHouseholdSize: 3.1,
      medianAge: 38,
      medianIncome: 118000
    },
    amenities: ['Community Pool', 'Tennis Courts', 'Playground', 'Green Spaces', 'Trails'],
    schoolDistrict: 'Leander ISD',
    walkScore: 28,
    image: 'https://images.pexels.com/photos/1396115/pexels-photo-1396115.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop',
    description: 'Established neighborhood with mature trees and family-friendly amenities.',
    keyFeatures: ['Mature Trees', 'Family-Friendly', 'Established', 'Good Schools']
  },
  {
    id: 'anderson-mill',
    name: 'Anderson Mill',
    community: 'cedar-park',
    city: 'Cedar Park',
    region: 'Central Texas',
    type: 'Historic District',
    medianHomePrice: 355000,
    priceRange: { min: 250000, max: 480000 },
    homes: {
      total: 334,
      forSale: 11,
      recentSold: 16
    },
    demographics: {
      households: 334,
      avgHouseholdSize: 2.9,
      medianAge: 41,
      medianIncome: 108000
    },
    amenities: ['Historic Sites', 'Community Center', 'Parks', 'Walking Trails', 'Library'],
    schoolDistrict: 'Leander ISD',
    walkScore: 32,
    image: 'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop',
    description: 'Historic neighborhood with character homes and community charm.',
    keyFeatures: ['Historic Character', 'Mature Community', 'Walkable', 'Unique Homes']
  }
];

// Helper function to get neighborhoods by community
export const getNeighborhoodsByCommunity = (communityId: string): Neighborhood[] => {
  return sampleNeighborhoods.filter(neighborhood => neighborhood.community === communityId);
};

// Helper function to get all neighborhoods for search
export const getAllNeighborhoods = (): Neighborhood[] => {
  return sampleNeighborhoods;
};

// Helper function to search neighborhoods
export const searchNeighborhoods = (query: string): Neighborhood[] => {
  const lowercaseQuery = query.toLowerCase();
  return sampleNeighborhoods.filter(neighborhood => 
    neighborhood.name.toLowerCase().includes(lowercaseQuery) ||
    neighborhood.city.toLowerCase().includes(lowercaseQuery) ||
    neighborhood.community.toLowerCase().includes(lowercaseQuery) ||
    neighborhood.type.toLowerCase().includes(lowercaseQuery) ||
    neighborhood.amenities.some(amenity => amenity.toLowerCase().includes(lowercaseQuery))
  );
};
