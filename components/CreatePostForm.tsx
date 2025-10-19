
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataProvider';
import { useModals } from '../contexts/ModalProvider';
import { Icon } from './Icon';
import { Media } from '../types';
import { applyWatermark } from '../services/geminiService';
import { ToggleSwitch } from './ToggleSwitch';
import { useLocale } from '../contexts/LocaleProvider';

export const CreatePostModal: React.FC = () => {
    const { currentUser } = useAuth();
    const { createPost, getFanListsForCreator, creators } = useData();
    const { isCreatePostModalOpen, closeCreatePostModal } = useModals();
    const { t } = useLocale();

    const [text, setText] = useState('');
    const [mediaFiles, setMediaFiles] = useState<Media[]>([]);
    const [visibility, setVisibility] = useState('subscribers');
    const [selectedLists, setSelectedLists] = useState<number[]>([]);
    const [showListSelector, setShowListSelector] = useState(false);
    const [isScheduling, setIsScheduling] = useState(false);
    const [scheduledAt, setScheduledAt] = useState('');
    const [isNsfw, setIsNsfw] = useState(false);
    
    // Monetization states
    const [monetizationType, setMonetizationType] = useState<'none' | 'ppv' | 'goal'>('none');
    const [ppvPrice, setPpvPrice] = useState('');
    const [goalAmount, setGoalAmount] = useState('');


    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const resetForm = () => {
        setText('');
        setMediaFiles([]);
        setVisibility('subscribers');
        setSelectedLists([]);
        setShowListSelector(false);
        setIsScheduling(false);
        setScheduledAt('');
        setIsNsfw(false);
        setMonetizationType('none');
        setPpvPrice('');
        setGoalAmount('');
    };

    useEffect(() => {
        if (!isCreatePostModalOpen) setTimeout(resetForm, 300);
    }, [isCreatePostModalOpen]);

    if (!isCreatePostModalOpen || !currentUser || currentUser.role !== 'CREATOR') return null;
    
    const fanLists = getFanListsForCreator(currentUser.creatorId!);
    const creator = creators.find(c => c.id === currentUser.creatorId);
    const hasSubscriptionPrice = creator && creator.monthlyPrice > 0;

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || !currentUser) return;

        const newMediaPromises = Array.from(files).map(file => {
            return new Promise<Media | null>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = async () => {
                    const dataUrl = reader.result as string;
                    if (file.type.startsWith('image/')) {
                        try {
                            const watermarkedUrl = await applyWatermark(dataUrl, `TheFreed/@${currentUser.username}`);
                            resolve({ type: 'image', url: watermarkedUrl });
                        } catch (e) { resolve({ type: 'image', url: dataUrl }); }
                    } else if (file.type.startsWith('video/')) {
                        resolve({ type: 'video', url: dataUrl });
                    } else { resolve(null); }
                };
                reader.readAsDataURL(file);
            });
        });
        const validMedia = (await Promise.all(newMediaPromises)).filter((m): m is Media => m !== null);
        setMediaFiles(prev => [...prev, ...validMedia]);
    };
    
    const removeMedia = (index: number) => setMediaFiles(prev => prev.filter((_, i) => i !== index));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isPostDisabled) return;
        
        createPost({ 
            text, 
            media: mediaFiles, 
            visibility, 
            visibleToLists: visibility === 'lists' ? selectedLists : [], 
            scheduledAt: isScheduling && scheduledAt ? new Date(scheduledAt).toISOString() : undefined,
            isNsfw,
            ppvPrice: monetizationType === 'ppv' && ppvPrice ? parseFloat(ppvPrice) : undefined,
            goalAmount: monetizationType === 'goal' && goalAmount ? parseFloat(goalAmount) : undefined,
        });
        closeCreatePostModal();
    };
    
    const getVisibilityText = () => {
        if (visibility === 'public') return 'Visible to Everyone';
        if (visibility === 'subscribers') return 'Subscribers Only';
        if (selectedLists.length === 0) return 'Select specific lists';
        return `Visible to ${selectedLists.length} list${selectedLists.length > 1 ? 's' : ''}`;
    }
    
    const isMonetizationInvalid =
        (monetizationType === 'ppv' && (!ppvPrice || parseFloat(ppvPrice) <= 0)) ||
        (monetizationType === 'goal' && (!goalAmount || parseInt(goalAmount) <= 0));

    const isPostDisabled = (!text.trim() && mediaFiles.length === 0) || (isScheduling && !scheduledAt) || isMonetizationInvalid;
    
    const handleMonetizationToggle = (type: 'ppv' | 'goal') => {
        setMonetizationType(prev => (prev === type ? 'none' : type));
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={closeCreatePostModal}>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-2xl relative flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create New Post</h2>
                    <button onClick={closeCreatePostModal} className="text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-white"><Icon name="close" className="w-6 h-6" /></button>
                </div>
                 <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
                    <div className="p-6 overflow-y-auto flex-1">
                        <div className="flex items-start gap-4">
                            <img src={currentUser.avatarUrl} alt="Your Avatar" className="w-12 h-12 rounded-full"/>
                            <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="What's on your mind?" rows={4} className="w-full bg-transparent border-none rounded-lg p-0 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-0 outline-none resize-none" />
                        </div>
                        
                        {mediaFiles.length > 0 && (
                            <div className="mt-4 pl-16 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                                {mediaFiles.map((media, index) => (
                                    <div key={index} className="relative aspect-square">
                                        <img src={media.url} alt={`Preview ${index}`} className="w-full h-full object-cover rounded-md" />
                                        <button type="button" onClick={() => removeMedia(index)} className="absolute -top-1 -right-1 bg-gray-900/70 rounded-full p-0.5 text-white hover:bg-red-500"><Icon name="close" className="w-4 h-4" /></button>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        <div className="pl-16 mt-6 border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Settings</h3>
                            <label className="flex items-center justify-between cursor-pointer">
                                <span>
                                    <strong className="text-gray-800 dark:text-gray-200">18+ Content (NSFW)</strong>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Mark this post as containing sensitive content.</p>
                                </span>
                                <ToggleSwitch checked={isNsfw} onChange={() => setIsNsfw(!isNsfw)} />
                            </label>
                            
                            {isScheduling && (
                                <div>
                                    <label htmlFor="schedule-time" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Time to send</label>
                                    <input id="schedule-time" type="datetime-local" value={scheduledAt} onChange={e => setScheduledAt(e.target.value)} className="w-full max-w-xs bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-2 text-gray-900 dark:text-white" />
                                </div>
                            )}

                            {monetizationType === 'ppv' && (
                                <div>
                                    <label htmlFor="ppv-price" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">{t('createPost.setPriceLabel')}</label>
                                    <div className="relative max-w-xs"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><span className="text-gray-500">$</span></div><input id="ppv-price" type="number" value={ppvPrice} onChange={e => setPpvPrice(e.target.value)} min="1" step="0.01" placeholder="e.g. 9.99" className="pl-7 w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-2" /></div>
                                </div>
                            )}
                             {monetizationType === 'goal' && (
                                <div>
                                    <label htmlFor="goal-amount" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">{t('createPost.fundraisingGoalLabel')}</label>
                                    <div className="relative max-w-xs"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><span className="text-gray-500">$</span></div><input id="goal-amount" type="number" value={goalAmount} onChange={e => setGoalAmount(e.target.value)} min="1" step="1" placeholder="e.g. 500" className="pl-7 w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-2" /></div>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Toolbar */}
                    <div className="flex justify-between items-center mt-auto p-4 border-t border-gray-200 dark:border-gray-800 flex-shrink-0">
                        <div className="flex items-center gap-1">
                            <input type="file" multiple accept="image/*,video/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                            <button type="button" onClick={() => fileInputRef.current?.click()} title="Add Media" className="text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 p-2 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-500/10 transition-colors"><Icon name="image" /></button>
                            <button type="button" onClick={() => setIsScheduling(!isScheduling)} title="Schedule Post" className={`p-2 rounded-full transition-colors ${isScheduling ? 'text-indigo-500 bg-indigo-100 dark:bg-indigo-500/20' : 'text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/10'}`}>
                                <Icon name="calendar-days" />
                            </button>
                             <div className="relative" title={hasSubscriptionPrice ? t('createPost.ppvDisabledTooltip') : t('createPost.setPriceTooltip')}>
                                <button type="button" onClick={() => handleMonetizationToggle('ppv')} disabled={hasSubscriptionPrice} className={`p-2 rounded-full transition-colors ${monetizationType === 'ppv' ? 'text-green-500 bg-green-100 dark:bg-green-500/20' : 'text-gray-500 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 hover:bg-green-100 dark:hover:bg-green-500/10'} disabled:opacity-50 disabled:cursor-not-allowed`}>
                                    <Icon name="dollar" />
                                </button>
                            </div>
                             <button type="button" onClick={() => handleMonetizationToggle('goal')} title={t('createPost.setGoalTooltip')} className={`p-2 rounded-full transition-colors ${monetizationType === 'goal' ? 'text-purple-500 bg-purple-100 dark:bg-purple-500/20' : 'text-gray-500 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-500/10'}`}>
                                <Icon name="trophy" />
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                             <div className="relative">
                                <button type="button" onClick={() => setShowListSelector(!showListSelector)} className="text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2">
                                    <Icon name={visibility === 'public' ? 'globe-alt' : 'lock'} className="w-4 h-4" />
                                    {getVisibilityText()}
                                </button>
                                {showListSelector && (
                                    <div className="absolute bottom-full right-0 mb-2 w-64 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-10 p-2 text-gray-900 dark:text-white">
                                        <div className="space-y-1">
                                            <button type="button" onClick={() => {setVisibility('public'); setShowListSelector(false);}} className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">Public</button>
                                            <button type="button" onClick={() => {setVisibility('subscribers'); setShowListSelector(false);}} className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">Subscribers Only</button>
                                            {fanLists.length > 0 && <button type="button" onClick={() => setVisibility('lists')} className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">Specific Lists</button>}
                                        </div>
                                        {visibility === 'lists' && fanLists.length > 0 && (<div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2 space-y-1">{fanLists.map(list => (<label key={list.id} className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"><input type="checkbox" checked={selectedLists.includes(list.id)} onChange={() => setSelectedLists(p => p.includes(list.id) ? p.filter(id => id !== list.id) : [...p, list.id])} className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500" />{list.name}</label>))}</div>)}
                                    </div>
                                )}
                            </div>
                            <button type="submit" disabled={isPostDisabled} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-full transition-colors disabled:bg-indigo-400 dark:disabled:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed">{isScheduling ? 'Schedule Post' : 'Post'}</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};
