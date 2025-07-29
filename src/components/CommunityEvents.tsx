import { useState } from 'react';
import { Calendar, MapPin, Clock, Users, ExternalLink, Filter, ChevronDown, ChevronUp, Star, Tag } from 'lucide-react';

interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  endTime?: string;
  location: string;
  address: string;
  category: 'festival' | 'community' | 'sports' | 'education' | 'entertainment' | 'family';
  organizer: string;
  attendees: number;
  maxAttendees?: number;
  price: 'free' | 'paid';
  cost?: string;
  image: string;
  website?: string;
  isRecurring: boolean;
  recurrence?: string;
  tags: string[];
  featured: boolean;
}

interface CommunityEventsProps {
  communityId: string;
  communityName: string;
}

export function CommunityEvents({ communityId, communityName }: CommunityEventsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<string>('upcoming');
  const [showFilters, setShowFilters] = useState(false);

  // Sample events data - in a real app, this would come from an API
  const getEventsData = (id: string): CommunityEvent[] => {
    const eventsData = {
      westlake: [
        {
          id: '1',
          title: 'Austin City Limits Music Festival',
          description: 'Three days of incredible music featuring top artists from around the world in beautiful Zilker Park.',
          date: '2024-04-15',
          time: '11:00 AM',
          endTime: '10:00 PM',
          location: 'Zilker Park',
          address: '2100 Barton Springs Rd, Austin, TX',
          category: 'festival' as const,
          organizer: 'Austin City Limits',
          attendees: 75000,
          maxAttendees: 75000,
          price: 'paid' as const,
          cost: '$275-425',
          image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop',
          website: 'https://aclfestival.com',
          isRecurring: true,
          recurrence: 'Annual',
          tags: ['music', 'outdoor', 'food', 'arts'],
          featured: true
        },
        {
          id: '2',
          title: 'Westlake Farmers Market',
          description: 'Fresh local produce, artisanal goods, and community gathering every Saturday morning.',
          date: '2024-04-06',
          time: '8:00 AM',
          endTime: '12:00 PM',
          location: 'Westlake City Hall',
          address: '911 Country Club Rd, Austin, TX',
          category: 'community' as const,
          organizer: 'Westlake Community Association',
          attendees: 250,
          price: 'free' as const,
          image: 'https://images.pexels.com/photos/1367276/pexels-photo-1367276.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop',
          isRecurring: true,
          recurrence: 'Weekly (Saturdays)',
          tags: ['farmers market', 'local', 'family-friendly', 'food'],
          featured: false
        },
        {
          id: '3',
          title: 'Lake Austin Boat Show',
          description: 'Annual boat show featuring the latest watercraft, marine equipment, and lake activities.',
          date: '2024-04-20',
          time: '10:00 AM',
          endTime: '6:00 PM',
          location: 'Lake Austin Marina',
          address: '3825 Lake Austin Blvd, Austin, TX',
          category: 'entertainment' as const,
          organizer: 'Austin Marine Dealers Association',
          attendees: 1200,
          maxAttendees: 2000,
          price: 'paid' as const,
          cost: '$15',
          image: 'https://images.pexels.com/photos/163236/luxury-yacht-boat-speed-water-163236.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop',
          isRecurring: true,
          recurrence: 'Annual',
          tags: ['boats', 'lake', 'outdoor', 'recreation'],
          featured: true
        },
        {
          id: '4',
          title: 'Westlake Youth Soccer League',
          description: 'Weekly soccer games for kids ages 6-16. Registration includes uniform and season schedule.',
          date: '2024-04-13',
          time: '9:00 AM',
          endTime: '2:00 PM',
          location: 'Westlake Sports Complex',
          address: '2001 Bee Cave Rd, Austin, TX',
          category: 'sports' as const,
          organizer: 'Westlake Youth Athletics',
          attendees: 180,
          maxAttendees: 200,
          price: 'paid' as const,
          cost: '$85/season',
          image: 'https://images.pexels.com/photos/1374064/pexels-photo-1374064.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop',
          isRecurring: true,
          recurrence: 'Weekly (Saturdays)',
          tags: ['soccer', 'youth', 'sports', 'recreation'],
          featured: false
        },
        {
          id: '5',
          title: 'Hill Country Food & Wine Festival',
          description: 'Celebration of local cuisine and Texas wines with live music and cooking demonstrations.',
          date: '2024-04-27',
          time: '2:00 PM',
          endTime: '9:00 PM',
          location: 'Westlake Community Center',
          address: '1309 Westbank Dr, Austin, TX',
          category: 'festival' as const,
          organizer: 'Hill Country Tourism',
          attendees: 850,
          maxAttendees: 1000,
          price: 'paid' as const,
          cost: '$45-85',
          image: 'https://images.pexels.com/photos/1058277/pexels-photo-1058277.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop',
          website: 'https://hillcountryfoodwine.com',
          isRecurring: true,
          recurrence: 'Annual',
          tags: ['food', 'wine', 'music', 'local'],
          featured: true
        },
        {
          id: '6',
          title: 'Family Movie Night in the Park',
          description: 'Free outdoor movie screening with popcorn and family-friendly activities before the show.',
          date: '2024-04-12',
          time: '7:30 PM',
          endTime: '10:00 PM',
          location: 'Westlake Park',
          address: '1309 Westbank Dr, Austin, TX',
          category: 'family' as const,
          organizer: 'Westlake Parks & Recreation',
          attendees: 320,
          price: 'free' as const,
          image: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop',
          isRecurring: true,
          recurrence: 'Monthly',
          tags: ['movie', 'family', 'outdoor', 'free'],
          featured: false
        }
      ],
      plano: [
        {
          id: '7',
          title: 'Plano Balloon Festival',
          description: 'Hot air balloons, live music, food vendors, and family activities.',
          date: '2024-04-21',
          time: '6:00 AM',
          endTime: '10:00 PM',
          location: 'Roach Park',
          address: '3300 Running Bear Way, Plano, TX',
          category: 'festival' as const,
          organizer: 'Plano Events',
          attendees: 25000,
          price: 'free' as const,
          image: 'https://images.pexels.com/photos/158826/balloon-balloons-party-hot-air-balloon-158826.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop',
          isRecurring: true,
          recurrence: 'Annual',
          tags: ['balloons', 'family', 'outdoor', 'free'],
          featured: true
        }
      ],
      katy: [
        {
          id: '8',
          title: 'Katy Rice Harvest Festival',
          description: 'Celebrating Katy\'s agricultural heritage with carnival rides, live music, and local food.',
          date: '2024-04-14',
          time: '4:00 PM',
          endTime: '11:00 PM',
          location: 'Katy City Park',
          address: '5051 Katy Hockley Cut Off Rd, Katy, TX',
          category: 'festival' as const,
          organizer: 'Katy Rice Harvest Festival Association',
          attendees: 15000,
          price: 'free' as const,
          image: 'https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop',
          isRecurring: true,
          recurrence: 'Annual',
          tags: ['festival', 'heritage', 'carnival', 'family'],
          featured: true
        }
      ]
    };
    
    return eventsData[id as keyof typeof eventsData] || eventsData.westlake;
  };

  const events = getEventsData(communityId);
  
  const categories = [
    { key: 'all', name: 'All Events', count: events.length },
    { key: 'festival', name: 'Festivals', count: events.filter(e => e.category === 'festival').length },
    { key: 'community', name: 'Community', count: events.filter(e => e.category === 'community').length },
    { key: 'sports', name: 'Sports', count: events.filter(e => e.category === 'sports').length },
    { key: 'family', name: 'Family', count: events.filter(e => e.category === 'family').length },
    { key: 'entertainment', name: 'Entertainment', count: events.filter(e => e.category === 'entertainment').length },
    { key: 'education', name: 'Education', count: events.filter(e => e.category === 'education').length }
  ].filter(cat => cat.count > 0);

  // Filter events
  let filteredEvents = selectedCategory === 'all' 
    ? events 
    : events.filter(event => event.category === selectedCategory);

  // Apply time filter
  const now = new Date();
  if (timeFilter === 'today') {
    filteredEvents = filteredEvents.filter(event => 
      new Date(event.date).toDateString() === now.toDateString()
    );
  } else if (timeFilter === 'week') {
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    filteredEvents = filteredEvents.filter(event => 
      new Date(event.date) >= now && new Date(event.date) <= weekFromNow
    );
  } else if (timeFilter === 'month') {
    const monthFromNow = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
    filteredEvents = filteredEvents.filter(event => 
      new Date(event.date) >= now && new Date(event.date) <= monthFromNow
    );
  }

  // Sort events by date
  filteredEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'festival': return '🎪';
      case 'community': return '🏘️';
      case 'sports': return '⚽';
      case 'education': return '📚';
      case 'entertainment': return '🎭';
      case 'family': return '👨‍👩‍👧‍👦';
      default: return '📅';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const isEventToday = (dateString: string) => {
    return new Date(dateString).toDateString() === new Date().toDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Calendar className="h-6 w-6 text-blue-900 mr-2" />
              Community Events & Activities
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Discover local events and activities in {communityName}
            </p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {showFilters ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Filters */}
        {showFilters && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.key}
                      onClick={() => setSelectedCategory(category.key)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                        selectedCategory === category.key
                          ? 'bg-blue-900 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                      }`}
                    >
                      {category.name} ({category.count})
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'upcoming', name: 'All Upcoming' },
                    { key: 'today', name: 'Today' },
                    { key: 'week', name: 'This Week' },
                    { key: 'month', name: 'This Month' }
                  ].map((filter) => (
                    <button
                      key={filter.key}
                      onClick={() => setTimeFilter(filter.key)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                        timeFilter === filter.key
                          ? 'bg-blue-900 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                      }`}
                    >
                      {filter.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Featured Events */}
        {selectedCategory === 'all' && timeFilter === 'upcoming' && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Star className="h-5 w-5 text-yellow-500 mr-2" />
              Featured Events
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {events.filter(event => event.featured).slice(0, 2).map((event) => (
                <div key={event.id} className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="flex items-start space-x-4">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate">{event.title}</h4>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{formatDate(event.date)}</span>
                        <span className="mx-2">•</span>
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span className="truncate">{event.location}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          event.price === 'free' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {event.price === 'free' ? 'Free' : event.cost}
                        </span>
                        <div className="flex items-center text-xs text-gray-500">
                          <Users className="h-3 w-3 mr-1" />
                          {event.attendees.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Events List */}
        <div className="space-y-4">
          {filteredEvents.map((event) => (
            <div 
              key={event.id} 
              className={`border rounded-lg p-4 hover:shadow-md transition-shadow duration-200 ${
                isEventToday(event.date) ? 'border-blue-300 bg-blue-25' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start space-x-4">
                {/* Event Image */}
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg flex-shrink-0"
                />

                {/* Event Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{event.title}</h3>
                        {event.featured && (
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        )}
                        {isEventToday(event.date) && (
                          <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                            TODAY
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{event.description}</p>
                      
                      {/* Event Meta */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span>{formatDate(event.date)}</span>
                          <span className="mx-2">•</span>
                          <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span>{event.time}{event.endTime && ` - ${event.endTime}`}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {event.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                          >
                            <Tag className="h-2 w-2 mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-right ml-4 flex-shrink-0">
                      <div className="text-lg font-bold text-gray-900">
                        {getCategoryIcon(event.category)}
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full mt-1 ${
                        event.price === 'free' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {event.price === 'free' ? 'Free' : event.cost}
                      </div>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Users className="h-3 w-3 mr-1" />
                        {event.attendees.toLocaleString()}
                        {event.maxAttendees && `/${event.maxAttendees.toLocaleString()}`}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                <div className="text-xs text-gray-500">
                  Organized by {event.organizer}
                  {event.isRecurring && (
                    <span> • {event.recurrence}</span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {event.website && (
                    <a
                      href={event.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Learn More
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  )}
                  <button className="px-3 py-1 text-sm bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors">
                    {event.price === 'free' ? 'Add to Calendar' : 'Get Tickets'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No events found matching your criteria.</p>
            <p className="text-sm">Try adjusting your filters or check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
}
