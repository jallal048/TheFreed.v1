import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataProvider';
import { useModals } from '../../contexts/ModalProvider';
import { Icon } from '../Icon';
import { UserRole } from '../../types';

export const SettingsAccount: React.FC = () => {
    const { currentUser, upgradeToCreator } = useAuth();
    const { updateUserSettings, deleteAccount, updatePassword } = useData();
    const { openConfirmationModal } = useModals();
    
    const [email, setEmail] = useState(currentUser?.email || '');
    const [isSaving, setIsSaving] = useState(false);

    const handleSaveChanges = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) return;
        setIsSaving(true);
        await updateUserSettings(currentUser.id, { email });
        setIsSaving(false);
        alert('Account details saved!');
    };
    
    const handleDeleteAccount = () => {
        if (!currentUser) return;
        openConfirmationModal({
            title: 'Delete Account',
            message: 'This action is irreversible. All your data, posts, and subscriptions will be permanently deleted. Are you absolutely sure you want to proceed?',
            confirmText: 'Delete My Account',
            confirmRequiresInput: currentUser.username,
            onConfirm: async () => { await deleteAccount(currentUser.id); }
        });
    }

    const handleBecomeCreator = () => {
        if (!currentUser) return;
        upgradeToCreator(currentUser.id);
    };

    return (
        <div className="space-y-10">
            <form onSubmit={handleSaveChanges} className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Account Details</h2>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                    <input type="email" name="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full md:max-w-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
                </div>
                <div className="flex justify-start">
                    <button type="submit" disabled={isSaving || email === currentUser?.email} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-full transition-colors duration-300 disabled:bg-indigo-400 dark:disabled:bg-indigo-800 disabled:opacity-60 disabled:cursor-not-allowed">{isSaving ? 'Saving...' : 'Save Email'}</button>
                </div>
            </form>

            <form onSubmit={(e) => { e.preventDefault(); updatePassword(); }} className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Change Password</h2>
                <div className="space-y-4">
                     <div><label htmlFor="current-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label><input type="password" name="current-password" id="current-password" placeholder="••••••••" className="w-full md:max-w-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-gray-900 dark:text-white" /></div>
                     <div><label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label><input type="password" name="new-password" id="new-password" placeholder="••••••••" className="w-full md:max-w-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3" /></div>
                </div>
                 <div className="flex justify-start"><button type="submit" className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold py-2 px-6 rounded-full">Update Password</button></div>
            </form>

            {currentUser?.role === UserRole.Fan && (
                <div className="space-y-4 p-6 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl border-2 border-dashed border-indigo-200 dark:border-indigo-500/30">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-3"><Icon name="sparkles" className="w-7 h-7 text-indigo-500"/>Creator Mode</h2>
                    <div><h3 className="text-lg font-bold text-gray-900 dark:text-white">Become a Creator</h3><p className="text-gray-600 dark:text-gray-400 max-w-xl mt-1">Ready to share your work and earn an income? Switch to a creator account to start monetizing your content.</p></div>
                    <button type="button" onClick={handleBecomeCreator} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-full transition-colors">Switch to Creator Account</button>
                </div>
            )}

            <div className="space-y-4 p-6 border-2 border-dashed border-red-500/20 dark:border-red-500/30 rounded-2xl">
                 <h2 className="text-2xl font-semibold text-red-500 dark:text-red-400">Danger Zone</h2>
                 <div><h3 className="text-lg font-bold text-gray-900 dark:text-white">Delete this account</h3><p className="text-gray-600 dark:text-gray-400 max-w-xl">Once you delete your account, there is no going back. Please be certain.</p></div>
                 <button type="button" onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-6 rounded-full transition-colors">Delete Account</button>
            </div>
        </div>
    );
};