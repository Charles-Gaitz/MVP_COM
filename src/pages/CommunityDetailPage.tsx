import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, ChevronDown, ChevronUp, Home, GraduationCap, Users, Clock } from 'lucide-react';

function CommunityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
  };

  // Sample data based on community ID
  const communityData = {
    name: id === 'westlake' ? 'Westlake' : id === 'plano' ? 'Plano' : id === 'katy' ? 'Katy' : 'Community',
    city: id === 'westlake' ? 'Austin' : id === 'plano' ? 'Dallas' : id === 'katy' ? 'Houston' : 'Texas',
    heroImage: id === 'westlake' 
      ? 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop'
      : id === 'plano'
      ? 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop'
      : 'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop'
  };

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

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link 
          to="/explore" 
          className="inline-flex items-center text-blue-900 hover:text-blue-800 mb-6 font-medium transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Explore
        </Link>

        {/* Hero Banner */}
        <div className="relative mb-8">
          <div 
            className="w-full h-[400px] bg-gray-300 rounded-lg overflow-hidden relative"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('${communityData.heroImage}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-4xl md:text-5xl font-bold mb-2">{communityData.name}</h1>
                <p className="text-xl text-white/90">{communityData.city}, Texas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Facts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <Home className="h-8 w-8 text-blue-900 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Median Home Price</h3>
            <p className="text-2xl font-bold text-blue-900">$485,000</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <GraduationCap className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">School Rating</h3>
            <p className="text-2xl font-bold text-green-600">A+</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <Clock className="h-8 w-8 text-orange-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Average Commute</h3>
            <p className="text-2xl font-bold text-orange-500">28 min</p>
          </div>
        </div>

        {/* Collapsible Info Sections */}
        <div className="space-y-4 mb-8">
          {/* Schools Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <button
              onClick={() => toggleSection('schools')}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors duration-200"
            >
              <h3 className="text-xl font-semibold text-gray-900">Schools</h3>
              {expandedSection === 'schools' ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>
            {expandedSection === 'schools' && (
              <div className="px-6 pb-6 border-t border-gray-100">
                <div className="space-y-4 mt-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-gray-900">Westlake Elementary School</h4>
                      <p className="text-gray-600">Grades K-5</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">A+</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-gray-900">Westlake High School</h4>
                      <p className="text-gray-600">Grades 9-12</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">A</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Housing Market Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <button
              onClick={() => toggleSection('housing')}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors duration-200"
            >
              <h3 className="text-xl font-semibold text-gray-900">Housing Market</h3>
              {expandedSection === 'housing' ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>
            {expandedSection === 'housing' && (
              <div className="px-6 pb-6 border-t border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Price Range</h4>
                    <p className="text-gray-600">$350,000 - $750,000</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Market Trend</h4>
                    <p className="text-green-600 font-medium">↗ +5.2% YoY</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Demographics Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <button
              onClick={() => toggleSection('demographics')}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors duration-200"
            >
              <h3 className="text-xl font-semibold text-gray-900">Demographics</h3>
              {expandedSection === 'demographics' ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>
            {expandedSection === 'demographics' && (
              <div className="px-6 pb-6 border-t border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Population</h4>
                    <p className="text-gray-600">42,850 residents</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Median Age</h4>
                    <p className="text-gray-600">38.5 years</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CTA Panel - Connect with Realtor */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-6">
            <Users className="h-12 w-12 text-blue-900 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Connect with a Local Realtor</h3>
            <p className="text-gray-600">Get personalized insights and schedule a tour of {communityData.name}</p>
          </div>
          
          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all duration-200"
                placeholder="Enter your full name"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all duration-200"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all duration-200"
                placeholder="Enter your phone number"
              />
            </div>
            
            <button
              type="submit"
              className="w-full px-6 py-3 text-white bg-blue-900 hover:bg-blue-800 rounded-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2"
            >
              Connect with Realtor
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CommunityDetailPage;