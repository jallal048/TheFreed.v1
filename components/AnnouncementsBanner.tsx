import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataProvider';
import { useAuth } from '../contexts/AuthContext';
import { Icon } from './Icon';
import { Announcement, UserRole } from '../types';

export const AnnouncementsBanner: React.FC = () => {
    const { announcements } = useData();
    const { currentUser } = useAuth();
    const [dismissedIds, setDismissedIds] = useState<number[]>([]);

    const activeAnnouncement = useMemo((): Announcement | null => {
        if (!currentUser) return null;

        return announcements.find(ann => 
            ann.isActive &&
            !dismissedIds.includes(ann.id) &&
            (ann.target === 'all' || ann.target === currentUser.role)
        ) || null;
    }, [announcements, currentUser, dismissedIds]);

    if (!activeAnnouncement) {
        return null;
    }

    const handleDismiss = () => {
        setDismissedIds(prev => [...prev, activeAnnouncement.id]);
    };

    return (
        <div className="bg-indigo-600 text-white p-3 text-center text-sm relative">
            <div className="container mx-auto flex items-center justify-center gap-4">
                <Icon name="bell" className="w-5 h-5 flex-shrink-0" />
                <p>
                    <strong className="font-bold">{activeAnnouncement.title}</strong>: {activeAnnouncement.content}
                </p>
                <button onClick={handleDismiss} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full">
                    <Icon name="close" className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};
