import React from 'react';
import { Shield, X, Check } from 'lucide-react';

interface ConsentPopupProps {
  onAccept: () => void;
  onDecline: () => void;
}

const ConsentPopup: React.FC<ConsentPopupProps> = ({ onAccept, onDecline }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Shield size={24} className="text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Personalize Your Travel Experience</h3>
            </div>
            <button 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={onDecline}
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <p className="text-gray-600 mb-6">
            We'd love to make your travel planning even better! With your permission, 
            we can provide you with:
          </p>
          
          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-3">
              <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">Tailored destination insights and hidden gems</span>
            </li>
            <li className="flex items-start gap-3">
              <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">Personalized restaurant and activity recommendations</span>
            </li>
            <li className="flex items-start gap-3">
              <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">Curated itineraries based on your preferences</span>
            </li>
            <li className="flex items-start gap-3">
              <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">Best possible deals and exclusive offers</span>
            </li>
          </ul>
          
          <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
            Your privacy matters to us. We only use this data to enhance your 
            travel experience and never share it with third parties.
          </p>
        </div>
        
        <div className="p-6 border-t border-gray-100 flex gap-3">
          <button 
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={onDecline}
          >
            Maybe Later
          </button>
          <button 
            className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-medium hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 hover:shadow-lg"
            onClick={onAccept}
          >
            Yes, Personalize My Experience
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsentPopup;
