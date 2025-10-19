
import React, { useState } from 'react';
import { useData } from '../../contexts/DataProvider';
import { VerificationSubmission } from '../../types';
import { Icon } from '../../components/Icon';
import { formatTimestamp } from '../../utils/formatters';

const VerificationCard: React.FC<{ 
    submission: VerificationSubmission,
    onImageClick: (url: string) => void 
}> = ({ submission, onImageClick }) => {
    const { processVerification } = useData();

    return (
        <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
            <div className="p-4">
                 <div className="flex items-center gap-3">
                    <img src={submission.avatarUrl} alt={submission.username} className="w-10 h-10 rounded-full" />
                    <div>
                        <p className="font-bold text-white">{submission.username}</p>
                        <p className="text-xs text-gray-400">User ID: {submission.userId}</p>
                    </div>
                </div>
                <div className="mt-3 text-sm">
                    <p><span className="font-semibold text-gray-300">Reason:</span> <span className="text-gray-400">{submission.reason === 'creator_onboarding' ? 'Creator Onboarding' : 'NSFW Access'}</span></p>
                    <p><span className="font-semibold text-gray-300">Submitted:</span> <span className="text-gray-400">{formatTimestamp(submission.timestamp)}</span></p>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-1 bg-black p-1">
                <div className="aspect-square bg-black cursor-pointer group relative" onClick={() => onImageClick(submission.idImageUrl)}>
                    <img src={submission.idImageUrl} alt="Verification document" className="w-full h-full object-contain" />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Icon name="search" className="w-8 h-8 text-white" />
                    </div>
                </div>
                <div className="aspect-square bg-black cursor-pointer group relative" onClick={() => onImageClick(submission.selfieImageUrl)}>
                    <img src={submission.selfieImageUrl} alt="Verification selfie" className="w-full h-full object-contain" />
                     <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Icon name="search" className="w-8 h-8 text-white" />
                    </div>
                </div>
            </div>
            <div className="p-3 bg-gray-800/50 grid grid-cols-2 gap-3">
                <button 
                    onClick={() => processVerification(submission.id, false)}
                    className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold py-2 rounded-md transition-colors"
                >
                    Reject
                </button>
                <button 
                    onClick={() => processVerification(submission.id, true)}
                    className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-400 font-bold py-2 rounded-md transition-colors"
                >
                    Approve
                </button>
            </div>
        </div>
    )
}

export const AdminVerificationsPage: React.FC = () => {
    const { verificationSubmissions } = useData();
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);
    
    return (
        <div>
            {lightboxImage && (
                <div 
                    className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                    onClick={() => setLightboxImage(null)}
                >
                    <button className="absolute top-4 right-4 text-white/70 hover:text-white" onClick={() => setLightboxImage(null)}>
                        <Icon name="close" className="w-10 h-10" />
                    </button>
                    <img 
                        src={lightboxImage} 
                        alt="Verification document enlarged" 
                        className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}

            <h1 className="text-4xl font-bold text-white mb-8 flex items-center gap-3">
                <Icon name="shield-check" className="w-9 h-9 text-indigo-400" />
                Age Verifications
            </h1>

            {verificationSubmissions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {verificationSubmissions.map(sub => <VerificationCard key={sub.id} submission={sub} onImageClick={setLightboxImage} />)}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-900 rounded-xl border border-gray-700">
                    <Icon name="check-circle" className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white">All Clear!</h3>
                    <p className="text-gray-400 mt-2">There are no pending age verifications.</p>
                </div>
            )}
        </div>
    )
}
