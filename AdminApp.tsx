import React from 'react';
import { useNavigation } from './contexts/NavigationProvider';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminContentPage } from './pages/admin/AdminContentPage';
import { AdminVerificationsPage } from './pages/admin/AdminVerificationsPage';
import { AdminFinancesPage } from './pages/admin/AdminFinancesPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminUserDetailPage } from './pages/admin/AdminUserDetailPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminAnnouncementsPage } from './pages/admin/AdminAnnouncementsPage';
import { AdminAutoModPage } from './pages/admin/AdminAutoModPage';
import { AdminPostDetailPage } from './pages/admin/AdminPostDetailPage';
import { AdminSupportTicketsPage } from './pages/admin/AdminSupportTicketsPage';

export const AdminApp: React.FC = () => {
  const { view } = useNavigation();

  const renderAdminPage = () => {
    switch (view.page) {
      case 'adminDashboard':
        return <AdminDashboardPage />;
      case 'adminUsers':
        return <AdminUsersPage />;
      case 'adminUserDetail':
        if (view.userId) {
          return <AdminUserDetailPage userId={view.userId} />;
        }
        return <AdminUsersPage />; // Fallback to users list if no ID
      case 'adminContent':
        return <AdminContentPage />;
      case 'adminPostDetail':
        if (view.postId) {
          return <AdminPostDetailPage postId={view.postId} />;
        }
        return <AdminContentPage />;
      case 'adminVerifications':
        return <AdminVerificationsPage />;
      case 'adminFinances':
        return <AdminFinancesPage />;
      case 'adminSettings':
        return <AdminSettingsPage />;
      case 'adminReports':
        return <AdminReportsPage />;
      case 'adminAnnouncements':
        return <AdminAnnouncementsPage />;
      case 'adminAutoMod':
        return <AdminAutoModPage />;
      case 'adminSupport':
        return <AdminSupportTicketsPage />;
      default:
        // Fallback to dashboard for any other admin-related view state
        return <AdminDashboardPage />;
    }
  };

  return (
    <div className="bg-gray-800 text-gray-200 min-h-screen">
        <AdminLayout>
            {renderAdminPage()}
        </AdminLayout>
    </div>
  );
};