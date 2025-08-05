// Analytics utility for tracking demo interactions
interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

class Analytics {
  private isEnabled: boolean;
  private isDemoMode: boolean;

  constructor() {
    this.isEnabled = import.meta.env.VITE_ENABLE_ANALYTICS === 'true';
    this.isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';
  }

  // Track demo interactions
  track(event: AnalyticsEvent) {
    if (!this.isEnabled && !this.isDemoMode) return;

    // In demo mode, just log to console
    if (this.isDemoMode) {
      console.log('📊 Demo Analytics:', event);
      return;
    }

    // In production, send to Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value
      });
    }
  }

  // Track page views
  trackPageView(page: string, title?: string) {
    if (this.isDemoMode) {
      console.log('📊 Page View:', { page, title });
      return;
    }

    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
        page_title: title,
        page_location: window.location.href,
        page_path: page
      });
    }
  }

  // Track community interactions
  trackCommunityView(communityId: string, communityName: string) {
    this.track({
      action: 'view_community',
      category: 'Community',
      label: `${communityId}:${communityName}`
    });
  }

  trackCommunityCompare(communities: string[]) {
    this.track({
      action: 'compare_communities',
      category: 'Comparison',
      label: communities.join(','),
      value: communities.length
    });
  }

  trackLeadCapture(type: string, communityId?: string) {
    this.track({
      action: 'lead_capture',
      category: 'Lead Generation',
      label: `${type}:${communityId || 'general'}`
    });
  }

  trackSearch(query: string, resultsCount: number) {
    this.track({
      action: 'search',
      category: 'Search',
      label: query,
      value: resultsCount
    });
  }

  trackFilter(filterType: string, filterValue: string) {
    this.track({
      action: 'filter',
      category: 'Filter',
      label: `${filterType}:${filterValue}`
    });
  }

  trackFavorite(communityId: string, action: 'add' | 'remove') {
    this.track({
      action: `favorite_${action}`,
      category: 'Favorites',
      label: communityId
    });
  }
}

// Global analytics instance
export const analytics = new Analytics();

// Type declaration for gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

// React hook for analytics
export const useAnalytics = () => {
  return {
    trackPageView: analytics.trackPageView.bind(analytics),
    trackCommunityView: analytics.trackCommunityView.bind(analytics),
    trackCommunityCompare: analytics.trackCommunityCompare.bind(analytics),
    trackLeadCapture: analytics.trackLeadCapture.bind(analytics),
    trackSearch: analytics.trackSearch.bind(analytics),
    trackFilter: analytics.trackFilter.bind(analytics),
    trackFavorite: analytics.trackFavorite.bind(analytics)
  };
};
