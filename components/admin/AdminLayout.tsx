
import React from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AnnouncementsBanner } from '../AnnouncementsBanner';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 lg:pl-64 flex flex-col">
        <AnnouncementsBanner />
        <main className="p-6 lg:p-10 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};
