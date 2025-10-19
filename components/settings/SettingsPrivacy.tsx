import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataProvider';
import { ToggleSwitch } from '../ToggleSwitch';
import { Icon } from '../Icon';
import { useLocale } from '../../contexts/LocaleProvider';

export const SettingsPrivacy: React.FC = () => {
    const { currentUser, startFanAgeVerification } = useAuth();
    const { updateUserSettings } = useData();
    const { t } = useLocale();

    const [isPrivate, setIsPrivate] = useState(currentUser?.isProfilePrivate || false);
    const [allowFindByEmail, setAllowFindByEmail] = useState(currentUser?.allowFindByEmail ?? true);
    const [sendReadReceipts, setSendReadReceipts] = useState(currentUser?.sendReadReceipts ?? true);
    const [showSensitiveContent, setShowSensitiveContent] = useState(currentUser?.showSensitiveContent ?? false);
    const [show2FA, setShow2FA] = useState(false);

    useEffect(() => {
      if (currentUser) {
        setShowSensitiveContent(currentUser.showSensitiveContent);
        setIsPrivate(currentUser.isProfilePrivate);
        setAllowFindByEmail(currentUser.allowFindByEmail);
        setSendReadReceipts(currentUser.sendReadReceipts);
      }
    }, [currentUser]);

    const handlePrivacyToggle = async () => {
        if (!currentUser) return;
        const newValue = !isPrivate;
        setIsPrivate(newValue);
        await updateUserSettings(currentUser.id, { isProfilePrivate: newValue });
    };

     const handleEmailFindToggle = async () => {
        if (!currentUser) return;
        const newValue = !allowFindByEmail;
        setAllowFindByEmail(newValue);
        await updateUserSettings(currentUser.id, { allowFindByEmail: newValue });
    };

    const handleReadReceiptsToggle = async () => {
        if (!currentUser) return;
        const newValue = !sendReadReceipts;
        setSendReadReceipts(newValue);
        await updateUserSettings(currentUser.id, { sendReadReceipts: newValue });
    };
    
    const handleSensitiveContentToggle = async () => {
        if (!currentUser) return;

        const intendedValue = !showSensitiveContent;
        if (intendedValue && !currentUser.isAgeVerified) {
            startFanAgeVerification();
            return;
        }

        setShowSensitiveContent(intendedValue);
        await updateUserSettings(currentUser.id, { showSensitiveContent: intendedValue });
    };

    return (
        <div className="space-y-10">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Privacy & Security</h2>
            
            <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Content Preferences</h3>
                <div className="flex items-start justify-between bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                    <div>
                        <h4 className="font-medium text-gray-800 dark:text-white">{t('settings.privacy.sensitiveContentTitle')}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">{t('settings.privacy.sensitiveContentDesc')}</p>
                    </div>
                    <ToggleSwitch checked={showSensitiveContent} onChange={handleSensitiveContentToggle} />
                </div>
            </div>

            <div className="space-y-4">
                 <div className="flex items-start justify-between bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                    <div>
                        <h4 className="font-medium text-gray-800 dark:text-white">Private Profile</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">If your profile is private, only subscribers you approve can see your content. (This is a simulated setting)</p>
                    </div>
                    <ToggleSwitch checked={isPrivate} onChange={handlePrivacyToggle} />
                </div>
                <div className="flex items-start justify-between bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                    <div>
                        <h4 className="font-medium text-gray-800 dark:text-white">Allow others to find me by my email address</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">Let people who have your email find your profile on TheFreed.</p>
                    </div>
                    <ToggleSwitch checked={allowFindByEmail} onChange={handleEmailFindToggle} />
                </div>
                 <div className="flex items-start justify-between bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                    <div>
                        <h4 className="font-medium text-gray-800 dark:text-white">Send Read Receipts</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">Allow others to see when you have read their messages. If disabled, you won't be able to see read receipts from others either.</p>
                    </div>
                    <ToggleSwitch checked={sendReadReceipts} onChange={handleReadReceiptsToggle} />
                </div>
            </div>

            <div className="space-y-4">
                 <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Two-Factor Authentication (2FA)</h3>
                 {!show2FA ? (
                     <div className="bg-white dark:bg-gray-900 p-4 rounded-lg flex items-center justify-between border border-gray-200 dark:border-gray-800">
                        <p className="text-gray-600 dark:text-gray-300">Add an extra layer of security to your account.</p>
                        <button onClick={() => setShow2FA(true)} className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold py-2 px-5 rounded-full transition-colors">
                            Enable 2FA
                        </button>
                     </div>
                 ) : (
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Set up 2FA</h4>
                        <p className="text-gray-500 dark:text-gray-400 mt-1 mb-4">1. Scan this QR code with your authenticator app (e.g., Google Authenticator).</p>
                        <div className="bg-white p-4 rounded-lg w-48 h-48 flex items-center justify-center mx-auto my-4">
                            <Icon name="qr-code" className="w-full h-full text-black"/>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 mt-4 mb-2">2. Enter the 6-digit code from your app to verify.</p>
                        <div className="flex items-center gap-4">
                             <input type="text" placeholder="123456" maxLength={6} className="w-48 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-center tracking-[0.2em]" />
                             <button onClick={() => { alert('2FA Enabled!'); setShow2FA(false); }} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-full transition-colors">
                                Verify & Enable
                             </button>
                        </div>
                    </div>
                 )}
            </div>
        </div>
    );
};