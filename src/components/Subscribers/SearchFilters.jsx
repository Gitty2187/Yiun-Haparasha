import React from 'react';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';

export const SearchFilters = ({ 
  searchFilters, 
  onFiltersChange, 
  searchExpanded, 
  onToggleExpanded,
  onClearSearch 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      <button
        onClick={onToggleExpanded}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          {searchExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
          <span className="text-sm text-gray-600">
            {Object.keys(searchFilters).length > 0 ? `${Object.keys(searchFilters).length} מסננים פעילים` : 'לחץ לפתיחת חיפושים'}
          </span>
        </div>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Filter className="w-5 h-5 text-gray-500" />
          <span className="font-medium text-gray-900">חיפוש ומסננים</span>
        </div>
      </button>

      {searchExpanded && (
        <div className="border-t border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 text-right mb-1">
                מס' תיוק
              </label>
              <input
                type="text"
                value={searchFilters.filingNumber || ''}
                onChange={(e) => onFiltersChange({ ...searchFilters, filingNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-right"
                placeholder="חיפוש לפי מס' תיוק"
                dir="rtl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 text-right mb-1">
                קוד מנוי
              </label>
              <input
                type="text"
                value={searchFilters.subscriberCode || ''}
                onChange={(e) => onFiltersChange({ ...searchFilters, subscriberCode: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-right"
                placeholder="חיפוש לפי קוד מנוי"
                dir="rtl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 text-right mb-1">
                שם
              </label>
              <input
                type="text"
                value={searchFilters.name || ''}
                onChange={(e) => onFiltersChange({ ...searchFilters, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-right"
                placeholder="חיפוש לפי שם"
                dir="rtl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 text-right mb-1">
                תעודת זהות
              </label>
              <input
                type="text"
                value={searchFilters.idNumber || ''}
                onChange={(e) => onFiltersChange({ ...searchFilters, idNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-right"
                placeholder="חיפוש לפי ת.ז."
                dir="rtl"
              />
            </div>
          </div>
          
          {Object.keys(searchFilters).length > 0 && (
            <div className="flex justify-start">
              <button
                onClick={onClearSearch}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
              >
                נקה חיפושים
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};