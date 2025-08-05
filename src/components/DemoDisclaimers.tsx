import { AlertTriangle, Info } from 'lucide-react';

interface DemoDisclaimerProps {
  type?: 'banner' | 'badge' | 'card';
  variant?: 'warning' | 'info';
  className?: string;
  showIcon?: boolean;
}

export const DemoDisclaimer = ({ 
  type = 'badge', 
  variant = 'warning',
  className = '',
  showIcon = true
}: DemoDisclaimerProps) => {
  const baseClasses = variant === 'warning' 
    ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
    : 'bg-blue-50 border-blue-200 text-blue-800';

  const iconClasses = variant === 'warning' 
    ? 'text-yellow-600' 
    : 'text-blue-600';

  const Icon = variant === 'warning' ? AlertTriangle : Info;

  if (type === 'banner') {
    return (
      <div className={`border-l-4 p-4 mb-6 ${baseClasses} ${className}`}>
        <div className="flex items-center">
          {showIcon && <Icon className={`w-5 h-5 mr-3 ${iconClasses}`} />}
          <div>
            <p className="font-medium">Demo Data Notice</p>
            <p className="text-sm mt-1">
              This application uses sample data for demonstration purposes. 
              All community information, pricing, and statistics are simulated 
              and not representative of actual market conditions.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className={`rounded-lg border p-4 ${baseClasses} ${className}`}>
        <div className="flex items-start">
          {showIcon && <Icon className={`w-5 h-5 mr-3 mt-0.5 ${iconClasses}`} />}
          <div>
            <h3 className="font-semibold mb-2">Demo Environment</h3>
            <p className="text-sm">
              You're viewing sample data for demonstration purposes. In the live version, 
              this information would be sourced from real MLS data, school districts, 
              and demographic databases.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Default: badge type
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${baseClasses} ${className}`}>
      {showIcon && <Icon className={`w-3 h-3 mr-1 ${iconClasses}`} />}
      Demo Data
    </span>
  );
};

export const DataSourceDisclaimer = ({ className = '' }: { className?: string }) => {
  return (
    <div className={`text-xs text-gray-500 mt-2 ${className}`}>
      <p className="flex items-center">
        <Info className="w-3 h-3 mr-1" />
        Data sources in production: MLS, TEA, US Census, Local Crime Databases
      </p>
    </div>
  );
};

export const PricingDisclaimer = ({ className = '' }: { className?: string }) => {
  return (
    <div className={`bg-gray-50 border border-gray-200 rounded-md p-3 ${className}`}>
      <div className="flex items-start">
        <AlertTriangle className="w-4 h-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
        <div className="text-xs text-gray-600">
          <p className="font-medium text-gray-800 mb-1">Pricing Information</p>
          <p>
            Displayed prices are sample data for demo purposes. Actual market prices 
            vary daily and should be verified with current MLS listings and local market analysis.
          </p>
        </div>
      </div>
    </div>
  );
};
