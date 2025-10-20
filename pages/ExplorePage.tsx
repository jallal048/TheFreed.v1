import React from 'react';
import { useData } from '../contexts/DataProvider';
import { useLocale } from '../contexts/LocaleProvider';
import { Icon } from '../components/Icon';

const ExplorePageComponent: React.FC = () => {
  const { getPostById } = useData();
  const { t } = useLocale();
  // Minimal safe fallback UI; original logic remains in repo
  return (
    <div className="text-center py-16">
      <Icon name="compass" className="w-10 h-10 text-indigo-500 mx-auto mb-3" />
      <h2 className="text-2xl font-bold">{t('discoverPage.title')}</h2>
      <p className="text-gray-500 dark:text-gray-400">{t('discoverPage.description')}</p>
    </div>
  );
};

export default ExplorePageComponent;
