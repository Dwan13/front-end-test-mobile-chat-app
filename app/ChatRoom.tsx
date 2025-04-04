import React, { useState, useRef, useEffect, useMemo } from 'react';
import { FlatList, InteractionManager } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppContext } from '@/context/AppContext';
import { ThemedText, ThemedView } from '@/design_system/components/atoms';
import { MessageBubble } from '@/design_system/components/organisms';
import { ChatRoomTemplate } from '@/design_system/components/templates';

/**
 * Chat room screen component that handles messaging functionality
 */
export default function ChatRoomScreen() {
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const { currentUser, users, chats, sendMessage, deleteMessage, addReaction, removeReaction, editMessage, forwardMessage } = useAppContext();
  const [messageText, setMessageText] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();

  const chat = chats.find(c => c.id === chatId);
  const chatParticipants = chat?.participants
    .filter(id => id !== currentUser?.id)
    .map(id => users.find(user => user.id === id))
    .filter(Boolean) || [];

    const names = chatParticipants.slice(0, 2).map(u => u?.name).filter(Boolean);
    const extraCount = chatParticipants.length - names.length;
    const chatName = `${names.join(', ')}${extraCount > 0 ? ` +${extraCount}` : ''}`;

  /**
   * Handles sending or editing a message
   */
  const handleSendMessage = async (imageUri?: string) => {
    if ((messageText.trim() || imageUri) && currentUser && chat) {
      try {
        if (editingMessageId) {
          await editMessage?.(editingMessageId, messageText.trim());
        } else {
          await sendMessage(chat.id, messageText.trim(), currentUser.id, imageUri);
        }
        setMessageText('');
        setEditingMessageId(null);
      } catch (err) {
        console.error("Error sending message:", err);
      }
      
    }
};

  /**
   * Initiates message editing mode
   * @param messageId - ID of the message to edit
   * @param currentText - Current text of the message
   */
  const handleEditMessage = (messageId: string, currentText: string) => {
    setEditingMessageId(messageId);
    setMessageText(currentText);
  };

  /**
   * Handles message deletion
   * @param messageId - ID of the message to delete
   */
  const handleDeleteMessage = async (messageId: string) => {
    if (chat && currentUser) {
      await deleteMessage?.(messageId, chat.id);
    }
  };

  /**
   * Handles adding a reaction to a message
   * @param messageId - ID of the message to react to
   * @param emoji - Emoji to add as a reaction
   */
  const handleAddReaction = async (messageId: string, emoji: string) => {
    if (chat && currentUser) {
      await addReaction?.(messageId, emoji);
    }
  };

  /**
   * Handles removing a reaction from a message
   * @param reactionId - ID of the reaction to remove
   * @param messageId - ID of the message the reaction belongs to
   */
  const handleRemoveReaction = async (reactionId: string, messageId: string) => {
    if (chat && currentUser) {
      await removeReaction?.(reactionId, messageId);
    }
  };

  const handleForwardMessage = async (messageId: string, targetChatId: string) => {
    try {
      if (forwardMessage) {        
        await forwardMessage(messageId, targetChatId, currentUser?.id || '');
      }
    } catch (error) {
      console.error('Error forwarding message:', error);
    }
  };
  

  useEffect(() => {
    if (chat?.messages.length && flatListRef.current) {
      InteractionManager.runAfterInteractions(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      });
    }
  }, [chat?.messages.length]);

  if (!chat || !currentUser) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedText>Chat not found</ThemedText>
      </ThemedView>
    );
  }

  const sortedMessages = useMemo(() => {
    return [...(chat?.messages || [])].sort((a, b) => a.timestamp - b.timestamp);
  }, [chat?.messages]);
  
  return (
      <ChatRoomTemplate
        chatName={chatName || 'Chat'}
        participantAvatar={{
          user: chatParticipants[0],
          size: 32
        }}
        messages={sortedMessages}
        messageText={messageText}
        isEditing={!!editingMessageId}
        onBack={() => router.back()}
        onMessageChange={setMessageText}
        onSendMessage={handleSendMessage}
        renderMessage={(item) => (
          <MessageBubble
            message={item}
            isCurrentUser={item.senderId === currentUser.id}
            onDeleteMessage={handleDeleteMessage}
            onAddReaction={handleAddReaction}
            onRemoveReaction={handleRemoveReaction}
            onEditMessage={handleEditMessage}
            onForwardMessage={handleForwardMessage}
            userId={currentUser.id}
          />
        )}
        flatListRef={flatListRef}
      />
  );
}