import React, { useState, useEffect } from 'react';
import { Sheet } from '../../types';
import { apiService } from '../../services/api';
import { FileText, Users, Edit, ChevronLeft } from 'lucide-react';

interface SheetsProps {
  onNavigateToSubscribers: (sheetId: number, sheetName: string) => void;
  onBack: () => void;
}

export const Sheets: React.FC<SheetsProps> = ({ onNavigateToSubscribers, onBack }) => {
  const [sheets, setSheets] = useState<Sheet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSheets();
  }, []);

  const loadSheets = async () => {
    try {
      setLoading(true);
      const data = await apiService.getSheets();
      setSheets(data);
    } catch (error) {
      console.error('Error loading sheets:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 rtl:space-x-reverse text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>חזרה</span>
          </button>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">גליונות</h1>
      </div>

      {/* Sheets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sheets.map((sheet) => (
          <div
            key={sheet.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{sheet.name}</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p><span className="font-medium">מספר:</span> {sheet.number}</p>
                <p><span className="font-medium">פרשה:</span> {sheet.parasha}</p>
                <p><span className="font-medium">מנויים:</span> {sheet.subscriberCount.toLocaleString()}</p>
              </div>
            </div>

            <button
              onClick={() => onNavigateToSubscribers(sheet.id, sheet.name)}
              className="w-full flex items-center justify-center space-x-2 rtl:space-x-reverse bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              <Users className="w-4 h-4" />
              <span>מנויים לגיליון</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};