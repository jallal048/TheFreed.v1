import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Icon } from './Icon';
import { UserRole } from '../types';
import { useLocale } from '../contexts/LocaleProvider';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authModalView, setAuthModalView, login, register, authModalInitialRole } = useAuth();
  const { t } = useLocale();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.Fan);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const titleId = 'auth-modal-title';

  useEffect(() => {
    if (isAuthModalOpen) {
      const timer = setTimeout(() => setVisible(true), 10);
      modalRef.current?.focus();
      setRole(authModalInitialRole);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [isAuthModalOpen, authModalInitialRole]);
  
  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
        closeAuthModal();
        setEmail(''); setPassword(''); setUsername(''); setRole(UserRole.Fan); setError(null); setLoading(false);
    }, 300);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (authModalView === 'login') await login(email, password);
      else await register({email, password, username, role});
      handleClose();
    } catch(err: any) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
  }

  if (!isAuthModalOpen) return null;

  return (
    <div className={`fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`} onClick={handleClose}>
      <div 
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-md relative outline-none transition-all duration-300 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} 
        onClick={e => e.stopPropagation()}
      >
        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-white"><Icon name="close" className="w-6 h-6" /></button>
        <div className="p-8">
            <div className="flex border-b border-gray-200 dark:border-gray-800 mb-6">
                <button onClick={() => setAuthModalView('login')} className={`px-4 py-3 font-semibold ${authModalView === 'login' ? 'text-indigo-600 dark:text-white border-b-2 border-indigo-500' : 'text-gray-500'}`}>{t('auth.login')}</button>
                <button onClick={() => setAuthModalView('signup')} className={`px-4 py-3 font-semibold ${authModalView === 'signup' ? 'text-indigo-600 dark:text-white border-b-2 border-indigo-500' : 'text-gray-500'}`}>{t('auth.signup')}</button>
            </div>
            <h2 id={titleId} className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{authModalView === 'login' ? t('auth.welcomeBack') : t('auth.join')}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{authModalView === 'login' ? t('auth.loginToContinue') : t('auth.createAccountJourney')}</p>
            <form onSubmit={handleAuth} className="space-y-4">
                {authModalView === 'signup' && <input type="text" placeholder={t('auth.username')} value={username} onChange={e => setUsername(e.target.value)} required className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3" />}
                <input type="email" placeholder={t('auth.email')} value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3" />
                <input type="password" placeholder={t('auth.password')} value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3" />
                {authModalView === 'signup' && (
                  <div>
                    <p className="text-gray-700 dark:text-gray-300 mb-2">{t('auth.iAmA')}</p>
                    <div className="grid grid-cols-2 gap-3">
                      <button type="button" onClick={() => setRole(UserRole.Fan)} className={`p-3 text-center rounded-lg border-2 transition-colors ${role === UserRole.Fan ? 'bg-indigo-50 dark:bg-indigo-600/20 border-indigo-500 text-indigo-700 dark:text-white' : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700'}`}>{t('auth.fan')}</button>
                      <button type="button" onClick={() => setRole(UserRole.Creator)} className={`p-3 text-center rounded-lg border-2 transition-colors ${role === UserRole.Creator ? 'bg-indigo-50 dark:bg-indigo-600/20 border-indigo-500 text-indigo-700 dark:text-white' : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700'}`}>{t('auth.creator')}</button>
                    </div>
                  </div>
                )}
                {error && <p className="text-red-500 dark:text-red-400 text-sm text-center">{error}</p>}
                <button type="submit" disabled={loading} className="w-full mt-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 disabled:bg-indigo-400 dark:disabled:bg-indigo-800 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                 {loading ? (<><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>{t('auth.processing')}</>) : (authModalView === 'login' ? t('auth.login') : t('auth.createAccount'))}
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};