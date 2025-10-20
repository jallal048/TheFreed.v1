import React from 'react';
import { useLocale } from '../contexts/LocaleProvider';

const BookmarksPageComponent: React.FC = () => {
  const { t } = useLocale();
  return <div className="p-6"><h1 className="text-2xl font-bold">{t('bookmarks.title')||'Bookmarks'}</h1></div>;
};
export default BookmarksPageComponent;
