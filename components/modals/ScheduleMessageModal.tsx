import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataProvider';
import { useModals } from '../../contexts/ModalProvider';
import { Icon } from '../Icon';

const ScheduleMessageModalComponent: React.FC = () => {
  const { currentUser } = useAuth();
  const { scheduleMessage, editScheduledMessage, getFanListsForCreator } = useData();
  const { isScheduleMessageModalOpen, closeScheduleMessageModal, editingScheduledMessage } = useModals();
  const isEditing = !!editingScheduledMessage;
  const [content, setContent] = useState('');
  const [targetType, setTargetType] = useState<'all' | 'lists'>('all');
  const [selectedLists, setSelectedLists] = useState<number[]>([]);
  const [scheduledAt, setScheduledAt] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (isEditing && editingScheduledMessage) {
      setContent(editingScheduledMessage.content);
      setTargetType(editingScheduledMessage.target.type);
      setSelectedLists(editingScheduledMessage.target.listIds || []);
      setScheduledAt(new Date(editingScheduledMessage.scheduledAt).toISOString().slice(0, 16));
    } else {
      setContent(''); setTargetType('all'); setSelectedLists([]); setScheduledAt('');
    }
  }, [editingScheduledMessage, isScheduleMessageModalOpen]);
  
  if (!currentUser || !isScheduleMessageModalOpen) return null;
  const fanLists = getFanListsForCreator(currentUser.creatorId!);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !scheduledAt) return;
    setLoading(true);
    const messageData = { content, target: { type: targetType, listIds: targetType === 'lists' ? selectedLists : undefined }, scheduledAt: new Date(scheduledAt).toISOString() };
    if (isEditing) editScheduledMessage(editingScheduledMessage.id, messageData);
    else scheduleMessage(messageData);
    setLoading(false);
    closeScheduleMessageModal();
  };

  const isSubmitDisabled = !content.trim() || !scheduledAt || (targetType === 'lists' && selectedLists.length === 0) || loading;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={closeScheduleMessageModal}>
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-2xl relative" onClick={e => e.stopPropagation()}>
        <button onClick={closeScheduleMessageModal} className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-white"><Icon name="close" className="w-6 h-6" /></button>
        <form onSubmit={handleSubmit} className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3"><Icon name="calendar-days" className="w-7 h-7" />{isEditing ? 'Edit Scheduled Message' : 'Schedule a Message'}</h2>
          <div className="space-y-4">
            <div><label htmlFor="message-content" className="block text-sm font-medium mb-1">Message</label><textarea id="message-content" value={content} onChange={(e) => setContent(e.target.value)} rows={5} placeholder="Write your broadcast message here..." className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3" /></div>
            <div><label className="block text-sm font-medium mb-1">Audience</label><div className="grid grid-cols-2 gap-3"><button type="button" onClick={() => setTargetType('all')} className={`p-3 text-center rounded-lg border-2 ${targetType === 'all' ? 'bg-indigo-50 dark:bg-indigo-600/20 border-indigo-500' : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700'}`}>All Subscribers</button><button type="button" disabled={fanLists.length === 0} onClick={() => setTargetType('lists')} className={`p-3 text-center rounded-lg border-2 ${targetType === 'lists' ? 'bg-indigo-50 dark:bg-indigo-600/20 border-indigo-500' : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700'} disabled:opacity-50`}>Specific Lists</button></div></div>
            {targetType === 'lists' && fanLists.length > 0 && (<div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 max-h-40 overflow-y-auto">{fanLists.map(list => <label key={list.id} className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"><input type="checkbox" checked={selectedLists.includes(list.id)} onChange={() => setSelectedLists(p => p.includes(list.id) ? p.filter(id => id !== list.id) : [...p, list.id])} className="h-4 w-4 rounded text-indigo-600" />{list.name} ({list.fanIds.length})</label>)}</div>)}
            <div><label htmlFor="schedule-time" className="block text-sm font-medium mb-1">Time to send</label><input id="schedule-time" type="datetime-local" value={scheduledAt} onChange={e => setScheduledAt(e.target.value)} className="w-full max-w-xs bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-2" /></div>
          </div>
          <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
            <button type="button" onClick={closeScheduleMessageModal} className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 font-bold py-2 px-6 rounded-full">Cancel</button>
            <button type="submit" disabled={isSubmitDisabled} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-full disabled:opacity-50 flex items-center gap-2">{loading && <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path></svg>}{isEditing ? 'Save Changes' : 'Schedule Message'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleMessageModalComponent;
