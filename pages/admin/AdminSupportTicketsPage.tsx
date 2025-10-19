import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataProvider';
import { SupportTicket, SupportTicketStatus } from '../../types';
import { Icon } from '../../components/Icon';
import { formatTimestamp } from '../../utils/formatters';
import { DropdownMenu } from '../../components/DropdownMenu';

const StatusBadge: React.FC<{ status: SupportTicketStatus }> = ({ status }) => {
    const styles = {
        [SupportTicketStatus.Open]: 'bg-blue-500/20 text-blue-400',
        [SupportTicketStatus.InProgress]: 'bg-yellow-500/20 text-yellow-400',
        [SupportTicketStatus.Closed]: 'bg-gray-500/20 text-gray-400',
    };
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>{status.replace('_', ' ')}</span>;
};

const TicketRow: React.FC<{ ticket: SupportTicket }> = ({ ticket }) => {
    const { updateSupportTicketStatus } = useData();
    const [isExpanded, setIsExpanded] = useState(false);

    const statusOptions = Object.values(SupportTicketStatus).map(status => ({
        label: `Mark as ${status.replace('_', ' ')}`,
        onClick: () => updateSupportTicketStatus(ticket.id, status)
    }));
    
    return (
        <>
            <tr className="border-b border-gray-700 hover:bg-gray-800/50 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <td className="px-4 py-3 text-sm text-gray-400">{ticket.id}</td>
                <td className="px-4 py-3">
                    <p className="font-medium text-white">{ticket.subject}</p>
                    <p className="text-xs text-gray-500">{ticket.username || ticket.email}</p>
                </td>
                <td className="px-4 py-3"><StatusBadge status={ticket.status} /></td>
                <td className="px-4 py-3 text-sm text-gray-400">{ticket.category}</td>
                <td className="px-4 py-3 text-sm text-gray-400 hidden md:table-cell">{formatTimestamp(ticket.timestamp)}</td>
                <td className="px-4 py-3">
                    <DropdownMenu
                        triggerElement={<button className="text-gray-400 hover:text-white p-1 rounded-md" onClick={(e) => e.stopPropagation()}><Icon name="ellipsis-vertical" /></button>}
                        items={statusOptions}
                    />
                </td>
            </tr>
            {isExpanded && (
                <tr className="bg-gray-800/30">
                    <td colSpan={6} className="p-4">
                        <p className="text-white whitespace-pre-wrap">{ticket.message}</p>
                    </td>
                </tr>
            )}
        </>
    );
};

export const AdminSupportTicketsPage: React.FC = () => {
    const { supportTickets } = useData();
    const [statusFilter, setStatusFilter] = useState<SupportTicketStatus | 'all'>('all');

    const filteredTickets = useMemo(() => {
        return [...supportTickets]
            .filter(ticket => statusFilter === 'all' || ticket.status === statusFilter)
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [supportTickets, statusFilter]);

    return (
        <div>
            <h1 className="text-4xl font-bold text-white mb-8 flex items-center gap-3">
                <Icon name="chat" className="w-9 h-9 text-indigo-400" />
                Support Tickets
            </h1>
            <div className="mb-6">
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="w-full md:w-auto bg-gray-800 border border-gray-600 rounded-lg p-2.5 text-white">
                    <option value="all">All Statuses</option>
                    <option value={SupportTicketStatus.Open}>Open</option>
                    <option value={SupportTicketStatus.InProgress}>In Progress</option>
                    <option value={SupportTicketStatus.Closed}>Closed</option>
                </select>
            </div>
            <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-max text-left">
                        <thead className="bg-gray-800">
                            <tr>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-400">ID</th>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-400">Subject</th>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-400">Status</th>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-400">Category</th>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-400 hidden md:table-cell">Date</th>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTickets.map(ticket => <TicketRow key={ticket.id} ticket={ticket} />)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};