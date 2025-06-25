import React from 'react';
import { Plus } from 'lucide-react';

export const SubscribersHeader = ({ sheetName, subscribersCount, onAddSubscriber }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex justify-start">
        <button
          onClick={onAddSubscriber}
          className="flex items-center space-x-2 rtl:space-x-reverse bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>הוסף מנוי</span>
        </button>
      </div>
      <div className="flex justify-end text-right">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            זכיות למנויים לגיליון {sheetName}
          </h1>
          <p className="text-sm text-gray-600 mt-1">{subscribersCount} מנויים</p>
        </div>
      </div>
    </div>
  );
};