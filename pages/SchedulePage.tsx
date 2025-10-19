import React, { useState } from 'react';
import { useData } from '../contexts/DataProvider';
import { useModals } from '../contexts/ModalProvider';
import { useNavigation } from '../contexts/NavigationProvider';
import { Post, ScheduledMessage } from '../types';
import { Icon } from '../components/Icon';

const ScheduledPostItem: React.FC<{ post: Post }> = ({ post }) => {
    const { cancelScheduledPost } = useData();
    const { openEditScheduledPostModal, openConfirmationModal } = useModals();
    const { onSelectCreator } = useNavigation();
    
    const scheduledDate = new Date(post.scheduledAt!).toLocaleString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

    const handleCancel = () => openConfirmationModal({
        title: 'Cancel Scheduled Post?',
        message: 'This will be permanently deleted.',
        confirmText: 'Yes, Cancel Post',
        onConfirm: () => cancelScheduledPost(post.id),
    });

    return (
        <div className="bg-white dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700/50 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
                 <button className="flex items-center gap-3 text-left group mb-2" onClick={() => onSelectCreator(post.creator)}>
                    <img src={post.creator.avatarUrl} alt="" className="w-8 h-8 rounded-full" />
                    <div><p className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-indigo-500">{post.creator.displayName}</p><p className="text-xs text-gray-500 dark:text-gray-400">@{post.creator.username}</p></div>
                 </button>
                 <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{post.text}</p>
                 <p className="text-xs text-indigo-500 dark:text-indigo-400 font-semibold mt-2">Scheduled for: {scheduledDate}</p>
            </div>
            <div className="flex-shrink-0 flex sm:flex-col gap-2">
                <button onClick={() => openEditScheduledPostModal(post)} className="text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold py-1.5 px-4 rounded-full">Edit</button>
                <button onClick={handleCancel} className="text-sm bg-red-100 dark:bg-red-500/20 hover:bg-red-200 dark:hover:bg-red-500/30 text-red-600 dark:text-red-400 font-semibold py-1.5 px-4 rounded-full">Cancel</button>
            </div>
        </div>
    );
}

const ScheduledMessageItem: React.FC<{ message: ScheduledMessage }> = ({ message }) => {
    const { cancelScheduledMessage } = useData();
    const { openScheduleMessageModal, openConfirmationModal } = useModals();
    
    const scheduledDate = new Date(message.scheduledAt).toLocaleString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    
    const handleCancel = () => openConfirmationModal({
        title: 'Cancel Scheduled Message?',
        message: 'This will be permanently deleted.',
        confirmText: 'Yes, Cancel Message',
        onConfirm: () => cancelScheduledMessage(message.id),
    });

    return (
         <div className="bg-white dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700/50 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
                 <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">To: {message.targetDescription}</p>
                 <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{message.content}</p>
                 <p className="text-xs text-indigo-500 dark:text-indigo-400 font-semibold mt-2">Scheduled for: {scheduledDate}</p>
            </div>
            <div className="flex-shrink-0 flex sm:flex-col gap-2">
                <button onClick={() => openScheduleMessageModal(message)} className="text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold py-1.5 px-4 rounded-full">Edit</button>
                <button onClick={handleCancel} className="text-sm bg-red-100 dark:bg-red-500/20 hover:bg-red-200 dark:hover:bg-red-500/30 text-red-600 dark:text-red-400 font-semibold py-1.5 px-4 rounded-full">Cancel</button>
            </div>
        </div>
    );
}


export const SchedulePage: React.FC = () => {
  const { getScheduledPosts, getScheduledMessages } = useData();
  const { openScheduleMessageModal } = useModals();
  const { onGoToDashboard } = useNavigation();
  const [activeTab, setActiveTab] = useState<'posts' | 'messages'>('posts');

  const scheduledPosts = getScheduledPosts();
  const scheduledMessages = getScheduledMessages();
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6"><button onClick={onGoToDashboard} className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-semibold transition-colors"><Icon name="arrow-left" className="w-5 h-5" />Back to Dashboard</button></div>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3"><Icon name="calendar-days" className="w-9 h-9 text-indigo-500"/>Content Schedule</h1>
        <button onClick={() => openScheduleMessageModal()} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-5 rounded-full flex items-center justify-center gap-2"><Icon name="plus" className="w-5 h-5" />Schedule New</button>
      </div>
       <div className="border-b border-gray-200 dark:border-gray-800 mb-6">
            <nav className="-mb-px flex space-x-6">
            <button onClick={() => setActiveTab('posts')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'posts' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Scheduled Posts <span className="bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 ml-2 px-2 py-0.5 rounded-full text-xs">{scheduledPosts.length}</span></button>
            <button onClick={() => setActiveTab('messages')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'messages' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Scheduled Messages <span className="bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 ml-2 px-2 py-0.5 rounded-full text-xs">{scheduledMessages.length}</span></button>
            </nav>
        </div>
      <div className="space-y-4">
        {activeTab === 'posts' && (scheduledPosts.length > 0 ? scheduledPosts.map(post => <ScheduledPostItem key={post.id} post={post} />) : <p className="text-center text-gray-500 py-10">You have no posts scheduled.</p>)}
        {activeTab === 'messages' && (scheduledMessages.length > 0 ? scheduledMessages.map(msg => <ScheduledMessageItem key={msg.id} message={msg} />) : <p className="text-center text-gray-500 py-10">You have no messages scheduled.</p>)}
      </div>
    </div>
  );
};
