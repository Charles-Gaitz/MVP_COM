// Free-tier API optimization service to minimize costs and maximize efficiency
export interface APIUsageStats {
  calls_today: number;
  calls_this_month: number;
  last_reset: string;
  limits: {
    daily: number;
    monthly: number;
  };
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

export class FreeTierManager {
  private static readonly CACHE_PREFIX = 'mvp_cache_';
  private static readonly USAGE_PREFIX = 'mvp_usage_';
  
  // Free tier limits for each service
  private static readonly SERVICE_LIMITS = {
    google_maps: { daily: 100, monthly: 2500 },      // Google Maps free tier
    weather: { daily: 1000, monthly: 10000 },        // OpenWeather free tier
    news: { daily: 100, monthly: 1000 },             // News API free tier
    school_data: { daily: 50, monthly: 500 },        // School APIs (typically low limits)
    real_estate: { daily: 25, monthly: 100 }         // Real estate APIs (very limited free tiers)
  };

  // Cache durations (in milliseconds)
  private static readonly CACHE_DURATIONS = {
    community_data: 24 * 60 * 60 * 1000,      // 24 hours
    weather_data: 60 * 60 * 1000,             // 1 hour
    market_data: 6 * 60 * 60 * 1000,          // 6 hours
    school_data: 7 * 24 * 60 * 60 * 1000,     // 7 days
    news_data: 30 * 60 * 1000,                // 30 minutes
    places_data: 2 * 60 * 60 * 1000           // 2 hours
  };

  // Check if API call is allowed
  static canMakeAPICall(service: keyof typeof this.SERVICE_LIMITS): boolean {
    const usage = this.getUsageStats(service);
    const limits = this.SERVICE_LIMITS[service];
    
    return usage.calls_today < limits.daily && usage.calls_this_month < limits.monthly;
  }

  // Record API call
  static recordAPICall(service: keyof typeof this.SERVICE_LIMITS): void {
    const key = `${this.USAGE_PREFIX}${service}`;
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const month = now.toISOString().slice(0, 7);
    
    const usage = this.getUsageStats(service);
    
    // Reset daily count if new day
    if (usage.last_reset !== today) {
      usage.calls_today = 0;
      usage.last_reset = today;
    }
    
    // Reset monthly count if new month
    const lastMonth = usage.last_reset.slice(0, 7);
    if (lastMonth !== month) {
      usage.calls_this_month = 0;
    }
    
    usage.calls_today++;
    usage.calls_this_month++;
    
    localStorage.setItem(key, JSON.stringify(usage));
  }

  // Get usage statistics
  static getUsageStats(service: keyof typeof this.SERVICE_LIMITS): APIUsageStats {
    const key = `${this.USAGE_PREFIX}${service}`;
    const stored = localStorage.getItem(key);
    const limits = this.SERVICE_LIMITS[service];
    
    if (!stored) {
      return {
        calls_today: 0,
        calls_this_month: 0,
        last_reset: new Date().toISOString().split('T')[0],
        limits
      };
    }
    
    try {
      const usage = JSON.parse(stored);
      return { ...usage, limits };
    } catch {
      return {
        calls_today: 0,
        calls_this_month: 0,
        last_reset: new Date().toISOString().split('T')[0],
        limits
      };
    }
  }

  // Cache management
  static setCache<T>(key: string, data: T, duration?: number): void {
    const expiry = Date.now() + (duration || this.CACHE_DURATIONS.community_data);
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiry
    };
    
    try {
      localStorage.setItem(`${this.CACHE_PREFIX}${key}`, JSON.stringify(entry));
    } catch (error) {
      console.warn('Cache storage failed:', error);
      // If localStorage is full, clear old entries
      this.clearExpiredCache();
    }
  }

  static getCache<T>(key: string): T | null {
    try {
      const stored = localStorage.getItem(`${this.CACHE_PREFIX}${key}`);
      if (!stored) return null;
      
      const entry: CacheEntry<T> = JSON.parse(stored);
      
      // Check if cache has expired
      if (Date.now() > entry.expiry) {
        localStorage.removeItem(`${this.CACHE_PREFIX}${key}`);
        return null;
      }
      
      return entry.data;
    } catch {
      return null;
    }
  }

