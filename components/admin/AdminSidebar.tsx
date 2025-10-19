import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '../../contexts/NavigationProvider';
import { Icon } from '../Icon';

const NavItem: React.FC<{
  icon: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-lg ${
      isActive
        ? 'bg-gray-700 text-white font-semibold'
        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
    }`}
  >
    <Icon name={icon} className="w-6 h-6" />
    <span>{label}</span>
  </button>
);

export const AdminSidebar: React.FC = () => {
  const { logout } = useAuth();
  const { view, onGoToAdminDashboard, onGoToAdminUsers, onGoToAdminContent, onGoToAdminVerifications, onGoToAdminFinances, onGoToAdminSettings, onGoToAdminReports, onGoToAdminAnnouncements, onGoToHome, onGoToAdminAutoMod, onGoToAdminSupport } = useNavigation();

  const handleLogout = () => {
    logout();
    onGoToHome(); 
  }

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen fixed top-0 left-0 bg-gray-900 border-r border-gray-700 p-4">
      <div className="flex items-center gap-3 px-2 pt-2 pb-6">
        <Icon name="logo" className="h-9 w-9 text-indigo-400" />
        <h1 className="text-2xl font-bold text-white tracking-tight">TheFreed Admin</h1>
      </div>
      <nav className="flex-1 flex flex-col gap-2">
        <NavItem
          icon="chart-pie"
          label="Dashboard"
          isActive={view.page === 'adminDashboard'}
          onClick={onGoToAdminDashboard}
        />
        <NavItem
          icon="users"
          label="Users"
          isActive={view.page === 'adminUsers' || view.page === 'adminUserDetail'}
          onClick={onGoToAdminUsers}
        />
        <NavItem
          icon="collection"
          label="Content"
          isActive={view.page === 'adminContent' || view.page === 'adminPostDetail'}
          onClick={onGoToAdminContent}
        />
        <NavItem
          icon="flag"
          label="Reports"
          isActive={view.page === 'adminReports'}
          onClick={onGoToAdminReports}
        />
        <NavItem
          icon="sparkles"
          label="Auto-Moderation"
          isActive={view.page === 'adminAutoMod'}
          onClick={onGoToAdminAutoMod}
        />
        <NavItem
          icon="shield-check"
          label="Verifications"
          isActive={view.page === 'adminVerifications'}
          onClick={onGoToAdminVerifications}
        />
         <NavItem
          icon="credit-card"
          label="Finances"
          isActive={view.page === 'adminFinances'}
          onClick={onGoToAdminFinances}
        />
        <NavItem
          icon="chat"
          label="Support Tickets"
          isActive={view.page === 'adminSupport'}
          onClick={onGoToAdminSupport}
        />
         <NavItem
          icon="bell"
          label="Announcements"
          isActive={view.page === 'adminAnnouncements'}
          onClick={onGoToAdminAnnouncements}
        />
        <NavItem
          icon="cog-6-tooth"
          label="Settings"
          isActive={view.page === 'adminSettings'}
          onClick={onGoToAdminSettings}
        />
      </nav>
       <div className="py-2 border-t border-gray-700">
          <button onClick={handleLogout} className="w-full text-left flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-md">
            Log Out
          </button>
        </div>
    </aside>
  );
};