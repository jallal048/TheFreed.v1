import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataProvider';
import { Creator } from '../../types';

export const SettingsPayout: React.FC = () => {
    const { currentUser } = useAuth();
    const { creators, updateCreatorProfile } = useData();
    const creatorData = creators.find(c => c.id === currentUser?.creatorId);

    const [formData, setFormData] = useState(creatorData?.payoutInfo || { iban: '', swiftBic: '', bankName: '' });
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        setHasChanges(JSON.stringify(creatorData?.payoutInfo) !== JSON.stringify(formData));
    }, [formData, creatorData?.payoutInfo]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser || !creatorData) return;
        setIsSaving(true);
        await updateCreatorProfile(creatorData.id, { payoutInfo: formData });
        setIsSaving(false);
        setHasChanges(false);
        alert('Payout settings updated successfully!');
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 p-8 rounded-2xl space-y-6 border border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Payout Settings</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm -mt-4">Enter your bank details to receive your earnings. This information is encrypted and stored securely.</p>
            
            <div>
                <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bank Name</label>
                <input
                    type="text"
                    name="bankName"
                    id="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    placeholder="e.g., International Bank of Creators"
                    className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
            </div>
            
            <div>
                <label htmlFor="iban" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">IBAN</label>
                <input
                    type="text"
                    name="iban"
                    id="iban"
                    value={formData.iban}
                    onChange={handleChange}
                    placeholder="ES00 0000 0000 0000 0000 0000"
                    className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
            </div>

            <div>
                <label htmlFor="swiftBic" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">SWIFT / BIC</label>
                <input
                    type="text"
                    name="swiftBic"
                    id="swiftBic"
                    value={formData.swiftBic}
                    onChange={handleChange}
                    placeholder="BANKESMMXXX"
                    className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-800">
                <button
                    type="submit"
                    disabled={isSaving || !hasChanges}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-full transition-colors duration-300 disabled:bg-indigo-400 dark:disabled:bg-indigo-800 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {isSaving ? 'Saving...' : hasChanges ? 'Save Changes' : 'Saved'}
                </button>
            </div>
        </form>
    );
};