
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataProvider';
import { useNavigation } from '../contexts/NavigationProvider';
import { Conversation, Message, Creator, Media, UserRole, DropdownItem } from '../types';
import { Icon } from '../components/Icon';
import { MediaGallery } from '../components/MediaGallery';
import { formatConvoTimestamp, formatLastSeen } from '../utils/formatters';
import { useModals } from '../contexts/ModalProvider';
import { applyWatermark } from '../services/geminiService';
import { AvatarWithStory } from '../components/AvatarWithStory';
import { DropdownMenu } from '../components/DropdownMenu';

const ConversationList: React.FC<{
  conversations: Conversation[];
  selectedConversationId: number | null;
  onSelectConversation: (id: number) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}> = ({ conversations, selectedConversationId, onSelectConversation, searchQuery, setSearchQuery }) => {
  const { currentUser } = useAuth();

  const hasUnread = (convo: Conversation) => {
      if (!currentUser) return false;
      if (currentUser.mutedConversations.includes(convo.id)) return false;
      return convo.messages.some(m => !m.isRead && m.senderId !== currentUser?.id);
  }

  return (
    <div className="bg-gray-50 dark:bg-black border-r border-gray-200 dark:border-gray-800 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Messages</h2>
        <div className="relative">
            <Icon name="search" className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full py-2 pl-10 pr-4 text-sm"
            />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-center p-4">
                <p className="text-gray-500">No conversations found.</p>
            </div>
        ) : conversations.map(convo => {
          const otherParticipant = convo.participants.find(p => p.id !== currentUser?.id);
          const lastMessage = convo.messages[convo.messages.length - 1];
          const isOnline = otherParticipant?.lastSeen === 'online';

          return (
            <button
              key={convo.id}
              onClick={() => onSelectConversation(convo.id)}
              className={`w-full text-left p-4 flex items-start gap-4 transition-colors relative ${
                selectedConversationId === convo.id ? 'bg-indigo-50 dark:bg-indigo-900/50' : 'hover:bg-gray-100 dark:hover:bg-gray-900'
              }`}
            >
              {selectedConversationId === convo.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>}
              <div className="relative flex-shrink-0">
                {otherParticipant && <AvatarWithStory creator={otherParticipant as any} className="w-12 h-12" />}
                {isOnline && <span className="absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full bg-purple-500 ring-2 ring-gray-50 dark:ring-black"></span>}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-center">
                  <p className="font-bold text-gray-900 dark:text-white truncate">{otherParticipant?.username}</p>
                  <p className="text-xs text-gray-500 flex-shrink-0 ml-2">{formatConvoTimestamp(convo.lastMessageTimestamp)}</p>
                </div>
                <div className="flex justify-between items-start">
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate pr-4">
                        {lastMessage?.ppvPrice ? 'Sent premium content' : lastMessage?.tipAmount ? `Sent a $${lastMessage.tipAmount} tip` : lastMessage?.media ? 'Sent an attachment' : lastMessage?.content || "No messages yet"}
                    </p>
                    {hasUnread(convo) && <span className="block h-2.5 w-2.5 rounded-full bg-blue-500 flex-shrink-0 mt-1"></span>}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  );
};

const ReadReceipt: React.FC<{isRead: boolean}> = ({ isRead }) => (
    <div className={`mr-1 ${isRead ? 'text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}>
        <Icon name={isRead ? 'check-double' : 'check'} className="w-4 h-4" />
    </div>
);

const LockedMessage: React.FC<{ message: Message }> = ({ message }) => {
    const { openPpvMessageModal } = useModals();
    return (
        <div className="relative w-64 aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
            {message.media && message.media.length > 0 && (
                <img src={message.media[0].url} className="w-full h-full object-cover blur-xl scale-110" />
            )}
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white text-center p-4">
                <Icon name="lock" className="w-10 h-10 mb-2"/>
                <p className="font-bold">Premium Content</p>
                <button 
                    onClick={() => openPpvMessageModal(message)}
                    className="mt-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-5 rounded-full text-sm"
                >
                    Unlock for ${message.ppvPrice?.toFixed(2)}
                </button>
            </div>
        </div>
    )
}


const MessageBubble: React.FC<{ 
    message: Message;
    isOwnMessage: boolean;
    senderCreatorInfo: Creator | null | undefined;
    isGroupStart: boolean;
    isGroupEnd: boolean;
}> = ({ message, isOwnMessage, senderCreatorInfo, isGroupStart, isGroupEnd }) => {
    const { currentUser } = useAuth();
    const isUnlocked = currentUser?.unlockedMessages.includes(message.id);
    const isCreator = senderCreatorInfo !== null && senderCreatorInfo !== undefined;

    if (message.tipAmount) {
        return ( <div className="text-center my-4"><span className="bg-green-100 dark:bg-green-800/50 text-green-700 dark:text-green-300 text-xs font-semibold px-3 py-1.5 rounded-full"><Icon name="tip" className="w-4 h-4 inline-block mr-1" />{isOwnMessage ? 'You sent' : 'Sent you'} a ${message.tipAmount} tip</span></div>)
    }

    const showLockedState = !isOwnMessage && message.ppvPrice && !isUnlocked;
    
    const bubbleClasses = [
        "max-w-xs md:max-w-md rounded-2xl transition-all",
        isOwnMessage ? "bg-gradient-to-br from-indigo-500 to-purple-500 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200",
        isGroupEnd ? (isOwnMessage ? "rounded-br-md" : "rounded-bl-md") : "",
    ].join(" ");

    return (
        <div className="group relative">
            <div className={bubbleClasses}>
                {showLockedState ? (
                    <LockedMessage message={message} />
                ) : (
                    <>
                        {message.media && message.media.length > 0 && (<div className="w-64 rounded-lg overflow-hidden"><MediaGallery media={message.media} creatorUsername={senderCreatorInfo?.username || ''} showWatermark={isCreator} postId={message.id} onVideoPlay={() => {}} onVideoComplete={() => {}} /></div>)}
                        {message.content && <p className="text-sm whitespace-pre-wrap p-3 break-words">{message.content}</p>}
                    </>
                )}
            </div>
             <div className={`absolute bottom-1 text-[10px] text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap ${isOwnMessage ? 'left-0 -translate-x-full pr-2' : 'right-0 translate-x-full pl-2'}`}>
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
        </div>
    );
}

const ChatInput: React.FC<{ conversationId: number, otherParticipant: any }> = ({ conversationId, otherParticipant }) => {
    const { currentUser } = useAuth();
    const { sendMessage } = useData();
    const { openTipModal } = useModals();
    const [newMessage, setNewMessage] = useState('');
    const [mediaPreview, setMediaPreview] = useState<Media[]>([]);
    const [ppvPrice, setPpvPrice] = useState('');
    const [showPpvInput, setShowPpvInput] = useState(false);
    
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [newMessage]);
    
    const resetForm = () => {
        setNewMessage('');
        setMediaPreview([]);
        setPpvPrice('');
        setShowPpvInput(false);
    }

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if(!newMessage.trim() && mediaPreview.length === 0) return;
        
        sendMessage(conversationId, { 
            content: newMessage,
            media: mediaPreview,
            ppvPrice: ppvPrice ? parseFloat(ppvPrice) : undefined
        });
        resetForm();
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(e as any);
        }
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && currentUser) {
            const newMediaPromises = Array.from(event.target.files).map(file => {
                return new Promise<Media | null>(resolve => {
                    const reader = new FileReader();
                    reader.onloadend = async () => {
                        const dataUrl = reader.result as string;
                        if (file.type.startsWith('image/') && currentUser.role === UserRole.Creator) {
                            try {
                                const watermarkedUrl = await applyWatermark(dataUrl, `TheFreed/@${currentUser.username}`);
                                resolve({ type: 'image', url: watermarkedUrl });
                            } catch (e) {
                                console.error("Watermarking failed for chat image, using original:", e);
                                resolve({ type: 'image', url: dataUrl });
                            }
                        } else if (file.type.startsWith('image/')) {
                            resolve({ type: 'image', url: dataUrl });
                        } else if (file.type.startsWith('video/')) {
                            resolve({ type: 'video', url: dataUrl });
                        } else {
                            resolve(null);
                        }
                    };
                    reader.readAsDataURL(file);
                });
            });
            const validMedia = (await Promise.all(newMediaPromises)).filter((m): m is Media => m !== null);
            setMediaPreview(prev => [...prev, ...validMedia]);
        }
    };

    const removeMedia = (index: number) => {
        setMediaPreview(prev => prev.filter((_, i) => i !== index));
    }

    const canSend = newMessage.trim() !== '' || mediaPreview.length > 0;
    
    return (
        <div className="p-4 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
             {mediaPreview.length > 0 && (
                <div className="mb-3 p-3 bg-gray-100 dark:bg-gray-900 rounded-lg">
                    <div className="grid grid-cols-5 gap-2 mb-2">
                        {mediaPreview.map((media, index) => (
                             <div key={index} className="relative aspect-square">
                                <img src={media.url} alt={`Preview ${index}`} className="w-full h-full object-cover rounded-md" />
                                <button type="button" onClick={() => removeMedia(index)} className="absolute -top-1 -right-1 bg-gray-800 rounded-full p-0.5 text-white hover:bg-red-500"><Icon name="close" className="w-4 h-4" /></button>
                            </div>
                        ))}
                    </div>
                     {currentUser?.role === UserRole.Creator && (
                        <div>
                            {!showPpvInput ? (
                                <button type="button" onClick={() => setShowPpvInput(true)} className="text-sm font-semibold text-green-600 dark:text-green-400 hover:underline">Set Price (PPV)</button>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <div className="relative flex-grow max-w-xs"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Icon name="dollar" className="w-4 h-4 text-gray-400" /></div><input type="number" value={ppvPrice} onChange={e => setPpvPrice(e.target.value)} min="1" step="0.01" placeholder="Price" className="pl-8 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-2" /></div>
                                    <button type="button" onClick={() => {setShowPpvInput(false); setPpvPrice('');}} className="text-sm font-semibold text-gray-500 hover:underline">Cancel</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
            <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                <div className="flex-shrink-0 flex items-center self-end mb-1 gap-1">
                    <input type="file" multiple accept="image/*,video/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 rounded-full text-gray-500 hover:bg-purple-100 hover:text-purple-600 dark:hover:bg-purple-900/50 dark:hover:text-purple-400 transition-colors">
                        <Icon name="paperclip" />
                    </button>
                    <button type="button" onClick={() => openTipModal(otherParticipant, (amount) => sendMessage(conversationId, { tipAmount: amount }))} className="p-2 rounded-full text-gray-500 hover:bg-green-100 hover:text-green-600 dark:hover:bg-green-900/50 dark:hover:text-green-400 transition-colors">
                        <Icon name="dollar" />
                    </button>
                </div>
                <div className="flex-1 flex items-end bg-gray-100 dark:bg-gray-800 rounded-2xl py-2 px-3 gap-2">
                    <textarea 
                        ref={textareaRef} 
                        value={newMessage} 
                        onKeyDown={handleKeyDown} 
                        onChange={(e) => setNewMessage(e.target.value)} 
                        placeholder="Type a message..." 
                        rows={1} 
                        className="flex-1 bg-transparent border-none focus:ring-0 outline-none p-0 text-gray-900 dark:text-white placeholder-gray-500 resize-none max-h-32 transition-all" 
                    />
                    <button 
                        type="submit" 
                        disabled={!canSend}
                        className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full text-white transition-all duration-300 ${canSend ? 'bg-indigo-600 scale-100' : 'bg-gray-300 dark:bg-gray-600 scale-0'}`}
                    >
                        <Icon name="send" className="w-5 h-5" />
                    </button>
                </div>
            </form>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-center md:text-left md:pl-16">
                Press <strong>Shift + Enter</strong> for a new line.
            </p>
        </div>
    );
}

const ChatView: React.FC<{ conversation: Conversation, onBack: () => void; }> = ({ conversation, onBack }) => {
  const { currentUser } = useAuth();
  const { creators, muteConversation, blockUser } = useData();
  const { onSelectCreator } = useNavigation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [visibleMessages, setVisibleMessages] = useState<Set<number>>(new Set());

  useEffect(() => { 
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    
    const messageIds = conversation.messages.map(m => m.id);
    const visibleSet = new Set<number>();
    
    let delay = 0;
    for (const id of messageIds) {
        setTimeout(() => {
            setVisibleMessages(prev => new Set(prev).add(id));
        }, delay);
        delay += 50; // Stagger animation
    }
  }, [conversation.messages]);


  const otherParticipant = conversation.participants.find(p => p.id !== currentUser?.id);
  const otherCreatorProfile = creators.find(c => c.id === otherParticipant?.id);
  
  const actionItems: DropdownItem[] = otherCreatorProfile ? [
      { label: 'View Profile', icon: <Icon name="user" className="w-5 h-5"/>, onClick: () => onSelectCreator(otherCreatorProfile) },
      { label: 'Mute Conversation', icon: <Icon name="volume-off" className="w-5 h-5"/>, onClick: () => muteConversation(conversation.id, true) },
      { label: 'Block User', icon: <Icon name="ban" className="w-5 h-5"/>, onClick: () => blockUser(otherParticipant!.id, true), isDestructive: true },
  ] : [];

  const groupedMessages = useMemo(() => {
    const groups: { date: string, messages: Message[] }[] = [];
    if (conversation.messages.length === 0) return groups;

    let lastDate = new Date(conversation.messages[0].timestamp).toDateString();
    let currentMessages: Message[] = [];

    conversation.messages.forEach(msg => {
        const msgDate = new Date(msg.timestamp).toDateString();
        if (msgDate !== lastDate) {
            groups.push({ date: lastDate, messages: currentMessages });
            currentMessages = [];
            lastDate = msgDate;
        }
        currentMessages.push(msg);
    });
    groups.push({ date: lastDate, messages: currentMessages });
    return groups;
  }, [conversation.messages]);

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-black relative chat-bg">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-white/80 dark:bg-black/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-4">
            <button onClick={onBack} className="md:hidden text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"><Icon name="arrow-left" className="w-6 h-6" /></button>
            {otherParticipant && (
              <button onClick={() => onSelectCreator(otherCreatorProfile as Creator)} className="flex items-center gap-4 group">
                  <AvatarWithStory creator={otherParticipant as any} className="w-10 h-10" />
                  <div>
                      <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-500">{otherParticipant.username}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{formatLastSeen(otherParticipant.lastSeen)}</p>
                  </div>
              </button>
            )}
        </div>
        {otherParticipant && <DropdownMenu triggerElement={<button className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"><Icon name="ellipsis-vertical" /></button>} items={actionItems} />}
      </div>
      <div className="flex-1 p-6 overflow-y-auto">
        {groupedMessages.map(group => (
            <React.Fragment key={group.date}>
                <div className="text-center my-4"><span className="bg-gray-100 dark:bg-gray-900 text-xs text-gray-500 dark:text-gray-400 px-2 py-1 rounded-full">{new Date(group.date).toLocaleDateString()}</span></div>
                 <div className="space-y-1">
                    {group.messages.map((msg, index) => {
                        const prevMsg = group.messages[index - 1];
                        const nextMsg = group.messages[index + 1];
                        const isOwnMessage = msg.senderId === currentUser?.id;
                        const isGroupStart = !prevMsg || prevMsg.senderId !== msg.senderId;
                        const isGroupEnd = !nextMsg || nextMsg.senderId !== msg.senderId;

                        return (
                            <div key={msg.id} className={`flex items-end gap-2 transition-all duration-300 ${visibleMessages.has(msg.id) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'} ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                                {!isOwnMessage && (
                                    <div className="w-8 h-8 flex-shrink-0 self-end mb-1">
                                        {isGroupEnd && <AvatarWithStory creator={otherParticipant as any} className="w-full h-full" />}
                                    </div>
                                )}
                                <MessageBubble 
                                    message={msg} 
                                    isOwnMessage={isOwnMessage}
                                    senderCreatorInfo={!isOwnMessage ? otherCreatorProfile : null} 
                                    isGroupStart={isGroupStart}
                                    isGroupEnd={isGroupEnd}
                                />
                                {isOwnMessage && (
                                    <div className="w-6 self-end mb-1">
                                        <ReadReceipt isRead={msg.isRead} />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                 </div>
            </React.Fragment>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {otherParticipant && <ChatInput conversationId={conversation.id} otherParticipant={otherCreatorProfile} />}
    </div>
  );
};

export const MessagesPage: React.FC = () => {
  const { getConversations, markConversationAsRead } = useData();
  const { view } = useNavigation();
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const rawConversations = getConversations();

  const conversations = useMemo(() => {
    if (!currentUser) return [];
    const filtered = rawConversations.filter(convo => {
        const other = convo.participants.find(p => p.id !== currentUser.id);
        return other?.username.toLowerCase().includes(searchQuery.toLowerCase());
    });
    return [...filtered].sort((a, b) => new Date(b.lastMessageTimestamp).getTime() - new Date(a.lastMessageTimestamp).getTime());
  }, [rawConversations, searchQuery, currentUser]);

  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);

  useEffect(() => {
    const initialId = (view.page === 'messages' && view.preSelectedConversationId) || conversations[0]?.id || null;
    if (window.innerWidth >= 768 && initialId) {
        setSelectedConversationId(initialId);
        markConversationAsRead(initialId);
    }
  }, [view, conversations]);
  
  const handleSelectConversation = (id: number) => {
    setSelectedConversationId(id);
    markConversationAsRead(id);
  }

  const selectedConversation = conversations.find(c => c.id === selectedConversationId) || null;
  const showChatViewMobile = selectedConversationId !== null;

  return (
       <div className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden h-[80vh] flex">
         <div className={`w-full md:w-1/3 lg:w-1/4 md:min-w-[320px] ${showChatViewMobile ? 'hidden md:block' : 'block'}`}><ConversationList conversations={conversations} selectedConversationId={selectedConversationId} onSelectConversation={handleSelectConversation} searchQuery={searchQuery} setSearchQuery={setSearchQuery} /></div>
         <div className={`flex-1 relative ${showChatViewMobile ? 'flex' : 'hidden md:flex'}`}>{selectedConversation ? <ChatView conversation={selectedConversation} onBack={() => setSelectedConversationId(null)} /> : <div className="flex-1 hidden md:flex items-center justify-center text-center h-full bg-white dark:bg-black relative chat-bg"><div><Icon name="chat-bubble-left-right" className="w-20 h-20 text-gray-300 dark:text-gray-700 mx-auto" /><h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">Select a conversation</h3><p className="mt-1 text-sm text-gray-500">Choose a chat from the left to start messaging.</p></div></div>}</div>
       </div>
  );
};
