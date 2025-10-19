import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataProvider';
import { useNavigation } from '../../contexts/NavigationProvider';
import { Icon } from '../../components/Icon';
import { AuthUser, Transaction, UserRole } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useModals } from '../../contexts/ModalProvider';

interface AdminUserDetailPageProps {
  userId: number;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: string }> = ({ title, value, icon }) => (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
        <Icon name={icon} className="w-6 h-6 text-gray-400 mb-2" />
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-xl font-bold text-white">{value}</p>
    </div>
);

const TransactionRow: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
    const { creators } = useData();
    const creator = creators.find(c => c.id === transaction.creatorId);
    return (
        <tr className="border-b border-gray-700 text-sm">
            <td className="px-4 py-2 text-gray-400">{new Date(transaction.timestamp).toLocaleString()}</td>
            <td className="px-4 py-2 text-white">{transaction.description}</td>
            <td className="px-4 py-2 text-gray-300">{creator?.username || 'N/A'}</td>
            <td className="px-4 py-2 font-semibold text-green-400">${transaction.amount.toFixed(2)}</td>
        </tr>
    );
};

export const AdminUserDetailPage: React.FC<AdminUserDetailPageProps> = ({ userId }) => {
    const { getUserById, getTransactionsForUser, creators, suspendUser, reactivateUser, adminCancelSubscription } = useData();
    const { impersonateUser } = useAuth();
    const { onGoToAdminUsers } = useNavigation();
    const { openConfirmationModal } = useModals();
    const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'subscriptions' | 'activity'>('overview');

    const user = getUserById(userId);
    const userTransactions = getTransactionsForUser(userId);
    
    const isSuspended = user?.suspendedUntil && new Date(user.suspendedUntil) > new Date();

    const userStats = useMemo(() => {
        if (!user) return { totalSpent: 0, activeSubs: 0, totalTips: 0 };
        const totalSpent = userTransactions.reduce((sum, t) => sum + t.amount, 0);
        const activeSubs = user.subscriptions.filter(s => new Date(s.expiresAt) > new Date()).length;
        const totalTips = userTransactions.filter(t => t.type === 'TIP').reduce((sum, t) => sum + t.amount, 0);
        return { totalSpent, activeSubs, totalTips };
    }, [user, userTransactions]);

    if (!user) {
        return <div className="text-center text-red-400">User not found.</div>;
    }
    
    const handleAction = (action: string) => alert(`Simulated action: ${action} for user ${user.username}`);
    
    const handleCancelSub = (creatorId: number, creatorUsername: string) => {
        openConfirmationModal({
            title: `Cancel Subscription?`,
            message: `Are you sure you want to cancel ${user.username}'s subscription to ${creatorUsername}? This action is immediate.`,
            confirmText: 'Cancel Subscription',
            onConfirm: () => adminCancelSubscription(user.id, creatorId),
        });
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard title="Total Spent" value={`$${userStats.totalSpent.toFixed(2)}`} icon="dollar" />
                        <StatCard title="Active Subscriptions" value={userStats.activeSubs} icon="users" />
                        <StatCard title="Total Tips" value={`$${userStats.totalTips.toFixed(2)}`} icon="tip" />
                        <div className="md:col-span-3 bg-gray-800 p-4 rounded-lg border border-gray-700">
                            <h3 className="font-semibold text-white mb-2">Personal Information</h3>
                            <p className="text-sm"><strong className="text-gray-400">Full Name:</strong> {user.personalInfo.fullName}</p>
                            <p className="text-sm"><strong className="text-gray-400">DOB:</strong> {user.personalInfo.dateOfBirth}</p>
                            <p className="text-sm"><strong className="text-gray-400">Address:</strong> {user.personalInfo.address}</p>
                            <p className="text-sm mt-2"><strong className="text-gray-400">Account Status:</strong> <span className={isSuspended ? 'text-yellow-400' : 'text-green-400'}>{isSuspended ? 'Suspended' : 'Active'}</span> · {user.isAgeVerified ? 'Age Verified' : 'Not Verified'}</p>
                        </div>
                    </div>
                );
            case 'transactions':
                return (
                    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                        <table className="w-full text-left">
                            <thead><tr><th className="px-4 py-2 text-xs text-gray-400">Date</th><th className="px-4 py-2 text-xs text-gray-400">Description</th><th className="px-4 py-2 text-xs text-gray-400">To Creator</th><th className="px-4 py-2 text-xs text-gray-400">Amount</th></tr></thead>
                            <tbody>{userTransactions.map(t => <TransactionRow key={t.id} transaction={t}/>)}</tbody>
                        </table>
                    </div>
                );
            case 'subscriptions':
                return (
                    <div className="space-y-3">
                    {user.subscriptions.map(sub => {
                        const creator = creators.find(c => c.id === sub.creatorId);
                        const isExpired = new Date(sub.expiresAt) < new Date();
                        return (
                            <div key={sub.creatorId} className="flex justify-between items-center bg-gray-800 p-3 rounded-lg border border-gray-700">
                                <span className="font-medium text-white">Subscribed to {creator?.username || 'Unknown'}</span>
                                <div className="flex items-center gap-4">
                                    <span className={`text-sm ${isExpired ? 'text-red-400' : 'text-green-400'}`}>{isExpired ? `Expired on ${new Date(sub.expiresAt).toLocaleDateString()}` : `Active until ${new Date(sub.expiresAt).toLocaleDateString()}`}</span>
                                    <button disabled={isExpired} onClick={() => handleCancelSub(sub.creatorId, creator?.username || 'Unknown')} className="text-sm text-yellow-400 hover:underline disabled:opacity-50 disabled:cursor-not-allowed">Cancel Sub</button>
                                </div>
                            </div>
                        );
                    })}
                    </div>
                );
            case 'activity':
                return <div className="text-center text-gray-500 py-10">Simulated activity log would appear here.</div>;
        }
    };

    return (
        <div>
            <button onClick={() => onGoToAdminUsers()} className="flex items-center gap-2 text-sm text-indigo-400 mb-6"><Icon name="arrow-left" className="w-4 h-4"/> Back to Users</button>
            
            <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-shrink-0">
                    <img src={user.avatarUrl} alt={user.username} className="w-24 h-24 rounded-full" />
                </div>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-white">{user.username}</h1>
                    <p className="text-gray-400">{user.email}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button onClick={() => impersonateUser(user)} className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold py-2 px-4 rounded-full">Impersonate</button>
                    <button onClick={() => handleAction('Send Password Reset')} className="bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold py-2 px-4 rounded-full">Send Password Reset</button>
                     {isSuspended ? (
                        <button onClick={() => reactivateUser(user.id)} className="bg-green-500/20 hover:bg-green-500/30 text-green-400 text-sm font-semibold py-2 px-4 rounded-full">Reactivate User</button>
                     ) : (
                        <button onClick={() => suspendUser(user.id, 'permanent')} className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 text-sm font-semibold py-2 px-4 rounded-full">Suspend User</button>
                     )}
                </div>
            </div>

            <div className="border-b border-gray-700 my-8">
                <nav className="-mb-px flex space-x-6">
                    <button onClick={() => setActiveTab('overview')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'overview' ? 'border-indigo-400 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}>Overview</button>
                    <button onClick={() => setActiveTab('transactions')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'transactions' ? 'border-indigo-400 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}>Transactions</button>
                    <button onClick={() => setActiveTab('subscriptions')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'subscriptions' ? 'border-indigo-400 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}>Subscriptions</button>
                    <button onClick={() => setActiveTab('activity')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'activity' ? 'border-indigo-400 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}>Activity Log</button>
                </nav>
            </div>

            <div>
                {renderTabContent()}
            </div>
        </div>
    );
};