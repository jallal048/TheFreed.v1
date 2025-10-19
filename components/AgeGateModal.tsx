
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Icon } from './Icon';
import { useLocale } from '../contexts/LocaleProvider';
import { useData } from '../contexts/DataProvider';
import { AuthUser } from '../types';

type Step = 'intro' | 'captureId' | 'captureSelfie' | 'processing' | 'pending' | 'denied';

export const AgeGateModal: React.FC = () => {
    const { isAgeGateModalOpen, closeAgeGateModal, ageVerificationReason, currentUser, creatorOnboardingUser } = useAuth();
    const { submitVerification } = useData();
    const [step, setStep] = useState<Step>('intro');
    const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
    const [idImageUrl, setIdImageUrl] = useState<string | null>(null);
    const [selfieImageUrl, setSelfieImageUrl] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { t } = useLocale();

    const stopCamera = useCallback(() => {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
            setCameraStream(null);
        }
    }, [cameraStream]);

    useEffect(() => {
        if (!isAgeGateModalOpen) {
            stopCamera();
            setTimeout(() => {
                setStep('intro');
                setIdImageUrl(null);
                setSelfieImageUrl(null);
            }, 300);
        }
    }, [isAgeGateModalOpen, stopCamera]);
    
    useEffect(() => {
        // Cleanup camera stream on component unmount
        return () => {
            stopCamera();
        };
    }, [stopCamera]);

    const startCamera = async (preferredFacingMode: 'environment' | 'user') => {
        stopCamera(); // Stop any existing stream
        try {
            // First, try with the preferred facing mode
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { exact: preferredFacingMode } } });
            setCameraStream(stream);
        } catch (err) {
            console.warn(`Could not get ${preferredFacingMode} camera, trying any camera...`, err);
            try {
                // If preferred fails, try with any available camera
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                setCameraStream(stream);
            } catch (fallbackErr) {
                console.error("Camera access denied on all attempts:", fallbackErr);
                setStep('denied');
            }
        }
    };
    
    useEffect(() => {
        if (cameraStream && videoRef.current) {
            videoRef.current.srcObject = cameraStream;
        }
    }, [cameraStream]);

    const handleStartIdCapture = () => {
        setStep('captureId');
        startCamera('environment');
    };
    
    const handleStartSelfieCapture = () => {
        setStep('captureSelfie');
        startCamera('user');
    };

    const handleCaptureId = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d')?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            
            const imageUrl = canvas.toDataURL('image/jpeg');
            setIdImageUrl(imageUrl);

            stopCamera();
            handleStartSelfieCapture();
        }
    };

    const handleCaptureSelfie = async () => {
        if (videoRef.current && canvasRef.current && idImageUrl) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            const context = canvas.getContext('2d');
            if (context) {
                // Flip the image horizontally for a mirror effect
                context.translate(video.videoWidth, 0);
                context.scale(-1, 1);
                context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            }
            
            const selfieUrl = canvas.toDataURL('image/jpeg');
            setSelfieImageUrl(selfieUrl);

            stopCamera();
            setStep('processing');

            let submissionData;
            if (ageVerificationReason === 'fan_nsfw' && currentUser) {
                submissionData = {
                    userId: currentUser.id,
                    username: currentUser.username,
                    avatarUrl: currentUser.avatarUrl,
                    reason: ageVerificationReason,
                    idImageUrl,
                    selfieImageUrl,
                };
            } else if (ageVerificationReason === 'creator_onboarding' && creatorOnboardingUser) {
                const { personalInfo, ...creatorProfileData } = creatorOnboardingUser;
                submissionData = {
                    userId: creatorOnboardingUser.id || Date.now(),
                    username: creatorOnboardingUser.username!,
                    avatarUrl: creatorOnboardingUser.avatarUrl || `https://picsum.photos/seed/${Date.now()}/40/40`,
                    reason: ageVerificationReason,
                    idImageUrl,
                    selfieImageUrl,
                    onboardingData: {
                        ...creatorProfileData,
                        personalInfo: personalInfo as AuthUser['personalInfo']
                    }
                };
            }

            if (submissionData) {
                await submitVerification(submissionData);
            } else {
                 console.error("Could not submit age verification due to missing data.");
            }
            
            setStep('pending');
            setTimeout(() => {
                closeAgeGateModal();
            }, 3000);
        }
    };
    
    const renderStep = () => {
        switch (step) {
            case 'intro':
                const isCreatorFlow = ageVerificationReason === 'creator_onboarding';
                return (
                    <div className="text-center">
                        <Icon name="shield-check" className="w-16 h-16 text-indigo-500 mx-auto mb-4"/>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{t('ageGate.title')}</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-sm mx-auto">
                            {isCreatorFlow ? t('ageGate.creatorDescription') : t('ageGate.fanDescription')}
                        </p>
                        {ageVerificationReason === 'fan_nsfw' && (
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-4 italic">
                                For your privacy, your verification photos will be permanently deleted once your age is confirmed.
                            </p>
                        )}
                        <div className="mt-8 flex flex-col gap-3">
                            <button onClick={handleStartIdCapture} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-full transition-colors">
                                Start Verification
                            </button>
                            <button onClick={closeAgeGateModal} className="w-full text-gray-500 dark:text-gray-400 font-semibold py-2 px-6 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                                Cancel
                            </button>
                        </div>
                    </div>
                );
            
            case 'captureId':
                return (
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Scan your ID</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1 mb-4">Position your ID within the frame and take a clear photo.</p>
                        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden my-4">
                            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-[85%] h-[80%] border-4 border-dashed border-white/50 rounded-xl"></div>
                            </div>
                        </div>
                         <button onClick={handleCaptureId} disabled={!cameraStream} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-full transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                             <Icon name="camera" className="w-5 h-5" />
                            Capture ID Photo
                         </button>
                         <canvas ref={canvasRef} className="hidden"></canvas>
                    </div>
                );
            
            case 'captureSelfie':
                return (
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Take a Selfie</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1 mb-4">Make sure your face is clearly visible.</p>
                        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden my-4">
                            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover transform -scale-x-100"></video>
                        </div>
                         <button onClick={handleCaptureSelfie} disabled={!cameraStream} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-full transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                             <Icon name="camera" className="w-5 h-5" />
                            Capture Selfie
                         </button>
                         <canvas ref={canvasRef} className="hidden"></canvas>
                    </div>
                );
            
            case 'processing':
                return (
                     <div className="text-center py-10">
                        <svg className="animate-spin h-12 w-12 text-indigo-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">Submitting Verification...</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">This will only take a moment.</p>
                    </div>
                );
            
             case 'pending':
                return (
                     <div className="text-center py-10">
                        <Icon name="check-circle" className="w-16 h-16 text-green-500 mx-auto mb-4"/>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">Submission Received</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">Your verification is pending review. You will be notified once it's processed.</p>
                    </div>
                );

             case 'denied':
                return (
                    <div className="text-center">
                        <Icon name="ban" className="w-16 h-16 text-red-500 mx-auto mb-4"/>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Camera Access Denied</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-sm mx-auto">We cannot verify your age without camera access. Please enable camera permissions in your browser settings and try again.</p>
                        <button onClick={closeAgeGateModal} className="mt-6 w-full text-gray-500 dark:text-gray-400 font-semibold py-2 px-6 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                                Close
                        </button>
                    </div>
                );

            default:
                return null;
        }
    }
    
    if (!isAgeGateModalOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-lg relative p-8" onClick={e => e.stopPropagation()}>
                {renderStep()}
            </div>
        </div>
    );
};
