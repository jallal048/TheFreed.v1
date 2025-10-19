
import React, { useState, useEffect } from 'react';
import { Creator, Category, SocialLink } from '../../types';
import { Icon } from '../Icon';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataProvider';
import { ImageUpload } from '../ImageUpload';
import { useLocale } from '../../contexts/LocaleProvider';

const CategorySelector: React.FC<{
    mainCategory: Category | null;
    subCategories: Category[];
    onMainChange: (category: Category) => void;
    onSubToggle: (category: Category) => void;
}> = ({ mainCategory, subCategories, onMainChange, onSubToggle }) => {
    const { getCategories } = useData();
    const allCategories = getCategories();
    const { t } = useLocale();

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('creatorProfile.categories')}</label>
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 max-h-80 overflow-y-auto">
                <p className="font-semibold text-gray-800 dark:text-gray-200 mb-2">{t('onboarding.step2.mainCategoryPrompt')}</p>
                <div className="space-y-3">
                    {allCategories.map(cat => (
                         <label key={cat.id} className={`flex items-center gap-3 cursor-pointer p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700/50 ${cat.name === 'NSFW' ? 'font-bold text-red-500 dark:text-red-400' : ''}`}>
                            <input type="radio" name="main-category" checked={mainCategory?.id === cat.id} onChange={() => onMainChange(cat)} className="h-5 w-5 text-indigo-600 bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-indigo-500" />
                            <span>{cat.name}</span>
                        </label>
                    ))}
                </div>
                {mainCategory && mainCategory.children.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                         <p className="font-semibold text-gray-800 dark:text-gray-200 mb-2">{t('onboarding.step2.subCategoryPrompt')}</p>
                         <div className="space-y-2">
                             {mainCategory.children.map(child => (
                                <label key={child.id} className="flex items-center gap-3 cursor-pointer p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700/50">
                                    <input type="checkbox" checked={subCategories.some(c => c.id === child.id)} onChange={() => onSubToggle(child)} disabled={!subCategories.some(c => c.id === child.id) && subCategories.length >= 3} className="h-5 w-5 rounded text-indigo-600 bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-indigo-500 disabled:opacity-50" />
                                    <span className="text-gray-700 dark:text-gray-300">{child.name}</span>
                                </label>
                            ))}
                         </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const SocialLinksManager: React.FC<{
    links: SocialLink[];
    onChange: (index: number, field: 'type' | 'url', value: string) => void;
    onAdd: () => void;
    onRemove: (index: number) => void;
}> = ({ links, onChange, onAdd, onRemove }) => {
    const { t } = useLocale();
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('creatorProfile.socialLinks')}</label>
            <div className="space-y-3">
                {links.map((link, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <select value={link.type} onChange={(e) => onChange(index, 'type', e.target.value)} className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-3">
                            <option value="website">Website</option>
                            <option value="twitter">Twitter</option>
                            <option value="instagram">Instagram</option>
                            <option value="youtube">YouTube</option>
                        </select>
                        <input type="url" placeholder="https://..." value={link.url} onChange={(e) => onChange(index, 'url', e.target.value)} className="flex-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-3" />
                        <button type="button" onClick={() => onRemove(index)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-500/10 rounded-full"><Icon name="trash" className="w-5 h-5"/></button>
                    </div>
                ))}
                {links.length < 4 && (
                    <button type="button" onClick={onAdd} className="w-full text-indigo-600 dark:text-indigo-400 font-semibold border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg py-2 hover:border-indigo-500 dark:hover:border-indigo-400">{t('onboarding.step3.addLink')}</button>
                )}
            </div>
        </div>
    )
}

