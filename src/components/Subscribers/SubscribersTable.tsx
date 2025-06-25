import React, { useState, useEffect, useCallback } from 'react';
import { Subscriber, SearchFilters, DropdownOption } from '../../types';
import { apiService } from '../../services/api';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  Loader2,
  ChevronDown,
  ChevronUp,
  Filter
} from 'lucide-react';
import { AddSubscriberModal } from './AddSubscriberModal';
import { ConfirmDialog } from '../UI/ConfirmDialog';

interface SubscribersTableProps {
  sheetId: number;
  sheetName: string;
}

export const SubscribersTable: React.FC<SubscribersTableProps> = ({ 
  sheetId, 
  sheetName
}) => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<Partial<Subscriber>>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState<number | null>(null);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [parashaOptions, setParashaOptions] = useState<DropdownOption[]>([]);
  const [halachaOptions, setHalachaOptions] = useState<DropdownOption[]>([]);
  const [searchExpanded, setSearchExpanded] = useState(false);

  useEffect(() => {
    loadInitialData();
    loadDropdownOptions();
  }, [sheetId]);

  useEffect(() => {
    if (Object.keys(searchFilters).length > 0) {
      handleSearch();
    }
  }, [searchFilters]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const response = await apiService.getSubscribers(sheetId, 1, 50);
      setSubscribers(response.data);
      setHasMore(response.hasMore);
      setPage(1);
    } catch (error) {
      console.error('Error loading subscribers:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDropdownOptions = async () => {
    try {
      const [parasha, halacha] = await Promise.all([
        apiService.getParashaAnswers(),
        apiService.getYiunHalachaAnswers()
      ]);
      setParashaOptions(parasha);
      setHalachaOptions(halacha);
    } catch (error) {
      console.error('Error loading dropdown options:', error);
    }
  };

  const loadMore = async () => {
    if (!hasMore || loading) return;

    try {
      setLoading(true);
      const nextPage = page + 1;
      const response = await apiService.getSubscribers(sheetId, nextPage, 50, searchFilters);
      setSubscribers(prev => [...prev, ...response.data]);
      setHasMore(response.hasMore);
      setPage(nextPage);
    } catch (error) {
      console.error('Error loading more subscribers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await apiService.getSubscribers(sheetId, 1, 50, searchFilters);
      setSubscribers(response.data);
      setHasMore(response.hasMore);
      setPage(1);
    } catch (error) {
      console.error('Error searching subscribers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 1.5) {
      loadMore();
    }
  }, [hasMore, loading, page, searchFilters]);

  const startEdit = (subscriber: Subscriber) => {
    setEditingRow(subscriber.filingNumber);
    setEditingData(subscriber);
  };

  const cancelEdit = () => {
    setEditingRow(null);
    setEditingData({});
  };

  const saveEdit = async () => {
    if (!editingRow || !editingData) return;

    try {
      await apiService.updateSubscriber(sheetId, editingData as Subscriber);
      setSubscribers(prev => 
        prev.map(sub => 
          sub.filingNumber === editingRow 
            ? { ...sub, ...editingData }
            : sub
        )
      );
      setEditingRow(null);
      setEditingData({});
    } catch (error) {
      console.error('Error updating subscriber:', error);
    }
  };

  const handleDelete = async (filingNumber: number) => {
    try {
      await apiService.deleteSubscriber(sheetId, filingNumber);
      setSubscribers(prev => prev.filter(sub => sub.filingNumber !== filingNumber));
      setShowDeleteDialog(null);
    } catch (error) {
      console.error('Error deleting subscriber:', error);
    }
  };

  const handleAddSubscriber = () => {
    loadInitialData(); // Refresh the list
    setShowAddModal(false);
  };

  const clearSearch = () => {
    setSearchFilters({});
    loadInitialData();
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 rtl:space-x-reverse bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>הוסף מנוי</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          זכיות למנויים לגיליון {sheetName}
        </h1>
      </div>

      {/* Search Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <button
          onClick={() => setSearchExpanded(!searchExpanded)}
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
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, filingNumber: e.target.value }))}
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
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, subscriberCode: e.target.value }))}
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
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, name: e.target.value }))}
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
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, idNumber: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-right"
                  placeholder="חיפוש לפי ת.ז."
                  dir="rtl"
                />
              </div>
            </div>
            
            {Object.keys(searchFilters).length > 0 && (
              <div className="flex justify-start">
                <button
                  onClick={clearSearch}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
                >
                  נקה חיפושים
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div 
          className="overflow-auto h-full"
          onScroll={handleScroll}
        >
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                  פעולות
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                  תשובות טקסט
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                  פסילת ההלכה
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                  עיון ההלכה
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                  פסילת הפרשה
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                  קרן מלגות
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                  מס' זכיות
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                  ישיבה
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                  ישוב
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                  תעודת זהות
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                  שם
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                  קוד מנוי
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                  מספר תיוק
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subscribers.map((subscriber, index) => (
                <tr key={subscriber.filingNumber} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    {editingRow === subscriber.filingNumber ? (
                      <div className="flex space-x-2 rtl:space-x-reverse">
                        <button
                          onClick={saveEdit}
                          className="text-green-600 hover:text-green-800 transition-colors"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex space-x-2 rtl:space-x-reverse">
                        <button
                          onClick={() => startEdit(subscriber)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setShowDeleteDialog(subscriber.filingNumber)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm text-right">
                    {editingRow === subscriber.filingNumber ? (
                      <input
                        type="text"
                        value={editingData.answersText || ''}
                        onChange={(e) => setEditingData(prev => ({ ...prev, answersText: e.target.value }))}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-right"
                        dir="rtl"
                      />
                    ) : (
                      <div className="max-w-[150px] truncate" title={subscriber.answersText}>
                        {subscriber.answersText}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-right">
                    {editingRow === subscriber.filingNumber ? (
                      <select
                        value={editingData.yiunHalachaAnswersCode || ''}
                        onChange={(e) => setEditingData(prev => ({ ...prev, yiunHalachaAnswersCode: e.target.value }))}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-right"
                        dir="rtl"
                      >
                        {halachaOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    ) : (
                      halachaOptions.find(opt => opt.value === subscriber.yiunHalachaAnswersCode)?.label || subscriber.yiunHalachaAnswersCode
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-right">
                    {editingRow === subscriber.filingNumber ? (
                      <input
                        type="checkbox"
                        checked={editingData.yiunHalacha || false}
                        onChange={(e) => setEditingData(prev => ({ ...prev, yiunHalacha: e.target.checked }))}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    ) : (
                      subscriber.yiunHalacha ? 'כן' : 'לא'
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-right">
                    {editingRow === subscriber.filingNumber ? (
                      <select
                        value={editingData.parashaAnswersCode || ''}
                        onChange={(e) => setEditingData(prev => ({ ...prev, parashaAnswersCode: e.target.value }))}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-right"
                        dir="rtl"
                      >
                        {parashaOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    ) : (
                      parashaOptions.find(opt => opt.value === subscriber.parashaAnswersCode)?.label || subscriber.parashaAnswersCode
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-right">
                    {editingRow === subscriber.filingNumber ? (
                      <input
                        type="number"
                        value={editingData.scholarshipFund || ''}
                        onChange={(e) => setEditingData(prev => ({ ...prev, scholarshipFund: parseInt(e.target.value) }))}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-right"
                        dir="rtl"
                      />
                    ) : (
                      subscriber.scholarshipFund.toLocaleString()
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-right">
                    {editingRow === subscriber.filingNumber ? (
                      <input
                        type="number"
                        value={editingData.numberOfWins || ''}
                        onChange={(e) => setEditingData(prev => ({ ...prev, numberOfWins: parseInt(e.target.value) }))}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-right"
                        dir="rtl"
                      />
                    ) : (
                      subscriber.numberOfWins
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    {subscriber.yeshiva}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    {subscriber.locality}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    {subscriber.idNumber}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    {subscriber.name}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    {subscriber.subscriberCode}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    {subscriber.filingNumber}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {loading && (
            <div className="flex justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          )}
          
          {!hasMore && subscribers.length > 0 && (
            <div className="text-center py-4 text-gray-500 text-sm">
              הוצגו כל הרשומות
            </div>
          )}
        </div>
      </div>

      {/* Add Subscriber Modal */}
      {showAddModal && (
        <AddSubscriberModal
          sheetId={sheetId}
          onClose={() => setShowAddModal(false)}
          onSuccess={handleAddSubscriber}
          parashaOptions={parashaOptions}
          halachaOptions={halachaOptions}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <ConfirmDialog
          title="מחיקת מנוי"
          message="האם אתה בטוח שברצונך למחוק את המנוי?"
          onConfirm={() => handleDelete(showDeleteDialog)}
          onCancel={() => setShowDeleteDialog(null)}
        />
      )}
    </div>
  );
};