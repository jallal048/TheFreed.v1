import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataProvider';
import { AuthUser, UserRole, DropdownItem } from '../../types';
import { useNavigation } from '../../contexts/NavigationProvider';
import { Icon } from '../../components/Icon';
import { useModals } from '../../contexts/ModalProvider';
import { DropdownMenu } from '../../components/DropdownMenu';

const UserRow: React.FC<{ user: AuthUser }> = ({ user }) => {
    const { onGoToAdminUserDetail } = useNavigation();
    const { adminDeleteUser, suspendUser, reactivateUser } = useData();
    const { openConfirmationModal } = useModals();

    const isSuspended = user.suspendedUntil && new Date(user.suspendedUntil) > new Date();
    
    const handleDelete = () => {
        openConfirmationModal({
            title: `Delete User ${user.username}?`,
            message: "This will permanently delete the user and all their associated content. This action cannot be undone.",
            confirmText: "Delete User",
            confirmRequiresInput: user.username,
            onConfirm: () => adminDeleteUser(user.id),
        })
    };
    
    const handleReactivate = () => {
        reactivateUser(user.id);
    };

    const suspendItems: DropdownItem[] = [
        { label: 'Suspend for 1 day', icon: <Icon name="ban" className="w-5 h-5"/>, onClick: () => suspendUser(user.id, 1) },
        { label: 'Suspend for 7 days', icon: <Icon name="ban" className="w-5 h-5"/>, onClick: () => suspendUser(user.id, 7) },
        { label: 'Suspend Permanently', icon: <Icon name="ban" className="w-5 h-5"/>, onClick: () => suspendUser(user.id, 'permanent'), isDestructive: true },
    ];
    
    const roleColor = 
        user.role === UserRole.Admin ? 'bg-red-500/20 text-red-400' :
        user.role === UserRole.Creator ? 'bg-indigo-500/20 text-indigo-400' :
        'bg-gray-500/20 text-gray-300';

    return (
        <tr className={`border-b border-gray-700 hover:bg-gray-800/50 transition-colors ${isSuspended ? 'bg-yellow-900/20' : ''}`}>
            <td className="px-4 py-3 text-sm text-gray-400">{user.id}</td>
            <td className="px-4 py-3">
                <button onClick={() => onGoToAdminUserDetail(user.id)} className="flex items-center gap-3 group text-left">
                    <img src={user.avatarUrl} alt={user.username} className="w-10 h-10 rounded-full" />
                    <div>
                        <span className="font-medium text-white group-hover:text-indigo-400 transition-colors">{user.username}</span>
                        {isSuspended && <p className="text-xs text-yellow-400">Suspended</p>}
                    </div>
                </button>
            </td>
            <td className="px-4 py-3 text-gray-300">{user.email}</td>
            <td className="px-4 py-3">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${roleColor}`}>{user.role}</span>
            </td>
            <td className="px-4 py-3 text-sm text-gray-400">{new Date(user.registeredAt).toLocaleDateString()}</td>
            <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                    {isSuspended ? (
                        <button onClick={handleReactivate} className="text-green-400 hover:underline text-sm font-semibold">Reactivate</button>
                    ) : (
                        <DropdownMenu
                            triggerElement={<button className="text-yellow-400 hover:underline text-sm font-semibold">Suspend</button>}
                            items={suspendItems}
                        />
                    )}
                    <button onClick={handleDelete} className="text-red-400 hover:underline text-sm">Delete</button>
                </div>
            </td>
        </tr>
    );
};

export const AdminUsersPage: React.FC = () => {
    const { users } = useData();
    const { view } = useNavigation();
    
    const initialFilters = (view.page === 'adminUsers' && view.filters) ? view.filters : {};

    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>(initialFilters.role || 'all');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>(initialFilters.status || 'all');
    
    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRole = roleFilter === 'all' || user.role === roleFilter;
            const isSuspended = user.suspendedUntil && new Date(user.suspendedUntil) > new Date();
            const matchesStatus = statusFilter === 'all' || (statusFilter === 'suspended' && isSuspended) || (statusFilter === 'active' && !isSuspended);
            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [users, searchTerm, roleFilter, statusFilter]);

    return (
        <div>
            <h1 className="text-4xl font-bold text-white mb-8">User Management</h1>
            <div className="bg-gray-900 rounded-xl border border-gray-700 p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="text" placeholder="Search by name or email..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2.5 text-white" />
                    <select value={roleFilter} onChange={e => setRoleFilter(e.target.value as any)} className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2.5 text-white">
                        <option value="all">All Roles</option>
                        <option value={UserRole.Fan}>Fan</option>
                        <option value={UserRole.Creator}>Creator</option>
                        <option value={UserRole.Admin}>Admin</option>
                    </select>
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2.5 text-white">
                        <option value="all">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                    </select>
                </div>
            </div>
            <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-max text-left">
                        <thead className="bg-gray-800">
                            <tr>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-400">ID</th>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-400">User</th>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-400">Email</th>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-400">Role</th>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-400">Joined</th>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => <UserRow key={user.id} user={user} />)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};