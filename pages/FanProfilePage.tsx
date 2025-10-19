import React, { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataProvider';
import { useNavigation } from '../contexts/NavigationProvider';
import { Icon } from '../components/Icon';
import { CreatorCard } from '../components/CreatorCard';
import { useModals } from '../contexts/ModalProvider';
import { Feed } from '../components/Feed';
import { AchievementBadge } from '../components/AchievementBadge';
import { SuggestedCreatorsWidget } from '../components/widgets/SuggestedCreatorsWidget';
import { useLocale } from '../contexts/LocaleProvider';

const TabButton: React.FC<{ label: string; count: number; isActive: boolean; onClick: () => void; }> = ({ label, count, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
            isActive
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
    >
        {label} <span className="ml-1 opacity-75">{count}</span>
    </button>
);


export const FanProfilePage: React.FC = () => {
    const { currentUser } = useAuth();
    const { creators, posts, isSubscribedToCreator, getExpiredSubscriptionsForUser, getAchievementsForUser } = useData();
    const { onSelectCreator } = useNavigation();
    const { openAchievementsModal } = useModals();
    const { t } = useLocale();

    const [activeTab, setActiveTab] = useState<'active' | 'saved' | 'expired'>('active');

    if (!currentUser) return null;

    const subscribedTo = useMemo(() => creators.filter(creator => isSubscribedToCreator(creator.id, currentUser)), [creators, isSubscribedToCreator, currentUser]);
    const savedPosts = useMemo(() => posts.filter(post => currentUser.bookmarkedPostIds.includes(post.id)), [posts, currentUser]);
    const expiredSubscriptions = useMemo(() => getExpiredSubscriptionsForUser(currentUser.id), [getExpiredSubscriptionsForUser, currentUser.id]);
    const achievements = useMemo(() => getAchievementsForUser(currentUser.id), [getAchievementsForUser, currentUser.id]);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'active':
                return subscribedTo.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        {subscribedTo.map(creator => <CreatorCard key={creator.id} creator={creator} onClick={() => onSelectCreator(creator)} />)}
                    </div>
                ) : <div className="text-center text-gray-500 py-10 bg-gray-50 dark:bg-gray-900 rounded-lg"><p>{t('fanProfile.noActiveSubs')}</p></div>;
            case 'saved':
                return savedPosts.length > 0 ? <div className="mt-6"><Feed posts={savedPosts} /></div> : <div className="text-center text-gray-500 py-10 bg-gray-50 dark:bg-gray-900 rounded-lg"><p>{t('fanProfile.noSavedPosts')}</p></div>;
            case 'expired':
                return expiredSubscriptions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        {expiredSubscriptions.map(creator => <CreatorCard key={creator.id} creator={creator} onClick={() => onSelectCreator(creator)} />)}
                    </div>
                ) : <div className="text-center text-gray-500 py-10 bg-gray-50 dark:bg-gray-900 rounded-lg"><p>{t('fanProfile.noExpiredSubs')}</p></div>;
            default: return null;
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Profile Header */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden mb-8 border border-gray-200 dark:border-transparent">
                <div className="relative h-40 bg-gray-200 dark:bg-gray-800">
                    {/* Default banner */}
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-30"></div>
                </div>
                <div className="px-6 pb-6">
                    <div className="relative flex items-end -mt-16">
                        <img src={currentUser.avatarUrl} alt="Your avatar" className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-900" />
                        <div className="ml-4 mb-2">
                             <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{currentUser.username}</h1>
                             <p className="text-sm text-gray-500 dark:text-gray-400">{t('fanProfile.joinedOn', { date: new Date(currentUser.registeredAt).toLocaleDateString() })}</p>
                        </div>
                    </div>
                     <div className="mt-4 flex items-center gap-6 text-sm text-gray-600 dark:text-gray-300">
                        <div><strong>{subscribedTo.length}</strong> {t('fanProfile.activeSubs')}</div>
                        <div><strong>{savedPosts.length}</strong> {t('fanProfile.savedPosts')}</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                        <TabButton label={t('fanProfile.activeSubs')} count={subscribedTo.length} isActive={activeTab === 'active'} onClick={() => setActiveTab('active')} />
                        <TabButton label={t('fanProfile.savedPosts')} count={savedPosts.length} isActive={activeTab === 'saved'} onClick={() => setActiveTab('saved')} />
                        <TabButton label={t('fanProfile.expired')} count={expiredSubscriptions.length} isActive={activeTab === 'expired'} onClick={() => setActiveTab('expired')} />
                    </div>
                    {renderTabContent()}
                </div>

                {/* Sidebar */}
                <aside className="space-y-6">
                    <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-transparent">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">{t('fanProfile.achievements')}</h3>
                            <button onClick={() => openAchievementsModal(currentUser.id)} className="text-sm font-semibold text-indigo-500 hover:underline">{t('fanProfile.viewAll')}</button>
                        </div>
                        {achievements.length > 0 ? (
                            <div className="flex flex-wrap gap-4">
                                {achievements.slice(0, 3).map(ach => <AchievementBadge key={ach.id} achievement={ach} />)}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">{t('fanProfile.noAchievements')}</p>
                        )}
                    </div>
                    <SuggestedCreatorsWidget />
                </aside>
            </div>
        </div>
    );
};