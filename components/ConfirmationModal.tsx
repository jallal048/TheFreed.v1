import React, { useState, useEffect } from 'react';
import { useModals } from '../contexts/ModalProvider';
import { Icon } from './Icon';
import { useLocale } from '../contexts/LocaleProvider';

export const ConfirmationModal: React.FC = () => {
  const { isConfirmationModalOpen, closeConfirmationModal, confirmationModalOptions } = useModals();
  const [inputValue, setInputValue] = useState('');
  const { t } = useLocale();

  useEffect(() => {
    if (!isConfirmationModalOpen) {
      setTimeout(() => setInputValue(''), 200);
    }
  }, [isConfirmationModalOpen]);

  if (!isConfirmationModalOpen || !confirmationModalOptions) return null;

  const { title, message, confirmText, onConfirm, confirmRequiresInput } = confirmationModalOptions;
  const isConfirmationDisabled = confirmRequiresInput ? inputValue !== confirmRequiresInput : false;

  const handleConfirm = () => {
    onConfirm();
    closeConfirmationModal();
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={closeConfirmationModal}>
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-md relative" onClick={e => e.stopPropagation()}>
        <div className="p-8">
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">{title}</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">{message}</p>
            {confirmRequiresInput && (
                <div className="mt-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">To confirm, type "<span className="font-semibold">{confirmRequiresInput}</span>":</p>
                    <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-red-500" />
                </div>
            )}
            <div className="flex justify-end gap-4 mt-6">
                <button onClick={closeConfirmationModal} className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 font-bold py-2 px-6 rounded-full">{t('common.cancel')}</button>
                <button onClick={handleConfirm} disabled={isConfirmationDisabled} className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-6 rounded-full disabled:opacity-60">{confirmText}</button>
            </div>
        </div>
      </div>
    </div>
  );
};