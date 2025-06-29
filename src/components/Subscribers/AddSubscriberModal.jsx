import React, { useState } from 'react';
import { apiService } from '../../services/api';
import { X, Search, Loader2, User, Award, BookOpen, DollarSign } from 'lucide-react';

export const AddSubscriberModal = ({
  sheetId,
  onClose,
  onSuccess,
  parashaOptions,
  halachaOptions,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedSubscriber, setSelectedSubscriber] = useState(null);
  const [searching, setSearching] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    numberOfWins: 0,
    scholarshipFund: 0,
    parashaAnswersCode: '',
    yiunHalacha: false,
    yiunHalachaAnswersCode: '',
    answersText: '',
  });
  const [errors, setErrors] = useState([]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      setSearching(true);
      const results = await apiService.searchSubscribers(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching subscribers:', error);
    } finally {
      setSearching(false);
    }
  };

  const selectSubscriber = (subscriber) => {
    setSelectedSubscriber(subscriber);
    setSearchResults([]);
    setSearchQuery('');
  };

  const validateForm = () => {
    const newErrors = [];

    if (!selectedSubscriber) {
      newErrors.push('יש לבחור מנוי');
    }

    const hasAtLeastOneValue = 
      (formData.numberOfWins && formData.numberOfWins > 0) ||
      formData.yiunHalacha ||
      (formData.scholarshipFund && formData.scholarshipFund > 0) ||
      formData.parashaAnswersCode;

    if (!hasAtLeastOneValue) {
      newErrors.push('חובה להזין לפחות ערך אחד: מספר זכיות, עיון ההלכה, קרן מלגות או פסילת הפרשה');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      const subscriberData = {
        subscriberCode: selectedSubscriber.code,
        name: selectedSubscriber.name,
        idNumber: selectedSubscriber.idNumber,
        numberOfWins: formData.numberOfWins || 0,
        scholarshipFund: formData.scholarshipFund || 0,
        parashaAnswersCode: formData.parashaAnswersCode || '',
        yiunHalacha: formData.yiunHalacha || false,
        yiunHalachaAnswersCode: formData.yiunHalachaAnswersCode || '',
        answersText: formData.answersText || '',
      };

      await apiService.addSubscriber(sheetId, subscriberData);
      onSuccess();
    } catch (error) {
      console.error('Error adding subscriber:', error);
      setErrors(['אירעה שגיאה בהוספת המנוי']);
    } finally {
      setSubmitting(false);
    }
  };

  // Helper function to get the label text for a code
  const getParashaAnswerText = (code) => {
    const option = parashaOptions.find(opt => opt.value === code);
    return option ? option.label : code;
  };

  const getHalachaAnswerText = (code) => {
    const option = halachaOptions.find(opt => opt.value === code);
    return option ? option.label : code;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" dir="rtl">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900 text-right">הוספת מנוי חדש</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
              <ul className="list-disc list-inside text-right">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Subscriber Search */}
          {!selectedSubscriber && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 text-right">
                חיפוש מנוי (קוד מנוי / שם / תעודת זהות)
              </label>
              <div className="flex space-x-2 rtl:space-x-reverse">
                <button
                  type="button"
                  onClick={handleSearch}
                  disabled={searching || !searchQuery.trim()}
                  className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  {searching ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-right text-sm"
                  placeholder="הזן קוד מנוי, שם או ת.ז."
                  dir="rtl"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>

              {searchResults.length > 0 && (
                <div className="border border-gray-200 rounded-md max-h-32 overflow-y-auto">
                  {searchResults.map((result, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => selectSubscriber(result)}
                      className="w-full px-3 py-2 text-right hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors text-sm"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">{result.yeshiva} - {result.locality}</span>
                        <div className="text-right">
                          <div className="font-medium">{result.name}</div>
                          <div className="text-xs text-gray-500">{result.code} - {result.idNumber}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Selected Subscriber */}
          {selectedSubscriber && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <button
                  type="button"
                  onClick={() => setSelectedSubscriber(null)}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="text-right flex-1">
                  <div className="flex items-center justify-end space-x-2 rtl:space-x-reverse mb-1">
                    <User className="w-4 h-4 text-blue-600" />
                    <h3 className="text-lg font-bold text-blue-900">{selectedSubscriber.name}</h3>
                  </div>
                  <p className="text-sm text-blue-700 font-medium">{selectedSubscriber.code} - {selectedSubscriber.idNumber}</p>
                  <p className="text-sm text-blue-600">{selectedSubscriber.yeshiva} - {selectedSubscriber.locality}</p>
                </div>
              </div>
            </div>
          )}

          {/* Form Fields */}
          {selectedSubscriber && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-end space-x-2 rtl:space-x-reverse mb-2">
                    <span className="text-sm font-semibold text-gray-800 text-right">
                      מספר זכיות
                    </span>
                    <Award className="w-4 h-4 text-gray-600" />
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={formData.numberOfWins || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, numberOfWins: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-right text-sm bg-white"
                    dir="rtl"
                  />
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-end space-x-2 rtl:space-x-reverse mb-2">
                    <span className="text-sm font-semibold text-gray-800 text-right">
                      קרן מלגות
                    </span>
                    <DollarSign className="w-4 h-4 text-gray-600" />
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={formData.scholarshipFund || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, scholarshipFund: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-right text-sm bg-white"
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-end space-x-2 rtl:space-x-reverse mb-2">
                    <span className="text-sm font-semibold text-gray-800 text-right">
                      פסילת הפרשה
                    </span>
                    <BookOpen className="w-4 h-4 text-gray-600" />
                  </div>
                  <select
                    value={formData.parashaAnswersCode || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, parashaAnswersCode: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-right text-sm bg-white"
                    dir="rtl"
                  >
                    {parashaOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-end space-x-2 rtl:space-x-reverse mb-2">
                    <span className="text-sm font-semibold text-gray-800 text-right">
                      פסילת ההלכה
                    </span>
                    <BookOpen className="w-4 h-4 text-gray-600" />
                  </div>
                  <select
                    value={formData.yiunHalachaAnswersCode || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, yiunHalachaAnswersCode: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-right text-sm bg-white"
                    dir="rtl"
                    disabled={!formData.yiunHalacha}
                  >
                    {halachaOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <label className="flex items-center justify-end space-x-2 rtl:space-x-reverse text-sm font-semibold text-gray-800 cursor-pointer">
                  <span className="text-right">עיון ההלכה</span>
                  <input
                    type="checkbox"
                    checked={formData.yiunHalacha || false}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      yiunHalacha: e.target.checked,
                      // Reset halacha answer code if unchecked
                      yiunHalachaAnswersCode: e.target.checked ? prev.yiunHalachaAnswersCode : ''
                    }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </label>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <label className="block text-sm font-semibold text-gray-800 text-right mb-2">
                  הערות
                </label>
                <textarea
                  value={formData.answersText || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, answersText: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-right text-sm resize-none"
                  dir="rtl"
                  placeholder="הזן הערות נוספות..."
                />
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-start space-x-3 rtl:space-x-reverse pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              ביטול
            </button>
            <button
              type="submit"
              disabled={submitting || !selectedSubscriber}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? (
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>מוסיף...</span>
                </div>
              ) : (
                'הוסף מנוי'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};