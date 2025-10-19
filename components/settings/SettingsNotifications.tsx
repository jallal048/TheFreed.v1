import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataProvider';
import { ToggleSwitch } from '../ToggleSwitch';

export const SettingsNotifications: React.FC = () => {
  const { currentUser } = useAuth();
  const { updateUserSettings } = useData();
  const [prefs, setPrefs] = useState(currentUser?.notifications || { newPosts: true, newComments: true, specialOffers: true });
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setHasChanges(JSON.stringify(currentUser?.notifications) !== JSON.stringify(prefs));
  }, [prefs, currentUser?.notifications]);
  
  const handleToggleChange = (name: keyof typeof prefs) => {
    setPrefs(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSave = async () => {
    if (!currentUser) return;
    setIsSaving(true);
    await updateUserSettings(currentUser.id, { notifications: prefs });
    setIsSaving(false);
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Notification Settings</h2>
        <div className="space-y-4">
            <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                <div>
                    <h4 className="font-medium text-gray-800 dark:text-white">New posts from creators I follow</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Get notified when a creator you're subscribed to makes a new post.</p>
                </div>
                <ToggleSwitch checked={prefs.newPosts} onChange={() => handleToggleChange('newPosts')} />
            </div>
            <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                <div>
                    <h4 className="font-medium text-gray-800 dark:text-white">New comments and replies</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Get notified when someone comments on your post or replies to you.</p>
                </div>
                <ToggleSwitch checked={prefs.newComments} onChange={() => handleToggleChange('newComments')} />
            </div>
            <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                <div>
                    <h4 className="font-medium text-gray-800 dark:text-white">Special offers and announcements</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive occasional special offers and platform announcements.</p>
                </div>
                <ToggleSwitch checked={prefs.specialOffers} onChange={() => handleToggleChange('specialOffers')} />
            </div>
        </div>
        <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-800">
            <button
                onClick={handleSave}
                disabled={isSaving || !hasChanges}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-full transition-colors duration-300 disabled:bg-indigo-400 dark:disabled:bg-indigo-800 disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {isSaving ? 'Saving...' : hasChanges ? 'Save Preferences' : 'Saved'}
            </button>
        </div>
    </div>
  );
};