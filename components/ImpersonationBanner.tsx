import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Icon } from './Icon';

export const ImpersonationBanner: React.FC = () => {
    const { impersonatedUser, stopImpersonation } = useAuth();

    if (!impersonatedUser) {
        return null;
    }

    return (
        <div className="bg-yellow-500 text-black p-3 text-center text-sm font-semibold sticky top-0 z-50 flex items-center justify-center gap-4">
            <Icon name="user-circle" className="w-5 h-5" />
            <span>
                You are currently viewing the site as <strong>{impersonatedUser.username}</strong>.
            </span>
            <button
                onClick={stopImpersonation}
                className="ml-4 bg-black/10 hover:bg-black/20 font-bold py-1 px-3 rounded-full"
            >
                Stop Impersonating
            </button>
        </div>
    );
};
