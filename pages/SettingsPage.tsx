import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '../contexts/NavigationProvider';
import { Icon } from '../components/Icon';
import { SettingsSidebar } from '../components/settings/SettingsSidebar';
import { SettingsProfile } from '../components/settings/SettingsProfile';
import { SettingsAccount } from '../components/settings/SettingsAccount';
import { SettingsWallet } from '../components/settings/SettingsWallet';
import { SettingsNotifications } from '../components/settings/SettingsNotifications';
import { SettingsPrivacy } from '../components/settings/SettingsPrivacy';
import { UserRole, SettingsSection } from '../types';
import { SettingsPersonal } from '../components/settings/SettingsPersonal';
import { SettingsBilling } from '../components/settings/SettingsBilling';
import { SettingsPayout } from '../components/settings/SettingsPayout';
import { SettingsMonetization } from '../components/settings/SettingsMonetization';
import { SupportPage } from './SupportPage';
import { SettingsReferrals } from '../components/settings/SettingsReferrals';

export const SettingsPage: React.FC = () => {
    const { currentUser } = useAuth();
    const { view, onGoToHome, onGoToSettings } = useNavigation();
    
    const activeSection = view.page === 'settings' ? view.activeSection : (currentUser?.role === UserRole.Creator ? 'profile' : 'account');

    const renderSection = () => {
        switch (activeSection) {
            case 'profile': return currentUser?.role === UserRole.Creator ? <SettingsProfile /> : null;
            case 'account': return <SettingsAccount />;
            case 'monetization': return currentUser?.role === UserRole.Creator ? <SettingsMonetization /> : null;
            case 'personal': return <SettingsPersonal />;
            case 'billing': return <SettingsBilling />;
            case 'payout': return currentUser?.role === UserRole.Creator ? <SettingsPayout /> : null;
            case 'wallet': return <SettingsWallet />;
            case 'notifications': return <SettingsNotifications />;
            case 'privacy': return <SettingsPrivacy />;
            case 'support': return <SupportPage />;
            case 'referrals': return <SettingsReferrals />;
            default: return null;
        }
    }
    
    if (!currentUser) return null;

    return (
        <div className="max-w-6xl mx-auto">
             <div className="mb-6"><button onClick={onGoToHome} className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-semibold transition-colors"><Icon name="arrow-left" className="w-5 h-5" />Back to Home</button></div>
            <div className="flex flex-col md:flex-row md:gap-10">
                <aside className="md:w-1/4 lg:w-1/5 mb-8 md:mb-0"><SettingsSidebar activeSection={activeSection!} setActiveSection={onGoToSettings} /></aside>
                <main className="flex-1">{renderSection()}</main>
            </div>
        </div>
    );
};