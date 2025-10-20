import React from 'react';
import { useLocale } from '../contexts/LocaleProvider';

const FanListsPageComponent: React.FC = () => {
  const { t } = useLocale();
  return <div className="p-6"><h1 className="text-2xl font-bold">{t('fanLists.title')||'Fan Lists'}</h1></div>;
};
export default FanListsPageComponent;
