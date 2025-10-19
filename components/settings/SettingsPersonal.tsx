import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataProvider';
import { AuthUser } from '../../types';

export const SettingsPersonal: React.FC = () => {
    const { currentUser } = useAuth();
    const { updateUserSettings } = useData();
    const [formData, setFormData] = useState(currentUser?.personalInfo || { fullName: '', dateOfBirth: '', address: '' });
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        setHasChanges(JSON.stringify(currentUser?.personalInfo) !== JSON.stringify(formData));
    }, [formData, currentUser?.personalInfo]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) return;
        setIsSaving(true);
        await updateUserSettings(currentUser.id, { personalInfo: formData });
        setIsSaving(false);
        setHasChanges(false);
        alert('Personal data updated successfully!');
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 p-8 rounded-2xl space-y-6 border border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Personal Data</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm -mt-4">This information is private and will not be displayed on your public profile.</p>
            
            <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <input
                    type="text"
                    name="fullName"
                    id="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
            </div>

            <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date of Birth</label>
                <input
                    type="date"
                    name="dateOfBirth"
                    id="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
            </div>

            <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                <textarea
                    name="address"
                    id="address"
                    rows={3}
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-y"
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