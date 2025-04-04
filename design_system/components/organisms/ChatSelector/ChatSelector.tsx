import React from 'react';
import { Modal, FlatList, Pressable, Text } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAppContext } from '@/context/AppContext';
import { styles as createStyles } from './ChatSelector.styles';
import { ThemedText, ThemedView } from '../../atoms';
import { ChatListItem } from '../ChatListItem';
import { Chat } from '@/types/Chat';

interface ChatSelectorProps {
  visible: boolean;
  onClose: () => void;
  onChatSelected: (chatId: string) => void;
}

export const ChatSelector: React.FC<ChatSelectorProps> = ({ 
  visible, 
  onClose,
  onChatSelected 
}) => {
  const { theme } = useTheme();
  const { chats, users, currentUser } = useAppContext();
  const styles = createStyles(theme);
  const handleTest = (item: Chat) => {
    onChatSelected(item.id);
  }
  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} >
        <ThemedView style={styles.container}>
          <ThemedText style={styles.title}>Select chat</ThemedText>
          <FlatList
            data={chats}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <ChatListItem
                  chat={item}
                  currentUserId={currentUser?.id || ''}
                  users={users}
                  onPress={() => handleTest(item)}
                />
            )}
          />
        </ThemedView>
      </Pressable>
    </Modal>
  );
};