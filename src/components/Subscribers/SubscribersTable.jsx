import React, { useState, useEffect, useCallback, useRef } from 'react';
import { apiService } from '../../services/api';
import { Loader2 } from 'lucide-react';
import { SubscribersHeader } from './SubscribersHeader';
import { SearchFilters } from './SearchFilters';
import { SubscribersTableHeader } from './SubscribersTableHeader';
import { SubscriberRow } from './SubscriberRow';
import { AddSubscriberModal } from './AddSubscriberModal';
import {ConfirmDialog} from '../UI/ConfirmDialog';

export const SubscribersTable = ({ sheetId, sheetName, subscriberCount }) => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [editingRow, setEditingRow] = useState(null);
  const [editingData, setEditingData] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(null);
  const [searchFilters, setSearchFilters] = useState({});
  const [parashaOptions, setParashaOptions] = useState([]);
  const [halachaOptions, setHalachaOptions] = useState([]);
  const [searchExpanded, setSearchExpanded] = useState(false);
  
  // Use ref to prevent duplicate API calls
  const loadingRef = useRef(false);
  const optionsLoadedRef = useRef(false);

  useEffect(() => {
    if (!loadingRef.current) {
      loadInitialData();
    }
  }, [sheetId]);

  useEffect(() => {
    if (!optionsLoadedRef.current) {
      loadDropdownOptions();
    }
  }, []);

  useEffect(() => {
    if (Object.keys(searchFilters).length > 0) {
      handleSearch();
    }
  }, [searchFilters]);

  const loadInitialData = async () => {
    if (loadingRef.current) return;
    
    try {
      loadingRef.current = true;
      setInitialLoading(true);
      
      const response = await apiService.getSubscribers(sheetId, 1, 50);
      
      setSubscribers(response.data || response);
      setHasMore(response.hasMore || false);
      setPage(1);
    } catch (error) {
      console.error('Error loading subscribers:', error);
    } finally {
      setInitialLoading(false);
      loadingRef.current = false;
    }
  };

  const loadDropdownOptions = async () => {
    if (optionsLoadedRef.current) return;
    
    try {
      optionsLoadedRef.current = true;
      const [parasha, halacha] = await Promise.all([
        apiService.getParashaAnswers(),
        apiService.getYiunHalachaAnswers()
      ]);
      setParashaOptions(parasha);
      setHalachaOptions(halacha);
    } catch (error) {
      console.error('Error loading dropdown options:', error);
      optionsLoadedRef.current = false; // Reset on error
    }
  };

  const loadMore = async () => {
    if (!hasMore || loading || loadingRef.current) return;

    try {
      setLoading(true);
      const nextPage = page + 1;
      const response = await apiService.getSubscribers(sheetId, nextPage, 50, searchFilters);
      setSubscribers(prev => [...prev, ...(response.data || response)]);
      setHasMore(response.hasMore || false);
      setPage(nextPage);
    } catch (error) {
      console.error('Error loading more subscribers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (loadingRef.current) return;
    
    try {
      loadingRef.current = true;
      setLoading(true);
      
      const response = await apiService.getSubscribers(sheetId, 1, 50, searchFilters);
      setSubscribers(response.data || response);
      setHasMore(response.hasMore || false);
      setPage(1);
    } catch (error) {
      console.error('Error searching subscribers:', error);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  const handleScroll = useCallback((e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 1.5) {
      loadMore();
    }
  }, [hasMore, loading, page, searchFilters]);

  const startEdit = (subscriber) => {
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
      await apiService.updateSubscriber(sheetId, editingData);
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

  const handleDelete = async (filingNumber) => {
    try {
      await apiService.deleteSubscriber(sheetId, filingNumber);
      setSubscribers(prev => prev.filter(sub => sub.filingNumber !== filingNumber));
      setShowDeleteDialog(null);
    } catch (error) {
      console.error('Error deleting subscriber:', error);
    }
  };

  const handleAddSubscriber = () => {
    loadInitialData();
    setShowAddModal(false);
  };

  const clearSearch = () => {
    setSearchFilters({});
    loadingRef.current = false; // Reset loading ref
    loadInitialData();
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col" dir="rtl">
      <SubscribersHeader
        sheetName={sheetName}
        subscribersCount={subscriberCount}
        onAddSubscriber={() => setShowAddModal(true)}
      />
      
      <SearchFilters
        searchFilters={searchFilters}
        onFiltersChange={setSearchFilters}
        searchExpanded={searchExpanded}
        onToggleExpanded={() => setSearchExpanded(!searchExpanded)}
        onClearSearch={clearSearch}
      />

      <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-auto h-full" onScroll={handleScroll}>
          <table className="w-full divide-y divide-gray-200 table-fixed">
            <SubscribersTableHeader />
            <tbody className="bg-white divide-y divide-gray-200">
              {subscribers.map((subscriber, index) => (
                <SubscriberRow
                  key={`subscriber-${subscriber.filingNumber}`}
                  subscriber={subscriber}
                  index={index}
                  isEditing={editingRow === subscriber.filingNumber}
                  editingData={editingData}
                  onEdit={startEdit}
                  onSave={saveEdit}
                  onCancel={cancelEdit}
                  onDelete={setShowDeleteDialog}
                  onEditingDataChange={setEditingData}
                  parashaOptions={parashaOptions}
                  halachaOptions={halachaOptions}
                />
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

          {subscribers.length === 0 && !loading && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg font-medium">לא נמצאו מנויים</p>
              <p className="text-sm mt-2">נסה לשנות את פרמטרי החיפוש או להוסיף מנויים חדשים</p>
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <AddSubscriberModal
          sheetId={sheetId}
          onClose={() => setShowAddModal(false)}
          onSuccess={handleAddSubscriber}
          parashaOptions={parashaOptions}
          halachaOptions={halachaOptions}
        />
      )}

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