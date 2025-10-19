import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataProvider';
import { useModals } from '../../contexts/ModalProvider';
import { Icon } from '../Icon';

export const SettingsWallet: React.FC = () => {
    const { currentUser } = useAuth();
    const { removeCard } = useData();
    const { openAddCardModal } = useModals();

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">My Wallet</h2>
            <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Saved Payment Methods</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage the payment methods associated with your account.</p>
            </div>
             {currentUser?.savedCard ? (
                <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800 max-w-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Icon name="credit-card" className="w-8 h-8 text-gray-600 dark:text-gray-300" />
                            <div>
                                <p className="font-semibold text-gray-900 dark:text-white">{currentUser.savedCard.brand} ending in {currentUser.savedCard.last4}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Expires 12/2028</p>
                            </div>
                        </div>
                        <button onClick={removeCard} className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-2 rounded-md flex items-center gap-2 text-sm font-semibold">
                            <Icon name="trash" className="w-4 h-4" />
                            Remove
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 max-w-lg">
                    <p className="text-gray-600 dark:text-gray-400">No payment method saved.</p>
                    <p className="text-gray-500 text-sm mt-1">You can save a card during your next subscription or purchase.</p>
                </div>
            )}
             <div className="flex justify-start pt-4">
                <button onClick={openAddCardModal} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-full transition-colors">
                    Add new payment method
                </button>
            </div>
        </div>
    );
};