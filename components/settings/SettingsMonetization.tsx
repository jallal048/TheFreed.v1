import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataProvider';
import { SubscriptionPackage, FreeTrialLink } from '../../types';
import { Icon } from '../Icon';

const PackageForm: React.FC<{
    pkg?: SubscriptionPackage;
    monthlyPrice: number;
    onSave: (pkgData: SubscriptionPackage) => void;
    onCancel: () => void;
}> = ({ pkg, monthlyPrice, onSave, onCancel }) => {
    const [months, setMonths] = useState(pkg?.months || 3);
    const [price, setPrice] = useState(pkg?.price || 0);

    const handleSave = () => {
        onSave({ months, price });
    };

    const savings = monthlyPrice > 0 && price > 0 && months > 1
        ? Math.round(((monthlyPrice * months - price) / (monthlyPrice * months)) * 100)
        : 0;

    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700/50 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{pkg ? 'Edit Package' : 'Add New Package'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="pkg-months" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration (Months)</label>
                    <input type="number" id="pkg-months" value={months} onChange={e => setMonths(parseInt(e.target.value))} min="2" step="1" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 text-gray-900 dark:text-white" />
                </div>
                <div>
                    <label htmlFor="pkg-price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Price ($)</label>
                    <input type="number" id="pkg-price" value={price} onChange={e => setPrice(parseFloat(e.target.value))} min="0" step="0.01" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 text-gray-900 dark:text-white" />
                </div>
            </div>
             {savings > 0 && (
                <div className="text-sm text-green-600 dark:text-green-400 font-semibold">
                    This package offers a {savings}% saving for your fans.
                </div>
            )}
            <div className="flex justify-end gap-3">
                <button onClick={onCancel} className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold py-2 px-4 rounded-full transition-colors">Cancel</button>
                <button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-full transition-colors">Save Package</button>
            </div>
        </div>
    );
};

