import React from 'react';
import { useLocale } from '../contexts/LocaleProvider';

const SchedulePageComponent: React.FC = () => {
  const { t } = useLocale();
  return <div className="p-6"><h1 className="text-2xl font-bold">{t('schedule.title')||'Schedule'}</h1></div>;
};
export default SchedulePageComponent;
