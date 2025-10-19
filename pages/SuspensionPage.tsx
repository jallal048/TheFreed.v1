
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '../contexts/NavigationProvider';
import { Icon } from '../components/Icon';

export const SuspensionPage: React.FC = () => {
    const { currentUser, logout } = useAuth();
    const { onGoToHome, onGoToSupport } = useNavigation();

    if (!currentUser || !currentUser.suspendedUntil) {
        return null;
    }

    const suspensionEndDate = new Date(currentUser.suspendedUntil);
    const isPermanent = suspensionEndDate.getFullYear() > 9000;

    const handleGoHome = () => {
        logout();
        onGoToHome();
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-4 text-center">
            <div className="max-w-md w-full">
                <Icon name="ban" className="w-20 h-20 text-red-500 mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {isPermanent ? 'Account Banned' : 'Account Suspended'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-4">
                    Your account has been {isPermanent ? 'permanently banned' : 'temporarily suspended'} for violating our terms and conditions.
                </p>
                {!isPermanent && (
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        You will be able to access your account again on <strong className="text-gray-800 dark:text-white">{suspensionEndDate.toLocaleString()}</strong>.
                    </p>
                )}
                <p className="text-gray-500 dark:text-gray-500 mt-6 text-sm">
                    If you believe this is a mistake, please contact our support team.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                    <button
                        onClick={handleGoHome}
                        className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold py-3 px-6 rounded-full transition-colors"
                    >
                        Go Back Home
                    </button>
                    <button
                        onClick={onGoToSupport}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-full transition-colors"
                    >
                        Contact Support
                    </button>
                </div>
            </div>
        </div>
    );
};
