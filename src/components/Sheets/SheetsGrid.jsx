import React from 'react';
import { SheetCard } from './SheetCard';

export const SheetsGrid = ({ sheets, onNavigateToSubscribers }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sheets.map((sheet) => (
        <SheetCard
          key={sheet.sheetCode}
          sheet={sheet}
          onNavigateToSubscribers={onNavigateToSubscribers}
        />
      ))}
    </div>
  );
};