import React from 'react';
import { useLocale } from '../contexts/LocaleProvider';

const SettingsPageComponent: React.FC = () => {
  const { t } = useLocale();
  return <div className="p-6"><h1 className="text-2xl font-bold">{t('settings.title')||'Settings'}</h1></div>;
};
export default SettingsPageComponent;
