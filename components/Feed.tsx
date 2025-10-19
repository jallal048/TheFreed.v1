
import React from 'react';
import { Post as PostType } from '../types';
import { Post } from './Post';

interface FeedProps {
  posts: PostType[];
}

export const Feed: React.FC<FeedProps> = ({ posts }) => {
  return (
    <div className="space-y-6">
      {posts.map(post => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};
