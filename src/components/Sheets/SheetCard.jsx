import React from 'react';
import { FileText, Users, Edit } from 'lucide-react';

export const SheetCard = ({ sheet, onNavigateToSubscribers }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex space-x-2 rtl:space-x-reverse">
          <button
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            title="עריכה"
          >
            <Edit className="w-4 h-4" />
          </button>
        </div>
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <FileText className="w-6 h-6 text-blue-600" />
        </div>
      </div>

      <div className="text-right mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{sheet.sheetName}</h3>
        <div className="space-y-1 text-sm text-gray-600">
          <p><span className="font-medium">מספר:</span> {sheet.sheetCode}</p>
          <p><span className="font-medium">שם:</span> {sheet.description}</p>
          <p><span className="font-medium">מנויים:</span> {sheet.subscribersNum}</p>
        </div>
      </div>

      <button
        onClick={() => onNavigateToSubscribers(sheet.sheetCode, sheet.sheetName, sheet.subscribersNum)}
        className="w-full flex items-center justify-center space-x-2 rtl:space-x-reverse bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
      >
        <Users className="w-4 h-4" />
        <span>מנויים לגיליון</span>
      </button>
    </div>
  );
};