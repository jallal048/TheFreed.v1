
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Post as PostType, PostType as PostTypeEnum, Comment, PostFormat, DropdownItem, Creator } from '../types';
import { Icon } from './Icon';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataProvider';
import { useModals } from '../contexts/ModalProvider';
import { useNavigation } from '../contexts/NavigationProvider';
import { MediaGallery } from './MediaGallery';
import { DropdownMenu } from './DropdownMenu';
import { formatTimestamp } from '../utils/formatters';
import { AvatarWithStory } from './AvatarWithStory';
import { useLocale } from '../contexts/LocaleProvider';
import { PostContent } from './PostContent';
import { FundraisingGoal } from './FundraisingGoal';

interface PostProps {
  post: PostType;
}

const PostHeader: React.FC<{ post: PostType, onCreatorClick: (creator: Creator) => void; }> = ({ post, onCreatorClick }) => {
    return (
        <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
                <AvatarWithStory creator={post.creator} className="w-12 h-12" />
                <button className="text-left group" onClick={() => onCreatorClick(post.creator)}>
                    <div>
                    <div className="flex items-center gap-2">
                        <p className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">{post.creator.displayName}</p>
                        {post.creator.mainCategory.slug === 'nsfw' && (
                             <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400">18+</span>
                        )}
                    </div>
                    <p className="text-sm text-gray-500">@{post.creator.username} · {formatTimestamp(post.timestamp)}</p>
                    </div>
                </button>
            </div>
            <PostDropdown post={post} />
        </div>
    );
};

const PostDropdown: React.FC<{post: PostType}> = ({ post }) => {
    const { currentUser } = useAuth();
    const { toggleBookmark, deletePost, boostPost, addReport } = useData();
    const { openEditPostModal, openConfirmationModal } = useModals();

    const isOwner = currentUser?.creatorId === post.creator.id;
    const isBookmarked = currentUser ? currentUser.bookmarkedPostIds.includes(post.id) : false;
    
    const handleDelete = () => {
        openConfirmationModal({
            title: 'Delete Post',
            message: 'Are you sure you want to delete this post? This action cannot be undone.',
            confirmText: 'Delete Post',
            onConfirm: async () => { await deletePost(post.id); }
        });
    };
    
    const handleReport = () => {
        const reason = prompt("Please provide a reason for reporting this post:");
        if (reason) {
            addReport({
                targetType: 'post',
                targetId: post.id,
                reason,
            });
            alert('Thank you for your report. Our moderation team will review it shortly.');
        }
    };

    const copyPostLink = (postId: number) => {
        navigator.clipboard.writeText(`${window.location.origin}/post/${postId}`);
        alert(`Link to post ${postId} copied to clipboard!`);
    }

    const postMenuItems: DropdownItem[] = isOwner 
    ? [
        { label: "Edit Post", icon: <Icon name="pencil-square" className="w-5 h-5"/>, onClick: () => openEditPostModal(post) },
        { label: "Boost Post", icon: <Icon name="rocket-launch" className="w-5 h-5"/>, onClick: () => boostPost(post.id) },
        { label: "Delete Post", icon: <Icon name="trash" className="w-5 h-5"/>, onClick: handleDelete, isDestructive: true },
    ]
    : [
        { label: isBookmarked ? "Saved" : "Save Post", icon: <Icon name={isBookmarked ? 'bookmark-filled' : 'bookmark'} className="w-5 h-5"/>, onClick: () => toggleBookmark(post.id, () => {}) },
        { label: "Copy Link", icon: <Icon name="link" className="w-5 h-5"/>, onClick: () => copyPostLink(post.id) },
        { label: "Report Post", icon: <Icon name="flag" className="w-5 h-5"/>, onClick: handleReport, isDestructive: true },
    ];

    return (
         <DropdownMenu 
            triggerElement={
                <button className="text-gray-400 hover:text-gray-800 dark:hover:text-white p-1 rounded-full"><Icon name="ellipsis-vertical" /></button>
            }
            items={postMenuItems}
        />
    )
}


