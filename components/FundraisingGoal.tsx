
import React from 'react';
import { Post as PostType } from '../types';
import { useModals } from '../contexts/ModalProvider';
import { useData } from '../contexts/DataProvider';
import { useLocale } from '../contexts/LocaleProvider';

interface FundraisingGoalProps {
    post: PostType;
}

export const FundraisingGoal: React.FC<FundraisingGoalProps> = ({ post }) => {
    const { openTipModal } = useModals();
    const { contributeToGoal } = useData();
    const { t } = useLocale();

    if (!post.goalAmount) return null;

    const raised = post.goalRaised || 0;
    const goal = post.goalAmount;
    const progress = Math.min((raised / goal) * 100, 100);

    const handleContribute = () => {
        openTipModal(post.creator, (amount) => {
            contributeToGoal(post.id, amount);
        });
    };

    return (
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700/50">
            <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {t('fundraising.raised', { raised: raised.toFixed(2), goal: goal.toFixed(2) })}
                </p>
                <p className="text-sm font-bold text-indigo-500 dark:text-indigo-400">{progress.toFixed(0)}%</p>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                    className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" 
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            <button
                onClick={handleContribute}
                className="w-full mt-4 bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-full transition-colors"
            >
                {t('fundraising.contribute')}
            </button>
        </div>
    );
};
