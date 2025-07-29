import { useState } from 'react';
import { Smartphone, Download, QrCode, Star, Bell, MapPin, Camera, Share2, X, Apple, Zap } from 'lucide-react';

interface MobileAppFeature {
  icon: any;
  title: string;
  description: string;
  highlight?: boolean;
}

export function MobileAppPromotionModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'features' | 'download'>('features');

  if (!isOpen) return null;

  const features: MobileAppFeature[] = [
    {
      icon: Bell,
      title: 'Instant Notifications',
      description: 'Get real-time alerts for new listings, price changes, and market updates',
      highlight: true
    },
    {
      icon: MapPin,
      title: 'Location-Based Search',
      description: 'Find properties and communities around you using GPS and map integration',
      highlight: true
    },
    {
      icon: Camera,
      title: 'Photo Recognition',
      description: 'Take a photo of any property to instantly get details and similar listings'
    },
    {
      icon: Share2,
      title: 'Easy Sharing',
      description: 'Share properties and communities with family and friends seamlessly'
    },
    {
      icon: Zap,
      title: 'Offline Access',
      description: 'View saved properties and community data even without internet connection'
    },
    {
      icon: Star,
      title: 'Quick Actions',
      description: 'Save favorites, add notes, and schedule viewings with just a few taps'
    }
  ];

  const appStoreFeatures = [
    { name: 'Real Estate Search', rating: 4.8 },
    { name: 'Community Discovery', rating: 4.9 },
    { name: 'Market Analytics', rating: 4.7 },
    { name: 'Photo Gallery', rating: 4.8 },
    { name: 'Push Notifications', rating: 4.6 }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Smartphone className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Texas Communities Mobile</h2>
              <p className="text-blue-100">Discover your perfect community on the go</p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex mt-6 space-x-1 bg-white/10 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('features')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'features'
                  ? 'bg-white text-blue-600'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              Features
            </button>
            <button
              onClick={() => setActiveTab('download')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'download'
                  ? 'bg-white text-blue-600'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              Download
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {activeTab === 'features' && (
            <div className="space-y-6">
              {/* Hero Section */}
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Take Texas Communities Anywhere
                </h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Our mobile app brings the power of community discovery to your fingertips. 
                  Search, explore, and connect with your future neighborhood from anywhere.
                </p>
              </div>

              {/* App Preview */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="w-64 h-96 bg-gray-900 rounded-3xl p-2 shadow-2xl">
                    <div className="w-full h-full bg-gradient-to-b from-blue-50 to-white rounded-2xl overflow-hidden">
                      {/* Mock phone screen */}
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                              <Smartphone className="h-4 w-4 text-white" />
                            </div>
                            <span className="font-semibold text-gray-900">Texas Communities</span>
                          </div>
                          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">3</span>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="bg-white rounded-lg p-3 shadow-sm border">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-green-100 rounded-lg"></div>
                              <div className="flex-1">
                                <div className="h-3 bg-gray-300 rounded mb-1"></div>
                                <div className="h-2 bg-gray-200 rounded"></div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-white rounded-lg p-3 shadow-sm border">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-blue-100 rounded-lg"></div>
                              <div className="flex-1">
                                <div className="h-3 bg-gray-300 rounded mb-1"></div>
                                <div className="h-2 bg-gray-200 rounded"></div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-white rounded-lg p-3 shadow-sm border">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-purple-100 rounded-lg"></div>
                              <div className="flex-1">
                                <div className="h-3 bg-gray-300 rounded mb-1"></div>
                                <div className="h-2 bg-gray-200 rounded"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating notification */}
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                    New!
                  </div>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={index}
                      className={`p-6 rounded-xl border-2 transition-all hover:shadow-lg ${
                        feature.highlight
                          ? 'border-blue-200 bg-blue-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-lg ${
                          feature.highlight ? 'bg-blue-600' : 'bg-gray-600'
                        }`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            {feature.title}
                            {feature.highlight && (
                              <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                                Premium
                              </span>
                            )}
                          </h4>
                          <p className="text-gray-600 text-sm">{feature.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* User Reviews */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">What Users Are Saying</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      "Perfect for house hunting! The location features are incredibly accurate."
                    </p>
                    <p className="text-xs text-gray-500">- Sarah M.</p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      "Love the instant notifications. Never miss a good deal anymore!"
                    </p>
                    <p className="text-xs text-gray-500">- Mike R.</p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      "The community data is so detailed. Made choosing a neighborhood easy."
                    </p>
                    <p className="text-xs text-gray-500">- Jennifer L.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'download' && (
            <div className="space-y-6">
              {/* Download Section */}
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Download the App
                </h3>
                <p className="text-gray-600 mb-6">
                  Available for iOS and Android. Scan the QR code or choose your platform below.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* QR Code Section */}
                <div className="text-center">
                  <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-xl">
                    <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                      <QrCode className="h-24 w-24 text-gray-400" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    Scan with your phone's camera to download
                  </p>
                </div>

                {/* Download Links */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 mb-4">Choose Your Platform</h4>
                  
                  {/* iOS */}
                  <button className="w-full flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="p-2 bg-gray-900 rounded-lg">
                      <Apple className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">Download for iOS</p>
                      <p className="text-sm text-gray-600">Available on the App Store</p>
                    </div>
                    <Download className="h-5 w-5 text-gray-400 ml-auto" />
                  </button>

                  {/* Android */}
                  <button className="w-full flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="p-2 bg-green-600 rounded-lg">
                      <Smartphone className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">Download for Android</p>
                      <p className="text-sm text-gray-600">Available on Google Play</p>
                    </div>
                    <Download className="h-5 w-5 text-gray-400 ml-auto" />
                  </button>

                  {/* Progressive Web App */}
                  <button className="w-full flex items-center space-x-4 p-4 border border-blue-200 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    <div className="p-2 bg-blue-600 rounded-lg">
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">Web App</p>
                      <p className="text-sm text-gray-600">Install directly from browser</p>
                    </div>
                    <Download className="h-5 w-5 text-blue-600 ml-auto" />
                  </button>
                </div>
              </div>

              {/* App Store Ratings */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-4">App Store Performance</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <span className="text-2xl font-bold text-gray-900">4.8</span>
                      <span className="text-gray-600">/ 5.0</span>
                    </div>
                    <p className="text-sm text-gray-600">Based on 12,847 reviews</p>
                  </div>
                  
                  <div className="space-y-2">
                    {appStoreFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{feature.name}</span>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium text-gray-900">{feature.rating}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* System Requirements */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-4">System Requirements</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">iOS</h5>
                    <ul className="space-y-1 text-gray-600">
                      <li>• iOS 14.0 or later</li>
                      <li>• iPhone 8 or newer</li>
                      <li>• 150 MB available space</li>
                      <li>• Internet connection required</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Android</h5>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Android 8.0 (API level 26)</li>
                      <li>• 4 GB RAM recommended</li>
                      <li>• 200 MB available space</li>
                      <li>• Location services optional</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Quick Setup */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-semibold text-gray-900 mb-4">Quick Setup</h4>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                    <span className="text-sm text-gray-700">Download & Install</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                    <span className="text-sm text-gray-700">Sign In with Account</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                    <span className="text-sm text-gray-700">Start Exploring</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Your account data will sync automatically across all devices
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium"
            >
              Continue on Web
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
