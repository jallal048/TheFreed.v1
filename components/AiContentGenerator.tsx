
import React, { useState } from 'react';
import { generateContentIdeas } from '../services/geminiService';
import { ContentIdea } from '../types';
import { Icon } from './Icon';
import { useLocale } from '../contexts/LocaleProvider';

export const AiContentGenerator: React.FC = () => {
  const [topic, setTopic] = useState<string>('');
  const [ideas, setIdeas] = useState<ContentIdea[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLocale();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError(t('aiGenerator.errorTopic'));
      return;
    }
    setLoading(true);
    setError(null);
    setIdeas([]);
    try {
      const result = await generateContentIdeas(topic);
      // Add a filter to ensure data integrity before setting state
      const validIdeas = result.filter(idea => idea && idea.title && idea.type && idea.description);
      setIdeas(validIdeas);
    } catch (err) {
      setError(t('aiGenerator.errorFailed'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const IdeaTypeIcon = ({ type }: { type: 'Text' | 'Photo' | 'Video' }) => {
    const style = "w-4 h-4 mr-2 inline-block";
    switch(type) {
        case 'Text': return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={style}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>;
        case 'Photo': return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={style}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 017.5 0z" /></svg>;
        case 'Video': return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={style}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" /></svg>;
        default: return null;
    }
  }

  return (
    <div>
      <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
        <Icon name="sparkles" className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
        {t('aiGenerator.title')}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 mb-4">{t('aiGenerator.description')}</p>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., 'autumn vibes', 'sci-fi concept art'"
          className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
        />
        <button 
          type="submit" 
          disabled={loading}
          className="w-full mt-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 disabled:bg-indigo-400 dark:disabled:bg-indigo-800 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('aiGenerator.generating')}
            </>
          ) : t('aiGenerator.generate')}
        </button>
      </form>

      {error && <p className="text-red-500 dark:text-red-400 mt-4">{error}</p>}
      
      <div className="mt-6 space-y-4">
        {ideas.map((idea, index) => (
          <div key={index} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-bold text-gray-900 dark:text-white flex items-center">
                {idea.type && <IdeaTypeIcon type={idea.type} />}
                {idea.title}
            </h4>
            <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm">{idea.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};