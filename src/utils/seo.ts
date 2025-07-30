// SEO utility functions
export interface SEOData {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

export function updatePageSEO(data: SEOData) {
  // Update document title
  if (data.title) {
    document.title = data.title;
  }

  // Update meta description
  updateMetaTag('description', data.description);
  updateMetaTag('keywords', data.keywords);

  // Update Open Graph tags
  updateMetaProperty('og:title', data.title);
  updateMetaProperty('og:description', data.description);
  updateMetaProperty('og:image', data.image);
  updateMetaProperty('og:url', data.url);
  updateMetaProperty('og:type', data.type || 'website');

  // Update Twitter tags
  updateMetaProperty('twitter:title', data.title);
  updateMetaProperty('twitter:description', data.description);
  updateMetaProperty('twitter:image', data.image);
  updateMetaProperty('twitter:url', data.url);

  // Update canonical URL
  if (data.url) {
    updateCanonicalUrl(data.url);
  }
}

function updateMetaTag(name: string, content?: string) {
  if (!content) return;
  
  let meta = document.querySelector(`meta[name="${name}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', name);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

function updateMetaProperty(property: string, content?: string) {
  if (!content) return;
  
  let meta = document.querySelector(`meta[property="${property}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('property', property);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

function updateCanonicalUrl(url: string) {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

// Generate structured data for communities
export function generateCommunityStructuredData(community: {
  name: string;
  city: string;
  state: string;
  description: string;
  medianPrice?: number;
  schoolRating?: string;
  population?: number;
  amenities?: string[];
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Place",
    "name": community.name,
    "description": community.description,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": community.city,
      "addressRegion": community.state,
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates"
      // coordinates would be added here in real implementation
    }
  };

  // Add to page
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(structuredData);
  document.head.appendChild(script);
}

// Generate structured data for real estate listings
export function generateRealEstateStructuredData(listing: {
  name: string;
  description: string;
  price: number;
  address: string;
  bedrooms?: number;
  bathrooms?: number;
  squareFootage?: number;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": listing.name,
    "description": listing.description,
    "price": listing.price,
    "priceCurrency": "USD",
    "address": listing.address,
    "floorSize": {
      "@type": "QuantitativeValue",
      "value": listing.squareFootage,
      "unitText": "sqft"
    },
    "numberOfRooms": listing.bedrooms,
    "numberOfBathroomsTotal": listing.bathrooms
  };

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(structuredData);
  document.head.appendChild(script);
}

// SEO-friendly URL generation
export function generateSEOUrl(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim()
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}
