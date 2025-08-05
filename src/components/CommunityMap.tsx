import React, { useEffect, useRef, useState } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { sampleCommunities, CommunityDetailed } from '../data/communities';

// Community coordinates for Texas locations
const communityCoordinates: Record<string, { lat: number; lng: number }> = {
  westlake: { lat: 30.3382, lng: -97.8313 }, // Austin area
  'the-woodlands': { lat: 30.1588, lng: -95.4895 }, // Houston area  
  plano: { lat: 33.0198, lng: -96.6989 }, // Dallas area
  katy: { lat: 29.7858, lng: -95.8244 }, // Houston area
  'allen-frisco': { lat: 33.1031, lng: -96.6706 }, // Dallas area
  'round-rock': { lat: 30.5083, lng: -97.6789 }, // Austin area
  southlake: { lat: 32.9412, lng: -97.1342 }, // Dallas area
  'sugar-land': { lat: 29.6196, lng: -95.6349 }, // Houston area
  'flower-mound': { lat: 33.0145, lng: -97.0969 }, // Dallas area
  'lake-travis': { lat: 30.3879, lng: -97.9489 }, // Austin area
  mckinney: { lat: 33.1972, lng: -96.6397 }, // Dallas area
  conroe: { lat: 30.3118, lng: -95.4560 }, // Houston area
  'cedar-park': { lat: 30.5052, lng: -97.8203 }, // Austin area
  'league-city': { lat: 29.5075, lng: -95.0951 }, // Houston area
  grapevine: { lat: 32.9342, lng: -97.0781 }, // Dallas area
  'bee-cave': { lat: 30.3077, lng: -97.9475 }, // Austin area
  pearland: { lat: 29.5638, lng: -95.2861 }, // Houston area
  coppell: { lat: 32.9546, lng: -97.0150 }, // Dallas area
  'georgetown-sun-city': { lat: 30.6327, lng: -97.6770 }, // Austin area
  'missouri-city': { lat: 29.6185, lng: -95.5377 }, // Houston area
  'prosper-celina': { lat: 33.2362, lng: -96.8011 }, // Dallas area
  'leander-liberty-hill': { lat: 30.5788, lng: -97.8531 }, // Austin area
};

interface CommunityMapProps {
  communities: CommunityDetailed[];
  selectedCommunityId?: string;
  onCommunityClick?: (communityId: string) => void;
  height?: string;
  className?: string;
}

// Map component that renders the actual Google Map
const MapComponent: React.FC<{
  center: google.maps.LatLngLiteral;
  zoom: number;
  communities: CommunityDetailed[];
  selectedCommunityId?: string;
  onCommunityClick?: (communityId: string) => void;
}> = ({ center, zoom, communities, selectedCommunityId, onCommunityClick }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

  useEffect(() => {
    if (ref.current && !map) {
      const newMap = new google.maps.Map(ref.current, {
        center,
        zoom,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
          },
        ],
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });
      setMap(newMap);
    }
  }, [ref, map, center, zoom]);

  // Add markers for communities
  useEffect(() => {
    if (!map) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));

    const newMarkers: google.maps.Marker[] = [];

    communities.forEach((community: CommunityDetailed) => {
      const coords = communityCoordinates[community.id];
      if (!coords) return;

      const marker = new google.maps.Marker({
        position: coords,
        map,
        title: community.name,
        icon: {
          url: selectedCommunityId === community.id 
            ? 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#1e40af">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              `)
            : 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#dc2626">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              `),
          scaledSize: new google.maps.Size(
            selectedCommunityId === community.id ? 32 : 24,
            selectedCommunityId === community.id ? 32 : 24
          ),
        },
      });

      // Add click listener
      marker.addListener('click', () => {
        if (onCommunityClick) {
          onCommunityClick(community.id);
        }
      });

      // Create info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div class="p-3 max-w-xs">
            <h3 class="font-semibold text-gray-900 mb-1">${community.name}</h3>
            <p class="text-sm text-gray-600 mb-2">${community.city}, ${community.region}</p>
            <p class="text-sm font-medium text-blue-600">$${community.medianHomePrice.toLocaleString()}</p>
            <p class="text-xs text-gray-500">Median: $${community.medianHomePrice.toLocaleString()}</p>
          </div>
        `,
      });

      marker.addListener('click', () => {
        // Close other info windows
        newMarkers.forEach(m => {
          const iw = (m as any).infoWindow;
          if (iw) iw.close();
        });
        
        infoWindow.open(map, marker);
        (marker as any).infoWindow = infoWindow;
      });

      newMarkers.push(marker);
    });

    setMarkers(newMarkers);

    return () => {
      newMarkers.forEach(marker => marker.setMap(null));
    };
  }, [map, communities, selectedCommunityId, onCommunityClick]);

  return <div ref={ref} className="w-full h-full" />;
};

// Loading component
const MapLoadingComponent: React.FC<{ height?: string }> = ({ height = "h-full" }) => (
  <div className={`w-full ${height} bg-gray-100 flex items-center justify-center`}>
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading interactive map...</p>
    </div>
  </div>
);

// Error component  
const MapErrorComponent: React.FC<{ height?: string }> = ({ height = "h-full" }) => (
  <div className={`w-full ${height} bg-gray-50 border-2 border-dashed border-gray-300 flex items-center justify-center`}>
    <div className="text-center p-6">
      <div className="text-4xl mb-4">🗺️</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Interactive Map Demo</h3>
      <p className="text-gray-600 mb-4">
        Map integration ready for Google Maps API
      </p>
      <div className="text-sm text-gray-500 space-y-1">
        <p>• Real-time community locations</p>
        <p>• Interactive markers with details</p>
        <p>• Zoom and pan functionality</p>
        <p>• Custom styling and branding</p>
      </div>
    </div>
  </div>
);

// Render function for different loading states
const render = (status: Status): React.ReactElement => {
  switch (status) {
    case Status.LOADING:
      return <MapLoadingComponent />;
    case Status.FAILURE:
      return <MapErrorComponent />;
    case Status.SUCCESS:
      return <MapComponent 
        center={{ lat: 30.2672, lng: -97.7431 }} // Austin, TX center
        zoom={7}
        communities={sampleCommunities}
        selectedCommunityId={undefined}
        onCommunityClick={undefined}
      />;
  }
};

// Main component
export const CommunityMap: React.FC<CommunityMapProps> = ({
  communities,
  selectedCommunityId,
  onCommunityClick,
  height = "h-full",
  className = "",
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // If no API key, show demo component
  if (!apiKey || apiKey === 'AIzaSyBHaNQK8J7X8yk_demo_key_replace_with_real') {
    return (
      <div className={`w-full ${height} ${className}`}>
        <MapErrorComponent height={height} />
      </div>
    );
  }

  return (
    <div className={`w-full ${height} ${className}`}>
      <Wrapper apiKey={apiKey} render={render}>
        <MapComponent
          center={{ lat: 30.2672, lng: -97.7431 }} // Texas center
          zoom={7}
          communities={communities}
          selectedCommunityId={selectedCommunityId}
          onCommunityClick={onCommunityClick}
        />
      </Wrapper>
    </div>
  );
};

export default CommunityMap;
