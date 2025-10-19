
import React, { useState } from 'react';
import { useNavigation } from '../contexts/NavigationProvider';
import { useData } from '../contexts/DataProvider';
import { useAuth } from '../contexts/AuthContext';

interface PostContentProps {
  content: string;
  onTextExpand: () => void;
}

const MAX_COLLAPSED_LENGTH = 300;

export const PostContent: React.FC<PostContentProps> = ({ content, onTextExpand }) => {
  const { onGoToHashtag, onSelectCreator } = useNavigation();
  const { creators, users, isBlocked } = useData();
  const { currentUser } = useAuth();
  const [isExpanded, setIsExpanded] = useState(content.length <= MAX_COLLAPSED_LENGTH);

  const handleExpand = () => {
    setIsExpanded(true);
    onTextExpand();
  };
  
  const contentToDisplay = isExpanded ? content : `${content.substring(0, MAX_COLLAPSED_LENGTH)}...`;

  const parts = contentToDisplay.split(/([#@]\w+)/g);

  return (
    <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap my-4">
      {parts.map((part, index) => {
        if (part.startsWith('#')) {
          const tag = part.substring(1);
          return (
            <button 
              key={index} 
              onClick={() => onGoToHashtag(tag)} 
              className="text-indigo-500 hover:text-indigo-400 font-semibold hover:underline"
            >
              {part}
            </button>
          );
        }
        if (part.startsWith('@')) {
          const username = part.substring(1);
          const creator = creators.find(c => c.username === username);
          if (creator) {
            const creatorUser = users.find(u => u.creatorId === creator.id);
            const creatorUserId = creatorUser ? creatorUser.id : creator.id;
            const isUserBlocked = currentUser ? isBlocked(currentUser.id, creatorUserId) : false;
            
            if (isUserBlocked) {
                return <span key={index}>{part}</span>;
            }

            return (
              <button 
                key={index} 
                onClick={() => onSelectCreator(creator)} 
                className="text-indigo-500 hover:text-indigo-400 font-semibold hover:underline"
              >
                {part}
              </button>
            );
          }
        }
        return <span key={index}>{part}</span>;
      })}
      {!isExpanded && (
        <button onClick={handleExpand} className="text-indigo-500 hover:text-indigo-400 font-semibold ml-2">
          See more
        </button>
      )}
    </div>
  );
};