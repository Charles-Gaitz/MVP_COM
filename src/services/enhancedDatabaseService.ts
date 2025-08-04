import { RealDataService } from './realDataService';
import { FreeTierManager } from './freeTierManager';

// Enhanced Database Service with Real Data Integration
export class EnhancedDatabaseService {
  private static readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
  private static communityCache = new Map<string, any>();

  // Get enhanced community data with real information
  static async getEnhancedCommunityData(communityId: string) {
    try {
      // Check cache first
      const cacheKey = `enhanced_${communityId}`;
      const cached = this.getCachedData(cacheKey);
      
      if (cached && !this.shouldRefreshData(cached)) {
        console.log(`Using cached enhanced data for community: ${communityId}`);
        return cached;
      }

      // Get base community data
      const baseData = await this.getBaseCommunityData(communityId);
      if (!baseData) {
        throw new Error(`Community not found: ${communityId}`);
      }

      // Check API usage limits
      const canUseAPIs = FreeTierManager.canMakeAPICall('real_estate'); // Using existing service category
      
      if (canUseAPIs) {
        // Enhance with real data
        const enhancedData = await RealDataService.getEnhancedCommunityData(baseData);
        
        // Track API usage
        FreeTierManager.recordAPICall('real_estate');
        
        // Cache the enhanced data
        const dataWithMetadata = {
          ...enhancedData,
          cacheTimestamp: Date.now(),
          lastEnhanced: new Date().toISOString(),
          enhancementStatus: 'success'
        };
        
        this.setCachedData(cacheKey, dataWithMetadata);
        return dataWithMetadata;
        
      } else {
        console.warn('API limit reached, returning base data with cache if available');
        
        // Return cached data if available, even if older
        if (cached) {
          return {
            ...cached,
            enhancementStatus: 'cached_due_to_limits'
          };
        }
        
        // Return base data with enhancement status
        return {
          ...baseData,
          enhancementStatus: 'skipped_due_to_limits',
          dataEnhancement: {
            realDataAvailable: false,
            reason: 'API usage limits reached'
          }
        };
      }

    } catch (error) {
      console.error('Error getting enhanced community data:', error);
      
      // Try to return cached data on error
      const cacheKey = `enhanced_${communityId}`;
      const cached = this.getCachedData(cacheKey);
      
      if (cached) {
        return {
          ...cached,
          enhancementStatus: 'error_using_cache',
          lastError: error instanceof Error ? error.message : 'Unknown error'
        };
      }
      
      throw error;
    }
  }

