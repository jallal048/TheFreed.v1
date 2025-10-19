import React, { useState } from 'react';
import { useData } from '../../contexts/DataProvider';
import { useModals } from '../../contexts/ModalProvider';
import { Icon } from '../Icon';
import { PaymentForm } from '../PaymentForm';

export const AddCardModal: React.FC = () => {
    const { isAddCardModalOpen, closeAddCardModal } = useModals();
    const { saveCard } = useData();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handlePaymentSubmit = async () => {
        setLoading(true);
        await saveCard({ brand: 'Mastercard', last4: '5555' });
        setLoading(false);
        setSuccess(true);
        setTimeout(() => { closeAddCardModal(); setSuccess(false); }, 1500);
    };

    if (!isAddCardModalOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={closeAddCardModal}>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-md relative" onClick={e => e.stopPropagation()}>
                <button onClick={closeAddCardModal} className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-white" disabled={loading || success}><Icon name="close" className="w-6 h-6" /></button>
                 <div className="p-8">
                    {success ? (
                         <div className="text-center py-8"><div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto"><Icon name="check-circle" className="w-10 h-10 text-green-600" /></div><h2 className="text-2xl font-bold mt-4">Card Added!</h2><p className="text-gray-600 mt-1">Your new payment method has been saved.</p></div>
                    ) : (
                        <>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Add New Payment Method</h2>
                             <PaymentForm isProcessing={loading} onSubmit={handlePaymentSubmit} submitButtonText="Save Card" />
                        </>
                    )}
                 </div>
            </div>
        </div>
    );
};
