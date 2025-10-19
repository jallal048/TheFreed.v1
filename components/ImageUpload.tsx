import React, { useState, useRef } from 'react';
import { Icon } from './Icon';
import { useLocale } from '../contexts/LocaleProvider';

interface ImageUploadProps {
    label: string;
    currentImage: string;
    onImageSelect: (dataUrl: string) => void;
    aspectRatio?: string;
    isAvatar?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ label, currentImage, onImageSelect, aspectRatio = 'aspect-video', isAvatar = false }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(currentImage);
    const { t } = useLocale();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const dataUrl = reader.result as string;
                setPreview(dataUrl);
                onImageSelect(dataUrl);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
            <div
                className={`group relative ${aspectRatio} w-full ${isAvatar ? 'max-w-40 rounded-full' : 'rounded-lg'} bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center text-center cursor-pointer hover:border-indigo-500 transition-colors`}
                onClick={triggerFileSelect}
            >
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                />
                {preview ? (
                    <>
                        <img 
                            src={preview} 
                            alt={`${label} preview`} 
                            className={`w-full h-full object-cover ${isAvatar ? 'rounded-full' : 'rounded-lg'}`}
                        />
                        <div className={`absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${isAvatar ? 'rounded-full' : 'rounded-lg'}`}>
                            <div className="text-center text-white">
                                <Icon name="pencil" className="w-8 h-8 mx-auto" />
                                <p className="mt-1 font-semibold">{t('imageUpload.change')}</p>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-gray-500 dark:text-gray-400">
                        <Icon name="image" className="w-12 h-12 mx-auto" />
                        <p className="mt-2 text-sm">{t('imageUpload.clickToUpload')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};