const CommentSection: React.FC<{ postId: number, postCreatorId: number, postComments: Comment[] }> = ({ postId, postCreatorId, postComments }) => {
    const { currentUser } = useAuth();
    const { addComment, deleteComment, getTopFanForCreator } = useData();
    const { openAuthModal } = useAuth();
    const [newComment, setNewComment] = useState('');
    
    const topFanId = getTopFanForCreator(postCreatorId);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !currentUser) return;
        addComment(postId, newComment, openAuthModal);
        setNewComment('');
    };
    
    const getCommentMenuItems = (comment: Comment): DropdownItem[] => {
        const isCommentOwner = currentUser?.id === comment.user.id;
        const isPostOwner = currentUser?.creatorId === postCreatorId;

        if (isCommentOwner || isPostOwner) {
            return [ { label: "Delete Comment", icon: <Icon name="trash" className="w-5 h-5"/>, onClick: () => deleteComment(postId, comment.id), isDestructive: true } ];
        }
        return [ { label: "Report Comment", icon: <Icon name="flag" className="w-5 h-5"/>, onClick: () => alert('Report comment'), isDestructive: true } ];
    }

    return (
        <div className="space-y-4">
            {currentUser && (
                 <form onSubmit={handleSubmit} className="flex items-start gap-3">
                    <img src={currentUser.avatarUrl} alt="Your avatar" className="w-9 h-9 rounded-full mt-1" />
                    <div className="flex-1">
                         <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onClick={() => !currentUser && openAuthModal()}
                            placeholder="Add a comment..."
                            rows={1}
                            className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-2 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
                         />
                         {newComment && ( <button type="submit" className="mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-1 px-3 rounded-full text-sm">Post Comment</button> )}
                    </div>
                </form>
            )}
            {postComments.map(comment => (
                <div key={comment.id} className="flex items-start gap-3 group">
                    <img src={comment.user.avatarUrl} alt={`${comment.user.username}'s avatar`} className="w-9 h-9 rounded-full" />
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 flex-1">
                        <div className="flex items-baseline justify-between">
                            <div className="flex items-center gap-2">
                                <p className="font-bold text-gray-900 dark:text-white text-sm">{comment.user.username}</p>
                                {comment.user.id === topFanId && (
                                    <div title="Top Fan">
                                        <Icon name="diamond" className="w-4 h-4 text-cyan-500" />
                                    </div>
                                )}
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{formatTimestamp(comment.timestamp)}</span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap mt-1">{comment.text}</p>
                    </div>
                    {currentUser && ( <DropdownMenu triggerElement={<button className="text-gray-500 hover:text-gray-800 dark:hover:text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><Icon name="ellipsis-vertical" className="w-5 h-5" /></button>} items={getCommentMenuItems(comment)} /> )}
                </div>
            ))}
        </div>
    );
}

const PostActions: React.FC<{ post: PostType; onCommentClick: () => void; }> = ({ post, onCommentClick }) => {
  const { currentUser, openAuthModal } = useAuth();
  const { toggleLikePost, toggleBookmark } = useData();
  const { openTipModal } = useModals();

  const isLiked = currentUser ? post.likedBy.includes(currentUser.id) : false;
  const isBookmarked = currentUser ? currentUser.bookmarkedPostIds.includes(post.id) : false;

  return (
    <div className="flex justify-between items-center text-gray-500 dark:text-gray-400 mt-4">
        <div className="flex items-center gap-4">
            <button onClick={() => toggleLikePost(post.id, openAuthModal)} className={`flex items-center gap-2 transition-colors ${isLiked ? 'text-red-500' : 'text-gray-500 dark:text-gray-400 hover:text-red-500'}`}>
                <Icon name={isLiked ? 'like-filled' : 'like'} className="w-5 h-5" />
                <span>{post.likedBy.length.toLocaleString()}</span>
            </button>
            <button onClick={onCommentClick} className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                <Icon name="comment" className="w-5 h-5" /> <span>{post.comments.length}</span>
            </button>
            <button onClick={() => !currentUser ? openAuthModal() : openTipModal(post.creator)} className="flex items-center gap-2 hover:text-green-400 transition-colors">
                <Icon name="tip" className="w-5 h-5" /> <span>Tip</span>
            </button>
        </div>
        <button onClick={() => toggleBookmark(post.id, openAuthModal)} className={`flex items-center gap-2 transition-colors ${isBookmarked ? 'text-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:text-indigo-400'}`}>
            <Icon name={isBookmarked ? 'bookmark-filled' : 'bookmark'} className="w-5 h-5" />
        </button>
    </div>
  );
};

const SubscriberLockedContent = React.memo(({ creator, onSubscribeClick, post }: { creator: Creator, onSubscribeClick: () => void, post: PostType }) => {
    const { t } = useLocale();
    const getSubscribeButtonText = () => creator.monthlyPrice > 0 ? t('creatorProfile.subscribeFor', { price: creator.monthlyPrice.toFixed(2) }) : t('creatorProfile.subscribeFree');
    
    return (
        <div className="mt-4 relative overflow-hidden rounded-lg">
            <div className="relative">
                {post.media.length > 0 ? (
                <img src={post.media[0].url} alt="Locked post content" className="w-full object-cover max-h-[600px] blur-3xl scale-110" onContextMenu={(e) => e.preventDefault()} />
                ) : <div className="h-48 bg-gray-200 dark:bg-gray-700 blur-3xl"></div> }
                    <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-gray-50 dark:from-gray-900 to-transparent"></div>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-black/80 text-center p-4">
                <Icon name="lock" className="w-12 h-12 text-gray-800 dark:text-white mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{t('post.locked.title')}</h3>
                <p className="text-gray-700 dark:text-gray-200 max-w-sm" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>{t('post.locked.description', { creatorName: creator.displayName })}</p>
                <button onClick={onSubscribeClick} className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-full transition-colors shadow-lg">{getSubscribeButtonText()}</button>
            </div>
        </div>
    );
});

const PpvLockedContent = React.memo(({ post, onUnlockClick }: { post: PostType, onUnlockClick: () => void }) => {
    return (
        <div className="mt-4 p-5 rounded-lg bg-gray-100 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
                <div className="bg-green-500/10 dark:bg-green-500/20 p-3 rounded-full"><Icon name="unlock" className="w-7 h-7 text-green-500 dark:text-green-400" /></div>
                <div><h4 className="font-bold text-gray-900 dark:text-white">Unlock exclusive content</h4><p className="text-gray-600 dark:text-gray-300 text-sm max-w-md">{post.text}</p></div>
            </div>
            <button onClick={onUnlockClick} className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-full transition-colors whitespace-nowrap">Unlock for ${post.ppvPrice?.toFixed(2)}</button>
        </div>
    );
});


const _Post: React.FC<PostProps> = ({ post }) => {
  const { currentUser, openAuthModal } = useAuth();
  const { isSubscribedToCreator, getFanListsForCreator, logPostInteraction } = useData();
  const { openSubModal, openPpvModal } = useModals();
  const { onSelectCreator } = useNavigation();
  const [showComments, setShowComments] = useState(false);
  
  const postRef = useRef<HTMLDivElement>(null);
  const dwellStartTime = useRef<number>(0);

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              dwellStartTime.current = Date.now();
          } else {
              if (dwellStartTime.current > 0) {
                  const elapsedTime = Date.now() - dwellStartTime.current;
                  logPostInteraction(post.id, 'dwellTime', elapsedTime);
                  dwellStartTime.current = 0;
              }
          }
      });
  }, [logPostInteraction, post.id]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
        root: null, rootMargin: '0px', threshold: 0.5 
    });
    const currentRef = postRef.current;
    if (currentRef) observer.observe(currentRef);
    
    return () => {
        if (currentRef) observer.unobserve(currentRef);
        if (dwellStartTime.current > 0) {
            const elapsedTime = Date.now() - dwellStartTime.current;
            logPostInteraction(post.id, 'dwellTime', elapsedTime);
        }
    };
  }, [handleIntersection, logPostInteraction, post.id]);

  const isOwner = currentUser?.creatorId === post.creator.id;
  const isSubscribed = isSubscribedToCreator(post.creator.id);
  const isUnlocked = currentUser?.unlockedPosts.includes(post.id);

  if (!isOwner && post.visibleToLists?.length) {
      if (!currentUser) return null;
      const fanLists = getFanListsForCreator(post.creator.id);
      const userIsInList = fanLists.some(list => post.visibleToLists!.includes(list.id) && list.fanIds.includes(currentUser.id));
      if (!userIsInList) return null;
  }

  const handleToggleComments = () => {
      if(!currentUser && post.comments.length === 0) {
          openAuthModal();
          return;
      }
      setShowComments(!showComments);
  }

  const handleCreatorClick = (creator: Creator) => {
    logPostInteraction(post.id, 'profileClicked', true);
    onSelectCreator(creator);
  };
  const handleTextExpand = () => logPostInteraction(post.id, 'textExpanded', true);
  const handleVideoPlay = () => logPostInteraction(post.id, 'videoPlayCount', 1);
  const handleVideoComplete = () => logPostInteraction(post.id, 'videoCompletionCount', 1);

  const renderContent = () => {
    const unlockedContent = (
      <>
        {post.text && <PostContent content={post.text} onTextExpand={handleTextExpand} />}
        {post.format === PostFormat.Gallery && post.media.length > 0 && (
            <MediaGallery 
                media={post.media} 
                creatorUsername={post.creator.username} 
                showWatermark={!isOwner}
                postId={post.id}
                onVideoPlay={handleVideoPlay}
                onVideoComplete={handleVideoComplete}
             />
        )}
        {post.goalAmount && <div className="mt-4"><FundraisingGoal post={post} /></div>}
        <PostActions post={post} onCommentClick={handleToggleComments} />
        <div className={`transition-all duration-500 ease-in-out overflow-hidden 
            ${showComments 
                ? 'max-h-[2000px] opacity-100 mt-4 pt-4 border-t border-gray-200 dark:border-gray-800' 
                : 'max-h-0 opacity-0'}`
        }>
            <CommentSection postId={post.id} postCreatorId={post.creator.id} postComments={post.comments} />
        </div>
      </>
    );

    if (isOwner) return unlockedContent;
    
    switch (post.type) {
      case PostTypeEnum.Public: return unlockedContent;
      case PostTypeEnum.SubscriberOnly:
        if (isSubscribed) return unlockedContent;
        return <SubscriberLockedContent post={post} creator={post.creator} onSubscribeClick={() => !currentUser ? openAuthModal() : openSubModal(post.creator)} />;
      case PostTypeEnum.PayPerView:
        if (isUnlocked) return unlockedContent;
        return <PpvLockedContent post={post} onUnlockClick={() => !currentUser ? openAuthModal() : openPpvModal(post)} />;
      default: return null;
    }
  };

  return (
    <div ref={postRef} className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm dark:shadow-none border border-gray-200 dark:border-transparent" id={`post-${post.id}`}>
      <PostHeader post={post} onCreatorClick={handleCreatorClick} />
      {renderContent()}
    </div>
  );
};

export const Post = React.memo(_Post);
