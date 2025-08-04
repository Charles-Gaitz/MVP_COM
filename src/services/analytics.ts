// Analytics service for tracking user behavior and app performance
const GA_TRACKING_ID = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

export interface UserSession {
  session_id: string;
  user_id?: string;
  start_time: string;
  page_views: string[];
  events: AnalyticsEvent[];
  device_info: {
    browser: string;
    device_type: string;
    screen_resolution: string;
  };
}

export class AnalyticsService {
  private static sessionId: string = '';
  private static userId?: string;
  private static pageViews: string[] = [];
  private static events: AnalyticsEvent[] = [];

  // Initialize analytics
  static initialize(userId?: string): void {
    this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.userId = userId;
    this.pageViews = [];
    this.events = [];

    // Initialize Google Analytics if available
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', GA_TRACKING_ID, {
        user_id: userId,
        session_id: this.sessionId
      });
    }

    this.trackEvent({
      action: 'session_start',
      category: 'engagement'
    });
  }

  // Track page views
  static trackPageView(page: string, title?: string): void {
    this.pageViews.push(page);
    
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: title || page,
        page_location: window.location.href,
        page_path: page
      });
    }

    this.trackEvent({
      action: 'page_view',
      category: 'navigation',
      label: page
    });
  }

  // Track custom events
  static trackEvent(event: AnalyticsEvent): void {
    this.events.push({
      ...event,
      custom_parameters: {
        ...event.custom_parameters,
        timestamp: new Date().toISOString(),
        session_id: this.sessionId,
        user_id: this.userId
      }
    });

    // Send to Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.custom_parameters
      });
    }

    // Log for debugging in development
    if (import.meta.env.DEV) {
      console.log('📊 Analytics Event:', event);
    }
  }

  // Track community interactions
  static trackCommunityInteraction(action: string, communityId: string, communityName: string): void {
    this.trackEvent({
      action: action,
      category: 'community_interaction',
      label: communityName,
      custom_parameters: {
        community_id: communityId,
        community_name: communityName
      }
    });
  }

  // Track search behavior
  static trackSearch(query: string, filters: Record<string, any>, resultsCount: number): void {
    this.trackEvent({
      action: 'search',
      category: 'search',
      label: query,
      value: resultsCount,
      custom_parameters: {
        search_query: query,
        search_filters: filters,
        results_count: resultsCount
      }
    });
  }

  // Track comparison tool usage
  static trackComparison(communityIds: string[], action: 'add' | 'remove' | 'compare'): void {
    this.trackEvent({
      action: `comparison_${action}`,
      category: 'comparison_tool',
      value: communityIds.length,
      custom_parameters: {
        community_ids: communityIds,
        comparison_count: communityIds.length
      }
    });
  }

  // Track lead capture
  static trackLeadCapture(type: 'email' | 'phone' | 'contact_form', source: string): void {
    this.trackEvent({
      action: 'lead_capture',
      category: 'conversion',
      label: type,
      custom_parameters: {
        lead_type: type,
        lead_source: source
      }
    });
  }

  // Track user engagement
  static trackEngagement(action: string, duration?: number): void {
    this.trackEvent({
      action: action,
      category: 'engagement',
      value: duration,
      custom_parameters: {
        engagement_duration: duration
      }
    });
  }

  // Track errors
  static trackError(error: string, page: string, stack?: string): void {
    this.trackEvent({
      action: 'error',
      category: 'technical',
      label: error,
      custom_parameters: {
        error_message: error,
        error_page: page,
        error_stack: stack
      }
    });
  }

  // Get session data
  static getSessionData(): UserSession {
    return {
      session_id: this.sessionId,
      user_id: this.userId,
      start_time: new Date().toISOString(),
      page_views: this.pageViews,
      events: this.events,
      device_info: this.getDeviceInfo()
    };
  }

  // Get device information
  private static getDeviceInfo(): UserSession['device_info'] {
    if (typeof window === 'undefined') {
      return {
        browser: 'Unknown',
        device_type: 'Unknown',
        screen_resolution: 'Unknown'
      };
    }

    return {
      browser: navigator.userAgent,
      device_type: /Mobile|Android|iP(hone|od)/.test(navigator.userAgent) ? 'mobile' : 'desktop',
      screen_resolution: `${window.screen.width}x${window.screen.height}`
    };
  }

  // Send custom conversion events
  static trackConversion(type: string, value: number, currency: string = 'USD'): void {
    this.trackEvent({
      action: 'conversion',
      category: 'business',
      label: type,
      value: value,
      custom_parameters: {
        conversion_type: type,
        conversion_value: value,
        currency: currency
      }
    });

    // Send to Google Analytics as conversion
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', {
        send_to: GA_TRACKING_ID,
        value: value,
        currency: currency,
        transaction_id: `conv_${Date.now()}`
      });
    }
  }

  // Performance tracking
  static trackPerformance(metric: string, value: number, unit: string = 'ms'): void {
    this.trackEvent({
      action: 'performance',
      category: 'technical',
      label: metric,
      value: value,
      custom_parameters: {
        performance_metric: metric,
        performance_value: value,
        performance_unit: unit
      }
    });
  }

  // Batch send events (for offline support)
  static async sendBatchEvents(): Promise<void> {
    try {
      if (this.events.length === 0) return;

      // In a real implementation, you would send to your analytics endpoint
      console.log('📊 Sending batch analytics events:', this.events.length);
      
      // Clear sent events
      this.events = [];
    } catch (error) {
      console.error('Error sending analytics batch:', error);
    }
  }
}

// Global analytics instance
export const analytics = AnalyticsService;

// Auto-initialize on import
if (typeof window !== 'undefined') {
  AnalyticsService.initialize();
}
