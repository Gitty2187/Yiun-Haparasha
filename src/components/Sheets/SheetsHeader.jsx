import React from 'react';
import { Search } from 'lucide-react';

export const SheetsHeader = ({ searchQuery, onSearchChange, totalSheets }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4 rtl:space-x-reverse">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-right"
            placeholder="חיפוש גליונות..."
            dir="rtl"
          />
        </div>
      </div>
      <div className="text-right">
        <h1 className="text-2xl font-bold text-gray-900">גליונות</h1>
        <p className="text-sm text-gray-600 mt-1">{totalSheets} גליונות</p>
      </div>
    </div>
  );
};