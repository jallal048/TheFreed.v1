import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useModals } from '../contexts/ModalProvider';

export const CreatePostInput: React.FC = () => {
    const { currentUser } = useAuth();
    const { openCreatePostModal } = useModals();

    if (!currentUser) return null;

    return (
        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm dark:shadow-none border border-gray-200 dark:border-transparent">
            <div className="flex items-center gap-4">
                <img src={currentUser.avatarUrl} alt="Your avatar" className="w-12 h-12 rounded-full" />
                <button
                    onClick={openCreatePostModal}
                    className="w-full text-left bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full py-3 px-5 transition-colors"
                >
                    <span className="text-gray-500 dark:text-gray-400">Create a new post...</span>
                </button>
            </div>
        </div>
    );
};