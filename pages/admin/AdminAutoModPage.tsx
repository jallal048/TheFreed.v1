import React from 'react';
import { useData } from '../../contexts/DataProvider';
import { AutoModQueueItem } from '../../types';
import { Icon } from '../../components/Icon';
import { formatTimestamp } from '../../utils/formatters';
import { useNavigation } from '../../contexts/NavigationProvider';

const AutoModCard: React.FC<{ item: AutoModQueueItem }> = ({ item }) => {
    const { posts, resolveAutoModItem } = useData();
    const { onGoToAdminPostDetail } = useNavigation();
    const post = posts.find(p => p.id === item.postId);

    if (!post) {
        return (
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 text-center text-gray-500">
                Post #{item.postId} not found or has been deleted.
            </div>
        );
    }
    
    const confidenceColor = item.confidence > 0.9 ? 'text-red-400' : item.confidence > 0.75 ? 'text-yellow-400' : 'text-gray-400';

    return (
        <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden flex flex-col">
            <div className="p-4 flex-1">
                <div className="flex justify-between items-start">
                    <p className="text-sm font-bold text-white">{item.reason}</p>
                    <p className={`text-sm font-bold ${confidenceColor}`}>{ (item.confidence * 100).toFixed(0) }% confidence</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">Flagged {formatTimestamp(item.timestamp)}</p>

                <button onClick={() => onGoToAdminPostDetail(post.id)} className="mt-4 bg-gray-800/50 p-3 rounded-md border border-gray-700 w-full text-left hover:border-indigo-500">
                    <div className="flex items-center gap-3">
                         <img src={post.creator.avatarUrl} alt="" className="w-8 h-8 rounded-full" />
                         <div>
                            <p className="font-semibold text-white">{post.creator.username}</p>
                            <p className="text-xs text-gray-400 line-clamp-1">{post.text || "Media post"}</p>
                         </div>
                    </div>
                </button>
            </div>
             <div className="p-3 bg-gray-800/50 grid grid-cols-2 gap-3">
                <button 
                    onClick={() => resolveAutoModItem(item.id, false)}
                    className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold py-2 rounded-md transition-colors"
                >
                    Delete Post
                </button>
                <button 
                    onClick={() => resolveAutoModItem(item.id, true)}
                    className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-400 font-bold py-2 rounded-md transition-colors"
                >
                    Approve
                </button>
            </div>
        </div>
    );
};


export const AdminAutoModPage: React.FC = () => {
    const { autoModQueue } = useData();

    return (
        <div>
            <h1 className="text-4xl font-bold text-white mb-8 flex items-center gap-3">
                <Icon name="sparkles" className="w-9 h-9 text-indigo-400" />
                AI Auto-Moderation Queue
            </h1>
            
            {autoModQueue.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {autoModQueue.map(item => <AutoModCard key={item.id} item={item} />)}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-900 rounded-xl border border-gray-700">
                    <Icon name="check-circle" className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white">All Clear!</h3>
                    <p className="text-gray-400 mt-2">The AI has not flagged any content for review.</p>
                </div>
            )}
        </div>
    );
};
