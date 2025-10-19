import React, { useMemo } from 'react';
import { useData } from '../../contexts/DataProvider';
import { Icon } from '../../components/Icon';
import { UserRole, SupportTicketStatus } from '../../types';
import { AdminLineChart } from '../../components/admin/AdminLineChart';
import { useNavigation } from '../../contexts/NavigationProvider';

const StatCard: React.FC<{ title: string; value: string; icon: string; color: string, onClick?: () => void }> = ({ title, value, icon, color, onClick }) => (
    <div className={`bg-gray-900 p-6 rounded-xl border border-gray-700 ${onClick ? 'cursor-pointer hover:border-indigo-500 transition-colors' : ''}`} onClick={onClick}>
        <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full bg-gray-800`}><Icon name={icon} className={`w-7 h-7 ${color}`} /></div>
            <div>
                <p className="text-gray-400">{title}</p>
                <p className="text-3xl font-bold text-white">{value}</p>
            </div>
        </div>
    </div>
);

export const AdminDashboardPage: React.FC = () => {
    const { users, posts, transactions, verificationSubmissions, autoModQueue, supportTickets } = useData();
    const { onGoToAdminVerifications, onGoToAdminAutoMod, onGoToAdminUsers, onGoToAdminContent, onGoToAdminSupport } = useNavigation();

    const stats = useMemo(() => {
        const totalUsers = users.length;
        const totalCreators = users.filter(u => u.role === UserRole.Creator).length;
        const totalPosts = posts.filter(p => !p.scheduledAt).length; // Exclude scheduled
        const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
        const openSupportTickets = supportTickets.filter(t => t.status === SupportTicketStatus.Open).length;

        return {
            totalUsers,
            totalCreators,
            totalPosts,
            totalRevenue,
            pendingVerifications: verificationSubmissions.length,
            autoModQueueSize: autoModQueue.length,
            openSupportTickets,
        };
    }, [users, posts, transactions, verificationSubmissions, autoModQueue, supportTickets]);
    
    const chartData = useMemo(() => {
        const today = new Date();
        const userGrowthData: { name: string; value: number }[] = [];
        const revenueGrowthData: { name: string; value: number }[] = [];
        let cumulativeUsers = 0;
        let cumulativeRevenue = 0;

        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateString = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            
            const newUsersThisDay = users.filter(u => {
                const regDate = new Date(u.registeredAt);
                return regDate.toDateString() === date.toDateString();
            }).length;
            cumulativeUsers += newUsersThisDay;

            const revenueThisDay = transactions.filter(t => {
                const transDate = new Date(t.timestamp);
                return transDate.toDateString() === date.toDateString();
            }).reduce((sum, t) => sum + t.amount, 0);
            cumulativeRevenue += revenueThisDay;
            
            userGrowthData.push({ name: dateString, value: cumulativeUsers });
            revenueGrowthData.push({ name: dateString, value: cumulativeRevenue });
        }
        return { userGrowthData, revenueGrowthData };
    }, [users, transactions]);


    return (
        <div>
            <h1 className="text-4xl font-bold text-white mb-8">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <StatCard title="Total Users" value={stats.totalUsers.toLocaleString()} icon="users" color="text-blue-400" onClick={() => onGoToAdminUsers()} />
                <StatCard title="Total Revenue" value={`$${stats.totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2})}`} icon="dollar" color="text-green-400" />
                <StatCard title="Total Posts" value={stats.totalPosts.toLocaleString()} icon="collection" color="text-yellow-400" onClick={() => onGoToAdminContent()} />
                <StatCard title="Total Creators" value={stats.totalCreators.toLocaleString()} icon="sparkles" color="text-pink-400" onClick={() => onGoToAdminUsers({ role: UserRole.Creator })} />
                <StatCard title="Pending Verifications" value={stats.pendingVerifications.toLocaleString()} icon="shield-check" color="text-cyan-400" onClick={onGoToAdminVerifications} />
                <StatCard title="Auto-Mod Queue" value={stats.autoModQueueSize.toLocaleString()} icon="flag" color="text-orange-400" onClick={onGoToAdminAutoMod}/>
                 <StatCard title="Open Support Tickets" value={stats.openSupportTickets.toLocaleString()} icon="chat" color="text-purple-400" onClick={onGoToAdminSupport}/>
            </div>

             <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 h-96 flex flex-col">
                    <h2 className="text-xl font-semibold text-white mb-4">User Growth (Last 30 Days)</h2>
                    <div className="flex-1"><AdminLineChart data={chartData.userGrowthData} color="#38bdf8" /></div>
                </div>
                 <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 h-96 flex flex-col">
                    <h2 className="text-xl font-semibold text-white mb-4">Revenue Growth (Last 30 Days)</h2>
                    <div className="flex-1"><AdminLineChart data={chartData.revenueGrowthData} color="#34d399" formatAsCurrency /></div>
                </div>
            </div>
        </div>
    );
};