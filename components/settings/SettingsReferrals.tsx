import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataProvider';
import { useLocale } from '../../contexts/LocaleProvider';
import { Icon } from '../Icon';

export const SettingsReferrals: React.FC = () => {
    const { currentUser } = useAuth();
    const { getReferredUsers, getReferralEarnings } = useData();
    const { t } = useLocale();
    const [copied, setCopied] = useState(false);

    if (!currentUser || !currentUser.referralCode) {
        return <div>Loading referral info...</div>;
    }

    const referralLink = `${window.location.origin}/?ref=${currentUser.referralCode}`;
    const referredUsers = getReferredUsers(currentUser.id);
    const totalEarnings = getReferralEarnings(currentUser.id);

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl space-y-6 border border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{t('settings.referrals.title')}</h2>
            <p className="text-gray-600 dark:text-gray-400">{t('settings.referrals.description')}</p>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('settings.referrals.yourLink')}</label>
                <div className="flex items-center gap-2">
                    <input type="text" readOnly value={referralLink} className="flex-1 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-gray-900 dark:text-white" />
                    <button onClick={handleCopy} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-lg flex items-center gap-2">
                        <Icon name={copied ? 'check' : 'clipboard-document'} className="w-5 h-5" />
                        {copied ? t('settings.referrals.copied') : t('settings.referrals.copy')}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.referrals.creatorsReferred')}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{referredUsers.length}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.referrals.totalEarnings')}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">${totalEarnings.toFixed(2)}</p>
                </div>
            </div>
        </div>
    );
};