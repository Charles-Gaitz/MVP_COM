import { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, MapPin, Clock, User, Eye, X } from 'lucide-react';

interface VirtualTour {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'streetview' | '360';
  thumbnail: string;
  url: string;
  duration?: string;
  location: string;
  views: number;
  creator: string;
  date: string;
  category: 'homes' | 'schools' | 'amenities' | 'neighborhoods' | 'downtown';
}

interface VirtualToursProps {
  communityId: string;
  communityName: string;
}

export function VirtualTours({ communityId, communityName }: VirtualToursProps) {
  const [selectedTour, setSelectedTour] = useState<VirtualTour | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Sample virtual tour data - in a real app, this would come from an API
  const getTourData = (id: string): VirtualTour[] => {
    const tourData = {
      westlake: [
        {
          id: '1',
          title: 'Westlake Luxury Home Tour',
          description: 'Take a virtual walkthrough of a stunning 4-bedroom home with Hill Country views',
          type: 'video' as const,
          thumbnail: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=400&h=225&fit=crop',
          url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          duration: '12:34',
          location: '1234 Westlake Dr',
          views: 1240,
          creator: 'Luxury Homes Austin',
          date: '2024-03-15',
          category: 'homes'
        },
        {
          id: '2',
          title: 'Westlake High School Campus',
          description: 'Explore the award-winning facilities and beautiful campus grounds',
          type: '360' as const,
          thumbnail: 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=400&h=225&fit=crop',
          url: '/virtual-tours/westlake-high-360',
          location: '4100 Westbank Dr',
          views: 890,
          creator: 'Eanes ISD',
          date: '2024-02-20',
          category: 'schools'
        },
        {
          id: '3',
          title: 'Downtown Austin Street View',
          description: 'Navigate through downtown Austin like you\'re walking the streets',
          type: 'streetview' as const,
          thumbnail: 'https://images.pexels.com/photos/374811/pexels-photo-374811.jpeg?auto=compress&cs=tinysrgb&w=400&h=225&fit=crop',
          url: 'https://www.google.com/maps/embed/v1/streetview',
          location: '6th Street, Austin',
          views: 2150,
          creator: 'Austin Tourism',
          date: '2024-01-10',
          category: 'downtown'
        },
        {
          id: '4',
          title: 'Westlake Community Center',
          description: 'Tour the recreation facilities, pools, and community spaces',
          type: 'video' as const,
          thumbnail: 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=400&h=225&fit=crop',
          url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          duration: '8:15',
          location: 'Westlake Community Center',
          views: 654,
          creator: 'Westlake HOA',
          date: '2024-03-01',
          category: 'amenities'
        },
        {
          id: '5',
          title: 'Neighborhood Drive-Through',
          description: 'Experience a scenic drive through Westlake\'s beautiful neighborhoods',
          type: 'video' as const,
          thumbnail: 'https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=400&h=225&fit=crop',
          url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          duration: '15:42',
          location: 'Westlake Hills',
          views: 1876,
          creator: 'Austin Real Estate',
          date: '2024-02-14',
          category: 'neighborhoods'
        }
      ],
      plano: [
        {
          id: '6',
          title: 'Legacy West Virtual Tour',
          description: 'Explore the premier shopping and dining destination',
          type: '360' as const,
          thumbnail: 'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=400&h=225&fit=crop',
          url: '/virtual-tours/legacy-west-360',
          location: '7501 Windrose Ave',
          views: 1320,
          creator: 'Legacy West',
          date: '2024-03-08',
          category: 'amenities'
        }
      ],
      katy: [
        {
          id: '7',
          title: 'Cinco Ranch Home Tour',
          description: 'Beautiful family home in master-planned community',
          type: 'video' as const,
          thumbnail: 'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=400&h=225&fit=crop',
          url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          duration: '10:28',
          location: 'Cinco Ranch',
          views: 945,
          creator: 'Katy Homes',
          date: '2024-02-25',
          category: 'homes'
        }
      ]
    };
    
    return tourData[id as keyof typeof tourData] || tourData.westlake;
  };

  const tours = getTourData(communityId);
  
  const categories = [
    { key: 'all', name: 'All Tours', count: tours.length },
    { key: 'homes', name: 'Homes', count: tours.filter(t => t.category === 'homes').length },
    { key: 'schools', name: 'Schools', count: tours.filter(t => t.category === 'schools').length },
    { key: 'amenities', name: 'Amenities', count: tours.filter(t => t.category === 'amenities').length },
    { key: 'neighborhoods', name: 'Neighborhoods', count: tours.filter(t => t.category === 'neighborhoods').length },
    { key: 'downtown', name: 'Downtown', count: tours.filter(t => t.category === 'downtown').length }
  ].filter(cat => cat.count > 0);

  const filteredTours = selectedCategory === 'all' 
    ? tours 
    : tours.filter(tour => tour.category === selectedCategory);

  const getTourTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return '🎥';
      case 'streetview': return '🗺️';
      case '360': return '🔄';
      default: return '🎥';
    }
  };

  const getTourTypeName = (type: string) => {
    switch (type) {
      case 'video': return 'Video Tour';
      case 'streetview': return 'Street View';
      case '360': return '360° Tour';
      default: return 'Virtual Tour';
    }
  };

  const openTour = (tour: VirtualTour) => {
    setSelectedTour(tour);
    // Increment view count in real app
  };

  const closeTour = () => {
    setSelectedTour(null);
    setIsPlaying(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Play className="h-6 w-6 text-blue-900 mr-2" />
              Virtual Tours & Street Views
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Explore {communityName} from the comfort of your home
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-900">{tours.length}</div>
            <p className="text-xs text-gray-500">Tours Available</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => setSelectedCategory(category.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                selectedCategory === category.key
                  ? 'bg-blue-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        {/* Tours Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTours.map((tour) => (
            <div 
              key={tour.id}
              className="group cursor-pointer bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200"
              onClick={() => openTour(tour)}
            >
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={tour.thumbnail}
                  alt={tour.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Play Overlay */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                    <Play className="h-8 w-8 text-white ml-1" />
                  </div>
                </div>

                {/* Tour Type Badge */}
                <div className="absolute top-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center">
                  <span className="mr-1">{getTourTypeIcon(tour.type)}</span>
                  {getTourTypeName(tour.type)}
                </div>

                {/* Duration Badge */}
                {tour.duration && (
                  <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                    {tour.duration}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-900 transition-colors">
                  {tour.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {tour.description}
                </p>

                {/* Meta Info */}
                <div className="space-y-2 text-xs text-gray-500">
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{tour.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      <span>{tour.creator}</span>
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-3 w-3 mr-1" />
                      <span>{tour.views.toLocaleString()} views</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{new Date(tour.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTours.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Play className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No virtual tours available in this category.</p>
          </div>
        )}
      </div>

      {/* Tour Modal */}
      {selectedTour && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-6xl max-h-full w-full bg-black rounded-lg overflow-hidden">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-4 z-10">
              <div className="flex items-center justify-between text-white">
                <div>
                  <h3 className="text-lg font-semibold">{selectedTour.title}</h3>
                  <div className="flex items-center space-x-4 text-sm opacity-75">
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {selectedTour.location}
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-3 w-3 mr-1" />
                      {selectedTour.views.toLocaleString()} views
                    </div>
                  </div>
                </div>
                <button
                  onClick={closeTour}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Video/Tour Content */}
            <div className="aspect-video bg-gray-900 flex items-center justify-center">
              {selectedTour.type === 'video' ? (
                <iframe
                  src={selectedTour.url}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={selectedTour.title}
                />
              ) : selectedTour.type === 'streetview' ? (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🗺️</div>
                    <p className="text-lg mb-2">Street View Integration</p>
                    <p className="text-sm opacity-75">
                      Interactive street-level exploration would be embedded here
                    </p>
                    <button className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                      Launch Street View
                    </button>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🔄</div>
                    <p className="text-lg mb-2">360° Virtual Tour</p>
                    <p className="text-sm opacity-75">
                      Interactive 360-degree view would be embedded here
                    </p>
                    <button className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                      Launch 360° Tour
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Controls (for video tours) */}
            {selectedTour.type === 'video' && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </button>
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                      {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                    </button>
                    {selectedTour.duration && (
                      <span className="text-sm">0:00 / {selectedTour.duration}</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
                      <RotateCcw className="h-5 w-5" />
                    </button>
                    <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
                      <Maximize className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
