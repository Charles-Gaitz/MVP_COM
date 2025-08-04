import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  communityName?: string;
}

export function useSEO({ 
  title = 'Texas Communities - Find Your Perfect Community',
  description = 'Discover the best Texas communities with real data on schools, employment, climate, and amenities. Make informed decisions with our comprehensive community guides.',
  image = '/og-image.jpg',
  url = 'https://texascommunities.com',
  communityName
}: SEOProps) {
  useEffect(() => {
    const fullTitle = communityName 
      ? `${communityName} Community Guide - Texas Communities`
      : title;
      
    const fullDescription = communityName
      ? `Complete guide to ${communityName}, Texas. Real data on schools, employment, weather, and local amenities. Make informed decisions about your next home.`
      : description;

    // Update document title
    document.title = fullTitle;
    
    // Update meta tags
    const updateMetaTag = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let element = document.querySelector(selector) as HTMLMetaElement;
      
      if (!element) {
        element = document.createElement('meta');
        if (property) {
          element.setAttribute('property', name);
        } else {
          element.setAttribute('name', name);
        }
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', fullDescription);
    updateMetaTag('keywords', `Texas communities, ${communityName || 'real estate'}, schools, employment data, weather, amenities`);
    
    // Open Graph
    updateMetaTag('og:title', fullTitle, true);
    updateMetaTag('og:description', fullDescription, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:url', url, true);
    updateMetaTag('og:type', 'website', true);
    
    // Twitter
    updateMetaTag('twitter:card', 'summary_large_image', true);
    updateMetaTag('twitter:title', fullTitle, true);
    updateMetaTag('twitter:description', fullDescription, true);
    updateMetaTag('twitter:image', image, true);
    
  }, [title, description, image, url, communityName]);
}
