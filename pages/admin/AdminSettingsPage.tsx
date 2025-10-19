import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataProvider';
import { PlatformSettings, RankName, Category } from '../../types';
import { Icon } from '../../components/Icon';

const CategoryManager: React.FC = () => {
    const { getCategories, addCategory, editCategory, deleteCategory } = useData();
    const [categories, setCategories] = useState<Category[]>(getCategories());
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryParent, setNewCategoryParent] = useState<number | null>(null);

    useEffect(() => {
        setCategories(getCategories());
    }, [getCategories]);

    const handleAddCategory = () => {
        if (newCategoryName.trim()) {
            addCategory(newCategoryName.trim(), newCategoryParent);
            setNewCategoryName('');
            setNewCategoryParent(null);
        }
    };
    
    const handleStartEdit = (cat: Category) => {
        setEditingCategory(cat);
        setNewCategoryName(cat.name);
    }
    
    const handleUpdateCategory = () => {
        if(editingCategory && newCategoryName.trim()) {
            editCategory(editingCategory.id, newCategoryName.trim());
            setEditingCategory(null);
            setNewCategoryName('');
        }
    }

    const handleDeleteCategory = (catId: number) => {
        if (window.confirm('Are you sure you want to delete this category? This cannot be undone.')) {
            deleteCategory(catId);
        }
    };


    return (
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 space-y-4">
            <h2 className="text-2xl font-semibold text-white">Category Management</h2>
            <div className="max-h-72 overflow-y-auto pr-2 space-y-2">
                {categories.map(cat => (
                    <div key={cat.id}>
                        <div className="flex items-center justify-between bg-gray-800/50 p-2 rounded-md">
                            <span className="font-semibold text-white">{cat.name}</span>
                            <div>
                                <button onClick={() => handleStartEdit(cat)} className="p-1 text-gray-400 hover:text-indigo-400"><Icon name="pencil" className="w-4 h-4" /></button>
                                <button onClick={() => handleDeleteCategory(cat.id)} className="p-1 text-gray-400 hover:text-red-400"><Icon name="trash" className="w-4 h-4" /></button>
                            </div>
                        </div>
                        {cat.children.map(child => (
                             <div key={child.id} className="flex items-center justify-between ml-6 p-2 rounded-md">
                                <span className="text-gray-300">{child.name}</span>
                                <div>
                                    <button onClick={() => handleStartEdit(child)} className="p-1 text-gray-400 hover:text-indigo-400"><Icon name="pencil" className="w-4 h-4" /></button>
                                    <button onClick={() => handleDeleteCategory(child.id)} className="p-1 text-gray-400 hover:text-red-400"><Icon name="trash" className="w-4 h-4" /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <div className="pt-4 border-t border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-2">{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
                <div className="flex items-center gap-2">
                    <input type="text" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} placeholder="Category Name" className="flex-1 bg-gray-800 border border-gray-600 rounded-lg p-2 text-white" />
                    {!editingCategory && (
                        <select value={newCategoryParent || ''} onChange={e => setNewCategoryParent(e.target.value ? parseInt(e.target.value) : null)} className="bg-gray-800 border border-gray-600 rounded-lg p-2 text-white">
                            <option value="">As Main Category</option>
                            {categories.map(cat => <option key={cat.id} value={cat.id}>Sub-category of {cat.name}</option>)}
                        </select>
                    )}
                    <button onClick={editingCategory ? handleUpdateCategory : handleAddCategory} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full transition-colors">{editingCategory ? 'Update' : 'Add'}</button>
                    {editingCategory && <button onClick={() => {setEditingCategory(null); setNewCategoryName('');}} className="text-gray-400 text-sm">Cancel</button>}
                </div>
            </div>
        </div>
    );
};

export const AdminSettingsPage: React.FC = () => {
    const { platformSettings, updatePlatformSettings, creators } = useData();
    const [settings, setSettings] = useState<PlatformSettings>(platformSettings);
    const [hasChanges, setHasChanges] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [newFeaturedId, setNewFeaturedId] = useState('');

    useEffect(() => {
        setHasChanges(JSON.stringify(platformSettings) !== JSON.stringify(settings));
    }, [settings, platformSettings]);

    const handleCommissionChange = (rank: RankName, rate: string) => {
        const newRate = parseFloat(rate);
        if (!isNaN(newRate)) {
            setSettings(prev => ({
                ...prev,
                commissionRates: {
                    ...prev.commissionRates,
                    [rank]: newRate / 100, // Convert percentage to decimal
                }
            }));
        }
    };
    
    const handleAddFeaturedCreator = () => {
        const id = parseInt(newFeaturedId, 10);
        if (!isNaN(id) && !settings.featuredCreatorIds.includes(id)) {
            const creatorExists = creators.some(c => c.id === id);
            if (creatorExists) {
                setSettings(prev => ({
                    ...prev,
                    featuredCreatorIds: [...prev.featuredCreatorIds, id]
                }));
                setNewFeaturedId('');
            } else {
                alert(`Creator with ID ${id} not found.`);
            }
        }
    };

    const handleRemoveFeaturedCreator = (id: number) => {
        setSettings(prev => ({
            ...prev,
            featuredCreatorIds: prev.featuredCreatorIds.filter(creatorId => creatorId !== id)
        }));
    };

    const handleSaveChanges = async () => {
        setIsSaving(true);
        await updatePlatformSettings(settings);
        setIsSaving(false);
        setHasChanges(false);
        alert('Settings saved successfully!');
    };

    const featuredCreators = settings.featuredCreatorIds.map(id => 
        creators.find(c => c.id === id)
    ).filter((c): c is NonNullable<typeof c> => c !== undefined);

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-white flex items-center gap-3">
                    <Icon name="cog-6-tooth" className="w-9 h-9 text-indigo-400" />
                    Platform Settings
                </h1>
                 <button onClick={handleSaveChanges} disabled={!hasChanges || isSaving} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-full transition-colors disabled:opacity-50">
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Commission Rates & Featured */}
                <div className="space-y-8">
                    <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Commission Rates</h2>
                        <p className="text-gray-400 text-sm">Set the platform fee percentage for each creator rank.</p>
                        <div className="space-y-3">
                            {Object.entries(settings.commissionRates).map(([rank, rate]) => (
                                <div key={rank} className="flex items-center justify-between">
                                    <label htmlFor={`rate-${rank}`} className="font-semibold text-gray-300 capitalize">{rank.toLowerCase()}</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            id={`rate-${rank}`}
                                            value={(rate * 100).toFixed(1)}
                                            onChange={e => handleCommissionChange(rank as RankName, e.target.value)}
                                            className="w-24 bg-gray-800 border border-gray-600 rounded-lg p-2 pr-6 text-white text-right"
                                        />
                                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Featured Creators</h2>
                        <p className="text-gray-400 text-sm">Manage the list of creators featured on discovery pages.</p>
                        <div className="space-y-3">
                            {featuredCreators.map(creator => (
                                <div key={creator.id} className="flex items-center justify-between bg-gray-800/50 p-3 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <img src={creator.avatarUrl} alt={creator.username} className="w-8 h-8 rounded-full" />
                                        <span className="font-medium text-white">{creator.username} (ID: {creator.id})</span>
                                    </div>
                                    <button onClick={() => handleRemoveFeaturedCreator(creator.id)} className="text-red-400 hover:text-red-300 p-1"><Icon name="trash" className="w-5 h-5"/></button>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center gap-2 pt-4 border-t border-gray-700">
                            <input
                                type="text"
                                value={newFeaturedId}
                                onChange={e => setNewFeaturedId(e.target.value)}
                                placeholder="Enter Creator ID"
                                className="flex-1 bg-gray-800 border border-gray-600 rounded-lg p-2 text-white"
                            />
                            <button onClick={handleAddFeaturedCreator} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full transition-colors">Add</button>
                        </div>
                    </div>
                </div>

                {/* Category Management */}
                <CategoryManager />
            </div>
        </div>
    );
};