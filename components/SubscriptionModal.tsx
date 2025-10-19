
import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataProvider';
import { useModals } from '../contexts/ModalProvider';
import { Icon } from './Icon';
import { PaymentForm } from './PaymentForm';
import { SubscriptionPackage } from '../types';
import { useLocale } from '../contexts/LocaleProvider';

interface PackageOption {
    months: number;
    price: number;
    monthlyPrice?: number;
    savings?: string;
}

const PackageCard: React.FC<{ option: PackageOption, isSelected: boolean, onSelect: () => void; }> = ({ option, isSelected, onSelect }) => {
    const { t } = useLocale();
    return (
        <button onClick={onSelect} className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 relative ${isSelected ? 'bg-indigo-50 dark:bg-indigo-900/50 border-indigo-500 dark:border-indigo-400 shadow-lg' : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-white dark:hover:bg-gray-800'}`}>
            {option.savings && <div className="absolute -top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{t('subModal.save', { savings: option.savings })}</div>}
            <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('subModal.monthPlan', { months: option.months })}</h3>
                <div className="text-right">
                    <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">${option.price.toFixed(2)}</p>
                    {option.monthlyPrice && <p className="text-sm font-normal text-gray-500">(${option.monthlyPrice.toFixed(2)}/mo)</p>}
                </div>
            </div>
        </button>
    );
}

export const SubscriptionModal: React.FC = () => {
    const { isSubModalOpen, closeSubModal, subModalCreator } = useModals();
    const { subscribeToPackage } = useData();
    const { t } = useLocale();
    
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState<PackageOption | null>(null);
    const [step, setStep] = useState<'select' | 'pay'>('select');
    const [packageOptions, setPackageOptions] = useState<PackageOption[]>([]);

    useEffect(() => {
        if (isSubModalOpen && subModalCreator) {
            const basePrice = subModalCreator.monthlyPrice;
            const options: PackageOption[] = [{ months: 1, price: basePrice, monthlyPrice: basePrice }];
            subModalCreator.subscriptionPackages.forEach(pkg => {
                const totalRegularPrice = basePrice * pkg.months;
                let savingsPercent = 0;
                if (totalRegularPrice > 0) { // Avoid division by zero
                  savingsPercent = Math.round(((totalRegularPrice - pkg.price) / totalRegularPrice) * 100);
                }
                options.push({ 
                    months: pkg.months, 
                    price: pkg.price, 
                    monthlyPrice: pkg.price / pkg.months, 
                    savings: savingsPercent > 0 ? `${savingsPercent}%` : undefined 
                });
            });
            const sortedOptions = options.sort((a,b) => a.months - b.months);
            setPackageOptions(sortedOptions);
            setSelectedPackage(sortedOptions[0]);
        } else {
             setTimeout(() => { setLoading(false); setSuccess(false); setSelectedPackage(null); setStep('select'); setPackageOptions([]); }, 300);
        }
    }, [isSubModalOpen, subModalCreator]);

    const handlePaymentSubmit = async () => {
        if (!selectedPackage || !subModalCreator) return;
        setLoading(true);
        await subscribeToPackage(subModalCreator.id, selectedPackage.months);
        setLoading(false);
        setSuccess(true);
        setTimeout(() => closeSubModal(), 1500);
    };

    if (!isSubModalOpen || !subModalCreator) return null;

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={closeSubModal}>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-md relative" onClick={e => e.stopPropagation()}>
                <button onClick={closeSubModal} className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-white disabled:opacity-50" disabled={loading || success}><Icon name="close" className="w-6 h-6" /></button>
                <div className="p-8">
                    {success ? (
                        <div className="text-center py-8"><div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto"><Icon name="check-circle" className="w-10 h-10 text-green-600 dark:text-green-400" /></div><h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">{t('subModal.confirmed')}</h2><p className="text-gray-600 dark:text-gray-300 mt-1">{t('subModal.welcome', { creatorName: subModalCreator?.displayName })}</p></div>
                    ) : (
                    <>
                        <div className="flex items-center gap-4 mb-6"><img src={subModalCreator?.avatarUrl} alt="creator" className="w-16 h-16 rounded-full" /><div><p className="text-gray-500 dark:text-gray-400">{t('subModal.subscribingTo')}</p><h2 className="text-2xl font-bold text-gray-900 dark:text-white">{subModalCreator?.displayName}</h2></div></div>
                        {step === 'select' && (
                             <>
                                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">{t('subModal.choosePlan')}</h3>
                                <div className="space-y-3 max-h-80 overflow-y-auto pr-2">{packageOptions.map(option => <PackageCard key={option.months} option={option} isSelected={selectedPackage?.months === option.months} onSelect={() => setSelectedPackage(option)} />)}</div>
                                <button onClick={() => selectedPackage?.price === 0 ? handlePaymentSubmit() : setStep('pay')} disabled={!selectedPackage} className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 disabled:bg-indigo-400 dark:disabled:bg-indigo-800 disabled:cursor-not-allowed">{selectedPackage?.price === 0 ? t('creatorProfile.subscribeFree') : t('subModal.continueToPayment')}</button>
                             </>
                        )}
                        {step === 'pay' && selectedPackage && (
                             <>
                                <button onClick={() => setStep('select')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-4"><Icon name="arrow-left" className="w-4 h-4"/> {t('subModal.backToPlans')}</button>
                                <PaymentForm isProcessing={loading} onSubmit={handlePaymentSubmit} submitButtonText={`${t('subModal.continueToPayment')}: $${selectedPackage.price.toFixed(2)}`} />
                             </>
                        )}
                    </>
                    )}
                </div>
            </div>
        </div>
    );
};