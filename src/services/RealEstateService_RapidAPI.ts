/**
 * Real Estate API Service - RapidAPI Realtor Data API
 * Integrates with RapidAPI's Realtor Data API for comprehensive real estate information
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
  mlsId?: string;
  daysOnMarket?: number;
  pricePerSqFt?: number;
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
  private static readonly RAPIDAPI_BASE_URL = 'https://realtor.p.rapidapi.com';
  private static readonly RAPIDAPI_HOST = 'realtor.p.rapidapi.com';

  /**
   * Get comprehensive market data for a community using RapidAPI Realtor
   */
  static async getMarketData(
    communityId: string,
    zipCode?: string,
    coordinates?: { lat: number; lng: number }
  ): Promise<MarketData | null> {
    try {
      const apiKey = import.meta.env.VITE_RAPIDAPI_REALTOR_KEY;
      if (!apiKey || apiKey === 'your_rapidapi_realtor_key_here') {
        console.warn('RapidAPI Realtor key not configured');
        return null;
      }

      // Use coordinates or zipCode to get market data
      const location = coordinates ? 
        `${coordinates.lat},${coordinates.lng}` : 
        zipCode || await this.getZipCodeForCommunity(communityId);

      if (!location) return null;

      // Get market statistics from RapidAPI Realtor
      const marketStats = await this.getRapidAPIMarketStats(location);
      const priceHistory = await this.getRapidAPIPriceHistory(location);

      if (!marketStats) return null;

      return {
        medianHomePrice: marketStats.median_listing_price || 0,
        medianPricePerSqFt: marketStats.median_price_per_sqft || 0,
        averageDaysOnMarket: marketStats.median_days_on_market || 0,
        inventoryMonths: marketStats.months_of_supply || 0,
        priceChange1Year: marketStats.price_change_year_over_year || 0,
        priceChange3Month: marketStats.price_change_three_month || 0,
        salesVolume: marketStats.total_sales || 0,
        priceHistory: priceHistory || []
      };
    } catch (error) {
      console.error('RapidAPI Realtor Market Data Error:', error);
      return null;
    }
  }

  /**
   * Get property listings using RapidAPI Realtor
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
      const apiKey = import.meta.env.VITE_RAPIDAPI_REALTOR_KEY;
      if (!apiKey || apiKey === 'your_rapidapi_realtor_key_here') {
        console.warn('RapidAPI Realtor key not configured');
        return [];
      }

      const zipCode = await this.getZipCodeForCommunity(communityId);
      if (!zipCode) return [];

      const params = new URLSearchParams({
        postal_code: zipCode,
        limit: (filters?.limit || 20).toString(),
        offset: '0',
        sort: 'newest'
      });

      if (filters?.minPrice) params.append('price_min', filters.minPrice.toString());
      if (filters?.maxPrice) params.append('price_max', filters.maxPrice.toString());
      if (filters?.bedrooms) params.append('beds_min', filters.bedrooms.toString());
      if (filters?.propertyType) params.append('prop_type', filters.propertyType);

      const response = await fetch(
        `${this.RAPIDAPI_BASE_URL}/properties/v3/list?${params}`,
        {
          headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': this.RAPIDAPI_HOST
          }
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 403 && errorText.includes('not subscribed')) {
          console.warn('RapidAPI Realtor: Subscription required for this endpoint');
          return [];
        }
        console.warn('RapidAPI Realtor listings request failed:', response.status, errorText);
        return [];
      }

      const data = await response.json();
      return this.parseRapidAPIListings(data);
    } catch (error) {
      console.error('RapidAPI Realtor Listings Error:', error);
      return [];
    }
  }

  /**
   * Get rental market data using RapidAPI Realtor
   */
  static async getRentalData(communityId: string): Promise<RentalData | null> {
    try {
      const apiKey = import.meta.env.VITE_RAPIDAPI_REALTOR_KEY;
      if (!apiKey || apiKey === 'your_rapidapi_realtor_key_here') {
        return null;
      }

      const zipCode = await this.getZipCodeForCommunity(communityId);
      if (!zipCode) return null;

      const response = await fetch(
        `${this.RAPIDAPI_BASE_URL}/rentals/v2/list?postal_code=${zipCode}&limit=50`,
        {
          headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': this.RAPIDAPI_HOST
          }
        }
      );

      if (!response.ok) return null;

      const data = await response.json();
      return this.parseRapidAPIRentalData(data);
    } catch (error) {
      console.error('RapidAPI Realtor Rental Data Error:', error);
      return null;
    }
  }

  /**
   * Get housing stock and inventory data
   */
  static async getHousingStock(communityId: string): Promise<HousingStock | null> {
    try {
      // Combine RapidAPI data with Census data for comprehensive housing stock
      const marketData = await this.getMarketData(communityId);
      
      // This would integrate with Census API for complete housing stock data
      // For now, return null to indicate this data source needs Census integration
      return null;
    } catch (error) {
      console.error('Housing Stock Error:', error);
      return null;
    }
  }

  // Private helper methods
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

  private static async getRapidAPIMarketStats(location: string): Promise<any> {
    try {
      const apiKey = import.meta.env.VITE_RAPIDAPI_REALTOR_KEY;
      
      const response = await fetch(
        `${this.RAPIDAPI_BASE_URL}/locations/v2/search?input=${encodeURIComponent(location)}`,
        {
          headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': this.RAPIDAPI_HOST
          }
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 403 && errorText.includes('not subscribed')) {
          console.warn('RapidAPI Realtor: Market data requires subscription upgrade');
        }
        return null;
      }

      const data = await response.json();
      
      // Extract market statistics from location data
      if (data.autocomplete && data.autocomplete.length > 0) {
        const locationData = data.autocomplete[0];
        return locationData.market_insights || null;
      }

      return null;
    } catch (error) {
      console.error('RapidAPI Market Stats Error:', error);
      return null;
    }
  }

  private static async getRapidAPIPriceHistory(location: string): Promise<any[]> {
    try {
      // RapidAPI Realtor might have price history endpoints
      // This would need to be implemented based on available endpoints
      return [];
    } catch (error) {
      console.error('RapidAPI Price History Error:', error);
      return [];
    }
  }

  // Data parsing methods
  private static parseRapidAPIListings(data: any): PropertyListing[] {
    if (!data.data || !data.data.home_search || !data.data.home_search.results) {
      return [];
    }

    return data.data.home_search.results
      .filter((listing: any) => listing && listing.location)
      .map((listing: any) => ({
        id: listing.property_id || listing.listing_id || Math.random().toString(),
        address: this.formatAddress(listing.location.address),
        price: listing.list_price || 0,
        bedrooms: listing.description?.beds || 0,
        bathrooms: listing.description?.baths || 0,
        squareFeet: listing.description?.sqft || 0,
        propertyType: this.mapPropertyType(listing.description?.type),
        listingDate: listing.list_date || new Date().toISOString(),
        status: this.mapListingStatus(listing.status),
        images: this.extractImages(listing.primary_photo),
        description: listing.description?.text || '',
        features: listing.tags || [],
        coordinates: {
          lat: listing.location.address.coordinate?.lat || 0,
          lng: listing.location.address.coordinate?.lon || 0
        },
        mlsId: listing.mls?.id,
        daysOnMarket: listing.days_on_mls,
        pricePerSqFt: listing.price_per_sqft
      }));
  }

  private static parseRapidAPIRentalData(data: any): RentalData {
    // Parse rental data from RapidAPI response
    const rentals = data.data?.home_search?.results || [];
    
    if (rentals.length === 0) {
      return {
        averageRent: 0,
        rentPerSqFt: 0,
        vacancyRate: 0,
        rentChange1Year: 0,
        availableUnits: 0
      };
    }

    const totalRent = rentals.reduce((sum: number, rental: any) => sum + (rental.list_price || 0), 0);
    const averageRent = totalRent / rentals.length;

    return {
      averageRent,
      rentPerSqFt: averageRent / (rentals[0]?.description?.sqft || 1000),
      vacancyRate: 0, // Would need additional data source
      rentChange1Year: 0, // Would need historical data
      availableUnits: rentals.length
    };
  }

  private static formatAddress(address: any): string {
    if (!address) return '';
    
    const parts = [
      address.line,
      address.city,
      address.state_code,
      address.postal_code
    ].filter(Boolean);
    
    return parts.join(', ');
  }

  private static mapPropertyType(type: string): 'single-family' | 'condo' | 'townhouse' | 'multi-family' {
    if (!type) return 'single-family';
    
    const typeMap: Record<string, 'single-family' | 'condo' | 'townhouse' | 'multi-family'> = {
      'single_family': 'single-family',
      'condo': 'condo',
      'townhome': 'townhouse',
      'townhouse': 'townhouse',
      'multi_family': 'multi-family',
      'apartment': 'multi-family'
    };

    return typeMap[type.toLowerCase()] || 'single-family';
  }

  private static mapListingStatus(status: string): 'active' | 'pending' | 'sold' {
    if (!status) return 'active';
    
    const statusMap: Record<string, 'active' | 'pending' | 'sold'> = {
      'for_sale': 'active',
      'active': 'active',
      'pending': 'pending',
      'sold': 'sold',
      'off_market': 'sold'
    };

    return statusMap[status.toLowerCase()] || 'active';
  }

  private static extractImages(primaryPhoto: any): string[] {
    if (!primaryPhoto) return [];
    
    if (typeof primaryPhoto === 'string') {
      return [primaryPhoto];
    }
    
    if (primaryPhoto.href) {
      return [primaryPhoto.href];
    }

    return [];
  }
}
