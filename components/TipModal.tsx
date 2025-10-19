
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataProvider';
import { useModals } from '../contexts/ModalProvider';
import { Icon } from './Icon';
import { PaymentForm } from './PaymentForm';
import { useLocale } from '../contexts/LocaleProvider';

export const TipModal: React.FC = () => {
    const { currentUser } = useAuth();
    const { isTipModalOpen, closeTipModal, tipModalCreator, tipSuccessCallback } = useModals();
    const { sendTip, saveCard } = useData();
    const { t } = useLocale();
    
    const [amount, setAmount] = useState('10');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const presetAmounts = [5, 10, 20];

    useEffect(() => {
        if (!isTipModalOpen) {
            setTimeout(() => { setLoading(false); setSuccess(false); setAmount('10'); setShowPayment(false); }, 300);
        }
    }, [isTipModalOpen]);

    const handlePaymentSubmit = async ({ saveCard: shouldSaveCard }: { saveCard: boolean }) => {
        const tipAmount = parseFloat(amount);
        if (!tipModalCreator || isNaN(tipAmount) || tipAmount <= 0) return;
        
        setLoading(true);
        if (shouldSaveCard && !currentUser?.savedCard) {
            await saveCard({ brand: 'Visa', last4: '4242' });
        }
        await sendTip(tipModalCreator.id, tipAmount, tipSuccessCallback || undefined);
        setLoading(false);
        setSuccess(true);
        setTimeout(() => closeTipModal(), 1500);
    };

    if (!isTipModalOpen || !tipModalCreator) return null;

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={closeTipModal}>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-md relative" onClick={e => e.stopPropagation()}>
                <button onClick={closeTipModal} className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-white disabled:opacity-50" disabled={loading || success}><Icon name="close" className="w-6 h-6" /></button>
                <div className="p-8">
                    {success ? (
                        <div className="text-center py-8"><div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto"><Icon name="tip" className="w-10 h-10 text-green-600 dark:text-green-400" /></div><h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">{t('tipModal.sent')}</h2><p className="text-gray-600 dark:text-gray-300 mt-1">{t('tipModal.thankYou', { creatorName: tipModalCreator.displayName })}</p></div>
                    ) : (
                    <>
                        <div className="flex items-center gap-4 mb-6"><img src={tipModalCreator.avatarUrl} alt="creator" className="w-16 h-16 rounded-full" /><div><p className="text-gray-500 dark:text-gray-400">{t('tipModal.sendingTo')}</p><h2 className="text-2xl font-bold text-gray-900 dark:text-white">{tipModalCreator.displayName}</h2></div></div>
                        {!showPayment ? (
                            <form onSubmit={(e) => { e.preventDefault(); setShowPayment(true); }} className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('tipModal.amount')}</label>
                                    <div className="grid grid-cols-3 gap-3 mt-1">{presetAmounts.map(p => <button type="button" key={p} onClick={() => setAmount(String(p))} className={`p-3 text-center rounded-lg border-2 font-semibold transition-colors ${parseFloat(amount) === p ? 'bg-indigo-50 dark:bg-indigo-600/20 border-indigo-500' : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700'}`}>${p}</button>)}</div>
                                    <div className="relative mt-3"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Icon name="dollar" className="w-5 h-5 text-gray-400" /></div><input type="number" value={amount} onChange={e => setAmount(e.target.value)} min="1" placeholder={t('tipModal.customAmount')} required className="pl-10 w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3" /></div>
                                </div>
                                <button type="submit" disabled={!parseFloat(amount) || parseFloat(amount) <= 0} className="w-full mt-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 disabled:bg-indigo-400 dark:disabled:bg-indigo-800 disabled:cursor-not-allowed">{t('tipModal.continue')}</button>
                            </form>
                        ) : (
                            <div>
                                <div className="mb-4 border-b border-gray-200 dark:border-gray-800 pb-4"><div className="flex justify-between items-center text-gray-600 dark:text-gray-300"><span>{t('tipModal.tipAmount')}</span><span className="font-bold text-gray-900 dark:text-white text-lg">${parseFloat(amount).toFixed(2)}</span></div></div>
                                <PaymentForm isProcessing={loading} onSubmit={handlePaymentSubmit} submitButtonText={t('tipModal.sendButton', { price: parseFloat(amount).toFixed(2) })} submitButtonClassName="bg-green-600 hover:bg-green-500 disabled:bg-green-700 dark:disabled:bg-green-800" />
                            </div>
                        )}
                    </>
                    )}
                </div>
            </div>
        </div>
    );
};