export const SettingsProfile: React.FC = () => {
  const { currentUser } = useAuth();
  const { updateCreatorProfile, creators, getCategories } = useData();
  const { t } = useLocale();
  const creatorData = creators.find(c => c.id === currentUser?.creatorId);
  const allCategories = getCategories();
  
  const [formData, setFormData] = useState<Partial<Creator>>(creatorData || {});
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (creatorData) {
        setFormData(creatorData);
    }
  }, [creatorData]);

  useEffect(() => {
    setHasChanges(JSON.stringify(creatorData) !== JSON.stringify(formData));
  }, [formData, creatorData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (name: 'avatarUrl' | 'bannerUrl', dataUrl: string) => {
    setFormData(prev => ({ ...prev, [name]: dataUrl }));
  };
  
  const handleMainCategoryChange = (category: Category) => {
    setFormData(prev => ({
      ...prev,
      mainCategory: category,
      // Filter sub-categories to only keep ones that belong to the new main category.
      subCategories: (prev.subCategories || []).filter(sc => category.children.some(child => child.id === sc.id)),
    }));
  };

  const handleSubCategoryToggle = (subCategory: Category) => {
    setFormData(prev => {
        const subCategories = prev.subCategories || [];
        const isSelected = subCategories.some(c => c.id === subCategory.id);
        let newSubCategories;
        if (isSelected) {
            newSubCategories = subCategories.filter(c => c.id !== subCategory.id);
        } else {
            if (subCategories.length < 3) {
                newSubCategories = [...subCategories, subCategory];
            } else {
                return prev; // Max 3 reached
            }
        }
        return { ...prev, subCategories: newSubCategories };
    });
  };

  const handleSocialLinkChange = (index: number, field: 'type' | 'url', value: string) => {
    const newLinks = [...(formData.socialLinks || [])];
    (newLinks[index] as any)[field] = value;
    setFormData(prev => ({ ...prev, socialLinks: newLinks }));
  };
  
  const addSocialLink = () => {
    const links = formData.socialLinks || [];
    if (links.length < 4) {
        setFormData(prev => ({ ...prev, socialLinks: [...links, { type: 'website', url: '' }] }));
    }
  };
  
  const removeSocialLink = (index: number) => {
    setFormData(prev => ({ ...prev, socialLinks: prev.socialLinks?.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.creatorId) return;
    setIsSaving(true);
    await updateCreatorProfile(currentUser.creatorId, formData);
    setIsSaving(false);
    setHasChanges(false);
    alert('Profile updated successfully!');
  };
  
  if (!creatorData) {
      return <div>You are not a creator.</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 p-8 rounded-2xl space-y-8 border border-gray-200 dark:border-gray-800">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{t('settings.profile.title')}</h2>
      
        <div className="space-y-4">
            <ImageUpload 
                label={t('settings.profile.avatar')}
                currentImage={formData.avatarUrl || ''}
                onImageSelect={(dataUrl) => handleImageChange('avatarUrl', dataUrl)}
                aspectRatio="aspect-square"
                isAvatar
            />
            <ImageUpload 
                label={t('settings.profile.banner')}
                currentImage={formData.bannerUrl || ''}
                onImageSelect={(dataUrl) => handleImageChange('bannerUrl', dataUrl)}
                aspectRatio="aspect-[3/1]"
            />
        </div>

        <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('settings.profile.displayName')}</label>
            <input type="text" name="displayName" id="displayName" value={formData.displayName || ''} onChange={handleChange} required className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-gray-900 dark:text-white" />
        </div>
        
        <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('settings.profile.location')}</label>
            <input type="text" name="location" id="location" value={formData.location || ''} onChange={handleChange} placeholder="e.g. New York, USA" className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-gray-900 dark:text-white" />
        </div>

        <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('settings.profile.bio')}</label>
            <textarea name="bio" id="bio" rows={4} value={formData.bio || ''} onChange={handleChange} className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-gray-900 dark:text-white resize-y" />
        </div>
        
        <CategorySelector 
          mainCategory={formData.mainCategory || null} 
          subCategories={formData.subCategories || []} 
          onMainChange={handleMainCategoryChange} 
          onSubToggle={handleSubCategoryToggle} 
        />
        
        <SocialLinksManager links={formData.socialLinks || []} onChange={handleSocialLinkChange} onAdd={addSocialLink} onRemove={removeSocialLink} />

        <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-800">
             <button type="submit" disabled={isSaving || !hasChanges} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-full transition-colors duration-300 disabled:bg-indigo-400 dark:disabled:bg-indigo-800 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {isSaving ? (<><svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>{t('common.saving')}</>) : hasChanges ? t('common.saveChanges') : t('common.saved')}
            </button>
        </div>
    </form>
  );
};