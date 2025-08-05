/**
 * News API Service
 * Provides local news articles for communities
 */

export interface NewsArticle {
  id: string;
  headline: string;
  excerpt: string;
  content: string;
  city: string;
  state: string;
  image: string;
  publishedAt: string;
  source: string;
  url: string;
  category: 'development' | 'education' | 'economy' | 'infrastructure' | 'housing' | 'government';
}

export class NewsService {
  private static readonly BASE_URL = 'https://newsapi.org/v2/everything';
  private static readonly API_KEY = import.meta.env.VITE_NEWS_API_KEY;

  // City search terms for Texas communities
  private static readonly CITY_TERMS = {
    'austin': 'Austin Texas',
    'westlake': 'Austin Texas Westlake',
    'plano': 'Plano Texas',
    'frisco': 'Frisco Texas',
    'dallas': 'Dallas Texas',
    'houston': 'Houston Texas',
    'katy': 'Katy Texas Houston',
    'sugar-land': 'Sugar Land Texas Houston'
  };

  /**
   * Get local news articles for a community
   */
  static async getLocalNews(communityId: string, limit: number = 10): Promise<NewsArticle[]> {
    const searchTerm = this.CITY_TERMS[communityId as keyof typeof this.CITY_TERMS];
    if (!searchTerm) {
      console.warn(`No search terms found for ${communityId}`);
      return [];
    }

    try {
      // Search for local news with relevant keywords
      const keywords = [
        'development', 'real estate', 'housing', 'school district',
        'infrastructure', 'transportation', 'business', 'economy',
        'community', 'neighborhood', 'city council'
      ].join(' OR ');

      const url = `${this.BASE_URL}?q=${encodeURIComponent(searchTerm)} AND (${encodeURIComponent(keywords)})&sortBy=publishedAt&pageSize=${limit}&language=en&apiKey=${this.API_KEY}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`News API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status !== 'ok') {
        throw new Error(`News API error: ${data.message}`);
      }

      return this.parseNewsArticles(data.articles, communityId);
    } catch (error) {
      console.error('News API Error:', error);
      return [];
    }
  }

  /**
   * Get news by category for a community
   */
  static async getNewsByCategory(
    communityId: string, 
    category: 'development' | 'education' | 'economy' | 'infrastructure' | 'housing',
    limit: number = 5
  ): Promise<NewsArticle[]> {
    const searchTerm = this.CITY_TERMS[communityId as keyof typeof this.CITY_TERMS];
    if (!searchTerm) return [];

    const categoryKeywords = {
      development: 'development construction new project',
      education: 'school district education teacher',
      economy: 'business economy jobs employment',
      infrastructure: 'infrastructure road transportation transit',
      housing: 'housing real estate market home prices'
    };

    try {
      const keywords = categoryKeywords[category];
      const url = `${this.BASE_URL}?q=${encodeURIComponent(searchTerm)} AND ${encodeURIComponent(keywords)}&sortBy=publishedAt&pageSize=${limit}&language=en&apiKey=${this.API_KEY}`;

      const response = await fetch(url);
      if (!response.ok) return [];

      const data = await response.json();
      return this.parseNewsArticles(data.articles, communityId, category);
    } catch (error) {
      console.error('News Category API Error:', error);
      return [];
    }
  }

  /**
   * Parse news articles from API response
   */
  private static parseNewsArticles(
    articles: any[], 
    communityId: string, 
    category?: string
  ): NewsArticle[] {
    const cityNames = {
      'austin': 'Austin',
      'westlake': 'Austin',
      'plano': 'Plano',
      'frisco': 'Frisco',
      'dallas': 'Dallas',
      'houston': 'Houston',
      'katy': 'Katy',
      'sugar-land': 'Sugar Land'
    };

    return articles
      .filter(article => article.title && article.description)
      .map((article, index) => ({
        id: `${communityId}-${Date.now()}-${index}`,
        headline: article.title,
        excerpt: article.description,
        content: article.content || article.description,
        city: cityNames[communityId as keyof typeof cityNames] || 'Texas',
        state: 'Texas',
        image: article.urlToImage || 'https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
        publishedAt: article.publishedAt,
        source: article.source?.name || 'Local News',
        url: article.url,
        category: (category as NewsArticle['category']) || this.categorizeArticle(article.title + ' ' + article.description)
      }))
      .slice(0, 10); // Limit results
  }

  /**
   * Automatically categorize articles based on content
   */
  private static categorizeArticle(content: string): NewsArticle['category'] {
    const text = content.toLowerCase();
    
    if (text.includes('school') || text.includes('education') || text.includes('student')) {
      return 'education';
    } else if (text.includes('housing') || text.includes('real estate') || text.includes('home')) {
      return 'housing';
    } else if (text.includes('road') || text.includes('transit') || text.includes('infrastructure')) {
      return 'infrastructure';
    } else if (text.includes('business') || text.includes('job') || text.includes('economy')) {
      return 'economy';
    } else if (text.includes('development') || text.includes('construction') || text.includes('project')) {
      return 'development';
    } else {
      return 'government';
    }
  }
}
