import React from 'react';
import { useLocale } from '../contexts/LocaleProvider';

const HashtagPageComponent: React.FC = () => {
  const { t } = useLocale();
  return <div className="p-6"><h1 className="text-2xl font-bold">{t('hashtag.title')||'Hashtag'}</h1></div>;
};
export default HashtagPageComponent;
