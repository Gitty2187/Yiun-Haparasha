import React from 'react';

export const SubscribersTableHeader = () => {
  return (
    <thead className="bg-gray-50 sticky top-0">
      <tr>
        <th className="px-2 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
          מספר תיוק
        </th>
        <th className="px-2 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
          קוד מנוי
        </th>
        <th className="px-2 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
          שם
        </th>
        <th className="px-2 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
          תעודת זהות
        </th>
        <th className="px-2 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
          ישוב
        </th>
        <th className="px-2 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
          ישיבה
        </th>
        <th className="px-2 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
          מס' זכיות
        </th>
        <th className="px-2 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
          קרן מלגות
        </th>
        <th className="px-2 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
          פסילת הפרשה
        </th>
        <th className="px-2 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
          עיון ההלכה
        </th>
        <th className="px-2 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
          פסילת ההלכה
        </th>
        <th className="px-2 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
          תשובות טקסט
        </th>
        <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
          פעולות
        </th>
      </tr>
    </thead>
  );
};