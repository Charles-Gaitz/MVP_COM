// News API service for local news content
const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content?: string;
  url: string;
  urlToImage?: string;
  source: {
    id?: string;
    name: string;
  };
  author?: string;
  publishedAt: string;
  category?: string;
  relevanceScore?: number;
}

export interface LocalNews {
  breaking: NewsArticle[];
  community: NewsArticle[];
  business: NewsArticle[];
  events: NewsArticle[];
  government: NewsArticle[];
}

export class NewsService {
  // Get local news for a specific city/area
  static async getLocalNews(city: string, state: string = 'TX'): Promise<LocalNews | null> {
    try {
      const location = `${city} ${state}`;
      
      // Get different categories of local news
      const [breakingNews, communityNews, businessNews, eventNews, govNews] = await Promise.all([
        this.fetchNewsByCategory(location, 'general'),
        this.fetchNewsByCategory(location, 'general', 'community OR neighborhood'),
        this.fetchNewsByCategory(location, 'business'),
        this.fetchNewsByCategory(location, 'entertainment', 'events OR festival'),
        this.fetchNewsByCategory(location, 'general', 'government OR city council')
      ]);

      return {
        breaking: breakingNews.slice(0, 3),
        community: communityNews.slice(0, 5),
        business: businessNews.slice(0, 4),
        events: eventNews.slice(0, 4),
        government: govNews.slice(0, 3)
      };
    } catch (error) {
      console.error('News API error:', error);
      return this.getFallbackNews(city);
    }
  }

  // Fetch news by category and location
  private static async fetchNewsByCategory(
    location: string, 
    category: string = 'general',
    additionalQuery: string = ''
  ): Promise<NewsArticle[]> {
    try {
      const query = additionalQuery ? 
        `${location} AND (${additionalQuery})` : 
        location;
        
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&category=${category}&sortBy=publishedAt&pageSize=10&apiKey=${NEWS_API_KEY}`
      );
      
      const data = await response.json();
      
      if (data.articles) {
        return data.articles.map((article: any, index: number) => ({
          id: `${Date.now()}-${index}`,
          title: article.title,
          description: article.description,
          content: article.content,
          url: article.url,
          urlToImage: article.urlToImage,
          source: article.source,
          author: article.author,
          publishedAt: article.publishedAt,
          category: category,
          relevanceScore: this.calculateRelevanceScore(article, location)
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching news by category:', error);
      return [];
    }
  }

  // Calculate relevance score for local news
  private static calculateRelevanceScore(article: any, location: string): number {
    let score = 0;
    const title = article.title?.toLowerCase() || '';
    const description = article.description?.toLowerCase() || '';
    const locationLower = location.toLowerCase();
    
    // Higher score for exact location matches
    if (title.includes(locationLower)) score += 10;
    if (description.includes(locationLower)) score += 5;
    
    // Check for local keywords
    const localKeywords = ['local', 'community', 'neighborhood', 'downtown', 'city', 'mayor', 'council'];
    localKeywords.forEach(keyword => {
      if (title.includes(keyword)) score += 3;
      if (description.includes(keyword)) score += 2;
    });
    
    // Recency bonus
    const publishedDate = new Date(article.publishedAt);
    const hoursSincePublished = (Date.now() - publishedDate.getTime()) / (1000 * 60 * 60);
    if (hoursSincePublished < 24) score += 5;
    else if (hoursSincePublished < 72) score += 3;
    
    return score;
  }

  // Get trending topics for a location
  static async getTrendingTopics(city: string): Promise<string[]> {
    try {
      const news = await this.getLocalNews(city);
      if (!news) return [];
      
      const allArticles = [
        ...news.breaking,
        ...news.community,
        ...news.business,
        ...news.events
      ];
      
      // Extract common keywords from titles
      const keywords = new Map<string, number>();
      
      allArticles.forEach(article => {
        const words = article.title.toLowerCase()
          .replace(/[^\w\s]/g, '')
          .split(' ')
          .filter(word => word.length > 3);
          
        words.forEach(word => {
          keywords.set(word, (keywords.get(word) || 0) + 1);
        });
      });
      
      // Return top trending keywords
      return Array.from(keywords.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([word]) => word);
        
    } catch (error) {
      console.error('Error getting trending topics:', error);
      return ['development', 'community', 'business', 'events', 'government'];
    }
  }

  // Get fallback news when API fails
  private static getFallbackNews(city: string): LocalNews {
    return {
      breaking: [
        {
          id: 'fallback-1',
          title: `${city} City Council Approves New Development Plans`,
          description: `Local government approves major development initiative for ${city} area.`,
          url: '#',
          source: { name: 'Local News' },
          publishedAt: new Date().toISOString(),
          category: 'government'
        },
        {
          id: 'fallback-2',
          title: `${city} Housing Market Shows Strong Growth`,
          description: `Real estate market in ${city} continues upward trend with new listings.`,
          url: '#',
          source: { name: 'Real Estate News' },
          publishedAt: new Date().toISOString(),
          category: 'business'
        }
      ],
      community: [
        {
          id: 'fallback-3',
          title: `New Community Center Opens in ${city}`,
          description: `Residents celebrate opening of new recreational facility in downtown ${city}.`,
          url: '#',
          source: { name: 'Community News' },
          publishedAt: new Date().toISOString(),
          category: 'community'
        },
        {
          id: 'fallback-4',
          title: `${city} Neighborhood Association Hosts Annual Festival`,
          description: `Local neighborhoods come together for community celebration and networking.`,
          url: '#',
          source: { name: 'Community Events' },
          publishedAt: new Date().toISOString(),
          category: 'events'
        }
      ],
      business: [
        {
          id: 'fallback-5',
          title: `Tech Companies Expanding Operations in ${city}`,
          description: `Several major technology companies announce expansion plans in ${city} area.`,
          url: '#',
          source: { name: 'Business Journal' },
          publishedAt: new Date().toISOString(),
          category: 'business'
        }
      ],
      events: [
        {
          id: 'fallback-6',
          title: `${city} Summer Concert Series Announced`,
          description: `City announces lineup for summer outdoor concert series in local parks.`,
          url: '#',
          source: { name: 'Entertainment Weekly' },
          publishedAt: new Date().toISOString(),
          category: 'entertainment'
        }
      ],
      government: [
        {
          id: 'fallback-7',
          title: `${city} Budget Hearing Scheduled for Next Week`,
          description: `City council announces public hearing for next year's municipal budget.`,
          url: '#',
          source: { name: 'Government News' },
          publishedAt: new Date().toISOString(),
          category: 'government'
        }
      ]
    };
  }

  // Search news articles
  static async searchNews(query: string, location?: string): Promise<NewsArticle[]> {
    try {
      const searchQuery = location ? `${query} AND ${location}` : query;
      
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(searchQuery)}&sortBy=relevancy&pageSize=20&apiKey=${NEWS_API_KEY}`
      );
      
      const data = await response.json();
      
      if (data.articles) {
        return data.articles.map((article: any, index: number) => ({
          id: `search-${Date.now()}-${index}`,
          title: article.title,
          description: article.description,
          content: article.content,
          url: article.url,
          urlToImage: article.urlToImage,
          source: article.source,
          author: article.author,
          publishedAt: article.publishedAt,
          relevanceScore: location ? 
            this.calculateRelevanceScore(article, location) : 
            undefined
        }));
      }
      
      return [];
    } catch (error) {
      console.error('News search error:', error);
      return [];
    }
  }
}
