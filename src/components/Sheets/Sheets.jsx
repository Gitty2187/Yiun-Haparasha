import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { SheetsHeader } from './SheetsHeader';
import { SheetsGrid } from './SheetsGrid';

export const Sheets = ({ onNavigateToSubscribers }) => {
  const [sheets, setSheets] = useState([]);
  const [filteredSheets, setFilteredSheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadSheets();
  }, []);

  useEffect(() => {
    filterSheets();
  }, [sheets, searchQuery]);

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

  const filterSheets = () => {
    const filtered = sheets.filter(sheet => {
      const query = searchQuery.trim();
      const isNumeric = !isNaN(query);

      return (
        (isNumeric && sheet.sheetCode === Number(query)) ||
        (sheet.description && sheet.sheetName.toLowerCase().includes(query.toLowerCase()))
      );
    });

    setFilteredSheets(filtered);

  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <SheetsHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalSheets={filteredSheets.length}
      />

      <div className="max-h-[600px] overflow-y-auto pr-2" dir="rtl">
        <SheetsGrid
          sheets={filteredSheets}
          onNavigateToSubscribers={onNavigateToSubscribers}
        />
      </div>
    </div>


  );
};