  // Clear expired cache entries
  static clearExpiredCache(): void {
    const now = Date.now();
    
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (!key?.startsWith(this.CACHE_PREFIX)) continue;
      
      try {
        const stored = localStorage.getItem(key);
        if (!stored) continue;
        
        const entry = JSON.parse(stored);
        if (now > entry.expiry) {
          localStorage.removeItem(key);
        }
      } catch {
        // Remove corrupted entries
        localStorage.removeItem(key);
      }
    }
  }

  // Smart fallback data for when APIs are exhausted
  static getFallbackData(type: string, location?: string): any {
    switch (type) {
      case 'weather':
        return {
          current: {
            temperature: 75,
            condition: 'Clear',
            humidity: 65,
            windSpeed: 8,
            uvIndex: 5
          },
          forecast: Array.from({ length: 5 }, (_, i) => ({
            date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString(),
            high: 78 + Math.random() * 10,
            low: 65 + Math.random() * 8,
            condition: ['Clear', 'Partly Cloudy', 'Sunny'][Math.floor(Math.random() * 3)],
            precipitation: Math.random() * 0.1
          }))
        };
        
      case 'market_data':
        return {
          medianPrice: 400000 + Math.random() * 200000,
          pricePerSqFt: 150 + Math.random() * 100,
          marketTrend: ['rising', 'stable', 'falling'][Math.floor(Math.random() * 3)],
          monthlyChange: (Math.random() - 0.5) * 5,
          yearlyChange: (Math.random() - 0.3) * 20,
          inventory: 100 + Math.random() * 200,
          daysOnMarket: 20 + Math.random() * 40
        };
        
      case 'school_data':
        return {
          id: 'fallback',
          name: `${location || 'Local'} School District`,
          rating: 7 + Math.random() * 2,
          totalSchools: 10 + Math.floor(Math.random() * 20),
          totalEnrollment: 5000 + Math.floor(Math.random() * 10000),
          averageTestScores: {
            reading: 75 + Math.random() * 20,
            math: 70 + Math.random() * 25,
            science: 72 + Math.random() * 23
          }
        };
        
      case 'nearby_places':
        return [
          { name: 'Local Restaurant', type: 'restaurant', rating: 4.2, distance: '0.5 mi' },
          { name: 'Community Park', type: 'park', rating: 4.5, distance: '0.3 mi' },
          { name: 'Shopping Center', type: 'shopping', rating: 4.0, distance: '1.2 mi' }
        ];
        
      default:
        return null;
    }
  }

  // Priority system for API calls
  static getPriority(service: keyof typeof this.SERVICE_LIMITS, context: string): number {
    // Higher number = higher priority
    const basePriority = {
      weather: 3,          // Weather is quick and users expect it
      google_maps: 2,      // Maps are important but can be cached
      news: 1,             // News is nice-to-have
      school_data: 4,      // School data is crucial for decisions
      real_estate: 5       // Real estate data is most important
    };
    
    // Context-based priority adjustments
    const contextBoost: Record<string, number> = {
      'user_interaction': 2,    // User directly requested data
      'page_load': 1,          // Initial page load
      'background_refresh': 0   // Background updates
    };
    
    return (basePriority[service] || 1) + (contextBoost[context] || 0);
  }

  // Get API usage dashboard data
  static getUsageDashboard() {
    const services = Object.keys(this.SERVICE_LIMITS) as Array<keyof typeof this.SERVICE_LIMITS>;
    
    return services.map(service => {
      const usage = this.getUsageStats(service);
      const dailyPercent = (usage.calls_today / usage.limits.daily) * 100;
      const monthlyPercent = (usage.calls_this_month / usage.limits.monthly) * 100;
      
      return {
        service,
        usage,
        dailyPercent: Math.round(dailyPercent),
        monthlyPercent: Math.round(monthlyPercent),
        status: dailyPercent > 90 ? 'critical' : dailyPercent > 70 ? 'warning' : 'ok'
      };
    });
  }

  // Intelligent data refresh strategy
  static shouldRefreshData(key: string, priority: number): boolean {
    const cached = this.getCache(key);
    if (!cached) return true;
    
    const cacheAge = Date.now() - JSON.parse(localStorage.getItem(`${this.CACHE_PREFIX}${key}`)!).timestamp;
    const maxAge = this.CACHE_DURATIONS.community_data;
    
    // Refresh based on priority and cache age
    const ageRatio = cacheAge / maxAge;
    const refreshThreshold = Math.max(0.1, 1 - (priority * 0.2));
    
    return ageRatio > refreshThreshold;
  }
}
