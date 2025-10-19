import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataProvider';
import { useModals } from '../../contexts/ModalProvider';
import { Icon } from '../Icon';

export const EditScheduledPostModal: React.FC = () => {
    const { isEditScheduledPostModalOpen, closeEditScheduledPostModal, editingScheduledPost } = useModals();
    const { editScheduledPost } = useData();
    const [text, setText] = useState('');
    const [scheduledAt, setScheduledAt] = useState('');

    useEffect(() => {
        if (editingScheduledPost) {
            setText(editingScheduledPost.text || '');
            if (editingScheduledPost.scheduledAt) {
                setScheduledAt(new Date(editingScheduledPost.scheduledAt).toISOString().slice(0, 16));
            }
        }
    }, [editingScheduledPost]);

    if (!isEditScheduledPostModalOpen || !editingScheduledPost) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        editScheduledPost(editingScheduledPost.id, text, new Date(scheduledAt).toISOString());
        closeEditScheduledPostModal();
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={closeEditScheduledPostModal}>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-2xl relative" onClick={e => e.stopPropagation()}>
                <button onClick={closeEditScheduledPostModal} className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-white"><Icon name="close" className="w-6 h-6" /></button>
                <form onSubmit={handleSubmit} className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Edit Scheduled Post</h2>
                    <div className="space-y-4">
                         <div><label htmlFor="post-text" className="block text-sm font-medium mb-1">Post Content</label><textarea id="post-text" value={text} onChange={(e) => setText(e.target.value)} rows={8} className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3" /></div>
                        <div><label htmlFor="scheduled-at" className="block text-sm font-medium mb-1">Scheduled Time</label><input id="scheduled-at" type="datetime-local" value={scheduledAt} onChange={e => setScheduledAt(e.target.value)} className="w-full max-w-xs bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-2" /></div>
                    </div>
                    <div className="flex justify-end gap-4 mt-6">
                        <button type="button" onClick={closeEditScheduledPostModal} className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 font-bold py-2 px-6 rounded-full">Cancel</button>
                        <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-full">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
