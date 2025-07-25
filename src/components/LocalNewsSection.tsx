import React from 'react';
import { Link } from 'react-router-dom';

interface NewsArticle {
  id: string;
  headline: string;
  excerpt: string;
  city: string;
  image: string;
}

const mockArticles: NewsArticle[] = [
  {
    id: 'austin-tech-hub',
    headline: 'Austin Announces New Tech Hub Development in East Side',
    excerpt: 'The city plans to invest $50M in infrastructure improvements to support growing tech companies.',
    city: 'Austin',
    image: 'https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=250&h=150&fit=crop'
  },
  {
    id: 'frisco-school-expansion',
    headline: 'Frisco ISD Breaks Ground on Three New Elementary Schools',
    excerpt: 'The district responds to rapid population growth with $120M investment in education facilities.',
    city: 'Frisco',
    image: 'https://images.pexels.com/photos/1370296/pexels-photo-1370296.jpeg?auto=compress&cs=tinysrgb&w=250&h=150&fit=crop'
  },
  {
    id: 'katy-transit-project',
    headline: 'Katy Unveils Plans for Enhanced Public Transit System',
    excerpt: 'New bus rapid transit lines will connect residential areas to major employment centers.',
    city: 'Katy',
    image: 'https://images.pexels.com/photos/1634016/pexels-photo-1634016.jpeg?auto=compress&cs=tinysrgb&w=250&h=150&fit=crop'
  }
];

function LocalNewsSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Latest Community Developments in Texas
        </h2>
        
        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockArticles.map((article) => (
            <div 
              key={article.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              {/* Article Image */}
              <div className="w-full h-[150px] bg-gray-200 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.headline}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Article Content */}
              <div className="p-6">
                {/* City Badge */}
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 text-xs font-medium text-blue-900 bg-blue-100 rounded-full">
                    {article.city}
                  </span>
                </div>
                
                {/* Headline */}
                <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 leading-tight">
                  {article.headline}
                </h3>
                
                {/* Excerpt */}
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {article.excerpt}
                </p>
                
                {/* Read More Link */}
                <Link
                  to={`/news/${article.id}`}
                  className="inline-flex items-center text-blue-900 hover:text-blue-800 font-medium text-sm transition-colors duration-200"
                >
                  Read More
                  <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LocalNewsSection;