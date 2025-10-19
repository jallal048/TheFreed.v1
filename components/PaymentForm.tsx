
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Icon } from './Icon';
import { useLocale } from '../contexts/LocaleProvider';

interface PaymentFormProps {
    onSubmit: (payload: { saveCard: boolean }) => void;
    isProcessing: boolean;
    submitButtonText: string;
    submitButtonClassName?: string;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ onSubmit, isProcessing, submitButtonText, submitButtonClassName = 'bg-indigo-600 hover:bg-indigo-500' }) => {
    const { currentUser } = useAuth();
    const { t } = useLocale();
    const [showNewCardForm, setShowNewCardForm] = useState(!currentUser?.savedCard);
    const [saveCard, setSaveCard] = useState(true);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ saveCard: showNewCardForm && saveCard });
    };

    if (!showNewCardForm && currentUser?.savedCard) {
        return (
            <form onSubmit={handleSubmit}>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{t('payment.payWithSaved')}</p>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Icon name="credit-card" className="w-8 h-8 text-gray-600 dark:text-gray-300" />
                            <div>
                                <p className="font-semibold text-gray-900 dark:text-white">{t('payment.cardEndingIn', { brand: currentUser.savedCard.brand, last4: currentUser.savedCard.last4 })}</p>
                            </div>
                        </div>
                        <button type="button" onClick={() => setShowNewCardForm(true)} className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-semibold">
                            {t('payment.useDifferentCard')}
                        </button>
                    </div>
                </div>
                 <button type="submit" disabled={isProcessing} className={`w-full mt-4 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${submitButtonClassName}`}>
                    {isProcessing ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            {t('payment.processing')}
                        </>
                    ) : submitButtonText}
                </button>
            </form>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="card-number" className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('payment.cardNumber')}</label>
                <input id="card-number" type="text" placeholder="**** **** **** 1234" required className="mt-1 w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="expiry-date" className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('payment.expiryDate')}</label>
                    <input id="expiry-date" type="text" placeholder="MM / YY" required className="mt-1 w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
                </div>
                <div>
                    <label htmlFor="cvc" className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('payment.cvc')}</label>
                    <input id="cvc" type="text" placeholder="123" required className="mt-1 w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
                </div>
            </div>

            <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer text-gray-600 dark:text-gray-300">
                    <input 
                        type="checkbox"
                        checked={saveCard}
                        onChange={(e) => setSaveCard(e.target.checked)}
                        className="h-5 w-5 rounded bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm">{t('payment.saveCard')}</span>
                </label>
            </div>
            
            <p className="text-xs text-gray-500 text-center pt-2">{t('payment.simulationWarning')}</p>
            
            <button type="submit" disabled={isProcessing} className={`w-full text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${submitButtonClassName}`}>
                {isProcessing ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        {t('payment.processing')}
                    </>
                ) : submitButtonText}
            </button>
        </form>
    );
};