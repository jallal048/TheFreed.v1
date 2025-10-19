
import React, { useState } from 'react';
import { useModals } from '../../contexts/ModalProvider';
import { useData } from '../../contexts/DataProvider';
import { Icon } from '../Icon';
import { mockAchievements } from '../../constants';
import { Achievement } from '../../types';

const AchievementDetailPopup: React.FC<{ achievement: Achievement, onClose: () => void }> = ({ achievement, onClose }) => (
    <div 
      className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-10" 
      onClick={onClose}
    >
        <div 
            className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm text-center shadow-2xl border border-gray-200 dark:border-gray-700 animate-fade-in-scale" 
            onClick={e => e.stopPropagation()}
        >
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg mb-4 mx-auto">
                <Icon name={achievement.icon} className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{achievement.name}</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">{achievement.description}</p>
            <button 
                onClick={onClose}
                className="mt-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-full transition-colors"
            >
                Close
            </button>
        </div>
        <style>{`
            @keyframes fade-in-scale {
                0% { opacity: 0; transform: scale(0.95); }
                100% { opacity: 1; transform: scale(1); }
            }
            .animate-fade-in-scale { animation: fade-in-scale 0.2s ease-out forwards; }
        `}</style>
    </div>
);

export const AchievementsModal: React.FC = () => {
  const { isAchievementsModalOpen, closeAchievementsModal, achievementsModalUserId } = useModals();
  const { getUserById, getAchievementsForUser } = useData();
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  if (!isAchievementsModalOpen || !achievementsModalUserId) {
    return null;
  }

  const user = getUserById(achievementsModalUserId);
  const unlockedAchievements = getAchievementsForUser(achievementsModalUserId);
  const unlockedAchievementIds = new Set(unlockedAchievements.map(a => a.id));

  const lockedAchievements = mockAchievements.filter(ach => !unlockedAchievementIds.has(ach.id));

  const handleAchievementClick = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={closeAchievementsModal}>
      <div 
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-3xl relative p-8 max-h-[90vh] flex flex-col overflow-hidden" 
        onClick={e => e.stopPropagation()}
      >
        <button onClick={closeAchievementsModal} className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-white z-20">
          <Icon name="close" className="w-6 h-6" />
        </button>
        <div className="text-center flex-shrink-0">
            <Icon name="trophy" className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {user?.username}'s Achievements
            </h2>
        </div>

        <div className="mt-6 border-t border-gray-200 dark:border-gray-800 pt-6 flex-1 overflow-y-auto pr-2">
            {unlockedAchievements.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Conseguidos ({unlockedAchievements.length})</h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-y-6 gap-x-4 justify-items-center">
                        {unlockedAchievements.map(ach => (
                           <button key={ach.id} onClick={() => handleAchievementClick(ach)} className="flex flex-col items-center text-center w-24">
                              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg mb-2">
                                <Icon name={ach.icon} className="w-8 h-8" />
                              </div>
                              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 leading-tight">
                                {ach.name}
                              </p>
                            </button>
                        ))}
                    </div>
                </div>
            )}
            {lockedAchievements.length > 0 && (
                 <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Por Conseguir ({lockedAchievements.length})</h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-y-6 gap-x-4 justify-items-center">
                        {lockedAchievements.map(ach => (
                            <button key={ach.id} onClick={() => handleAchievementClick(ach)} className="flex flex-col items-center text-center w-24 grayscale opacity-60 transition-all hover:opacity-100 hover:grayscale-0 focus:opacity-100 focus:grayscale-0">
                                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-2">
                                    <Icon name={ach.icon} className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                                </div>
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 leading-tight">
                                    {ach.name}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
        {selectedAchievement && <AchievementDetailPopup achievement={selectedAchievement} onClose={() => setSelectedAchievement(null)} />}
      </div>
    </div>
  );
};
