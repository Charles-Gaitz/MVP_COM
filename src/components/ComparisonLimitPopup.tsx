import { X, AlertTriangle } from 'lucide-react';

interface ComparisonLimitPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ComparisonLimitPopup({ isOpen, onClose }: ComparisonLimitPopupProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Comparison Limit Reached
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            You can compare up to 4 communities at a time for the best comparison experience.
          </p>
          <p className="text-sm text-gray-500">
            To add a new community, please remove one from your current selection first.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            Got it
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors"
          >
            View Comparison
          </button>
        </div>
      </div>
    </div>
  );
}
