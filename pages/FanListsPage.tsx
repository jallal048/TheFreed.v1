import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataProvider';
import { useNavigation } from '../contexts/NavigationProvider';
import { Icon } from '../components/Icon';
import { FanList } from '../types';

export const FanListsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { getFanListsForCreator, updateFanList, createFanList, users } = useData();
  const { onGoToDashboard } = useNavigation();

  const creatorLists = getFanListsForCreator(currentUser!.creatorId!);
  const [selectedListId, setSelectedListId] = useState<number | null>(creatorLists[0]?.id || null);

  const selectedList = creatorLists.find(l => l.id === selectedListId);

  // In a real app, you'd fetch your subscribers. Here we simulate it.
  const mySubscribers = users.filter(u => u.subscriptions.some(s => s.creatorId === currentUser?.creatorId));

  const handleToggleFanInList = (fanId: number) => {
    if (!selectedList) return;
    const updatedFanIds = selectedList.fanIds.includes(fanId)
      ? selectedList.fanIds.filter(id => id !== fanId)
      : [...selectedList.fanIds, fanId];
    updateFanList(selectedList.id, updatedFanIds);
  };

  const handleCreateList = () => {
    const listName = prompt("Enter a name for your new list:");
    if (listName?.trim()) createFanList(listName);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6"><button onClick={onGoToDashboard} className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-semibold transition-colors"><Icon name="arrow-left" className="w-5 h-5" />Back to Dashboard</button></div>
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Manage Fan Lists</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Your Lists</h2>
            <div className="space-y-2">{creatorLists.map(list => <button key={list.id} onClick={() => setSelectedListId(list.id)} className={`w-full text-left p-3 rounded-lg transition-colors ${selectedListId === list.id ? 'bg-indigo-100 dark:bg-indigo-600/30 text-gray-900 dark:text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}><p className="font-semibold">{list.name}</p><p className="text-sm text-gray-500 dark:text-gray-400">{list.fanIds.length} members</p></button>)}</div>
            <button onClick={handleCreateList} className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 rounded-lg transition-colors">+ Create New List</button>
          </div>
        </div>
        <div className="md:col-span-2">
          {selectedList ? (
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Editing "{selectedList.name}"</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">{mySubscribers.map(fan => <label key={fan.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50"><span className="font-medium text-gray-900 dark:text-white">{fan.username}</span><input type="checkbox" checked={selectedList.fanIds.includes(fan.id)} onChange={() => handleToggleFanInList(fan.id)} className="h-5 w-5 rounded text-indigo-500 focus:ring-indigo-600" /></label>)}</div>
            </div>
          ) : (
             <div className="flex items-center justify-center text-center h-full bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800"><Icon name="list" className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto" /><h3 className="mt-2 text-lg font-medium">Select a list to edit</h3><p className="mt-1 text-sm text-gray-500">Choose a list or create a new one.</p></div>
          )}
        </div>
      </div>
    </div>
  );
};
