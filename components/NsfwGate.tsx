import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '../contexts/NavigationProvider';
import { useLocale } from '../contexts/LocaleProvider';
import { Icon } from './Icon';

interface NsfwGateProps {
  isNsfwContent: boolean;
  children: React.ReactNode;
}

export const NsfwGate: React.FC<NsfwGateProps> = ({ isNsfwContent, children }) => {
  const { currentUser, startFanAgeVerification } = useAuth();
  const { onGoToDiscover } = useNavigation();
  const { t } = useLocale();

  const isBlocked = isNsfwContent && !currentUser?.showSensitiveContent;

  if (!isBlocked) {
    return <>{children}</>;
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
      <Icon name="ban" className="w-16 h-16 text-red-500 mb-4" />
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{t('nsfwGate.title')}</h2>
      <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-md mx-auto">{t('nsfwGate.description')}</p>
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <button
          onClick={onGoToDiscover}
          className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 font-bold py-3 px-6 rounded-full transition-colors"
        >
          {t('nsfwGate.goBackButton')}
        </button>
        <button
          onClick={startFanAgeVerification}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-full transition-colors"
        >
          {t('nsfwGate.verifyButton')}
        </button>
      </div>
    </div>
  );
};
