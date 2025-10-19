

import React from 'react';
import { Icon } from '../Icon';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole, SettingsSection } from '../../types';
import { useLocale } from '../../contexts/LocaleProvider';

interface SettingsSidebarProps {
  activeSection: SettingsSection;
  setActiveSection: (section: SettingsSection) => void;
}

const NavItem: React.FC<{ label: string; iconName: string; isActive: boolean; onClick: () => void }> = ({ label, iconName, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive ? 'bg-indigo-100 dark:bg-indigo-600/20 text-indigo-700 dark:text-indigo-300' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
    }`}
  >
    <Icon name={iconName} className="w-5 h-5" />
    {label}
  </button>
);

export const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ activeSection, setActiveSection }) => {
  const { currentUser } = useAuth();
  const { t } = useLocale();
  
  const creatorItems: { id: SettingsSection; label: string; icon: string }[] = currentUser?.role === UserRole.Creator ? [
    { id: 'profile', label: t('settings.nav.profile'), icon: 'user-circle' },
    { id: 'monetization', label: t('settings.nav.monetization'), icon: 'ticket' },
    { id: 'payout', label: t('settings.nav.payout'), icon: 'building-office' },
  ] : [];

  const userItems: { id: SettingsSection; label: string; icon: string }[] = [
      { id: 'account', label: t('settings.nav.account'), icon: 'cog-6-tooth' },
      { id: 'personal', label: t('settings.nav.personal'), icon: 'identification' },
      { id: 'billing', label: t('settings.nav.billing'), icon: 'credit-card' },
      { id: 'wallet', label: t('settings.nav.wallet'), icon: 'credit-card' },
      { id: 'notifications', label: t('settings.nav.notifications'), icon: 'bell' },
      { id: 'privacy', label: t('settings.nav.privacy'), icon: 'shield-check' },
  ];

  const commonItems: { id: SettingsSection; label: string; icon: string }[] = [
    { id: 'referrals', label: t('header.referrals'), icon: 'users' },
    { id: 'support', label: t('settings.nav.support'), icon: 'chat' },
  ];

  const navItems = [...creatorItems, ...userItems, ...commonItems];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-800">
        <h2 className="text-lg font-bold px-2 pb-2 text-gray-900 dark:text-white">{t('settings.title')}</h2>
        <nav className="space-y-1">
          {navItems.map(item => (
            <NavItem
              key={item.id}
              label={item.label}
              iconName={item.icon}
              isActive={activeSection === item.id}
              onClick={() => setActiveSection(item.id)}
            />
          ))}
        </nav>
      </div>

      {/* Mobile Select Menu */}
      <div className="md:hidden">
        <select
          value={activeSection}
          onChange={(e) => setActiveSection(e.target.value as SettingsSection)}
          className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-gray-900 dark:text-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
        >
          {navItems.map(item => (
            <option key={item.id} value={item.id}>{item.label}</option>
          ))}
        </select>
      </div>
    </>
  );
};