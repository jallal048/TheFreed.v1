
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '../contexts/NavigationProvider';
import { Icon } from './Icon';

const OnboardingStepCard: React.FC<{ text: string; isCompleted: boolean; onClick: () => void; icon: string; }> = ({ text, isCompleted, onClick, icon }) => (
  <button disabled={isCompleted} onClick={onClick} className={`w-full h-full text-left p-5 rounded-2xl border-2 transition-all flex flex-col justify-between ${isCompleted ? 'bg-green-100 dark:bg-green-900/30 border-green-500' : 'bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:border-indigo-500 hover:-translate-y-1'}`}>
    <div>
      <div className={`p-2 rounded-full inline-block mb-3 ${isCompleted ? 'bg-green-500/20' : 'bg-gray-200 dark:bg-gray-700'}`}><Icon name={icon} className={`w-6 h-6 ${isCompleted ? 'text-green-500' : 'text-gray-500'}`} /></div>
      <p className={`font-bold text-lg ${isCompleted ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>{text}</p>
    </div>
    {!isCompleted && <div className="flex items-center gap-1 text-indigo-500 font-semibold mt-4 text-sm"><span>Go to settings</span><Icon name="arrow-right" className="w-4 h-4" /></div>}
  </button>
);

export const OnboardingChecklist: React.FC = () => {
  const { currentUser } = useAuth();
  const { onGoToSettings, onGoToHome } = useNavigation();

  if (!currentUser?.onboardingProgress?.some(p => !p.completed)) return null;

  const handleStepClick = (stepId: string) => {
    if (stepId === 'complete_profile') onGoToSettings('profile');
    else if (stepId === 'setup_monetization') onGoToSettings('monetization');
    else if (stepId === 'first_post') onGoToHome();
  };

  const steps = [
    { id: 'complete_profile', text: 'Complete Profile', icon: 'user-circle' },
    { id: 'setup_monetization', text: 'Set Up Monetization', icon: 'dollar' },
    { id: 'first_post', text: 'Make First Post', icon: 'pencil-square' },
  ];
  
  const getIsCompleted = (stepId: string): boolean => {
    if (!currentUser?.onboardingProgress) return false;

    const progressMap = new Map(currentUser.onboardingProgress.map(p => [p.step, p.completed]));

    switch (stepId) {
      case 'complete_profile':
        // This conceptual step is complete if all its granular parts are complete.
        return (progressMap.get('profile_basics') ?? false) &&
               (progressMap.get('categorization') ?? false) &&
               (progressMap.get('social_links') ?? false);
      case 'setup_monetization':
        return progressMap.get('monetization') ?? false;
      case 'first_post':
        return progressMap.get('first_post') ?? false;
      default:
        return false;
    }
  };

  const completedSteps = currentUser.onboardingProgress.filter(p => p.completed).length;
  const totalSteps = currentUser.onboardingProgress.length;
  const completionPercentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Complete Your Setup</h3>
        <span className="font-bold text-indigo-600 dark:text-indigo-400">{completionPercentage}% Complete</span>
      </div>
      <p className="text-gray-500 dark:text-gray-400 mb-4">Follow these steps to get your creator page ready for fans.</p>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-6"><div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${completionPercentage}%` }}></div></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {steps.map(step => (
          <OnboardingStepCard 
            key={step.id} 
            text={step.text} 
            icon={step.icon} 
            isCompleted={getIsCompleted(step.id)} 
            onClick={() => handleStepClick(step.id)} 
          />
        ))}
      </div>
    </div>
  );
};