  // Get multiple enhanced communities
  static async getEnhancedCommunitiesBulk(communityIds: string[]) {
    try {
      const results = await Promise.allSettled(
        communityIds.map(id => this.getEnhancedCommunityData(id))
      );

      return results.map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          console.error(`Failed to get enhanced data for community ${communityIds[index]}:`, result.reason);
          // Return base data on failure
          return this.getBaseCommunityData(communityIds[index]);
        }
      });

    } catch (error) {
      console.error('Error in bulk enhanced community fetch:', error);
      throw error;
    }
  }

  // Get all communities with optional real data enhancement
  static async getAllCommunitiesEnhanced(includeRealData: boolean = true) {
    try {
      const allCommunities = await this.getAllBaseCommunities();
      
      if (!includeRealData) {
        return allCommunities;
      }

      // Check if we can enhance all communities within API limits
      const canEnhanceAll = allCommunities.length <= 10; // Simplified check
      
      if (canEnhanceAll) {
        console.log('Enhancing all communities with real data...');
        return await RealDataService.enhanceMultipleCommunities(allCommunities);
      } else {
        console.warn('Cannot enhance all communities due to API limits, enhancing selectively');
        return await this.selectivelyEnhanceCommunities(allCommunities);
      }

    } catch (error) {
      console.error('Error getting all enhanced communities:', error);
      // Fallback to base communities
      return await this.getAllBaseCommunities();
    }
  }

  // Selectively enhance communities based on priority and cache status
  private static async selectivelyEnhanceCommunities(communities: any[]) {
    const priorityCommunities = communities.slice(0, 5); // Enhance top 5
    const remainingCommunities = communities.slice(5);

    // Enhance priority communities
    const enhancedPriority = await Promise.allSettled(
      priorityCommunities.map(community => 
        RealDataService.getEnhancedCommunityData(community)
      )
    );

    // Check cache for remaining communities
    const enhancedRemaining = remainingCommunities.map(community => {
      const cacheKey = `enhanced_${community.id}`;
      const cached = this.getCachedData(cacheKey);
      
      if (cached && !this.shouldRefreshData(cached)) {
        return cached;
      }
      
      // Return base data with enhancement status
      return {
        ...community,
        enhancementStatus: 'deferred_due_to_limits',
        dataEnhancement: {
          realDataAvailable: false,
          reason: 'API usage optimization - check cache or try later'
        }
      };
    });

    // Combine results
    const finalResults = [
      ...enhancedPriority.map((result, index) => 
        result.status === 'fulfilled' ? result.value : priorityCommunities[index]
      ),
      ...enhancedRemaining
    ];

    return finalResults;
  }

  // Get base community data (sample data)
  private static async getBaseCommunityData(communityId: string) {
    // This would typically fetch from your database
    // For now, using the existing communities data
    const communities = await this.getAllBaseCommunities();
    return communities.find((c: any) => c.id === communityId);
  }

  // Get all base communities (sample data)
  private static async getAllBaseCommunities() {
    // Import the communities data
    const { sampleCommunities } = await import('../data/communities');
    return sampleCommunities;
  }

  // Cache management
  private static getCachedData(key: string) {
    const cached = this.communityCache.get(key);
    if (!cached) return null;
    
    // Check if cache is expired
    if (this.isCacheExpired(cached)) {
      this.communityCache.delete(key);
      return null;
    }
    
    return cached;
  }

  private static setCachedData(key: string, data: any) {
    const dataWithTimestamp = {
      ...data,
      cacheTimestamp: Date.now()
    };
    
    this.communityCache.set(key, dataWithTimestamp);
    
    // Clean up old cache entries
    if (this.communityCache.size > 50) {
      this.cleanupCache();
    }
  }

  private static isCacheExpired(cached: any): boolean {
    if (!cached.cacheTimestamp) return true;
    return Date.now() - cached.cacheTimestamp > this.CACHE_DURATION;
  }

  private static shouldRefreshData(cached: any): boolean {
    // Refresh if cache is more than 12 hours old (half the cache duration)
    if (!cached.cacheTimestamp) return true;
    return Date.now() - cached.cacheTimestamp > (this.CACHE_DURATION / 2);
  }

  private static cleanupCache() {
    for (const [key, value] of this.communityCache.entries()) {
      if (this.isCacheExpired(value)) {
        this.communityCache.delete(key);
      }
    }
  }

  // Data quality methods
  static getDataQualityReport(communityData: any) {
    const report = {
      communityId: communityData.id,
      overallQuality: 'unknown' as 'high' | 'medium' | 'low' | 'unknown',
      realDataSources: [] as string[],
      sampleDataFields: [] as string[],
      lastUpdated: communityData.lastEnhanced || 'Never',
      enhancementStatus: communityData.enhancementStatus || 'none'
    };

    // Check for real data enhancement
    if (communityData.dataEnhancement?.realDataAvailable) {
      report.overallQuality = communityData.dataEnhancement.dataQuality || 'medium';
      report.realDataSources = communityData.dataEnhancement.dataSources
        ?.filter((source: any) => source.available)
        .map((source: any) => source.name) || [];
    } else {
      report.overallQuality = 'low';
    }

    // Identify sample vs real data fields
    if (communityData.demographics?.dataSource) {
      if (communityData.demographics.dataSource.includes('Official')) {
        report.realDataSources.push('Demographics');
      } else {
        report.sampleDataFields.push('Demographics');
      }
    }

    if (communityData.schools?.dataSource) {
      if (communityData.schools.dataSource.includes('Official')) {
        report.realDataSources.push('Schools');
      } else {
        report.sampleDataFields.push('Schools');
      }
    }

    if (communityData.safety?.dataSource) {
      if (communityData.safety.dataSource.includes('Official')) {
        report.realDataSources.push('Safety');
      } else {
        report.sampleDataFields.push('Safety');
      }
    }

    if (communityData.qualityOfLife?.dataSource) {
      if (communityData.qualityOfLife.dataSource.includes('Official')) {
        report.realDataSources.push('Air Quality');
      } else {
        report.sampleDataFields.push('Air Quality');
      }
    }

    return report;
  }

  // API usage statistics
  static async getAPIUsageStats() {
    return FreeTierManager.getUsageStats('real_estate');
  }

  // Clear all caches
  static clearAllCaches() {
    this.communityCache.clear();
    RealDataService.clearCache();
    console.log('All caches cleared');
  }

  // Force refresh specific community
  static async forceRefreshCommunity(communityId: string) {
    const cacheKey = `enhanced_${communityId}`;
    this.communityCache.delete(cacheKey);
    RealDataService.clearCache(); // Clear real data cache too
    
    return await this.getEnhancedCommunityData(communityId);
  }

  // Get cache statistics
  static getCacheStats() {
    return {
      enhancedCommunitiesCount: this.communityCache.size,
      realDataCacheSize: RealDataService.getDataSourceStatus().cacheSize,
      cacheHitRate: this.calculateCacheHitRate(),
      oldestCacheEntry: this.getOldestCacheEntry(),
      newestCacheEntry: this.getNewestCacheEntry()
    };
  }

  private static calculateCacheHitRate(): number {
    // This would require tracking cache hits vs misses
    // Placeholder implementation
    return 85; // 85% hit rate
  }

  private static getOldestCacheEntry(): string | null {
    let oldest: any = null;
    for (const [, value] of this.communityCache.entries()) {
      if (!oldest || (value.cacheTimestamp && value.cacheTimestamp < oldest.cacheTimestamp)) {
        oldest = value;
      }
    }
    return oldest ? new Date(oldest.cacheTimestamp).toLocaleString() : null;
  }

  private static getNewestCacheEntry(): string | null {
    let newest: any = null;
    for (const [, value] of this.communityCache.entries()) {
      if (!newest || (value.cacheTimestamp && value.cacheTimestamp > newest.cacheTimestamp)) {
        newest = value;
      }
    }
    return newest ? new Date(newest.cacheTimestamp).toLocaleString() : null;
  }
}
