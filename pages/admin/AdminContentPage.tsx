import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataProvider';
import { Post, PostType } from '../../types';
import { Icon } from '../../components/Icon';
import { formatTimestamp } from '../../utils/formatters';
import { useModals } from '../../contexts/ModalProvider';
import { useNavigation } from '../../contexts/NavigationProvider';

const AdminPostRow: React.FC<{ post: Post }> = ({ post }) => {
    const { deletePost } = useData();
    const { openConfirmationModal } = useModals();
    const { onSelectCreator, onGoToAdminPostDetail } = useNavigation();

    const handleDelete = () => {
        openConfirmationModal({
            title: 'Delete Post?',
            message: `Are you sure you want to permanently delete this post by ${post.creator.username}? This action cannot be undone.`,
            confirmText: 'Delete Post',
            onConfirm: () => deletePost(post.id),
        });
    };

    return (
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 flex items-start gap-4">
            <div className="w-20 h-20 bg-gray-800 rounded-md flex-shrink-0">
                {post.media.length > 0 && post.media[0].type === 'image' ? (
                    <img src={post.media[0].url} alt="Post media" className="w-full h-full object-cover rounded-md" />
                ) : (
                     <div className="w-full h-full flex items-center justify-center">
                        <Icon name={post.media.length > 0 ? 'video' : 'collection'} className="w-8 h-8 text-gray-600" />
                    </div>
                )}
            </div>
            <div className="flex-1">
                <button onClick={() => onSelectCreator(post.creator)} className="group">
                    <div className="flex items-center gap-2">
                         <img src={post.creator.avatarUrl} alt={post.creator.username} className="w-6 h-6 rounded-full" />
                         <span className="font-semibold text-white group-hover:text-indigo-400">{post.creator.username}</span>
                    </div>
                </button>
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">{post.text || 'No text content'}</p>
                <p className="text-xs text-gray-500 mt-2">{formatTimestamp(post.timestamp)}</p>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={() => onGoToAdminPostDetail(post.id)} className="text-sm bg-gray-700 hover:bg-gray-600 text-white font-semibold py-1 px-3 rounded-full">View</button>
                <button onClick={handleDelete} className="text-sm bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold py-1 px-3 rounded-full">Delete</button>
            </div>
        </div>
    );
}

export const AdminContentPage: React.FC = () => {
    const { posts } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [postTypeFilter, setPostTypeFilter] = useState<'all' | PostType>('all');

    const filteredPosts = useMemo(() => {
        return [...posts]
            .filter(post => {
                const matchesSearch = !searchTerm || post.text?.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesType = postTypeFilter === 'all' || post.type === postTypeFilter;
                return matchesSearch && matchesType;
            })
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [posts, searchTerm, postTypeFilter]);

    return (
        <div>
            <h1 className="text-4xl font-bold text-white mb-8">Content Moderation</h1>
            
            <div className="bg-gray-900 rounded-xl border border-gray-700 p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Search post content..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2.5 text-white" />
                    <select value={postTypeFilter} onChange={e => setPostTypeFilter(e.target.value as any)} className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2.5 text-white">
                        <option value="all">All Post Types</option>
                        <option value={PostType.Public}>Public</option>
                        <option value={PostType.SubscriberOnly}>Subscriber Only</option>
                        <option value={PostType.PayPerView}>Pay-Per-View</option>
                    </select>
                </div>
            </div>
            
            <div className="space-y-4">
                {filteredPosts.map(post => <AdminPostRow key={post.id} post={post} />)}
            </div>
        </div>
    );
};