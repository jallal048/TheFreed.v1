import React from 'react';
import { useLocale } from '../contexts/LocaleProvider';

const SearchPageComponent: React.FC = () => {
  const { t } = useLocale();
  return <div className="p-6"><h1 className="text-2xl font-bold">{t('search.title')||'Search'}</h1></div>;
};
export default SearchPageComponent;
