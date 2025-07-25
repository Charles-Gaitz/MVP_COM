import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, User } from 'lucide-react';

function NewsDetailPage() {
  const { id } = useParams<{ id: string }>();

  // Sample article data based on ID
  const getArticleData = (articleId: string) => {
    const articles = {
      'austin-tech-hub': {
        headline: 'Austin Announces New Tech Hub Development in East Side',
        city: 'Austin',
        date: 'January 15, 2025',
        author: 'Sarah Johnson',
        image: 'https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
        content: `Austin city officials announced plans for a major new technology hub development on the East Side, representing a $50 million investment in infrastructure improvements designed to support the city's rapidly growing tech sector.

The development will span 15 acres and include modern office spaces, co-working facilities, and innovation labs specifically designed for startups and established tech companies. The project is expected to create over 2,000 new jobs and attract additional technology companies to the area.

"This investment represents our commitment to maintaining Austin's position as a leading technology destination," said Mayor Kirk Watson during the announcement ceremony. "We're not just building office space – we're creating an ecosystem where innovation can thrive."

The tech hub will feature state-of-the-art amenities including high-speed fiber internet, flexible workspace configurations, and green building certifications. Construction is expected to begin in spring 2025, with the first phase opening in late 2026.`
      },
      'frisco-school-expansion': {
        headline: 'Frisco ISD Breaks Ground on Three New Elementary Schools',
        city: 'Frisco',
        date: 'January 12, 2025',
        author: 'Michael Chen',
        image: 'https://images.pexels.com/photos/1370296/pexels-photo-1370296.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
        content: `Frisco Independent School District officially broke ground on three new elementary schools as part of a $120 million investment to accommodate the district's rapid enrollment growth.

The new schools will serve approximately 2,100 students across three different neighborhoods in Frisco, each featuring modern learning environments, technology-integrated classrooms, and expanded outdoor learning spaces.

"Our community's growth is a testament to the quality of life and education we provide," said Superintendent Dr. Mike Waldrip. "These new schools will ensure we continue to deliver exceptional educational opportunities for every student."

Each school will include specialized STEM labs, art studios, music rooms, and gymnasiums. The district has also incorporated sustainable design elements, including solar panels and energy-efficient systems, to reduce long-term operational costs.

The schools are scheduled to open for the 2026-2027 academic year, helping to alleviate capacity concerns in the rapidly growing district.`
      },
      'katy-transit-project': {
        headline: 'Katy Unveils Plans for Enhanced Public Transit System',
        city: 'Katy',
        date: 'January 10, 2025',
        author: 'Lisa Rodriguez',
        image: 'https://images.pexels.com/photos/1634016/pexels-photo-1634016.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
        content: `The City of Katy unveiled comprehensive plans for an enhanced public transit system featuring new bus rapid transit lines designed to connect residential neighborhoods with major employment centers throughout the Houston metropolitan area.

The $75 million transit initiative will include dedicated bus lanes, modern transit stations, and electric buses to provide reliable, environmentally-friendly transportation options for residents.

"This transit system will transform how our residents move throughout the region," said Katy Mayor Dusty Thiele. "We're creating connections that will reduce traffic congestion while providing convenient access to jobs and services."

The first phase will include three main routes connecting Katy Mills Mall, the Katy Business District, and several major residential developments. Each route will feature 15-minute peak-hour service and real-time arrival information at all stations.

Construction is expected to begin in summer 2025, with the first routes becoming operational by early 2027. The project has received support from both state and federal transportation funding programs.`
      }
    };

    return articles[articleId as keyof typeof articles] || {
      headline: 'Article Not Found',
      city: 'Texas',
      date: 'January 1, 2025',
      author: 'Staff Writer',
      image: 'https://images.pexels.com/photos/1634016/pexels-photo-1634016.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
      content: 'This article could not be found.'
    };
  };

  const article = getArticleData(id || '');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2 text-gray-900 hover:text-blue-900 transition-colors duration-200">
              <MapPin className="h-8 w-8 text-blue-900" />
              <span className="text-xl font-bold">TexasCommunities</span>
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-900 font-medium transition-colors duration-200">
              About
            </Link>
          </div>
        </div>
      </nav>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center text-blue-900 hover:text-blue-800 mb-6 font-medium transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        {/* Article Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
          {/* Hero Image */}
          <div className="w-full h-[400px] bg-gray-200 overflow-hidden">
            <img
              src={article.image}
              alt={article.headline}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Article Meta */}
          <div className="p-8">
            {/* City Badge */}
            <div className="mb-4">
              <span className="inline-block px-3 py-1 text-sm font-medium text-blue-900 bg-blue-100 rounded-full">
                {article.city}
              </span>
            </div>
            
            {/* Headline */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {article.headline}
            </h1>
            
            {/* Article Info */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 text-gray-600 text-sm">
              <div className="flex items-center mb-2 sm:mb-0">
                <Calendar className="h-4 w-4 mr-2" />
                {article.date}
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                By {article.author}
              </div>
            </div>
          </div>
        </div>

        {/* Article Body */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            {article.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-6">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewsDetailPage;