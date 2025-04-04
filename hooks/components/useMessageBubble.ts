import { useState } from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import { getBubbleColors } from '@/design_system/components/organisms/MessageBubble/MessageBubble.styles';
import { Message } from '@/types/Chat';
import { getUserReaction, hasUserReacted } from '@/utils/chatUtils';

interface UseMessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  onDeleteMessage?: (messageId: string) => void;
  onEditMessage?: (messageId: string, currentText: string) => void;
  onAddReaction?: (messageId: string, emoji: string) => void;
  onRemoveReaction?: (reactionId: string, messageId: string) => void;
  onForwardMessage?: (messageId: string, targetChatId: string) => void;
  userId?: string;
}

/**
 * Custom hook for handling message bubble interactions and styling
 * @param message - Message object containing content and reactions
 * @param isCurrentUser - Boolean indicating if the message belongs to the current user
 * @param onAddReaction - Callback function for adding reactions
 * @param onRemoveReaction - Callback function for removing reactions
 * @param userId - ID of the current user
 * @returns Object containing styling, handlers, and state for message bubble
 */
export function useMessageBubble({
  message,
  isCurrentUser,
  userId,
  onAddReaction,
  onRemoveReaction,
  onForwardMessage,
}: UseMessageBubbleProps) {
  const [showEmojiSelector, setShowEmojiSelector] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showChatSelector, setShowChatSelector] = useState(false);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const bubbleColors = getBubbleColors(isDark, isCurrentUser);

  const handleLongPress = () => {
    isCurrentUser ? setShowOptionsMenu(true) : setShowEmojiSelector(true);
  };

  const handleEmojiSelected = (emoji: string) => {
    if (!userId) return;

    if (hasUserReacted(message, userId)) {
      const existingReaction = getUserReaction(message, userId);
      if (existingReaction) handleRemoveReaction(existingReaction.id);
    }

    onAddReaction?.(message.id, emoji);
    setShowEmojiSelector(false);
  };

  const handleForward = async (targetChatId: string) => {
    try {
      await onForwardMessage?.(message.id, targetChatId);
      setShowChatSelector(false);
    } catch (error) {
      console.error('Error forwarding message:', error);
    }
  };

  const handleRemoveReaction = (reactionId: string) => {
    onRemoveReaction?.(reactionId, message.id);
  };

  return {
    isDark,
    bubbleColors,
    handleLongPress,
    showEmojiSelector,
    setShowEmojiSelector,
    handleEmojiSelected,
    handleRemoveReaction,
    handleForward,
    showChatSelector,
    setShowChatSelector,
    showOptionsMenu,
    setShowOptionsMenu,
  };
}
