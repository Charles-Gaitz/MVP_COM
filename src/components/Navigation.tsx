import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, User, Mail, Smartphone, LogOut, LogIn } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { AuthModal } from './AuthModal';
import { UserProfileModal } from './UserProfile';
import { EmailDigestModal } from './EmailDigest';
import { MobileAppPromotionModal } from './MobileAppPromotion';

export function Navigation() {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useUser();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showEmailDigestModal, setShowEmailDigestModal] = useState(false);
  const [showMobileAppModal, setShowMobileAppModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navigationLinks = [
    { to: "/explore", label: "Explore" },
    { to: "/favorites", label: "Favorites" },
    { to: "/reports", label: "Compare" },
    { to: "/about", label: "About" }
  ];

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <>
      <nav className="relative z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-gray-900 hover:text-blue-900 transition-colors duration-200"
            >
              <MapPin className="h-8 w-8 text-blue-900" />
              <span className="text-xl font-bold">TexasCommunities</span>
            </Link>
            
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              {navigationLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`font-medium transition-colors duration-200 ${
                    location.pathname === link.to
                      ? 'text-blue-900 border-b-2 border-blue-900 pb-1'
                      : 'text-gray-700 hover:text-blue-900'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {/* Mobile App Promotion */}
              <button
                onClick={() => setShowMobileAppModal(true)}
                className="hidden sm:flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-blue-900 transition-colors"
              >
                <Smartphone className="h-4 w-4" />
                <span>Get App</span>
              </button>

              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      {user.avatar ? (
                        <img src={user.avatar} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <User className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-gray-700">
                      {user.name}
                    </span>
                  </button>

                  {/* User Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>

                      <div className="py-2">
                        <button
                          onClick={() => {
                            setShowProfileModal(true);
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <User className="h-4 w-4 mr-3" />
                          My Profile
                        </button>

                        <button
                          onClick={() => {
                            setShowEmailDigestModal(true);
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <Mail className="h-4 w-4 mr-3" />
                          Email Digest
                        </button>

                        <button
                          onClick={() => {
                            setShowMobileAppModal(true);
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <Smartphone className="h-4 w-4 mr-3" />
                          Mobile App
                        </button>

                        <div className="border-t border-gray-100 mt-2 pt-2">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="h-4 w-4 mr-3" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden border-t border-gray-100 py-2">
            <div className="flex justify-between items-center">
              {navigationLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    location.pathname === link.to
                      ? 'text-blue-900'
                      : 'text-gray-700 hover:text-blue-900'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      <UserProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />

      <EmailDigestModal
        isOpen={showEmailDigestModal}
        onClose={() => setShowEmailDigestModal(false)}
      />

      <MobileAppPromotionModal
        isOpen={showMobileAppModal}
        onClose={() => setShowMobileAppModal(false)}
      />
    </>
  );
}
