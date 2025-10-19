import React from 'react';
import { Creator, Post } from '../types';
import { Icon } from './Icon';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataProvider';
import { useModals } from '../contexts/ModalProvider';
import { useNavigation } from '../contexts/NavigationProvider';

interface CreatorInfoSidebarProps {
    creator: Creator;
    posts: Post[];
}

export const CreatorInfoSidebar: React.FC<CreatorInfoSidebarProps> = ({ creator, posts }) => {
    const { currentUser, openAuthModal } = useAuth();
    const { isSubscribedToCreator, startOrGetConversation } = useData();
    const { openSubModal } = useModals();
    const { onGoToMessages } = useNavigation();

    const isOwner = currentUser?.creatorId === creator.id;
    const isSubscribed = isSubscribedToCreator(creator.id);
    
    const totalLikes = posts.reduce((acc, post) => acc + post.likedBy.length, 0);

    const handleSubscribe = () => {
        if (!currentUser) {
            openAuthModal();
        } else if (!isSubscribed) {
            openSubModal(creator);
        }
    };
    
    const handleSendMessage = async () => {
        if (!currentUser || !isSubscribed) return;
        const conversationId = await startOrGetConversation(creator.id);
        onGoToMessages(conversationId);
    }

    const formatStat = (num: number): string => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };
    
    const getSubscribeButtonText = () => {
      if (creator.monthlyPrice > 0) {
        return `Subscribe for $${creator.monthlyPrice.toFixed(2)}/mo`;
      }
      return "Subscribe for Free";
    }

    const PrimaryButton = () => {
        if (isOwner) {
            return null; // Edit profile is now in the main user dropdown -> settings
        }

        if (isSubscribed) {
            return (
                <button 
                    onClick={handleSendMessage}
                    className="w-full mt-6 font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-lg flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30"
                >
                    <Icon name="chat-bubble-left-right" className="w-5 h-5"/>
                    Send Message
                </button>
            )
        }
        
        return (
             <button 
                onClick={handleSubscribe}
                className={`w-full mt-6 font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30`}
            >
                {getSubscribeButtonText()}
            </button>
        )
    }

    return (
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
            <div className="flex flex-col items-center text-center">
                 <img 
                    src={creator.avatarUrl} 
                    alt={`${creator.displayName}'s avatar`} 
                    className="w-32 h-32 rounded-full border-4 border-gray-700"
                    onContextMenu={(e) => e.preventDefault()}
                />
                <h2 className="text-3xl font-bold text-white mt-4">{creator.displayName}</h2>
                <p className="text-md text-gray-400">@{creator.username}</p>
                <p className="mt-4 text-gray-300">{creator.bio}</p>
            </div>
             <div className="mt-6 flex items-center justify-around text-gray-300 border-t border-b border-gray-700 py-4">
                <div className="text-center">
                    <p className="text-xl font-bold text-white">{posts.length}</p>
                    <p className="text-sm text-gray-400">Posts</p>
                </div>
                <div className="text-center">
                    <p className="text-xl font-bold text-white">{formatStat(totalLikes)}</p>
                    <p className="text-sm text-gray-400">Likes</p>
                </div>
                <div className="text-center">
                    <p className="text-xl font-bold text-white">{creator.stats.subscribers}</p>
                    <p className="text-sm text-gray-400">Subscribers</p>
                </div>
            </div>
            <PrimaryButton />
        </div>
    )
}