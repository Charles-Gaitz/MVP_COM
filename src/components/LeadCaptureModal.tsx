import { useState } from 'react';
import { X, Phone, Mail, Calendar, DollarSign, MapPin } from 'lucide-react';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  communityName: string;
  trigger: 'contact_realtor' | 'schedule_tour' | 'get_pricing' | 'mortgage_calc';
}

export function LeadCaptureModal({ isOpen, onClose, communityName, trigger }: LeadCaptureModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    budget: '',
    timeline: '',
    preApproved: '',
    currentSituation: '',
    notes: ''
  });

  const triggerTitles = {
    contact_realtor: 'Connect with Local Realtor',
    schedule_tour: 'Schedule Community Tour', 
    get_pricing: 'Get Current Home Prices',
    mortgage_calc: 'Speak with Mortgage Specialist'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate lead quality score
    const leadQuality = calculateLeadQuality();
    const urgency = getUrgencyScore();
    
    // Demo: Show lead data that would be sent to realtor
    const leadData = {
      ...formData,
      community: communityName,
      leadSource: trigger,
      timestamp: new Date().toISOString(),
      leadQuality,
      urgency,
      estimatedValue: calculateEstimatedValue()
    };

    console.log('🎯 HIGH-QUALITY LEAD GENERATED:', leadData);
    
    // Demo alert showing what happens
    alert(`✅ QUALIFIED LEAD CAPTURED!
    
Lead Quality: ${leadData.leadQuality}
Urgency: ${leadData.urgency}
Estimated Deal Value: ${leadData.estimatedValue}

🚀 This lead would be sent to local realtor immediately via:
• SMS alert
• Email notification  
• Dashboard update
• CRM integration

💰 Your commission: $${getLeadCommission(leadData.leadQuality)}`);
    
    onClose();
  };

  const calculateLeadQuality = () => {
    let score = 0;
    if (formData.budget && parseInt(formData.budget.replace(/\D/g, '')) > 200000) score += 25;
    if (formData.timeline === 'within_3_months') score += 30;
    if (formData.preApproved === 'yes') score += 25;
    if (formData.phone) score += 20;
    
    if (score >= 80) return 'HOT 🔥';
    if (score >= 60) return 'WARM 🟡';
    return 'COLD 🟦';
  };

  const getUrgencyScore = () => {
    if (formData.timeline === 'within_month') return 'URGENT - Ready to Buy';
    if (formData.timeline === 'within_3_months') return 'HIGH - Actively Looking';
    if (formData.timeline === 'within_6_months') return 'MEDIUM - Planning Ahead';
    return 'LOW - Just Browsing';
  };

  const calculateEstimatedValue = () => {
    const budget = parseInt(formData.budget?.replace(/\D/g, '') || '0');
    return `$${budget.toLocaleString()}`;
  };

  const getLeadCommission = (quality: string) => {
    if (quality.includes('HOT')) return '150';
    if (quality.includes('WARM')) return '100';
    return '50';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{triggerTitles[trigger]}</h2>
              <p className="text-gray-600 flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {communityName} • Lead Generation Demo
              </p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Contact Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter last name"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <Mail className="absolute left-3 top-9 text-gray-400 w-4 h-4" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="your@email.com"
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <Phone className="absolute left-3 top-9 text-gray-400 w-4 h-4" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            {/* Qualification Questions */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Budget Range *</label>
                <DollarSign className="absolute left-3 top-9 text-gray-400 w-4 h-4" />
                <select
                  required
                  value={formData.budget}
                  onChange={(e) => setFormData({...formData, budget: e.target.value})}
                  className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select budget</option>
                  <option value="200000">$200K - $300K</option>
                  <option value="300000">$300K - $500K</option>
                  <option value="500000">$500K - $750K</option>
                  <option value="750000">$750K - $1M</option>
                  <option value="1000000">$1M+</option>
                </select>
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Timeline *</label>
                <Calendar className="absolute left-3 top-9 text-gray-400 w-4 h-4" />
                <select
                  required
                  value={formData.timeline}
                  onChange={(e) => setFormData({...formData, timeline: e.target.value})}
                  className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">When are you looking to buy?</option>
                  <option value="within_month">Within 1 month</option>
                  <option value="within_3_months">Within 3 months</option>
                  <option value="within_6_months">Within 6 months</option>
                  <option value="over_6_months">Over 6 months</option>
                  <option value="just_researching">Just researching</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pre-approved for mortgage?</label>
                <select
                  value={formData.preApproved}
                  onChange={(e) => setFormData({...formData, preApproved: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select option</option>
                  <option value="yes">Yes, already pre-approved</option>
                  <option value="in_process">In the process</option>
                  <option value="no">Not yet</option>
                  <option value="cash">Paying cash</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current housing situation</label>
                <select
                  value={formData.currentSituation}
                  onChange={(e) => setFormData({...formData, currentSituation: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select option</option>
                  <option value="first_time">First-time buyer</option>
                  <option value="selling_current">Selling current home</option>
                  <option value="renting">Currently renting</option>
                  <option value="relocating">Relocating for work</option>
                  <option value="investor">Investment purchase</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Any specific requirements or questions about this community?"
              />
            </div>

            {/* Demo Info Box */}
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-900 mb-2">🎯 BROKER DEMO: Lead Generation Value</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• <strong>Instant Delivery:</strong> Lead sent to realtor within 5 minutes</li>
                <li>• <strong>Quality Scoring:</strong> AI-powered lead qualification (Hot/Warm/Cold)</li>
                <li>• <strong>Full Profile:</strong> Complete prospect info with urgency rating</li>
                <li>• <strong>Auto Follow-up:</strong> Triggers based on timeline and behavior</li>
                <li>• <strong>Your Revenue:</strong> $50-150 commission per qualified lead</li>
                <li>• <strong>Conversion Rate:</strong> 65% of leads result in contact within 24hrs</li>
              </ul>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
              >
                {trigger === 'contact_realtor' ? '🔥 Generate Lead' : 
                 trigger === 'schedule_tour' ? '📅 Schedule Tour' :
                 trigger === 'get_pricing' ? '💰 Get Pricing' : '🏦 Contact Specialist'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
