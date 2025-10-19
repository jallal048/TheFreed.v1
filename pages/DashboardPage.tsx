import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataProvider';
import { useNavigation } from '../contexts/NavigationProvider';
import { AiContentGenerator } from '../components/AiContentGenerator';
import { Icon } from '../components/Icon';
import { UserRole } from '../types';
import { PieChart } from '../components/charts/PieChart';
import { LineChart } from '../components/charts/LineChart';
import { OnboardingChecklist } from '../components/OnboardingChecklist';
import { useLocale } from '../contexts/LocaleProvider';

const StatCard: React.FC<{ title: string, value: string, icon: string, color: string }> = ({ title, value, icon, color }) => (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-800`}><Icon name={icon} className={`w-6 h-6 ${color}`} /></div>
            <div><p className="text-gray-500 dark:text-gray-400 text-sm">{title}</p><p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p></div>
        </div>
    </div>
);

const CreatorDashboard: React.FC = () => {
    const { currentUser } = useAuth();
    const { getCreatorStats } = useData();
    const { onGoToFanLists } = useNavigation();
    const { t } = useLocale();
    const stats = getCreatorStats(currentUser!.creatorId!);

    if (!stats) return <p>{t('dashboard.loadingStats')}</p>;

    const pieChartData = stats.earningsBreakdown.map((item) => ({...item, color: item.name === 'Subscriptions' ? 'text-indigo-500' : item.name === 'Tips' ? 'text-green-500' : 'text-pink-500'}));
    const growthCount = stats.subscriberGrowth.length;
    const growthValue = growthCount >= 2 ? stats.subscriberGrowth[growthCount-1].count - stats.subscriberGrowth[growthCount-2].count : (growthCount === 1 ? stats.subscriberGrowth[0].count : 0);

    return (
        <div>
            <div className="flex justify-between items-center mb-6"><h2 className="text-3xl font-bold text-gray-900 dark:text-white">{t('dashboard.creatorDashboard')}</h2></div>
            {currentUser?.onboardingProgress?.some(p => !p.completed) && <div className="mb-8"><OnboardingChecklist /></div> }
            <div className="space-y-8">
                <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('dashboard.thisMonthPerformance')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <StatCard title={t('dashboard.monthlyRevenue')} value={`$${stats.monthlyRevenue.toLocaleString()}`} icon="dollar" color="text-green-500"/>
                        <StatCard title={t('dashboard.totalSubscribers')} value={stats.totalSubscribers.toLocaleString()} icon="user" color="text-blue-500"/>
                        <StatCard title={t('dashboard.subscriberGrowth')} value={`+${growthValue.toLocaleString()}`} icon="logo" color="text-pink-500"/>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800"><h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('dashboard.subscriberGrowth')}</h3><div className="h-72"><LineChart data={stats.subscriberGrowth} /></div></div>
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800"><h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('dashboard.earningsBreakdown')}</h3><div className="h-72"><PieChart data={pieChartData} /></div></div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800"><h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-3"><Icon name="list" className="w-6 h-6 text-gray-500"/>{t('dashboard.audienceManagement')}</h3><p className="text-gray-500 mb-4">{t('dashboard.audienceManagementDesc')}</p><button onClick={onGoToFanLists} className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold py-2 px-4 rounded-lg">{t('dashboard.manageFanLists')}</button></div>
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800"><AiContentGenerator /></div>
                </div>
            </div>
        </div>
    );
};

export const DashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { onGoToHome } = useNavigation();
  const { t } = useLocale();

  return (
    <div>
      <div className="mb-6"><button onClick={onGoToHome} className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-semibold transition-colors"><Icon name="arrow-left" className="w-5 h-5" />{t('dashboard.backToHome')}</button></div>
      {currentUser?.role === UserRole.Creator ? <CreatorDashboard /> : <div className="text-center py-16 bg-gray-50 dark:bg-gray-900 rounded-2xl"><h3 className="text-xl font-semibold">{t('dashboard.fanDashboard')}</h3><p className="text-gray-500 mt-2">{t('dashboard.fanDashboardDesc')}</p></div>}
    </div>
  );
};