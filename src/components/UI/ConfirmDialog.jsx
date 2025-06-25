import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const ConfirmDialog = ({
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'אישור',
  cancelText = 'ביטול',
  variant = 'danger'
}) => {
  const variantStyles = {
    danger: {
      icon: 'text-red-600',
      bg: 'bg-red-50',
      button: 'bg-red-600 hover:bg-red-700'
    },
    warning: {
      icon: 'text-yellow-600',
      bg: 'bg-yellow-50',
      button: 'bg-yellow-600 hover:bg-yellow-700'
    },
    info: {
      icon: 'text-blue-600',
      bg: 'bg-blue-50',
      button: 'bg-blue-600 hover:bg-blue-700'
    }
  };

  const styles = variantStyles[variant];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" dir="rtl">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-end space-x-3 rtl:space-x-reverse mb-4">
            <div className={`w-10 h-10 ${styles.bg} rounded-full flex items-center justify-center`}>
              <AlertTriangle className={`w-5 h-5 ${styles.icon}`} />
            </div>
            <div className="text-right">
              <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 text-right mb-6">{message}</p>
          
          <div className="flex space-x-3 rtl:space-x-reverse">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-2 text-sm font-medium text-white ${styles.button} border border-transparent rounded-md transition-colors`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};