import React from 'react';
import { useData } from '../../contexts/DataProvider';
import { Icon } from '../../components/Icon';
import { formatTimestamp } from '../../utils/formatters';
import { Report } from '../../types';
import { DropdownMenu } from '../../components/DropdownMenu';
import { DropdownItem } from '../../types';

const ReportItem: React.FC<{ report: Report }> = ({ report }) => {
    const { users, posts, resolveReport } = useData();

    const reporter = users.find(u => u.id === report.reporterId);
    const targetPost = report.targetType === 'post' ? posts.find(p => p.id === report.targetId) : null;
    const targetUser = report.targetType === 'user' ? users.find(u => u.id === report.targetId) : 
                       (targetPost ? users.find(u => u.creatorId === targetPost.creator.id) : null);
    
    const targetContent = targetPost || (targetUser ? { creator: { username: targetUser.username, avatarUrl: targetUser.avatarUrl, id: targetUser.id }, text: 'User Profile Report' } : null);

    const handleAction = (action: 'dismiss' | 'delete_post' | 'suspend_1d' | 'suspend_7d' | 'ban') => {
        resolveReport(report.id, action);
        alert(`Action '${action}' taken on report ${report.id}`);
    };
    
    const actionItems: DropdownItem[] = [
        ...(targetPost ? [{ label: 'Delete Post', icon: <Icon name="trash" className="w-5 h-5"/>, onClick: () => handleAction('delete_post'), isDestructive: true }] : []),
        ...(targetUser ? [
            { label: 'Suspend User (1d)', icon: <Icon name="ban" className="w-5 h-5"/>, onClick: () => handleAction('suspend_1d'), isDestructive: true },
            { label: 'Suspend User (7d)', icon: <Icon name="ban" className="w-5 h-5"/>, onClick: () => handleAction('suspend_7d'), isDestructive: true },
            { label: 'Ban User', icon: <Icon name="ban" className="w-5 h-5"/>, onClick: () => handleAction('ban'), isDestructive: true },
        ] : []),
    ];


    return (
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 flex flex-col md:flex-row items-start gap-4">
            <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                     <p className="text-xs text-gray-500">Report #{report.id} · {formatTimestamp(report.timestamp)}</p>
                </div>
                <p><strong className="text-gray-400">Reason:</strong> <span className="text-white">{report.reason}</span></p>
                <p><strong className="text-gray-400">Reported by:</strong> <span className="text-white">{reporter?.username || `User ID ${report.reporterId}`}</span></p>
            </div>
            
            {targetContent && (
                 <div className="w-full md:w-1/2 bg-gray-800/50 p-3 rounded-md border border-gray-700">
                    <p className="text-xs text-gray-500 mb-2">Reported Content ({report.targetType === 'post' ? `Post ID: ${report.targetId}` : `User ID: ${report.targetId}`})</p>
                    <div className="flex items-center gap-2">
                         <img src={targetContent.creator.avatarUrl} alt="" className="w-8 h-8 rounded-full" />
                        <span className="font-semibold text-white">{targetContent.creator.username}</span>
                    </div>
                     <p className="text-sm text-gray-300 mt-2 line-clamp-2">{targetContent.text}</p>
                </div>
            )}
            
            <div className="flex items-center gap-2 self-start">
                <button onClick={() => handleAction('dismiss')} className="bg-gray-700 hover:bg-gray-600 text-white font-semibold text-sm py-2 px-4 rounded-full">Dismiss</button>
                <DropdownMenu
                    triggerElement={<button className="bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold text-sm py-2 px-4 rounded-full">Take Action</button>}
                    items={actionItems}
                />
            </div>
        </div>
    );
};

export const AdminReportsPage: React.FC = () => {
    const { reports } = useData();
    const pendingReports = reports.filter(r => r.status === 'pending');

    return (
        <div>
            <h1 className="text-4xl font-bold text-white mb-8 flex items-center gap-3">
                <Icon name="flag" className="w-9 h-9 text-indigo-400" />
                Moderation Queue
            </h1>

            {pendingReports.length > 0 ? (
                <div className="space-y-4">
                    {pendingReports.map(report => <ReportItem key={report.id} report={report} />)}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-900 rounded-xl border border-gray-700">
                    <Icon name="check-circle" className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white">All Clear!</h3>
                    <p className="text-gray-400 mt-2">The moderation queue is empty.</p>
                </div>
            )}
        </div>
    );
};