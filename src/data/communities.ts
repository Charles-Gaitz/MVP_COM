// Shared community data for consistent IDs and basic info across all pages

export interface CommunityBasic {
  id: string;
  name: string;
  city: string;
  region: string;
  price: string;
  schoolRating: string;
  medianHomePrice: number;
  population: number;
  crimeRate: number;
  avgCommute: number;
  walkScore: number;
  type: string;
  image: string;
}

export interface CommunityDetailed extends CommunityBasic {
  demographics: {
    medianAge: number;
    medianHouseholdIncome: number;
    collegeEducated: number;
    marriedCouples: number;
  };
  housing: {
    homeOwnership: number;
    avgHomeSize: number;
    propertyTax: number;
    avgRent: number;
  };
  amenities: {
    parks: number;
    restaurants: number;
    shopping: number;
    healthcare: number;
    entertainment: number;
  };
  employment: {
    unemploymentRate: number;
    majorEmployers: string[];
    averageWage: number;
  };
  climate: {
    avgTemp: number;
    rainyDays: number;
    sunnyDays: number;
  };
}

export const sampleCommunities: CommunityDetailed[] = [
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
    image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop',
    demographics: {
      medianAge: 42,
      medianHouseholdIncome: 125000,
      collegeEducated: 85,
      marriedCouples: 72
    },
    housing: {
      homeOwnership: 88,
      avgHomeSize: 2800,
      propertyTax: 2.1,
      avgRent: 2200
    },
    amenities: {
      parks: 12,
      restaurants: 25,
      shopping: 8,
      healthcare: 5,
      entertainment: 6
    },
    employment: {
      unemploymentRate: 2.1,
      majorEmployers: ['Dell Technologies', 'IBM', 'Apple'],
      averageWage: 75000
    },
    climate: {
      avgTemp: 78,
      rainyDays: 85,
      sunnyDays: 230
    }
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
    image: 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop',
    demographics: {
      medianAge: 39,
      medianHouseholdIncome: 95000,
      collegeEducated: 78,
      marriedCouples: 68
    },
    housing: {
      homeOwnership: 82,
      avgHomeSize: 2400,
      propertyTax: 2.3,
      avgRent: 1800
    },
    amenities: {
      parks: 35,
      restaurants: 180,
      shopping: 25,
      healthcare: 15,
      entertainment: 20
    },
    employment: {
      unemploymentRate: 2.8,
      majorEmployers: ['Toyota', 'Frito Lay', 'JCPenney'],
      averageWage: 68000
    },
    climate: {
      avgTemp: 76,
      rainyDays: 82,
      sunnyDays: 225
    }
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
    walkScore: 28,
    type: 'Suburban',
    image: 'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop',
    demographics: {
      medianAge: 36,
      medianHouseholdIncome: 88000,
      collegeEducated: 72,
      marriedCouples: 75
    },
    housing: {
      homeOwnership: 85,
      avgHomeSize: 2600,
      propertyTax: 2.4,
      avgRent: 1650
    },
    amenities: {
      parks: 18,
      restaurants: 85,
      shopping: 12,
      healthcare: 8,
      entertainment: 10
    },
    employment: {
      unemploymentRate: 3.1,
      majorEmployers: ['ExxonMobil', 'Katy ISD', 'Memorial Hermann'],
      averageWage: 65000
    },
    climate: {
      avgTemp: 79,
      rainyDays: 95,
      sunnyDays: 210
    }
  },
  {
    id: 'frisco',
    name: 'Frisco',
    city: 'Dallas',
    region: 'North Texas',
    price: '$$$',
    schoolRating: 'A+',
    medianHomePrice: 525000,
    population: 200490,
    crimeRate: 0.9,
    avgCommute: 29,
    walkScore: 35,
    type: 'Master-Planned',
    image: 'https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop',
    demographics: {
      medianAge: 37,
      medianHouseholdIncome: 110000,
      collegeEducated: 82,
      marriedCouples: 78
    },
    housing: {
      homeOwnership: 87,
      avgHomeSize: 2900,
      propertyTax: 2.2,
      avgRent: 2100
    },
    amenities: {
      parks: 28,
      restaurants: 150,
      shopping: 22,
      healthcare: 12,
      entertainment: 18
    },
    employment: {
      unemploymentRate: 2.3,
      majorEmployers: ['T-Mobile', 'Dallas Cowboys', 'Frisco ISD'],
      averageWage: 78000
    },
    climate: {
      avgTemp: 76,
      rainyDays: 80,
      sunnyDays: 228
    }
  },
  {
    id: 'sugar-land',
    name: 'Sugar Land',
    city: 'Houston',
    region: 'East Texas',
    price: '$$',
    schoolRating: 'A',
    medianHomePrice: 415000,
    population: 118488,
    crimeRate: 1.0,
    avgCommute: 31,
    walkScore: 32,
    type: 'Suburban',
    image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop',
    demographics: {
      medianAge: 37,
      medianHouseholdIncome: 95000,
      collegeEducated: 74,
      marriedCouples: 73
    },
    housing: {
      homeOwnership: 84,
      avgHomeSize: 2500,
      propertyTax: 2.5,
      avgRent: 1750
    },
    amenities: {
      parks: 22,
      restaurants: 95,
      shopping: 15,
      healthcare: 10,
      entertainment: 12
    },
    employment: {
      unemploymentRate: 2.9,
      majorEmployers: ['Fluor Corporation', 'Schlumberger', 'Imperial Sugar'],
      averageWage: 72000
    },
    climate: {
      avgTemp: 79,
      rainyDays: 92,
      sunnyDays: 215
    }
  },
  {
    id: 'round-rock',
    name: 'Round Rock',
    city: 'Austin',
    region: 'Central Texas',
    price: '$$',
    schoolRating: 'A',
    medianHomePrice: 365000,
    population: 133372,
    crimeRate: 1.3,
    avgCommute: 27,
    walkScore: 38,
    type: 'Suburban',
    image: 'https://images.pexels.com/photos/2089698/pexels-photo-2089698.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop',
    demographics: {
      medianAge: 35,
      medianHouseholdIncome: 82000,
      collegeEducated: 68,
      marriedCouples: 70
    },
    housing: {
      homeOwnership: 78,
      avgHomeSize: 2300,
      propertyTax: 2.2,
      avgRent: 1600
    },
    amenities: {
      parks: 25,
      restaurants: 120,
      shopping: 18,
      healthcare: 8,
      entertainment: 15
    },
    employment: {
      unemploymentRate: 3.2,
      majorEmployers: ['Dell Technologies', 'IKEA', 'Seton Healthcare'],
      averageWage: 65000
    },
    climate: {
      avgTemp: 78,
      rainyDays: 87,
      sunnyDays: 225
    }
  },
  {
    id: 'allen',
    name: 'Allen',
    city: 'Dallas',
    region: 'North Texas',
    price: '$$',
    schoolRating: 'A+',
    medianHomePrice: 445000,
    population: 105623,
    crimeRate: 0.7,
    avgCommute: 24,
    walkScore: 29,
    type: 'Suburban',
    image: 'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop',
    demographics: {
      medianAge: 38,
      medianHouseholdIncome: 105000,
      collegeEducated: 80,
      marriedCouples: 76
    },
    housing: {
      homeOwnership: 86,
      avgHomeSize: 2700,
      propertyTax: 2.1,
      avgRent: 1950
    },
    amenities: {
      parks: 20,
      restaurants: 110,
      shopping: 16,
      healthcare: 9,
      entertainment: 14
    },
    employment: {
      unemploymentRate: 2.4,
      majorEmployers: ['Allen ISD', 'Texas Instruments', 'Raytheon'],
      averageWage: 72000
    },
    climate: {
      avgTemp: 76,
      rainyDays: 83,
      sunnyDays: 227
    }
  },
  {
    id: 'pearland',
    name: 'Pearland',
    city: 'Houston',
    region: 'East Texas',
    price: '$$',
    schoolRating: 'A',
    medianHomePrice: 395000,
    population: 125817,
    crimeRate: 1.2,
    avgCommute: 33,
    walkScore: 26,
    type: 'Suburban',
    image: 'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop',
    demographics: {
      medianAge: 36,
      medianHouseholdIncome: 90000,
      collegeEducated: 75,
      marriedCouples: 74
    },
    housing: {
      homeOwnership: 83,
      avgHomeSize: 2500,
      propertyTax: 2.3,
      avgRent: 1700
    },
    amenities: {
      parks: 19,
      restaurants: 88,
      shopping: 14,
      healthcare: 7,
      entertainment: 11
    },
    employment: {
      unemploymentRate: 3.0,
      majorEmployers: ['MD Anderson', 'Pearland ISD', 'ExxonMobil'],
      averageWage: 68000
    },
    climate: {
      avgTemp: 79,
      rainyDays: 94,
      sunnyDays: 212
    }
  },
  {
    id: 'cedar-park',
    name: 'Cedar Park',
    city: 'Austin',
    region: 'Central Texas',
    price: '$$',
    schoolRating: 'A',
    medianHomePrice: 385000,
    population: 78890,
    crimeRate: 1.1,
    avgCommute: 29,
    walkScore: 34,
    type: 'Suburban',
    image: 'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop',
    demographics: {
      medianAge: 36,
      medianHouseholdIncome: 88000,
      collegeEducated: 72,
      marriedCouples: 75
    },
    housing: {
      homeOwnership: 85,
      avgHomeSize: 2600,
      propertyTax: 2.4,
      avgRent: 1650
    },
    amenities: {
      parks: 18,
      restaurants: 85,
      shopping: 12,
      healthcare: 8,
      entertainment: 10
    },
    employment: {
      unemploymentRate: 3.1,
      majorEmployers: ['ExxonMobil', 'Cedar Park ISD', 'Memorial Hermann'],
      averageWage: 65000
    },
    climate: {
      avgTemp: 79,
      rainyDays: 95,
      sunnyDays: 210
    }
  },
  {
    id: 'mckinney',
    name: 'McKinney',
    city: 'Dallas',
    region: 'North Texas',
    price: '$$',
    schoolRating: 'A',
    medianHomePrice: 425000,
    population: 195308,
    crimeRate: 1.0,
    avgCommute: 28,
    walkScore: 31,
    type: 'Suburban',
    image: 'https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop',
    demographics: {
      medianAge: 37,
      medianHouseholdIncome: 95000,
      collegeEducated: 78,
      marriedCouples: 72
    },
    housing: {
      homeOwnership: 84,
      avgHomeSize: 2700,
      propertyTax: 2.2,
      avgRent: 1850
    },
    amenities: {
      parks: 25,
      restaurants: 140,
      shopping: 18,
      healthcare: 11,
      entertainment: 16
    },
    employment: {
      unemploymentRate: 2.8,
      majorEmployers: ['Raytheon', 'McKinney ISD', 'Encore Wire'],
      averageWage: 70000
    },
    climate: {
      avgTemp: 76,
      rainyDays: 82,
      sunnyDays: 225
    }
  },
  {
    id: 'the-woodlands',
    name: 'The Woodlands',
    city: 'Houston',
    region: 'East Texas',
    price: '$$$',
    schoolRating: 'A+',
    medianHomePrice: 535000,
    population: 114436,
    crimeRate: 0.6,
    avgCommute: 35,
    walkScore: 22,
    type: 'Master-planned',
    image: 'https://images.pexels.com/photos/1396117/pexels-photo-1396117.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop',
    demographics: {
      medianAge: 40,
      medianHouseholdIncome: 118000,
      collegeEducated: 84,
      marriedCouples: 79
    },
    housing: {
      homeOwnership: 89,
      avgHomeSize: 2900,
      propertyTax: 2.0,
      avgRent: 2300
    },
    amenities: {
      parks: 30,
      restaurants: 140,
      shopping: 20,
      healthcare: 15,
      entertainment: 22
    },
    employment: {
      unemploymentRate: 2.0,
      majorEmployers: ['ExxonMobil', 'Chevron Phillips', 'Memorial Hermann'],
      averageWage: 85000
    },
    climate: {
      avgTemp: 79,
      rainyDays: 90,
      sunnyDays: 218
    }
  },
  {
    id: 'southlake',
    name: 'Southlake',
    city: 'Dallas',
    region: 'North Texas',
    price: '$$$',
    schoolRating: 'A+',
    medianHomePrice: 745000,
    population: 32576,
    crimeRate: 0.4,
    avgCommute: 26,
    walkScore: 28,
    type: 'Affluent',
    image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop',
    demographics: {
      medianAge: 42,
      medianHouseholdIncome: 175000,
      collegeEducated: 88,
      marriedCouples: 84
    },
    housing: {
      homeOwnership: 92,
      avgHomeSize: 3400,
      propertyTax: 2.1,
      avgRent: 2800
    },
    amenities: {
      parks: 15,
      restaurants: 65,
      shopping: 12,
      healthcare: 8,
      entertainment: 14
    },
    employment: {
      unemploymentRate: 1.8,
      majorEmployers: ['Fidelity Investments', 'Sabre Corporation', 'TD Ameritrade'],
      averageWage: 95000
    },
    climate: {
      avgTemp: 76,
      rainyDays: 80,
      sunnyDays: 230
    }
  },
  {
    id: 'flower-mound',
    name: 'Flower Mound',
    city: 'Dallas',
    region: 'North Texas',
    price: '$$',
    schoolRating: 'A',
    medianHomePrice: 485000,
    population: 78854,
    crimeRate: 0.8,
    avgCommute: 27,
    walkScore: 25,
    type: 'Suburban',
    image: 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop',
    demographics: {
      medianAge: 39,
      medianHouseholdIncome: 115000,
      collegeEducated: 82,
      marriedCouples: 78
    },
    housing: {
      homeOwnership: 88,
      avgHomeSize: 2900,
      propertyTax: 2.2,
      avgRent: 2100
    },
    amenities: {
      parks: 22,
      restaurants: 95,
      shopping: 14,
      healthcare: 9,
      entertainment: 12
    },
    employment: {
      unemploymentRate: 2.2,
      majorEmployers: ['Flowserve', 'Lewisville ISD', 'Presbyterian Hospital'],
      averageWage: 78000
    },
    climate: {
      avgTemp: 76,
      rainyDays: 82,
      sunnyDays: 228
    }
  },
  {
    id: 'leander',
    name: 'Leander',
    city: 'Austin',
    region: 'Central Texas',
    price: '$',
    schoolRating: 'A',
    medianHomePrice: 335000,
    population: 67124,
    crimeRate: 1.4,
    avgCommute: 32,
    walkScore: 29,
    type: 'Suburban',
    image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop',
    demographics: {
      medianAge: 34,
      medianHouseholdIncome: 78000,
      collegeEducated: 65,
      marriedCouples: 72
    },
    housing: {
      homeOwnership: 82,
      avgHomeSize: 2400,
      propertyTax: 2.3,
      avgRent: 1550
    },
    amenities: {
      parks: 20,
      restaurants: 75,
      shopping: 10,
      healthcare: 6,
      entertainment: 8
    },
    employment: {
      unemploymentRate: 3.4,
      majorEmployers: ['Leander ISD', 'Cedar Valley Medical Center', 'City of Leander'],
      averageWage: 62000
    },
    climate: {
      avgTemp: 78,
      rainyDays: 88,
      sunnyDays: 222
    }
  },
  {
    id: 'richardson',
    name: 'Richardson',
    city: 'Dallas',
    region: 'North Texas',
    price: '$$',
    schoolRating: 'A',
    medianHomePrice: 395000,
    population: 119469,
    crimeRate: 1.3,
    avgCommute: 25,
    walkScore: 45,
    type: 'Urban',
    image: 'https://images.pexels.com/photos/2089698/pexels-photo-2089698.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop',
    demographics: {
      medianAge: 37,
      medianHouseholdIncome: 85000,
      collegeEducated: 75,
      marriedCouples: 68
    },
    housing: {
      homeOwnership: 75,
      avgHomeSize: 2200,
      propertyTax: 2.4,
      avgRent: 1750
    },
    amenities: {
      parks: 28,
      restaurants: 165,
      shopping: 22,
      healthcare: 14,
      entertainment: 18
    },
    employment: {
      unemploymentRate: 2.9,
      majorEmployers: ['State Farm', 'University of Texas at Dallas', 'Fossil Group'],
      averageWage: 68000
    },
    climate: {
      avgTemp: 76,
      rainyDays: 84,
      sunnyDays: 225
    }
  },
  {
    id: 'spring',
    name: 'Spring',
    city: 'Houston',
    region: 'East Texas',
    price: '$',
    schoolRating: 'B+',
    medianHomePrice: 285000,
    population: 62559,
    crimeRate: 1.8,
    avgCommute: 34,
    walkScore: 24,
    type: 'Suburban',
    image: 'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop',
    demographics: {
      medianAge: 33,
      medianHouseholdIncome: 65000,
      collegeEducated: 58,
      marriedCouples: 64
    },
    housing: {
      homeOwnership: 78,
      avgHomeSize: 2100,
      propertyTax: 2.5,
      avgRent: 1450
    },
    amenities: {
      parks: 16,
      restaurants: 85,
      shopping: 12,
      healthcare: 7,
      entertainment: 9
    },
    employment: {
      unemploymentRate: 4.2,
      majorEmployers: ['Klein ISD', 'ExxonMobil', 'Memorial Hermann'],
      averageWage: 58000
    },
    climate: {
      avgTemp: 79,
      rainyDays: 96,
      sunnyDays: 208
    }
  },
  {
    id: 'carrollton',
    name: 'Carrollton',
    city: 'Dallas',
    region: 'North Texas',
    price: '$',
    schoolRating: 'B+',
    medianHomePrice: 285000,
    population: 133168,
    crimeRate: 1.7,
    avgCommute: 27,
    walkScore: 41,
    type: 'Urban',
    image: 'https://images.pexels.com/photos/2089701/pexels-photo-2089701.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop',
    demographics: {
      medianAge: 34,
      medianHouseholdIncome: 68000,
      collegeEducated: 62,
      marriedCouples: 65
    },
    housing: {
      homeOwnership: 72,
      avgHomeSize: 2100,
      propertyTax: 2.4,
      avgRent: 1400
    },
    amenities: {
      parks: 15,
      restaurants: 75,
      shopping: 12,
      healthcare: 6,
      entertainment: 8
    },
    employment: {
      unemploymentRate: 4.1,
      majorEmployers: ['Samsung', 'FASTSIGNS', 'Mary Kay'],
      averageWage: 58000
    },
    climate: {
      avgTemp: 77,
      rainyDays: 88,
      sunnyDays: 220
    }
  },
  {
    id: 'league-city',
    name: 'League City',
    city: 'Houston',
    region: 'East Texas',
    price: '$$',
    schoolRating: 'A',
    medianHomePrice: 375000,
    population: 112040,
    crimeRate: 1.1,
    avgCommute: 32,
    walkScore: 27,
    type: 'Suburban',
    image: 'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop',
    demographics: {
      medianAge: 36,
      medianHouseholdIncome: 92000,
      collegeEducated: 73,
      marriedCouples: 76
    },
    housing: {
      homeOwnership: 84,
      avgHomeSize: 2600,
      propertyTax: 2.3,
      avgRent: 1700
    },
    amenities: {
      parks: 21,
      restaurants: 95,
      shopping: 15,
      healthcare: 9,
      entertainment: 12
    },
    employment: {
      unemploymentRate: 3.0,
      majorEmployers: ['NASA Johnson Space Center', 'Clear Creek ISD', 'UTMB'],
      averageWage: 72000
    },
    climate: {
      avgTemp: 79,
      rainyDays: 93,
      sunnyDays: 215
    }
  },
  {
    id: 'grapevine',
    name: 'Grapevine',
    city: 'Dallas',
    region: 'North Texas',
    price: '$$',
    schoolRating: 'A',
    medianHomePrice: 445000,
    population: 53482,
    crimeRate: 1.0,
    avgCommute: 23,
    walkScore: 35,
    type: 'Suburban',
    image: 'https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop',
    demographics: {
      medianAge: 38,
      medianHouseholdIncome: 95000,
      collegeEducated: 78,
      marriedCouples: 72
    },
    housing: {
      homeOwnership: 82,
      avgHomeSize: 2500,
      propertyTax: 2.2,
      avgRent: 1850
    },
    amenities: {
      parks: 18,
      restaurants: 125,
      shopping: 16,
      healthcare: 10,
      entertainment: 15
    },
    employment: {
      unemploymentRate: 2.6,
      majorEmployers: ['American Airlines', 'Gaylord Texan', 'GameStop'],
      averageWage: 70000
    },
    climate: {
      avgTemp: 76,
      rainyDays: 81,
      sunnyDays: 228
    }
  },
  {
    id: 'pflugerville',
    name: 'Pflugerville',
    city: 'Austin',
    region: 'Central Texas',
    price: '$',
    schoolRating: 'A',
    medianHomePrice: 315000,
    population: 71145,
    crimeRate: 1.5,
    avgCommute: 28,
    walkScore: 32,
    type: 'Suburban',
    image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop',
    demographics: {
      medianAge: 33,
      medianHouseholdIncome: 75000,
      collegeEducated: 68,
      marriedCouples: 70
    },
    housing: {
      homeOwnership: 80,
      avgHomeSize: 2300,
      propertyTax: 2.3,
      avgRent: 1500
    },
    amenities: {
      parks: 17,
      restaurants: 85,
      shopping: 11,
      healthcare: 7,
      entertainment: 9
    },
    employment: {
      unemploymentRate: 3.5,
      majorEmployers: ['Pflugerville ISD', 'Dell Technologies', 'Seton Healthcare'],
      averageWage: 62000
    },
    climate: {
      avgTemp: 78,
      rainyDays: 87,
      sunnyDays: 223
    }
  },
  {
    id: 'georgetown',
    name: 'Georgetown',
    city: 'Austin',
    region: 'Central Texas',
    price: '$$',
    schoolRating: 'A',
    medianHomePrice: 385000,
    population: 79430,
    crimeRate: 1.2,
    avgCommute: 31,
    walkScore: 30,
    type: 'Historic',
    image: 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop',
    demographics: {
      medianAge: 35,
      medianHouseholdIncome: 82000,
      collegeEducated: 70,
      marriedCouples: 73
    },
    housing: {
      homeOwnership: 83,
      avgHomeSize: 2500,
      propertyTax: 2.2,
      avgRent: 1650
    },
    amenities: {
      parks: 19,
      restaurants: 105,
      shopping: 13,
      healthcare: 8,
      entertainment: 11
    },
    employment: {
      unemploymentRate: 3.1,
      majorEmployers: ['Georgetown ISD', 'Southwestern University', 'St. Davids HealthCare'],
      averageWage: 65000
    },
    climate: {
      avgTemp: 78,
      rainyDays: 86,
      sunnyDays: 225
    }
  },
  {
    id: 'garland',
    name: 'Garland',
    city: 'Dallas',
    region: 'North Texas',
    price: '$',
    schoolRating: 'B',
    medianHomePrice: 255000,
    population: 246018,
    crimeRate: 2.1,
    avgCommute: 28,
    walkScore: 38,
    type: 'Urban',
    image: 'https://images.pexels.com/photos/2089701/pexels-photo-2089701.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop',
    demographics: {
      medianAge: 33,
      medianHouseholdIncome: 58000,
      collegeEducated: 52,
      marriedCouples: 58
    },
    housing: {
      homeOwnership: 68,
      avgHomeSize: 1900,
      propertyTax: 2.5,
      avgRent: 1250
    },
    amenities: {
      parks: 25,
      restaurants: 145,
      shopping: 18,
      healthcare: 12,
      entertainment: 15
    },
    employment: {
      unemploymentRate: 4.8,
      majorEmployers: ['Garland ISD', 'Kraft Heinz', 'Resistol Hat Company'],
      averageWage: 52000
    },
    climate: {
      avgTemp: 77,
      rainyDays: 89,
      sunnyDays: 218
    }
  }
];

// Export basic community data for ExplorePage
export const getBasicCommunityData = (): CommunityBasic[] => {
  return sampleCommunities.map(community => ({
    id: community.id,
    name: community.name,
    city: community.city,
    region: community.region,
    price: community.price,
    schoolRating: community.schoolRating,
    medianHomePrice: community.medianHomePrice,
    population: community.population,
    crimeRate: community.crimeRate,
    avgCommute: community.avgCommute,
    walkScore: community.walkScore,
    type: community.type,
    image: community.image
  }));
};