const FreeTrialManager: React.FC = () => {
    const { currentUser } = useAuth();
    const { getFreeTrialLinksForCreator, createFreeTrialLink, deactivateFreeTrialLink } = useData();
    const links = getFreeTrialLinksForCreator(currentUser!.creatorId!);

    const [uses, setUses] = useState('10');
    const [isUnlimitedUses, setIsUnlimitedUses] = useState(false);
    const [expiresAt, setExpiresAt] = useState('');
    const [hasExpiry, setHasExpiry] = useState(true);
    const [copiedLinkCode, setCopiedLinkCode] = useState<string | null>(null);

    const handleCreateLink = () => {
        if (!hasExpiry && !isUnlimitedUses && parseInt(uses, 10) <= 0) {
            alert("Please set a valid number of uses.");
            return;
        }
        if (hasExpiry && !expiresAt) {
            alert("Please select an expiration date.");
            return;
        }

        const linkOptions = {
            uses: isUnlimitedUses ? 'unlimited' as const : parseInt(uses, 10),
            expiresAt: hasExpiry ? new Date(expiresAt).toISOString() : null,
        };
        createFreeTrialLink(linkOptions);
        // Reset form
        setUses('10');
        setIsUnlimitedUses(false);
        setExpiresAt('');
        setHasExpiry(true);
    };

    const handleCopy = (code: string) => {
        const url = `${window.location.origin}/join?trial=${code}`;
        navigator.clipboard.writeText(url);
        setCopiedLinkCode(code);
        setTimeout(() => setCopiedLinkCode(null), 2000);
    };
    
    // Sort links to show active ones first
    const sortedLinks = [...links].sort((a, b) => (b.isActive ? 1 : 0) - (a.isActive ? 0 : 1));

    return (
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl space-y-6 border border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Free Trial Links</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm -mt-4">Generate unique links to give fans a free trial of your subscription content.</p>

            <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700/50 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Generate New Link</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="uses" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Number of Uses</label>
                        <input type="number" id="uses" value={uses} onChange={e => setUses(e.target.value)} disabled={isUnlimitedUses} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 text-gray-900 dark:text-white disabled:bg-gray-200 dark:disabled:bg-gray-700" />
                        <label className="flex items-center gap-2 mt-2 text-sm text-gray-600 dark:text-gray-400">
                            <input type="checkbox" checked={isUnlimitedUses} onChange={e => setIsUnlimitedUses(e.target.checked)} className="h-4 w-4 rounded bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500"/>
                            Unlimited uses
                        </label>
                    </div>
                     <div>
                        <label htmlFor="expiresAt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expiration Date</label>
                        <input type="date" id="expiresAt" value={expiresAt} onChange={e => setExpiresAt(e.target.value)} disabled={!hasExpiry} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 text-gray-900 dark:text-white disabled:bg-gray-200 dark:disabled:bg-gray-700"/>
                        <label className="flex items-center gap-2 mt-2 text-sm text-gray-600 dark:text-gray-400">
                            <input type="checkbox" checked={!hasExpiry} onChange={e => setHasExpiry(!e.target.checked)} className="h-4 w-4 rounded bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500"/>
                            No expiration
                        </label>
                    </div>
                </div>
                 <div className="flex justify-end">
                    <button onClick={handleCreateLink} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-full transition-colors">
                        Generate Link
                    </button>
                </div>
            </div>
            
            <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Your Links</h3>
                {sortedLinks.length > 0 ? (
                    <div className="space-y-3">
                        {sortedLinks.map(link => (
                            <div key={link.id} className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="font-mono font-bold text-gray-900 dark:text-white">{link.code}</p>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${link.isActive ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                                            {link.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        Uses left: {link.usesLeft} · Expires: {link.expiresAt ? new Date(link.expiresAt).toLocaleDateString() : 'Never'}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <button
                                        onClick={() => handleCopy(link.code)}
                                        className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold py-2 px-4 rounded-full transition-colors text-sm flex items-center gap-2"
                                    >
                                        <Icon name={copiedLinkCode === link.code ? 'check' : 'clipboard-document'} className="w-4 h-4" />
                                        {copiedLinkCode === link.code ? 'Copied!' : 'Copy'}
                                    </button>
                                    <button 
                                        onClick={() => deactivateFreeTrialLink(link.id)} 
                                        disabled={!link.isActive}
                                        className="text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                                    >
                                        <Icon name="ban" className="w-5 h-5"/>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-6">You haven't generated any trial links yet.</p>
                )}
            </div>
        </div>
    );
}

export const SettingsMonetization: React.FC = () => {
    const { currentUser } = useAuth();
    const { creators, updateMonthlyPrice, addSubscriptionPackage, updateSubscriptionPackage, deleteSubscriptionPackage } = useData();
    
    const creatorData = creators.find(c => c.id === currentUser?.creatorId);
    
    const [monthlyPrice, setMonthlyPrice] = useState(creatorData?.monthlyPrice || 0);
    const [editingPackageIndex, setEditingPackageIndex] = useState<number | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    
    useEffect(() => {
        if(creatorData) {
            setMonthlyPrice(creatorData.monthlyPrice);
        }
    }, [creatorData]);
    
    const handleSaveMonthlyPrice = () => {
        updateMonthlyPrice(monthlyPrice);
        alert('Monthly price updated!');
    }

    const handleSavePackage = (pkgData: SubscriptionPackage) => {
        if (editingPackageIndex !== null) {
            updateSubscriptionPackage(editingPackageIndex, pkgData);
        } else {
            addSubscriptionPackage(pkgData);
        }
        setEditingPackageIndex(null);
        setIsAdding(false);
    };

    const handleDeletePackage = (pkgIndex: number) => {
        if (window.confirm('Are you sure you want to delete this package?')) {
            deleteSubscriptionPackage(pkgIndex);
        }
    }
    
    if (!creatorData) {
        return <div>You are not a creator.</div>;
    }

    return (
        <div className="space-y-10">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl space-y-6 border border-gray-200 dark:border-gray-800">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Subscription Pricing</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm -mt-4">Set your base monthly price and offer discounts for longer-term subscriptions.</p>
                
                <div>
                    <label htmlFor="monthlyPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Base Monthly Price ($)</label>
                    <div className="flex items-center gap-4">
                        <input
                            type="number"
                            id="monthlyPrice"
                            value={monthlyPrice}
                            onChange={e => setMonthlyPrice(parseFloat(e.target.value) || 0)}
                            min="0"
                            step="0.01"
                            className="w-full max-w-xs bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-gray-900 dark:text-white"
                        />
                         <button onClick={handleSaveMonthlyPrice} disabled={monthlyPrice === creatorData.monthlyPrice} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-full transition-colors disabled:opacity-50">
                            Save
                        </button>
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                     <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Subscription Packages</h3>
                    {creatorData.subscriptionPackages.map((pkg, index) => (
                         <div key={index} className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700/50">
                            <div className="flex justify-between items-start gap-4">
                                <div>
                                    <h4 className="font-bold text-lg text-gray-900 dark:text-white">{pkg.months}-Month Package</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Price: ${pkg.price.toFixed(2)}</p>
                                </div>
                                <div className="flex gap-2 flex-shrink-0">
                                    <button onClick={() => { setIsAdding(false); setEditingPackageIndex(index);}} className="p-2 text-gray-500 hover:text-indigo-500 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"><Icon name="pencil" className="w-5 h-5"/></button>
                                    <button onClick={() => handleDeletePackage(index)} className="p-2 text-gray-500 hover:text-red-500 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"><Icon name="trash" className="w-5 h-5"/></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {isAdding || editingPackageIndex !== null ? (
                    <PackageForm
                        pkg={editingPackageIndex !== null ? creatorData.subscriptionPackages[editingPackageIndex] : undefined}
                        monthlyPrice={creatorData.monthlyPrice}
                        onSave={handleSavePackage}
                        onCancel={() => { setEditingPackageIndex(null); setIsAdding(false); }}
                    />
                ) : (
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button onClick={() => { setEditingPackageIndex(null); setIsAdding(true); }} className="bg-indigo-100 dark:bg-indigo-500/10 hover:bg-indigo-200 dark:hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 font-bold py-2 px-6 rounded-full transition-colors">
                            + Add Package
                        </button>
                    </div>
                )}
            </div>

            <FreeTrialManager />
        </div>
    )
}