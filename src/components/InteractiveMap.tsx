import { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Layers } from 'lucide-react';

interface Community {
  id: string;
  name: string;
  city: string;
  latitude: number;
  longitude: number;
  median_home_price: number;
  school_rating: number;
  walkability_score: number;
}

interface InteractiveMapProps {
  communities: Community[];
  selectedCommunity?: Community;
  onCommunitySelect?: (community: Community) => void;
  className?: string;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

export function InteractiveMap({ 
  communities, 
  selectedCommunity, 
  onCommunitySelect, 
  className = '' 
}: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  // Initialize Google Maps
  useEffect(() => {
    const initializeMap = async () => {
      try {
        // Check if Google Maps is already loaded
        if (window.google && window.google.maps) {
          createMap();
          return;
        }

        // Load Google Maps script
        const script = document.createElement('script');
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        
        if (!apiKey) {
          console.warn('Google Maps API key not found, using fallback map');
          setMapError('Google Maps API key not configured');
          return;
        }

        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
          createMap();
        };
        
        script.onerror = () => {
          setMapError('Failed to load Google Maps');
        };

        document.head.appendChild(script);
      } catch (error) {
        console.error('Error initializing map:', error);
        setMapError('Map initialization failed');
      }
    };

    initializeMap();
  }, []);

  // Create the map instance
  const createMap = () => {
    if (!mapRef.current || !window.google) return;

    try {
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        zoom: 8,
        center: { lat: 30.2672, lng: -97.7431 }, // Austin, TX center
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      setMap(mapInstance);
      setIsMapLoaded(true);
    } catch (error) {
      console.error('Error creating map:', error);
      setMapError('Failed to create map');
    }
  };

  // Add markers for communities
  useEffect(() => {
    if (!map || !isMapLoaded || !communities.length) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));

    const newMarkers = communities.map(community => {
      const marker = new window.google.maps.Marker({
        position: { lat: community.latitude, lng: community.longitude },
        map: map,
        title: community.name,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" fill="#3B82F6" stroke="#1E40AF" stroke-width="2"/>
              <circle cx="20" cy="20" r="8" fill="white"/>
              <text x="20" y="25" font-family="Arial" font-size="10" font-weight="bold" text-anchor="middle" fill="#1E40AF">$${Math.round(community.median_home_price / 1000)}K</text>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(40, 40),
          anchor: new window.google.maps.Point(20, 20)
        }
      });

      // Create info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div class="p-3 min-w-[250px]">
            <h3 class="font-bold text-lg text-gray-900">${community.name}</h3>
            <p class="text-gray-600 mb-2">${community.city}</p>
            <div class="space-y-1 text-sm">
              <div class="flex justify-between">
                <span>Median Price:</span>
                <span class="font-semibold">$${community.median_home_price.toLocaleString()}</span>
              </div>
              <div class="flex justify-between">
                <span>School Rating:</span>
                <span class="font-semibold">${community.school_rating}/10</span>
              </div>
              <div class="flex justify-between">
                <span>Walk Score:</span>
                <span class="font-semibold">${community.walkability_score}/100</span>
              </div>
            </div>
            <button class="mt-2 w-full bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors" onclick="window.selectCommunity('${community.id}')">
              View Details
            </button>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      return marker;
    });

    setMarkers(newMarkers);

    // Set up global callback for info window buttons
    (window as any).selectCommunity = (communityId: string) => {
      const community = communities.find(c => c.id === communityId);
      if (community && onCommunitySelect) {
        onCommunitySelect(community);
      }
    };

    // Adjust map bounds to show all markers
    if (newMarkers.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      newMarkers.forEach(marker => {
        bounds.extend(marker.getPosition());
      });
      map.fitBounds(bounds);
      
      // Ensure minimum zoom level
      const listener = window.google.maps.event.addListener(map, 'idle', () => {
        if (map.getZoom() > 12) map.setZoom(12);
        window.google.maps.event.removeListener(listener);
      });
    }
  }, [map, isMapLoaded, communities, onCommunitySelect]);

  // Center map on selected community
  useEffect(() => {
    if (map && selectedCommunity) {
      map.setCenter({ 
        lat: selectedCommunity.latitude, 
        lng: selectedCommunity.longitude 
      });
      map.setZoom(12);
    }
  }, [map, selectedCommunity]);

  // Fallback map when Google Maps fails
  if (mapError) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center p-8">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">Map Unavailable</h3>
          <p className="text-gray-500 text-sm mb-4">{mapError}</p>
          <div className="grid grid-cols-1 gap-2 max-w-sm">
            {communities.slice(0, 3).map(community => (
              <div 
                key={community.id}
                className="bg-white p-3 rounded border cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => onCommunitySelect?.(community)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{community.name}</h4>
                    <p className="text-sm text-gray-600">{community.city}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">${Math.round(community.median_home_price / 1000)}K</p>
                    <p className="text-xs text-gray-500">Rating: {community.school_rating}/10</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div ref={mapRef} className="w-full h-full rounded-lg" />
      
      {!isMapLoaded && (
        <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      )}

      {/* Map controls */}
      {isMapLoaded && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-2 space-y-2">
          <button
            onClick={() => {
              if (map && communities.length > 0) {
                const bounds = new window.google.maps.LatLngBounds();
                communities.forEach(community => {
                  bounds.extend({ lat: community.latitude, lng: community.longitude });
                });
                map.fitBounds(bounds);
              }
            }}
            className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
            title="View All Communities"
          >
            <Layers className="w-4 h-4" />
            <span>All</span>
          </button>
          
          {selectedCommunity && (
            <button
              onClick={() => {
                if (map && selectedCommunity) {
                  map.setCenter({ 
                    lat: selectedCommunity.latitude, 
                    lng: selectedCommunity.longitude 
                  });
                  map.setZoom(12);
                }
              }}
              className="flex items-center space-x-1 px-3 py-1 text-sm text-blue-700 hover:bg-blue-50 rounded transition-colors"
              title="Center on Selected"
            >
              <Navigation className="w-4 h-4" />
              <span>Center</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
