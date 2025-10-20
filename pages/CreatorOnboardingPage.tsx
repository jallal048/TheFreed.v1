import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataProvider';
import { Icon } from '../components/Icon';
import { AuthUser, Creator, Category, SocialLink } from '../types';
import { useLocale } from '../contexts/LocaleProvider';

const OnboardingStep: React.FC<{
  title: string; description: string; children: React.ReactNode; onNext?: () => void; onBack?: () => void; isLastStep: boolean; canProceed: boolean;
}> = ({ title, description, children, onNext, onBack, isLastStep, canProceed }) => {
  const { t } = useLocale();
  return (
    <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{title}</h2>
      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 mb-6">{description}</p>
      <div className="space-y-6">{children}</div>
      <div className={`flex ${onBack ? 'justify-between' : 'justify-end'} items-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-800`}>
        {onBack && (<button type="button" onClick={onBack} className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 font-bold py-2 px-6 rounded-full transition-colors">{t('onboarding.back')}</button>)}
        <button type={isLastStep ? 'submit' : 'button'} onClick={onNext} disabled={!canProceed} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-full transition-colors duration-300 disabled:bg-indigo-400 dark:disabled:bg-indigo-800 disabled:opacity-60 disabled:cursor-not-allowed">{isLastStep ? t('onboarding.continueToVerification') : t('onboarding.nextStep')}</button>
      </div>
    </div>
  );
};

const CreatorOnboardingPageComponent: React.FC = () => {
  const { submitOnboardingData, creatorOnboardingUser } = useAuth();
  const { getCategories } = useData();
  const { t } = useLocale();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{ displayName: string; bio: string; location: string; mainCategory: Category | null; subCategories: Category[]; socialLinks: SocialLink[]; monthlyPrice: number; personalInfo: { fullName: string; dateOfBirth: string; address: string; } }>({
    displayName: creatorOnboardingUser?.username || '',
    bio: '', location: '', mainCategory: null, subCategories: [], socialLinks: [], monthlyPrice: 4.99,
    personalInfo: { fullName: '', dateOfBirth: '', address: '' }
  });
  const allCategories = getCategories();
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, [name]: value } })); };
  const handleMainCategoryChange = (category: Category) => { const allSubCategories = allCategories.flatMap(c => c.children); setFormData(prev => ({ ...prev, mainCategory: category, subCategories: prev.subCategories.filter(sc => category.children.some(child => child.id === sc.id)) })); };
  const handleSubCategoryToggle = (subCategory: Category) => { setFormData(prev => { const isSelected = prev.subCategories.some(c => c.id === subCategory.id); let newSubCategories; if (isSelected) { newSubCategories = prev.subCategories.filter(c => c.id !== subCategory.id); } else { if (prev.subCategories.length < 3) { newSubCategories = [...prev.subCategories, subCategory]; } else { return prev; } } return { ...prev, subCategories: newSubCategories }; }); };
  const handleSocialLinkChange = (index: number, field: 'type' | 'url', value: string) => { const newLinks = [...formData.socialLinks]; (newLinks[index] as any)[field] = value; setFormData(prev => ({ ...prev, socialLinks: newLinks })); };
  const addSocialLink = () => { if (formData.socialLinks.length < 4) { setFormData(prev => ({ ...prev, socialLinks: [...prev.socialLinks, { type: 'website', url: '' }] })); } };
  const removeSocialLink = (index: number) => { setFormData(prev => ({ ...prev, socialLinks: prev.socialLinks.filter((_, i) => i !== index) })); };
  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); setLoading(true); const { personalInfo, ...creatorProfileData } = formData; await submitOnboardingData({ ...creatorProfileData, personalInfo }); };
  
  const renderStepContent = () => {
    switch (step) {
      case 1: return (<OnboardingStep title={t('onboarding.step1.title')} description={t('onboarding.step1.description')} onNext={() => setStep(2)} isLastStep={false} canProceed={!!formData.displayName.trim()}><div><label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('onboarding.step1.displayNameLabel')}</label><input type="text" name="displayName" id="displayName" value={formData.displayName} onChange={handleFormChange} required className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3" /></div><div><label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('onboarding.step1.bioLabel')}</label><textarea name="bio" id="bio" rows={3} value={formData.bio} onChange={handleFormChange} placeholder={t('onboarding.step1.bioPlaceholder')} className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3 resize-y" /></div><div><label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('onboarding.step1.locationLabel')}</label><input type="text" name="location" id="location" value={formData.location} onChange={handleFormChange} placeholder={t('onboarding.step1.locationPlaceholder')} className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3" /></div></OnboardingStep>);
      case 2: return (<OnboardingStep title={t('onboarding.step2.title')} description={t('onboarding.step2.description')} onNext={() => setStep(3)} onBack={() => setStep(1)} isLastStep={false} canProceed={!!formData.mainCategory}><div className="space-y-3 max-h-64 overflow-y-auto pr-2"><p className="font-semibold text-gray-800 dark:text-gray-200 mb-2">{t('onboarding.step2.mainCategoryPrompt')}</p>{allCategories.map(cat => (<label key={cat.id} className={`flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer ${cat.name === 'NSFW' ? 'font-bold text-red-500 dark:text-red-400' : ''}`}><input type="radio" name="main-category" checked={formData.mainCategory?.id === cat.id} onChange={() => handleMainCategoryChange(cat)} className="h-5 w-5 text-indigo-600 bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-indigo-500" /><span>{cat.name}</span></label>))}{formData.mainCategory && formData.mainCategory.children.length > 0 && (<div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"><p className="font-semibold text-gray-800 dark:text-gray-200 mb-2">{t('onboarding.step2.subCategoryPrompt')}</p><div className="space-y-2">{formData.mainCategory.children.map(child => (<label key={child.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"><input type="checkbox" checked={formData.subCategories.some(c => c.id === child.id)} onChange={() => handleSubCategoryToggle(child)} disabled={!formData.subCategories.some(c => c.id === child.id) && formData.subCategories.length >= 3} className="h-5 w-5 rounded text-indigo-600 bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-indigo-500 disabled:opacity-50" /><span className="text-gray-700 dark:text-gray-300">{child.name}</span></label>))}</div></div>)}</div></OnboardingStep>);
      case 3: return (<OnboardingStep title={t('onboarding.step3.title')} description={t('onboarding.step3.description')} onNext={() => setStep(4)} onBack={() => setStep(2)} isLastStep={false} canProceed={true}><div className="space-y-4">{formData.socialLinks.map((link, index) => (<div key={index} className="flex items-center gap-2"><select value={link.type} onChange={(e) => handleSocialLinkChange(index, 'type', e.target.value)} className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3"><option value="website">Website</option><option value="twitter">Twitter</option><option value="instagram">Instagram</option><option value="youtube">YouTube</option></select><input type="url" placeholder="https://..." value={link.url} onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)} className="flex-1 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3" /><button type="button" onClick={() => removeSocialLink(index)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-500/10 rounded-full"><Icon name="trash" className="w-5 h-5"/></button></div>))}{formData.socialLinks.length < 4 && (<button type="button" onClick={addSocialLink} className="w-full text-indigo-600 dark:text-indigo-400 font-semibold border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg py-2 hover:border-indigo-500 dark:hover:border-indigo-400">{t('onboarding.step3.addLink')}</button>)}</div></OnboardingStep>);
      case 4: return (<OnboardingStep title={t('onboarding.step4.title')} description={t('onboarding.step4.description')} onNext={() => setStep(5)} onBack={() => setStep(3)} isLastStep={false} canProceed={formData.monthlyPrice >= 0}><div><label htmlFor="monthlyPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('onboarding.step4.priceLabel')}</label><div className="relative mt-1 max-w-xs"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><span className="text-gray-500">$</span></div><input type="number" name="monthlyPrice" id="monthlyPrice" value={formData.monthlyPrice} onChange={e => setFormData(prev => ({...prev, monthlyPrice: parseFloat(e.target.value) || 0}))} min="0" step="0.01" className="pl-7 w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3" /></div></div></OnboardingStep>);
      case 5: return (<OnboardingStep title={t('onboarding.step5.title')} description={t('onboarding.step5.description')} onBack={() => setStep(4)} isLastStep={true} canProceed={!!formData.personalInfo.fullName.trim() && !!formData.personalInfo.dateOfBirth.trim() && !!formData.personalInfo.address.trim()}><div><label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('onboarding.step5.fullNameLabel')}</label><input type="text" name="fullName" id="fullName" value={formData.personalInfo.fullName} onChange={handlePersonalInfoChange} required className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3" /></div><div><label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('onboarding.step5.dobLabel')}</label><input type="date" name="dateOfBirth" id="dateOfBirth" value={formData.personalInfo.dateOfBirth} onChange={handlePersonalInfoChange} required className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3" /></div><div><label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('onboarding.step5.addressLabel')}</label><textarea name="address" id="address" rows={3} value={formData.personalInfo.address} onChange={handlePersonalInfoChange} required className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3 resize-y" /></div></OnboardingStep>);
      default: return null;
    }
  }
  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, [name]: value } })); };
  const handleMainCategoryChange = (category: Category) => { const allSubCategories = allCategories.flatMap(c => c.children); setFormData(prev => ({ ...prev, mainCategory: category, subCategories: prev.subCategories.filter(sc => category.children.some(child => child.id === sc.id)) })); };
  const handleSubCategoryToggle = (subCategory: Category) => { setFormData(prev => { const isSelected = prev.subCategories.some(c => c.id === subCategory.id); let newSubCategories; if (isSelected) { newSubCategories = prev.subCategories.filter(c => c.id !== subCategory.id); } else { if (prev.subCategories.length < 3) { newSubCategories = [...prev.subCategories, subCategory]; } else { return prev; } } return { ...prev, subCategories: newSubCategories }; }); };
  const handleSocialLinkChange = (index: number, field: 'type' | 'url', value: string) => { const newLinks = [...formData.socialLinks]; (newLinks[index] as any)[field] = value; setFormData(prev => ({ ...prev, socialLinks: newLinks })); };
  const addSocialLink = () => { if (formData.socialLinks.length < 4) { setFormData(prev => ({ ...prev, socialLinks: [...prev.socialLinks, { type: 'website', url: '' }] })); } };
  const removeSocialLink = (index: number) => { setFormData(prev => ({ ...prev, socialLinks: prev.socialLinks.filter((_, i) => i !== index) })); };
  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); setLoading(true); const { personalInfo, ...creatorProfileData } = formData; await submitOnboardingData({ ...creatorProfileData, personalInfo }); };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <Icon name="logo" className="h-12 w-12 text-indigo-500 dark:text-indigo-400 mx-auto" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mt-2">{t('onboarding.welcome', { username: creatorOnboardingUser?.username || 'Creator' })}</h1>
          <p className="text-gray-600 dark:text-gray-400">{t('onboarding.subtitle')}</p>
        </div>
        <form onSubmit={handleSubmit}>{renderStepContent()}</form>
      </div>
    </div>
  );
};

export default CreatorOnboardingPageComponent;
