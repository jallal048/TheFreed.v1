import React, { useMemo, useState } from 'react';
import { useData } from '../../contexts/DataProvider';
import { Transaction } from '../../types';
import { Icon } from '../../components/Icon';

const StatCard: React.FC<{ title: string; value: string; icon: string; color: string }> = ({ title, value, icon, color }) => (
    <div className="bg-gray-900 p-6 rounded-xl border border-gray-700">
        <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full bg-gray-800`}>
                <Icon name={icon} className={`w-7 h-7 ${color}`} />
            </div>
            <div>
                <p className="text-gray-400">{title}</p>
                <p className="text-3xl font-bold text-white">{value}</p>
            </div>
        </div>
    </div>
);

const TransactionRow: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
    const { users } = useData();
    const fan = users.find(u => u.id === transaction.fanId);
    const creator = users.find(u => u.creatorId === transaction.creatorId);

    return (
        <tr className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors">
            <td className="px-4 py-3 text-sm text-gray-400">{transaction.id}</td>
            <td className="px-4 py-3 text-sm text-gray-400">{new Date(transaction.timestamp).toLocaleString()}</td>
            <td className="px-4 py-3 text-white">{fan?.username || 'N/A'}</td>
            <td className="px-4 py-3 text-white">{creator?.username || 'N/A'}</td>
            <td className="px-4 py-3 text-gray-300 capitalize">{transaction.type.toLowerCase()}</td>
            <td className="px-4 py-3 text-green-400 font-semibold">${transaction.amount.toFixed(2)}</td>
            <td className="px-4 py-3 text-yellow-400">${transaction.platformFee.toFixed(2)}</td>
            <td className="px-4 py-3 text-indigo-400">${transaction.creatorPayout.toFixed(2)}</td>
        </tr>
    );
};

export const AdminFinancesPage: React.FC = () => {
    const { transactions, processPayouts } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    
    const stats = useMemo(() => {
        const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
        const platformFees = transactions.reduce((sum, t) => sum + t.platformFee, 0);
        const totalPayouts = transactions.reduce((sum, t) => sum + t.creatorPayout, 0);
        
        return { totalRevenue, platformFees, totalPayouts };
    }, [transactions]);

    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            return String(t.creatorId).includes(searchTerm) || String(t.fanId).includes(searchTerm) || String(t.id).includes(searchTerm);
        }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [transactions, searchTerm]);
    
    const handlePayouts = () => {
        if (window.confirm('Are you sure you want to process all pending payouts? This action is irreversible.')) {
            processPayouts();
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                 <h1 className="text-4xl font-bold text-white flex items-center gap-3">
                    <Icon name="credit-card" className="w-9 h-9 text-indigo-400" />
                    Finances
                </h1>
                <button onClick={handlePayouts} className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-5 rounded-full flex items-center gap-2">
                    <Icon name="dollar" className="w-5 h-5" /> Process Payouts
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title="Total Revenue" value={`$${stats.totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2})}`} icon="dollar" color="text-green-400" />
                <StatCard title="Platform Fees" value={`$${stats.platformFees.toLocaleString(undefined, {minimumFractionDigits: 2})}`} icon="chart-pie" color="text-yellow-400" />
                <StatCard title="Creator Payouts" value={`$${stats.totalPayouts.toLocaleString(undefined, {minimumFractionDigits: 2})}`} icon="users" color="text-indigo-400" />
            </div>

            <div className="bg-gray-900 rounded-xl border border-gray-700">
                <div className="p-4">
                    <input type="text" placeholder="Search by User ID, Creator ID, or Transaction ID..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full md:w-1/3 bg-gray-800 border border-gray-600 rounded-lg p-2.5 text-white" />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-max text-left">
                        <thead className="bg-gray-800">
                            <tr>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-400">ID</th>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-400">Date</th>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-400">From (Fan)</th>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-400">To (Creator)</th>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-400">Type</th>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-400">Amount</th>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-400">Fee</th>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-400">Payout</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.map(t => <TransactionRow key={t.id} transaction={t} />)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
