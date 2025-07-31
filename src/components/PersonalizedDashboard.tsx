import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  TrendingUp, 
  Heart, 
  Search, 
  Bell, 
  MapPin, 
  Calendar,
  Target,
  ArrowRight,
  Star
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface PersonalizedDashboardProps {
  variant?: 'full' | 'compact' | 'widget';
  showRecommendations?: boolean;
  className?: string;
}

interface PersonalizedInsight {
  type: 'behavior' | 'preference' | 'market' | 'recommendation';
  title: string;
  description: string;
  action?: {
    label: string;
    link: string;
  };
  priority: 'high' | 'medium' | 'low';
}

export function PersonalizedDashboard({ 
  variant = 'full',
  className = ""
}: PersonalizedDashboardProps) {
  const { user, isAuthenticated, getFavorites } = useUser();
  const [insights, setInsights] = useState<PersonalizedInsight[]>([]);

  useEffect(() => {
    if (isAuthenticated && user) {
      generatePersonalizedInsights();
    }
  }, [user, isAuthenticated]);

  const generatePersonalizedInsights = () => {
    if (!user) return;

    const favorites = getFavorites();
    const { preferences, searchHistory } = user;
    const newInsights: PersonalizedInsight[] = [];

    // Analyze user behavior to generate insights
    
    // Search pattern analysis
    if (searchHistory.length >= 3) {
      const recentSearches = searchHistory.slice(0, 5);
      const mostSearchedCity = getMostSearchedCity(recentSearches);
      
      if (mostSearchedCity) {
        newInsights.push({
          type: 'behavior',
          title: `You're interested in ${mostSearchedCity}`,
          description: `Based on your recent searches, we've found 12 new listings in ${mostSearchedCity} that match your criteria.`,
          action: {
            label: `View ${mostSearchedCity} Communities`,
            link: `/explore?city=${mostSearchedCity.toLowerCase()}`
          },
          priority: 'high'
        });
      }
    }

    // Favorites analysis
    if (favorites.length >= 2) {
      newInsights.push({
        type: 'recommendation',
        title: 'Similar communities you might like',
        description: `Based on your ${favorites.length} saved communities, we found 5 similar options with better school ratings.`,
        action: {
          label: 'View Recommendations',
          link: '/explore?recommended=true'
        },
        priority: 'medium'
      });
    }

    // Price range optimization
    if (preferences.priceRange[1] > 0) {
      newInsights.push({
        type: 'market',
        title: 'Market opportunities in your price range',
        description: `Home prices in your range ($${preferences.priceRange[0].toLocaleString()} - $${preferences.priceRange[1].toLocaleString()}) dropped 3% this month.`,
        action: {
          label: 'View Market Trends',
          link: '/reports?type=market-trends'
        },
        priority: 'high'
      });
    }

    // Preferences completion
    const preferencesScore = calculatePreferencesCompleteness(preferences);
    if (preferencesScore < 70) {
      newInsights.push({
        type: 'preference',
        title: 'Complete your profile for better recommendations',
        description: `Your profile is ${preferencesScore}% complete. Add more preferences to get personalized suggestions.`,
        action: {
          label: 'Update Preferences',
          link: '/profile?tab=preferences'
        },
        priority: 'medium'
      });
    }

    // Saved search alerts
    if (user.savedSearches.length > 0) {
      newInsights.push({
        type: 'behavior',
        title: 'New matches for your saved searches',
        description: `3 new communities match your saved search "${user.savedSearches[0]?.name}".`,
        action: {
          label: 'View New Matches',
          link: '/explore?saved-search=true'
        },
        priority: 'medium'
      });
    }

    setInsights(newInsights.slice(0, variant === 'compact' ? 3 : 6));
  };

  const getMostSearchedCity = (searches: any[]): string | null => {
    const cityCount: { [key: string]: number } = {};
    
    searches.forEach(search => {
      const query = search.query.toLowerCase();
      if (query.includes('austin')) cityCount['Austin'] = (cityCount['Austin'] || 0) + 1;
      if (query.includes('houston')) cityCount['Houston'] = (cityCount['Houston'] || 0) + 1;
      if (query.includes('dallas')) cityCount['Dallas'] = (cityCount['Dallas'] || 0) + 1;
    });

    const maxCount = Math.max(...Object.values(cityCount));
    return Object.keys(cityCount).find(city => cityCount[city] === maxCount) || null;
  };

  const calculatePreferencesCompleteness = (prefs: any): number => {
    let score = 0;
    const totalFields = 6;

    if (prefs.priceRange[0] > 0 && prefs.priceRange[1] > 0) score++;
    if (prefs.bedrooms > 0) score++;
    if (prefs.location && prefs.location.length > 0) score++;
    if (prefs.amenities && prefs.amenities.length > 0) score++;
    if (prefs.favoriteRegion) score++;
    if (prefs.priorities && prefs.priorities.length > 0) score++;

    return Math.round((score / totalFields) * 100);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      default: return 'border-l-green-500 bg-green-50';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'behavior': return <TrendingUp className="h-5 w-5 text-blue-600" />;
      case 'preference': return <User className="h-5 w-5 text-purple-600" />;
      case 'market': return <Calendar className="h-5 w-5 text-green-600" />;
      case 'recommendation': return <Target className="h-5 w-5 text-orange-600" />;
      default: return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={className}>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 text-center border border-blue-100">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Get Personalized Recommendations</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Sign in to receive community suggestions tailored to your preferences, budget, and lifestyle.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/explore"
              className="inline-flex items-center px-6 py-3 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors"
            >
              <Search className="h-5 w-5 mr-2" />
              Start Exploring
            </Link>
            <button className="inline-flex items-center px-6 py-3 bg-white text-blue-900 font-semibold rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors">
              <User className="h-5 w-5 mr-2" />
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'widget') {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Personal Insights</h3>
          <Link to="/dashboard" className="text-sm text-blue-600 hover:text-blue-800">
            View All
          </Link>
        </div>
        
        {insights.slice(0, 2).map((insight, index) => (
          <div key={index} className="mb-4 last:mb-0">
            <div className="flex items-start space-x-3">
              {getTypeIcon(insight.type)}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 mb-1">{insight.title}</h4>
                <p className="text-xs text-gray-600 mb-2">{insight.description}</p>
                {insight.action && (
                  <Link
                    to={insight.action.link}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {insight.action.label} →
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={className}>
      {variant === 'full' && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h2>
          <p className="text-gray-600">
            Here's what we've discovered based on your activity and preferences.
          </p>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Saved Communities</p>
              <p className="text-2xl font-bold text-blue-900">{getFavorites().length}</p>
            </div>
            <Heart className="h-8 w-8 text-red-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Recent Searches</p>
              <p className="text-2xl font-bold text-green-600">{user?.searchHistory?.length || 0}</p>
            </div>
            <Search className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Profile Score</p>
              <p className="text-2xl font-bold text-purple-600">
                {calculatePreferencesCompleteness(user?.preferences || {})}%
              </p>
            </div>
            <Target className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">New Matches</p>
              <p className="text-2xl font-bold text-orange-600">7</p>
            </div>
            <Star className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Personalized Insights */}
      {insights.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Personalized Insights</h3>
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div
                key={index}
                className={`bg-white rounded-lg shadow-sm border-l-4 p-6 ${getPriorityColor(insight.priority)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    {getTypeIcon(insight.type)}
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-gray-900 mb-2">{insight.title}</h4>
                      <p className="text-gray-600 mb-4">{insight.description}</p>
                      {insight.action && (
                        <Link
                          to={insight.action.link}
                          className="inline-flex items-center px-4 py-2 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors text-sm"
                        >
                          {insight.action.label}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                      insight.priority === 'high' ? 'bg-red-100 text-red-800' :
                      insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {insight.priority} priority
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/explore"
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <MapPin className="h-6 w-6 text-blue-600" />
            <div>
              <p className="font-medium text-gray-900">Continue Exploring</p>
              <p className="text-sm text-gray-600">Find more communities</p>
            </div>
          </Link>

          <Link
            to="/reports"
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <TrendingUp className="h-6 w-6 text-green-600" />
            <div>
              <p className="font-medium text-gray-900">Compare Communities</p>
              <p className="text-sm text-gray-600">Side-by-side analysis</p>
            </div>
          </Link>

          <Link
            to="/favorites"
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Heart className="h-6 w-6 text-red-600" />
            <div>
              <p className="font-medium text-gray-900">View Favorites</p>
              <p className="text-sm text-gray-600">Manage saved communities</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PersonalizedDashboard;
