import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-auto p-8">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* 404 Icon */}
          <div className="w-24 h-24 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-4xl font-bold text-blue-600">404</span>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h1>
          
          <p className="text-gray-600 mb-8">
            Sorry, we couldn't find the page you're looking for. 
            The page may have been moved or doesn't exist.
          </p>
          
          <div className="space-y-3">
            <Link
              to="/"
              className="inline-flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <Home className="w-5 h-5 mr-2" />
              Go to Homepage
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </button>
          </div>
          
          {/* Popular Links */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-3">Popular Pages:</p>
            <div className="space-y-2">
              <Link 
                to="/explore" 
                className="block text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                Explore Communities
              </Link>
              <Link 
                to="/compare" 
                className="block text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                Compare Communities
              </Link>
              <Link 
                to="/about" 
                className="block text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                About Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
