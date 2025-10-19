import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataProvider';
import { useModals } from '../../contexts/ModalProvider';
import { Icon } from '../Icon';
import { PaymentForm } from '../PaymentForm';

export const PpvMessageModal: React.FC = () => {
    const { currentUser } = useAuth();
    const { isPpvMessageModalOpen, closePpvMessageModal, ppvMessageModalMessage } = useModals();
    const { unlockMessage, saveCard, creators } = useData();
    
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!isPpvMessageModalOpen) {
            setTimeout(() => { setLoading(false); setSuccess(false); }, 300);
        }
    }, [isPpvMessageModalOpen]);

    const handlePaymentSubmit = async ({ saveCard: shouldSaveCard }: { saveCard: boolean }) => {
        if (!ppvMessageModalMessage) return;
        setLoading(true);
        if (shouldSaveCard && !currentUser?.savedCard) {
            await saveCard({ brand: 'Visa', last4: '4242' });
        }
        await unlockMessage(ppvMessageModalMessage.id);
        setLoading(false);
        setSuccess(true);
        setTimeout(() => closePpvMessageModal(), 1500);
    };

    if (!isPpvMessageModalOpen || !ppvMessageModalMessage) return null;
    
    const creator = creators.find(c => c.id === ppvMessageModalMessage.senderId);

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={closePpvMessageModal}>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-md relative" onClick={e => e.stopPropagation()}>
                <button onClick={closePpvMessageModal} className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-white disabled:opacity-50" disabled={loading || success}><Icon name="close" className="w-6 h-6" /></button>
                <div className="p-8">
                    {success ? (
                        <div className="text-center py-8"><div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto"><Icon name="check-circle" className="w-10 h-10 text-green-600 dark:text-green-400" /></div><h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">Content Unlocked!</h2><p className="text-gray-600 dark:text-gray-300 mt-1">You can now view this exclusive message from {creator?.displayName}.</p></div>
                    ) : (
                    <>
                        <div className="text-center mb-6"><div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-500/20 p-3 rounded-full mx-auto mb-3"><Icon name="unlock" className="w-full h-full text-indigo-600 dark:text-indigo-400" /></div><h2 className="text-2xl font-bold text-gray-900 dark:text-white">Unlock Exclusive Message</h2><p className="text-gray-500 dark:text-gray-400">from {creator?.displayName}</p></div>
                        <PaymentForm isProcessing={loading} onSubmit={handlePaymentSubmit} submitButtonText={`Unlock for $${ppvMessageModalMessage.ppvPrice?.toFixed(2)}`} submitButtonClassName="bg-green-600 hover:bg-green-500 disabled:bg-green-700 dark:disabled:bg-green-800" />
                    </>
                    )}
                </div>
            </div>
        </div>
    );
};