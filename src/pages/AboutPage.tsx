import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin } from 'lucide-react';

function AboutPage() {
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

      {/* About Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link 
          to="/" 
          className="inline-flex items-center text-blue-900 hover:text-blue-800 mb-8 font-medium transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
        
        <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">About TexasCommunities</h1>
          
          <div className="prose prose-lg text-gray-600 max-w-none">
            <p className="mb-6">
              TexasCommunities is your trusted partner in finding the perfect place to call home in the Lone Star State. 
              We understand that choosing where to live is one of life's most important decisions, and we're here to make 
              that process easier and more informed.
            </p>
            
            <p className="mb-6">
              Our platform brings together comprehensive data about Texas communities, including school ratings, 
              housing market trends, local amenities, and the unique character that makes each neighborhood special. 
              Whether you're relocating for work, seeking better schools for your family, or simply looking for a 
              change of scenery, we provide the insights you need to make the right choice.
            </p>
            
            <p>
              From bustling urban centers like Dallas and Houston to charming small towns across the state, 
              Texas offers incredible diversity in lifestyle and opportunity. Let us help you discover the 
              community that matches your dreams and aspirations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;