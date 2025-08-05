/**
 * Real Estate API Service
 * Integrates with multiple real estate APIs for comprehensive housing market data
 */

export interface PropertyListing {
  id: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  propertyType: 'single-family' | 'condo' | 'townhouse' | 'multi-family';
  listingDate: string;
  status: 'active' | 'pending' | 'sold';
  images: string[];
  description: string;
  features: string[];
  coordinates: { lat: number; lng: number };
}

export interface MarketData {
  medianHomePrice: number;
  medianPricePerSqFt: number;
  averageDaysOnMarket: number;
  inventoryMonths: number;
  priceChange1Year: number;
  priceChange3Month: number;
  salesVolume: number;
  priceHistory: {
    date: string;
    medianPrice: number;
    salesCount: number;
  }[];
}

export interface RentalData {
  averageRent: number;
  rentPerSqFt: number;
  vacancyRate: number;
  rentChange1Year: number;
  availableUnits: number;
}

export interface HousingStock {
  totalUnits: number;
  ownerOccupied: number;
  renterOccupied: number;
  vacant: number;
  newConstruction: number;
  constructionPermits: number;
  propertyTypeBreakdown: {
    singleFamily: number;
    condo: number;
    townhouse: number;
    multifamily: number;
  };
}

export class RealEstateService {
  private static readonly RAPIDAPI_REALTOR_URL = 'https://realtor.p.rapidapi.com';
  private static readonly RAPIDAPI_HOST = 'realtor.p.rapidapi.com';
  
  /**
   * Get comprehensive market data for a community
   */
  static async getMarketData(
    _communityId: string, 
    zipCode?: string, 
    coordinates?: { lat: number; lng: number }
  ): Promise<MarketData | null> {
    try {
      // Try multiple APIs for market data
      const marketData = await this.fetchFromMultipleSources([
        () => this.getRealtyMoleMarketData(zipCode || ''),
        () => this.getZillowMarketData(zipCode || ''),
        () => this.getCensusHousingData(coordinates)
      ]);

      return marketData;
    } catch (error) {
      console.error('Real Estate Market Data Error:', error);
      return null;
    }
  }

  /**
   * Get property listings for a community
   */
  static async getPropertyListings(
    communityId: string,
    filters?: {
      minPrice?: number;
      maxPrice?: number;
      bedrooms?: number;
      propertyType?: string;
      limit?: number;
    }
  ): Promise<PropertyListing[]> {
    try {
      const zipCode = await this.getZipCodeForCommunity(communityId);
      if (!zipCode) return [];

      // Fetch from multiple listing sources
      const listings = await Promise.allSettled([
        this.getRentspreeListings(zipCode, filters),
        this.getRealtyMoleListings(zipCode, filters)
      ]);

      const allListings: PropertyListing[] = [];
      listings.forEach(result => {
        if (result.status === 'fulfilled' && result.value) {
          allListings.push(...result.value);
        }
      });

      return allListings.slice(0, filters?.limit || 20);
    } catch (error) {
      console.error('Property Listings Error:', error);
      return [];
    }
  }

  /**
   * Get rental market data
   */
  static async getRentalData(communityId: string): Promise<RentalData | null> {
    try {
      const zipCode = await this.getZipCodeForCommunity(communityId);
      if (!zipCode) return null;

      const response = await fetch(
        `${this.REALTY_MOLE_API_URL}/rentalPrice?zipCode=${zipCode}`,
        {
          headers: {
            'X-Api-Key': import.meta.env.VITE_REALTY_MOLE_API_KEY || ''
          }
        }
      );

      if (!response.ok) throw new Error('Rental data fetch failed');
      
      const data = await response.json();
      return this.parseRentalData(data);
    } catch (error) {
      console.error('Rental Data Error:', error);
      return null;
    }
  }

  /**
   * Get housing stock and inventory data
   */
  static async getHousingStock(communityId: string): Promise<HousingStock | null> {
    try {
      // Combine Census data with real estate APIs
      const [censusData] = await Promise.allSettled([
        this.getCensusHousingStock(communityId),
        this.getMarketInventoryData(communityId)
      ]);

      if (censusData.status === 'fulfilled' && censusData.value) {
        return censusData.value;
      }

      return null;
    } catch (error) {
      console.error('Housing Stock Error:', error);
      return null;
    }
  }

  // Private helper methods
  private static async fetchFromMultipleSources<T>(
    fetchFunctions: (() => Promise<T | null>)[]
  ): Promise<T | null> {
    for (const fetchFn of fetchFunctions) {
      try {
        const result = await fetchFn();
        if (result) return result;
      } catch (error) {
        console.warn('API source failed, trying next:', error);
        continue;
      }
    }
    return null;
  }

  private static async getZipCodeForCommunity(communityId: string): Promise<string | null> {
    // This would typically come from your community database
    const communityZipCodes: Record<string, string> = {
      'westlake': '78746',
      'the-woodlands': '77381',
      'plano': '75023',
      'katy': '77494',
      'allen-frisco': '75013',
      'round-rock': '78664',
      'southlake': '76092',
      'sugar-land': '77479',
      // Add more as needed
    };

    return communityZipCodes[communityId] || null;
  }

  private static async getRealtyMoleMarketData(zipCode: string): Promise<MarketData | null> {
    try {
      const response = await fetch(
        `${this.REALTY_MOLE_API_URL}/salesComparables?zipCode=${zipCode}&limit=100`,
        {
          headers: {
            'X-Api-Key': import.meta.env.VITE_REALTY_MOLE_API_KEY || ''
          }
        }
      );

      if (!response.ok) return null;
      const data = await response.json();
      return this.parseRealtyMoleMarketData(data);
    } catch (error) {
      return null;
    }
  }

  private static async getZillowMarketData(_zipCode: string): Promise<MarketData | null> {
    // Zillow API integration would go here
    // Note: Zillow has restrictions on their API access
    return null;
  }

  private static async getCensusHousingData(_coordinates?: { lat: number; lng: number }): Promise<MarketData | null> {
    // Integrate with Census API for housing data
    return null;
  }

  private static async getRentspreeListings(
    zipCode: string, 
    filters?: any
  ): Promise<PropertyListing[]> {
    try {
      const response = await fetch(
        `${this.RENTSPREE_API_URL}/listings?zipCode=${zipCode}&limit=${filters?.limit || 20}`,
        {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_RENTSPREE_API_KEY || ''}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) return [];
      const data = await response.json();
      return this.parseRentspreeListings(data);
    } catch (error) {
      return [];
    }
  }

  private static async getRealtyMoleListings(
    zipCode: string,
    filters?: any
  ): Promise<PropertyListing[]> {
    try {
      const response = await fetch(
        `${this.REALTY_MOLE_API_URL}/properties?zipCode=${zipCode}&limit=${filters?.limit || 20}`,
        {
          headers: {
            'X-Api-Key': import.meta.env.VITE_REALTY_MOLE_API_KEY || ''
          }
        }
      );

      if (!response.ok) return [];
      const data = await response.json();
      return this.parseRealtyMoleListings(data);
    } catch (error) {
      return [];
    }
  }

  private static async getCensusHousingStock(_communityId: string): Promise<HousingStock | null> {
    // Integrate with Census API for housing stock data
    return null;
  }

  private static async getMarketInventoryData(_communityId: string): Promise<Partial<HousingStock> | null> {
    // Get current market inventory from real estate APIs
    return null;
  }

  // Data parsing methods
  private static parseRealtyMoleMarketData(data: any): MarketData {
    return {
      medianHomePrice: data.medianPrice || 0,
      medianPricePerSqFt: data.pricePerSquareFoot || 0,
      averageDaysOnMarket: data.daysOnMarket || 0,
      inventoryMonths: data.monthsOfSupply || 0,
      priceChange1Year: data.priceChange1Year || 0,
      priceChange3Month: data.priceChange3Month || 0,
      salesVolume: data.salesCount || 0,
      priceHistory: data.priceHistory || []
    };
  }

  private static parseRentalData(data: any): RentalData {
    return {
      averageRent: data.averageRent || 0,
      rentPerSqFt: data.rentPerSquareFoot || 0,
      vacancyRate: data.vacancyRate || 0,
      rentChange1Year: data.rentChange1Year || 0,
      availableUnits: data.availableUnits || 0
    };
  }

  private static parseRentspreeListings(data: any): PropertyListing[] {
    return (data.listings || []).map((listing: any) => ({
      id: listing.id,
      address: listing.address,
      price: listing.price,
      bedrooms: listing.bedrooms,
      bathrooms: listing.bathrooms,
      squareFeet: listing.squareFeet,
      propertyType: listing.propertyType,
      listingDate: listing.listDate,
      status: listing.status,
      images: listing.images || [],
      description: listing.description || '',
      features: listing.features || [],
      coordinates: listing.coordinates || { lat: 0, lng: 0 }
    }));
  }

  private static parseRealtyMoleListings(data: any): PropertyListing[] {
    return (data.properties || []).map((property: any) => ({
      id: property.id,
      address: property.address,
      price: property.price,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      squareFeet: property.squareFeet,
      propertyType: property.propertyType,
      listingDate: property.listDate,
      status: property.status,
      images: property.photos || [],
      description: property.description || '',
      features: property.features || [],
      coordinates: { 
        lat: property.latitude || 0, 
        lng: property.longitude || 0 
      }
    }));
  }
}
