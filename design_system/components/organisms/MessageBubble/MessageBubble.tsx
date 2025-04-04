import React, { useRef, useState } from 'react';
import { View, Modal, Pressable, Image } from 'react-native';
import { ThemedText } from '@/design_system/components/atoms/ThemedText';
import { styles as createStyles } from './MessageBubble.styles';
import { useMessageBubble } from '@/hooks/components/useMessageBubble';
import { OptionsMenu } from '@/design_system/components/organisms/OptionsMenu';
import EmojiSelector, { Categories } from 'react-native-emoji-selector';
import { ChatSelector } from '@/design_system/components/organisms';
import { useTheme } from '@/context/ThemeContext';
import { Message } from '@/types/Chat';


interface MessageBubbleProps {
  /** Message data to be displayed */
  message: Message;
  /** Whether the message is from the current user */
  isCurrentUser: boolean;
  /** Current user's ID */
  userId: string;
  /** Function to be called when deleting a message */
  onDeleteMessage?: (messageId: string) => void;
  /** Function to be called when adding a reaction */
  onAddReaction?: (messageId: string, emoji: string) => void;
  /** Function to be called when removing a reaction */
  onRemoveReaction?: (reactionId: string, messageId: string) => void;
  /** Function to be called when editing a message */
  onEditMessage?: (messageId: string, currentText: string) => void;
  /** Function to be called when forwarding a message */
  onForwardMessage?: (messageId: string, targetChatId: string) => void;
}

/**
 * MessageBubble component displays a chat message with support for reactions, editing, and deletion.
 * It includes options for long-press actions and an emoji selector for reactions.
 */

const formatTime = (timestamp: number) =>
  new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export function MessageBubble({
  message,
  isCurrentUser,
  userId,
  onDeleteMessage,
  onAddReaction,
  onRemoveReaction,
  onEditMessage,
  onForwardMessage,
}: MessageBubbleProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const bubbleRef = useRef<View>(null);
  const [bubblePosition, setBubblePosition] = useState({ x: 0, y: 0, width: 0 });

  const {
    isDark,
    bubbleColors,
    handleLongPress,
    showEmojiSelector,
    setShowEmojiSelector,
    handleEmojiSelected,
    handleForward,
    handleRemoveReaction,
    showChatSelector,
    setShowChatSelector,
    showOptionsMenu,
    setShowOptionsMenu,
  } = useMessageBubble({
    message,
    isCurrentUser,
    userId,
    onDeleteMessage,
    onAddReaction,
    onEditMessage,
    onRemoveReaction,
    onForwardMessage,
  });

  const handleLayout = () => {
    bubbleRef.current?.measure((_x, _y, width, _height, pageX, pageY) => {
      setBubblePosition({ x: pageX, y: pageY, width });
    });
  };

  const renderMultimedia = () => {
    if (message.multimediaUrl && message.multimediaType === 'image') {
      return (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: message.multimediaUrl }}
            style={styles.messageImage}
            resizeMode="cover"
            onError={() => console.warn('Image failed to load')}
          />
        </View>
      );
    }
    return null;
  };

  const renderReactions = () => {
    if (!message.reactions || message.reactions.length === 0) return null;
    return (
      <View
        style={[
          styles.reactionsContainer,
          isCurrentUser ? styles.reactionsRight : styles.reactionsLeft,
        ]}
      >
        {message.reactions.map((reaction) => (
          <Pressable key={reaction.id} onPress={() => handleRemoveReaction(reaction.id)}>
            <View style={styles.reaction}>
              <ThemedText style={styles.reactionText}>{reaction.emoji}</ThemedText>
            </View>
          </Pressable>
        ))}
      </View>
    );
  };

  return (
    <>
      <Pressable onLongPress={handleLongPress}>
        <View
          testID="message-bubble-container"
          ref={bubbleRef}
          onLayout={handleLayout}
          style={[
            styles.container,
            isCurrentUser ? styles.selfContainer : styles.otherContainer,
          ]}
        >
          <View
            style={[
              styles.bubble,
              isCurrentUser ? styles.selfBubble : styles.otherBubble,
              { backgroundColor: bubbleColors.background },
            ]}
          >
            {renderMultimedia()}
            {message.text && (
              <ThemedText
                style={[
                  styles.messageText,
                  isCurrentUser && !isDark && styles.selfMessageText,
                ]}
              >
                {message.text}
              </ThemedText>
            )}
            <View style={styles.timeContainer}>
              <ThemedText style={styles.timeText}>
                {formatTime(message.timestamp)}
              </ThemedText>
            </View>
            {renderReactions()}
          </View>
        </View>
      </Pressable>

      <OptionsMenu
        visible={showOptionsMenu}
        onClose={() => setShowOptionsMenu(false)}
        onEdit={() => message.text && onEditMessage?.(message.id, message.text)}
        onDelete={() => onDeleteMessage?.(message.id)}
        onAddEmoji={() => setShowEmojiSelector(true)}
        onForward={() => setShowChatSelector(true)}
        position={{
          top: bubblePosition.y,
          left: bubblePosition.x,
          width: bubblePosition.width,
        }}
      />

      <Modal
        visible={showEmojiSelector}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEmojiSelector(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowEmojiSelector(false)}>
          <View style={styles.emojiSelectorContainer}>
            <View style={styles.emojiSelectorHeader}>
              <ThemedText darkColor="#000000">Select Reaction</ThemedText>
            </View>
            <View style={{ height: 300 }}>
              <EmojiSelector
                onEmojiSelected={handleEmojiSelected}
                showSearchBar={false}
                showHistory={false}
                showTabs
                columns={8}
                category={Categories.emotion}
                showSectionTitles={false}
              />
            </View>
          </View>
        </Pressable>
      </Modal>

      <ChatSelector
        visible={showChatSelector}
        onClose={() => setShowChatSelector(false)}
        onChatSelected={handleForward}
      />
    </>
  );
}
