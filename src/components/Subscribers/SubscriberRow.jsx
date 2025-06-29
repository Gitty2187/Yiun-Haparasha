import React from 'react';
import { Edit, Trash2, Save, X } from 'lucide-react';

export const SubscriberRow = ({ 
  subscriber, 
  index, 
  isEditing, 
  editingData, 
  onEdit, 
  onSave, 
  onCancel, 
  onDelete, 
  onEditingDataChange,
  parashaOptions,
  halachaOptions 
}) => {
  const isEvenRow = index % 2 === 0;
  const rowClass = isEditing 
    ? 'bg-blue-50 border-2 border-blue-200' 
    : isEvenRow ? 'bg-white' : 'bg-gray-50';

  // Find the label text for the codes
  const getParashaAnswerText = (code) => {
    const option = parashaOptions.find(opt => opt.code === String(code));
    return option ? option.description : code;
  };

  const getHalachaAnswerText = (code) => {
    debugger
    const option = halachaOptions.find(opt => opt.code === String(code));
    return option ? option.description : code;
  };

  return (
    <tr className={`${rowClass} transition-colors`}>
      <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-900 text-right">
        {subscriber.filingNumber}
      </td>
      <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-900 text-right">
        {subscriber.subscriberCode}
      </td>
      <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-900 text-right">
        <div className="truncate" title={subscriber.name}>
          {subscriber.name}
        </div>
      </td>
      <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-900 text-right">
        {subscriber.idNumber}
      </td>
      <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-900 text-right">
        <div className="truncate" title={subscriber.locality}>
          {subscriber.locality}
        </div>
      </td>
      <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-900 text-right">
        <div className="truncate" title={subscriber.yeshiva}>
          {subscriber.yeshiva}
        </div>
      </td>
      <td className="px-2 py-3 whitespace-nowrap text-xs text-right">
        {isEditing ? (
          <input
            type="number"
            value={editingData.numberOfWins || ''}
            onChange={(e) => onEditingDataChange({ ...editingData, numberOfWins: parseInt(e.target.value) })}
            className="w-full px-1 py-1 border border-gray-300 rounded text-right text-xs"
            dir="rtl"
          />
        ) : (
          subscriber.numberOfWins
        )}
      </td>
      <td className="px-2 py-3 whitespace-nowrap text-xs text-right">
        {isEditing ? (
          <input
            type="number"
            value={editingData.scholarshipFund || ''}
            onChange={(e) => onEditingDataChange({ ...editingData, scholarshipFund: parseInt(e.target.value) })}
            className="w-full px-1 py-1 border border-gray-300 rounded text-right text-xs"
            dir="rtl"
          />
        ) : (
          subscriber.scholarshipFund?.toLocaleString()
        )}
      </td>
      <td className="px-2 py-3 whitespace-nowrap text-xs text-right">
        {isEditing ? (
          <select
            value={editingData.parashaAnswersCode || ''}
            onChange={(e) => onEditingDataChange({ ...editingData, parashaAnswersCode: e.target.value })}
            className="w-full px-1 py-1 border border-gray-300 rounded text-right text-xs"
            dir="rtl"
          >
            {parashaOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        ) : (
          <div className="truncate" title={getParashaAnswerText(subscriber.parashaAnswersCode)}>
            {getParashaAnswerText(subscriber.parashaAnswersCode)}
          </div>
        )}
      </td>
      <td className="px-2 py-3 whitespace-nowrap text-xs text-right">
        {isEditing ? (
          <input
            type="checkbox"
            checked={editingData.yiunHalacha || false}
            onChange={(e) => onEditingDataChange({ ...editingData, yiunHalacha: e.target.checked })}
            className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
        ) : (
          subscriber.yiunHalacha ? 'כן' : 'לא'
        )}
      </td>
      <td className="px-2 py-3 whitespace-nowrap text-xs text-right">
        {isEditing ? (
          <select
            value={editingData.yiunHalachaAnswersCode || ''}
            onChange={(e) => onEditingDataChange({ ...editingData, yiunHalachaAnswersCode: e.target.value })}
            className="w-full px-1 py-1 border border-gray-300 rounded text-right text-xs"
            dir="rtl"
          >
            {halachaOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        ) : (
          <div className="truncate" title={getHalachaAnswerText(subscriber.yiunHalachaAnswersCode)}>
            {getHalachaAnswerText(subscriber.yiunHalachaAnswersCode)}
          </div>
        )}
      </td>
      <td className="px-2 py-3 text-xs text-right">
        {isEditing ? (
          <input
            type="text"
            value={editingData.answersText || ''}
            onChange={(e) => onEditingDataChange({ ...editingData, answersText: e.target.value })}
            className="w-full px-1 py-1 border border-gray-300 rounded text-right text-xs"
            dir="rtl"
          />
        ) : (
          <div className="truncate" title={subscriber.answersText}>
            {subscriber.answersText}
          </div>
        )}
      </td>
      <td className="px-2 py-3 whitespace-nowrap text-xs">
        <div className="flex justify-start space-x-1">
          {isEditing ? (
            <>
              <button
                onClick={onSave}
                className="text-green-600 hover:text-green-800 transition-colors"
                title="שמור"
              >
                <Save className="w-4 h-4" />
              </button>
              <button
                onClick={onCancel}
                className="text-red-600 hover:text-red-800 transition-colors"
                title="בטל"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onEdit(subscriber)}
                className="text-blue-600 hover:text-blue-800 transition-colors"
                title="ערוך"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(subscriber.filingNumber)}
                className="text-red-600 hover:text-red-800 transition-colors"
                title="מחק"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};