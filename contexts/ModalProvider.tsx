
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Creator, Post, ScheduledMessage, ConfirmationModalOptions, Media, Message } from '../types';

interface ModalContextType {
  isSubModalOpen: boolean;
  subModalCreator: Creator | null;
  openSubModal: (creator: Creator) => void;
  closeSubModal: () => void;

  isPpvModalOpen: boolean;
  ppvModalPost: Post | null;
  openPpvModal: (post: Post) => void;
  closePpvModal: () => void;
  
  isPpvMessageModalOpen: boolean;
  ppvMessageModalMessage: Message | null;
  openPpvMessageModal: (message: Message) => void;
  closePpvMessageModal: () => void;

  isTipModalOpen: boolean;
  tipModalCreator: Creator | null;
  openTipModal: (creator: Creator, onTipSuccess?: (amount: number) => void) => void;
  closeTipModal: () => void;
  tipSuccessCallback: ((amount: number) => void) | null;
  
  isConfirmationModalOpen: boolean;
  confirmationModalOptions: ConfirmationModalOptions | null;
  openConfirmationModal: (options: ConfirmationModalOptions) => void;
  closeConfirmationModal: () => void;

  isEditPostModalOpen: boolean;
  editingPost: Post | null;
  openEditPostModal: (post: Post) => void;
  closeEditPostModal: () => void;

  isAddCardModalOpen: boolean;
  openAddCardModal: () => void;
  closeAddCardModal: () => void;
  
  isCreatePostModalOpen: boolean;
  openCreatePostModal: () => void;
  closeCreatePostModal: () => void;

  isScheduleMessageModalOpen: boolean;
  editingScheduledMessage: ScheduledMessage | null;
  openScheduleMessageModal: (message?: ScheduledMessage) => void;
  closeScheduleMessageModal: () => void;

  isEditScheduledPostModalOpen: boolean;
  editingScheduledPost: Post | null;
  openEditScheduledPostModal: (post: Post) => void;
  closeEditScheduledPostModal: () => void;
  
  isLightboxOpen: boolean;
  lightboxMedia: Media[];
  lightboxStartIndex: number;
  lightboxCreatorInfo: { username: string; isOwner: boolean } | null;
  openLightbox: (media: Media[], startIndex: number, creatorInfo: { username: string; isOwner: boolean }) => void;
  closeLightbox: () => void;

  // Stories
  isStoryViewerOpen: boolean;
  storyViewerCreatorIds: number[];
  storyViewerStartIndex: number;
  openStoryViewer: (creatorIds: number[], startIndex: number) => void;
  closeStoryViewer: () => void;

  isAddStoryModalOpen: boolean;
  openAddStoryModal: () => void;
  closeAddStoryModal: () => void;

  isAchievementsModalOpen: boolean;
  achievementsModalUserId: number | null;
  openAchievementsModal: (userId: number) => void;
  closeAchievementsModal: () => void;
}

