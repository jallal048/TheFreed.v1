
import React from 'react';
import { useData } from '../../contexts/DataProvider';
import { useNavigation } from '../../contexts/NavigationProvider';
import { Icon } from '../../components/Icon';
import { formatTimestamp } from '../../utils/formatters';
import { MediaGallery } from '../../components/MediaGallery';
import { PostContent } from '../../components/PostContent';
import { useModals } from '../../contexts/ModalProvider';
import { Comment } from '../../types';

interface AdminPostDetailPageProps {
    postId: number;
}

export const AdminPostDetailPage: React.FC<AdminPostDetailPageProps> = ({ postId }) => {
    const { getPostById, deletePost, deleteComment } = useData();
    const { onGoToAdminContent, onSelectCreator } = useNavigation();
    const { openConfirmationModal } = useModals();
    
    const post = getPostById(postId);

    if (!post) {
        return <div>Post not found.</div>;
    }

    const handleDeletePost = () => {
        openConfirmationModal({
            title: 'Delete Post?',
            message: `Are you sure you want to permanently delete this post by ${post.creator.username}?`,
            confirmText: 'Delete Post',
            onConfirm: () => {
                deletePost(post.id);
                onGoToAdminContent();
            },
        });
    };
    
    const handleDeleteComment = (comment: Comment) => {
        openConfirmationModal({
            title: 'Delete Comment?',
            message: `Are you sure you want to delete the comment by ${comment.user.username}?`,
            confirmText: 'Delete Comment',
            onConfirm: () => deleteComment(post.id, comment.id),
        });
    }

    return (
        <div>
            <button onClick={onGoToAdminContent} className="flex items-center gap-2 text-sm text-indigo-400 mb-6"><Icon name="arrow-left" className="w-4 h-4"/> Back to Content List</button>
            <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden">
                <div className="p-6">
                    <div className="flex justify-between items-start">
                        <button onClick={() => onSelectCreator(post.creator)} className="group flex items-center gap-3">
                            <img src={post.creator.avatarUrl} alt={post.creator.username} className="w-12 h-12 rounded-full" />
                            <div>
                                <h2 className="text-xl font-bold text-white group-hover:text-indigo-400">{post.creator.displayName}</h2>
                                <p className="text-sm text-gray-400">@{post.creator.username}</p>
                            </div>
                        </button>
                        <button onClick={handleDeletePost} className="bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold text-sm py-2 px-4 rounded-full">
                            Delete Post
                        </button>
                    </div>

                    {post.text && <div className="mt-4"><PostContent content={post.text} onTextExpand={() => {}} /></div>}
                    
                    <div className="mt-4 text-xs text-gray-500">
                        {formatTimestamp(post.timestamp)} · {post.likedBy.length} Likes · {post.comments.length} Comments
                    </div>
                </div>

                {post.media.length > 0 && (
                    <div className="bg-black">
                        <MediaGallery media={post.media} creatorUsername={post.creator.username} showWatermark={false} postId={post.id} onVideoPlay={() => {}} onVideoComplete={() => {}} />
                    </div>
                )}
                
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Comments</h3>
                    <div className="space-y-4">
                        {post.comments.length > 0 ? post.comments.map(comment => (
                            <div key={comment.id} className="flex items-start gap-3 group">
                                <img src={comment.user.avatarUrl} alt={comment.user.username} className="w-9 h-9 rounded-full" />
                                <div className="flex-1 bg-gray-800/50 p-3 rounded-lg">
                                    <div className="flex justify-between items-baseline">
                                        <p className="font-bold text-white text-sm">{comment.user.username}</p>
                                        <span className="text-xs text-gray-500">{formatTimestamp(comment.timestamp)}</span>
                                    </div>
                                    <p className="text-gray-300 text-sm mt-1">{comment.text}</p>
                                </div>
                                <button onClick={() => handleDeleteComment(comment)} className="p-1 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Icon name="trash" className="w-4 h-4"/>
                                </button>
                            </div>
                        )) : (
                            <p className="text-gray-500 text-sm">No comments on this post.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
