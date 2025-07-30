import { useState } from 'react';
import { Camera, X, ChevronLeft, ChevronRight, MapPin, Calendar, User, Heart, Share2, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { LazyImage } from './LazyImage';

interface Photo {
  id: string;
  url: string;
  title: string;
  description: string;
  category: 'homes' | 'amenities' | 'schools' | 'parks' | 'downtown' | 'events';
  location: string;
  photographer: string;
  date: string;
  likes: number;
  isLiked: boolean;
}

interface PhotoGalleriesProps {
  communityId: string;
  communityName: string;
}

export function PhotoGalleries({ communityId, communityName }: PhotoGalleriesProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const toggleSection = () => {
    setIsExpanded(!isExpanded);
  };

  // Sample photo data - in a real app, this would come from an API
  const getPhotoData = (id: string): Photo[] => {
    const photoData = {
      westlake: [
        {
          id: '1',
          url: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
          title: 'Beautiful Westlake Homes',
          description: 'Stunning modern homes with Hill Country views',
          category: 'homes' as const,
          location: 'Westlake Hills',
          photographer: 'Sarah Johnson',
          date: '2024-03-15',
          likes: 24,
          isLiked: false
        },
        {
          id: '2',
          url: 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
          title: 'Community Pool & Recreation',
          description: 'Resort-style amenities for residents',
          category: 'amenities' as const,
          location: 'Westlake Community Center',
          photographer: 'Mike Chen',
          date: '2024-02-28',
          likes: 18,
          isLiked: true
        },
        {
          id: '3',
          url: 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
          title: 'Westlake High School',
          description: 'Top-rated educational facilities',
          category: 'schools' as const,
          location: '4100 Westbank Dr',
          photographer: 'Emily Rodriguez',
          date: '2024-01-20',
          likes: 31,
          isLiked: false
        },
        {
          id: '4',
          url: 'https://images.pexels.com/photos/158251/forest-the-sun-morning-tucholskie-158251.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
          title: 'Zilker Park Nature Trail',
          description: 'Miles of hiking and biking trails',
          category: 'parks' as const,
          location: 'Zilker Metropolitan Park',
          photographer: 'David Park',
          date: '2024-03-10',
          likes: 42,
          isLiked: true
        },
        {
          id: '5',
          url: 'https://images.pexels.com/photos/374811/pexels-photo-374811.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
          title: 'Downtown Austin Skyline',
          description: 'City lights and urban excitement nearby',
          category: 'downtown' as const,
          location: 'Downtown Austin',
          photographer: 'Alex Thompson',
          date: '2024-02-14',
          likes: 67,
          isLiked: false
        },
        {
          id: '6',
          url: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
          title: 'Austin City Limits Festival',
          description: 'Annual music festival in the community',
          category: 'events' as const,
          location: 'Zilker Park',
          photographer: 'Lisa Wang',
          date: '2023-10-08',
          likes: 89,
          isLiked: true
        }
      ],
      plano: [
        {
          id: '7',
          url: 'https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
          title: 'Modern Plano Neighborhoods',
          description: 'Well-planned residential communities',
          category: 'homes' as const,
          location: 'Legacy West',
          photographer: 'Jennifer Lee',
          date: '2024-03-22',
          likes: 33,
          isLiked: false
        },
        {
          id: '8',
          url: 'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
          title: 'Legacy West Shopping',
          description: 'Premier shopping and dining destination',
          category: 'amenities' as const,
          location: '7501 Windrose Ave',
          photographer: 'Robert Kim',
          date: '2024-02-18',
          likes: 45,
          isLiked: true
        }
      ],
      katy: [
        {
          id: '9',
          url: 'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
          title: 'Katy Family Homes',
          description: 'Spacious homes perfect for families',
          category: 'homes' as const,
          location: 'Cinco Ranch',
          photographer: 'Maria Gonzalez',
          date: '2024-03-05',
          likes: 28,
          isLiked: false
        },
        {
          id: '10',
          url: 'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
          title: 'Katy Mills Mall',
          description: 'Shopping and entertainment complex',
          category: 'amenities' as const,
          location: '5000 Katy Mills Cir',
          photographer: 'Carlos Rivera',
          date: '2024-01-30',
          likes: 19,
          isLiked: true
        }
      ]
    };
    
    return photoData[id as keyof typeof photoData] || photoData.westlake;
  };

  const photos = getPhotoData(communityId);
  
  const categories = [
    { key: 'all', name: 'All Photos', count: photos.length },
    { key: 'homes', name: 'Homes', count: photos.filter(p => p.category === 'homes').length },
    { key: 'amenities', name: 'Amenities', count: photos.filter(p => p.category === 'amenities').length },
    { key: 'schools', name: 'Schools', count: photos.filter(p => p.category === 'schools').length },
    { key: 'parks', name: 'Parks', count: photos.filter(p => p.category === 'parks').length },
    { key: 'downtown', name: 'Downtown', count: photos.filter(p => p.category === 'downtown').length },
    { key: 'events', name: 'Events', count: photos.filter(p => p.category === 'events').length }
  ].filter(cat => cat.count > 0);

  const filteredPhotos = selectedCategory === 'all' 
    ? photos 
    : photos.filter(photo => photo.category === selectedCategory);

  const openLightbox = (photo: Photo) => {
    setSelectedPhoto(photo);
    setCurrentPhotoIndex(filteredPhotos.findIndex(p => p.id === photo.id));
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  const navigatePhoto = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' 
      ? (currentPhotoIndex - 1 + filteredPhotos.length) % filteredPhotos.length
      : (currentPhotoIndex + 1) % filteredPhotos.length;
    
    setCurrentPhotoIndex(newIndex);
    setSelectedPhoto(filteredPhotos[newIndex]);
  };

  const toggleLike = (photoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // In a real app, this would update the database
    console.log('Toggle like for photo:', photoId);
  };

  const sharePhoto = (photo: Photo, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: photo.title,
        text: photo.description,
        url: window.location.href
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
      <div className="border-b border-gray-200">
        <div className="flex items-center justify-between">
          <button
            onClick={toggleSection}
            className="flex items-center justify-between w-full p-6 text-left hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="flex items-center flex-1">
              <Camera className="h-6 w-6 text-blue-900 mr-3" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Photo Gallery
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  High-quality photos showcasing {communityName}
                </p>
              </div>
            </div>
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-gray-600 ml-4" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-600 ml-4" />
            )}
          </button>
          <div className="text-right mr-6">
            <div className="text-2xl font-bold text-blue-900">{photos.length}</div>
            <p className="text-xs text-gray-500">Photos</p>
          </div>
        </div>
      </div>

      {isExpanded && (
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

        {/* Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPhotos.map((photo) => (
            <div 
              key={photo.id}
              className="group relative cursor-pointer overflow-hidden rounded-lg bg-gray-200 aspect-[4/3]"
              onClick={() => openLightbox(photo)}
            >
              <LazyImage
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                placeholder="Loading photo..."
                width={400}
                height={300}
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300">
                <div className="absolute inset-0 p-4 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {/* Top Actions */}
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={(e) => toggleLike(photo.id, e)}
                      className="p-2 bg-white/20 rounded-full backdrop-blur-sm hover:bg-white/30 transition-colors"
                    >
                      <Heart className={`h-4 w-4 ${photo.isLiked ? 'text-red-500 fill-current' : 'text-white'}`} />
                    </button>
                    <button
                      onClick={(e) => sharePhoto(photo, e)}
                      className="p-2 bg-white/20 rounded-full backdrop-blur-sm hover:bg-white/30 transition-colors"
                    >
                      <Share2 className="h-4 w-4 text-white" />
                    </button>
                  </div>

                  {/* Bottom Info */}
                  <div className="text-white">
                    <h3 className="font-semibold text-sm mb-1">{photo.title}</h3>
                    <div className="flex items-center text-xs opacity-90">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{photo.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Like Count Badge */}
              {photo.likes > 0 && (
                <div className="absolute top-3 left-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full flex items-center">
                  <Heart className="h-3 w-3 mr-1" />
                  {photo.likes}
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredPhotos.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Camera className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No photos available in this category.</p>
          </div>
        )}
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-6xl max-h-full w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 p-2 bg-white/20 rounded-full backdrop-blur-sm hover:bg-white/30 transition-colors z-10"
            >
              <X className="h-6 w-6 text-white" />
            </button>

            {/* Previous Button */}
            {filteredPhotos.length > 1 && (
              <button
                onClick={() => navigatePhoto('prev')}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 rounded-full backdrop-blur-sm hover:bg-white/30 transition-colors z-10"
              >
                <ChevronLeft className="h-6 w-6 text-white" />
              </button>
            )}

            {/* Next Button */}
            {filteredPhotos.length > 1 && (
              <button
                onClick={() => navigatePhoto('next')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 rounded-full backdrop-blur-sm hover:bg-white/30 transition-colors z-10"
              >
                <ChevronRight className="h-6 w-6 text-white" />
              </button>
            )}

            {/* Image */}
            <div className="flex flex-col max-h-full">
              <LazyImage
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className="max-w-full max-h-[80vh] object-contain"
                placeholder="Loading full image..."
              />
              
              {/* Photo Info */}
              <div className="bg-white/10 backdrop-blur-sm text-white p-4 mt-4 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">{selectedPhoto.title}</h3>
                    <p className="text-sm opacity-90 mb-2">{selectedPhoto.description}</p>
                    <div className="flex items-center space-x-4 text-xs opacity-75">
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{selectedPhoto.location}</span>
                      </div>
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        <span>{selectedPhoto.photographer}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{new Date(selectedPhoto.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={(e) => toggleLike(selectedPhoto.id, e)}
                      className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                    >
                      <Heart className={`h-5 w-5 ${selectedPhoto.isLiked ? 'text-red-500 fill-current' : 'text-white'}`} />
                    </button>
                    <button
                      onClick={(e) => sharePhoto(selectedPhoto, e)}
                      className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                    >
                      <Share2 className="h-5 w-5 text-white" />
                    </button>
                    <button
                      onClick={() => window.open(selectedPhoto.url, '_blank')}
                      className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                    >
                      <Download className="h-5 w-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Photo Counter */}
            {filteredPhotos.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                {currentPhotoIndex + 1} of {filteredPhotos.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