export const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [subModalCreator, setSubModalCreator] = useState<Creator | null>(null);
  
  const [isPpvModalOpen, setIsPpvModalOpen] = useState(false);
  const [ppvModalPost, setPpvModalPost] = useState<Post | null>(null);

  const [isPpvMessageModalOpen, setIsPpvMessageModalOpen] = useState(false);
  const [ppvMessageModalMessage, setPpvMessageModalMessage] = useState<Message | null>(null);

  const [isTipModalOpen, setIsTipModalOpen] = useState(false);
  const [tipModalCreator, setTipModalCreator] = useState<Creator | null>(null);
  const [tipSuccessCallback, setTipSuccessCallback] = useState<((amount: number) => void) | null>(null);

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [confirmationModalOptions, setConfirmationModalOptions] = useState<ConfirmationModalOptions | null>(null);

  const [isEditPostModalOpen, setIsEditPostModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);

  const [isScheduleMessageModalOpen, setIsScheduleMessageModalOpen] = useState(false);
  const [editingScheduledMessage, setEditingScheduledMessage] = useState<ScheduledMessage | null>(null);

  const [isEditScheduledPostModalOpen, setIsEditScheduledPostModalOpen] = useState(false);
  const [editingScheduledPost, setEditingScheduledPost] = useState<Post | null>(null);
  
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxMedia, setLightboxMedia] = useState<Media[]>([]);
  const [lightboxStartIndex, setLightboxStartIndex] = useState(0);
  const [lightboxCreatorInfo, setLightboxCreatorInfo] = useState<{ username: string; isOwner: boolean } | null>(null);

  const [isStoryViewerOpen, setIsStoryViewerOpen] = useState(false);
  const [storyViewerCreatorIds, setStoryViewerCreatorIds] = useState<number[]>([]);
  const [storyViewerStartIndex, setStoryViewerStartIndex] = useState(0);

  const [isAddStoryModalOpen, setIsAddStoryModalOpen] = useState(false);

  const [isAchievementsModalOpen, setIsAchievementsModalOpen] = useState(false);
  const [achievementsModalUserId, setAchievementsModalUserId] = useState<number | null>(null);

  const openSubModal = (creator: Creator) => { setSubModalCreator(creator); setIsSubModalOpen(true); };
  const closeSubModal = () => setIsSubModalOpen(false);

  const openPpvModal = (post: Post) => { setPpvModalPost(post); setIsPpvModalOpen(true); };
  const closePpvModal = () => setIsPpvModalOpen(false);

  const openPpvMessageModal = (message: Message) => { setPpvMessageModalMessage(message); setIsPpvMessageModalOpen(true); };
  const closePpvMessageModal = () => setIsPpvMessageModalOpen(false);

  const openTipModal = (creator: Creator, onTipSuccess?: (amount: number) => void) => {
    setTipModalCreator(creator);
    setTipSuccessCallback(onTipSuccess ? () => onTipSuccess : null);
    setIsTipModalOpen(true);
  };
  const closeTipModal = () => { setIsTipModalOpen(false); setTipSuccessCallback(null); };

  const openConfirmationModal = (options: ConfirmationModalOptions) => { setConfirmationModalOptions(options); setIsConfirmationModalOpen(true); };
  const closeConfirmationModal = () => setIsConfirmationModalOpen(false);
  
  const openEditPostModal = (post: Post) => { setEditingPost(post); setIsEditPostModalOpen(true); };
  const closeEditPostModal = () => setIsEditPostModalOpen(false);

  const openAddCardModal = () => setIsAddCardModalOpen(true);
  const closeAddCardModal = () => setIsAddCardModalOpen(false);
  
  const openCreatePostModal = () => setIsCreatePostModalOpen(true);
  const closeCreatePostModal = () => setIsCreatePostModalOpen(false);

  const openScheduleMessageModal = (message?: ScheduledMessage) => { setEditingScheduledMessage(message || null); setIsScheduleMessageModalOpen(true); };
  const closeScheduleMessageModal = () => setIsScheduleMessageModalOpen(false);

  const openEditScheduledPostModal = (post: Post) => { setEditingScheduledPost(post); setIsEditScheduledPostModalOpen(true); };
  const closeEditScheduledPostModal = () => setIsEditScheduledPostModalOpen(false);
  
  const openLightbox = (media: Media[], startIndex: number, creatorInfo: { username: string; isOwner: boolean }) => {
    setLightboxMedia(media);
    setLightboxStartIndex(startIndex);
    setLightboxCreatorInfo(creatorInfo);
    setIsLightboxOpen(true);
  };
  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setLightboxCreatorInfo(null);
  };
  
  const openStoryViewer = (creatorIds: number[], startIndex: number) => {
    setStoryViewerCreatorIds(creatorIds);
    setStoryViewerStartIndex(startIndex);
    setIsStoryViewerOpen(true);
  };
  const closeStoryViewer = () => setIsStoryViewerOpen(false);
  
  const openAddStoryModal = () => setIsAddStoryModalOpen(true);
  const closeAddStoryModal = () => setIsAddStoryModalOpen(false);
  
  const openAchievementsModal = (userId: number) => {
    setAchievementsModalUserId(userId);
    setIsAchievementsModalOpen(true);
  };
  const closeAchievementsModal = () => setIsAchievementsModalOpen(false);

  const value = {
    isSubModalOpen, subModalCreator, openSubModal, closeSubModal,
    isPpvModalOpen, ppvModalPost, openPpvModal, closePpvModal,
    isPpvMessageModalOpen, ppvMessageModalMessage, openPpvMessageModal, closePpvMessageModal,
    isTipModalOpen, tipModalCreator, openTipModal, closeTipModal, tipSuccessCallback,
    isConfirmationModalOpen, confirmationModalOptions, openConfirmationModal, closeConfirmationModal,
    isEditPostModalOpen, editingPost, openEditPostModal, closeEditPostModal,
    isAddCardModalOpen, openAddCardModal, closeAddCardModal,
    isCreatePostModalOpen, openCreatePostModal, closeCreatePostModal,
    isScheduleMessageModalOpen, editingScheduledMessage, openScheduleMessageModal, closeScheduleMessageModal,
    isEditScheduledPostModalOpen, editingScheduledPost, openEditScheduledPostModal, closeEditScheduledPostModal,
    isLightboxOpen, lightboxMedia, lightboxStartIndex, lightboxCreatorInfo, openLightbox, closeLightbox,
    isStoryViewerOpen, storyViewerCreatorIds, storyViewerStartIndex, openStoryViewer, closeStoryViewer,
    isAddStoryModalOpen, openAddStoryModal, closeAddStoryModal,
    isAchievementsModalOpen, achievementsModalUserId, openAchievementsModal, closeAchievementsModal,
  };

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
};

export const useModals = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModals must be used within a ModalProvider');
  }
  return context;
};
