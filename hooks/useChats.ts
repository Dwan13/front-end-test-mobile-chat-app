import { useChatsDb } from './db/useChatsDb';

export function useChats(userId: string | null) {
  const { 
    chats, 
    createChat, 
    sendMessage, 
    loading, 
    clearChats,
    deleteChat,
    deleteMessage,
    addReaction,
    removeReaction,
    editMessage,
    markMessagesAsRead,
    forwardMessage
  } = useChatsDb(userId);

  return {
    chats,
    createChat,
    sendMessage,
    loading,
    clearChats,
    deleteChat,
    deleteMessage,
    addReaction,
    removeReaction,
    editMessage,
    markMessagesAsRead,
    forwardMessage
  };
}
