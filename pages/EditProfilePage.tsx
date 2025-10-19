import React, { useState } from 'react';
import { Creator } from '../types';
import { Icon } from '../components/Icon';

interface EditProfilePageProps {
  creator: Creator;
  onSave: (updatedCreator: Creator) => void;
  onCancel: () => void;
}

export const EditProfilePage: React.FC<EditProfilePageProps> = ({ creator, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Creator>(creator);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call
    await new Promise(res => setTimeout(res, 1000));
    onSave(formData);
    setIsSaving(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Edit Your Profile</h1>
        <button onClick={onCancel} className="text-gray-400 hover:text-white">&times; Close</button>
      </div>

      <form onSubmit={handleSubmit} className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700 space-y-6">
        {/* URLs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="avatarUrl" className="block text-sm font-medium text-gray-300 mb-1">Avatar URL</label>
                <input
                type="text"
                name="avatarUrl"
                id="avatarUrl"
                value={formData.avatarUrl}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
            </div>
            <div>
                <label htmlFor="bannerUrl" className="block text-sm font-medium text-gray-300 mb-1">Banner URL</label>
                <input
                type="text"
                name="bannerUrl"
                id="bannerUrl"
                value={formData.bannerUrl}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
            </div>
        </div>

        {/* Display Name & Username */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-300 mb-1">Display Name</label>
                <input
                type="text"
                name="displayName"
                id="displayName"
                value={formData.displayName}
                onChange={handleChange}
                required
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
            </div>
            <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">Username</label>
                <input
                type="text"
                name="username"
                id="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
            </div>
        </div>

        {/* Bio */}
        <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-1">Bio</label>
            <textarea
                name="bio"
                id="bio"
                rows={4}
                value={formData.bio}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-y"
            />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end items-center gap-4 pt-4 border-t border-gray-700">
            <button
                type="button"
                onClick={onCancel}
                disabled={isSaving}
                className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300"
            >
                Cancel
            </button>
             <button
                type="submit"
                disabled={isSaving}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300 disabled:bg-indigo-800 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isSaving ? (
                     <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Saving...
                    </>
                ) : "Save Changes"}
            </button>
        </div>
      </form>
    </div>
  );
};