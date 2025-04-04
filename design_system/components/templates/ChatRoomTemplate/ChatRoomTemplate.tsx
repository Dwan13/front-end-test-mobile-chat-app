import React from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    FlatList,
    TextInput,
    Pressable,
    View,
    TouchableOpacity,
    Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { ThemedText, ThemedView } from '@/design_system/components/atoms';
import { Avatar } from '@/design_system/components/organisms';
import { IconSymbol } from '@/design_system/ui/vendors';
import { createStyles } from './ChatRoomTemplate.styles';
import { useTheme } from '@/context/ThemeContext';
import { colors, themes } from '@/design_system/ui/tokens';
import { useChatInput } from '@/hooks/useChatInput';

const KEYBOARD_OFFSET = Platform.OS === 'ios' ? 90 : 0;

const EmptyMessageComponent = () => (
    <ThemedView style={{ padding: 16, alignItems: 'center' }}>
        <ThemedText>No messages yet. Say hello!</ThemedText>
    </ThemedView>
);


interface ChatRoomTemplateProps {
    /** Name of the chat room displayed in the header */
    chatName: string;
    /** 
     * Avatar configuration for the chat participant
     * @property user - User object containing avatar information
     * @property size - Size of the avatar in pixels
     */
    participantAvatar?: {
        user: any;
        size: number;
    };
    /** 
     * Array of messages to be displayed in the chat
     * @remarks Each message object should contain at least an id property
     */
    messages: any[];
    /** 
     * Current message text in the input field
     * @remarks Controlled by the parent component
     */
    messageText: string;
    /** 
     * Whether the user is editing an existing message
     * @default false
     */
    isEditing: boolean;
    /** 
     * Callback function triggered when navigating back
     * @remarks Typically used to handle navigation to previous screen
     */
    onBack: () => void;
    /** 
     * Callback function triggered when the message text changes
     * @param text - The new text value from the input field
     */
    onMessageChange: (text: string) => void;
    /** 
     * Callback function triggered when sending a message
     * @param imageUri - Optional URI of an image to be sent with the message
     */
    onSendMessage: (imageUri?: string) => void;
    /** 
     * Function to render each message in the list
     * @param item - The message object to be rendered
     * @returns React node representing the message
     */
    renderMessage: (item: any) => React.ReactNode;
    /** 
     * Reference to the FlatList component
     * @remarks Used for programmatic control of the message list
     */
    flatListRef: React.RefObject<FlatList>;
    /** 
     * Callback function triggered when forwarding a message
     * @param messageId - ID of the message to forward
     * @param targetChatId - ID of the chat to forward to
     */
    onForwardMessage?: (messageId: string, targetChatId: string) => void;
}

/**
 * ChatRoomTemplate component provides a complete layout for a chat room interface.
 * 
 * @component
 * @example
 * <ChatRoomTemplate
 *   chatName="General Chat"
 *   messages={messages}
 *   messageText={messageText}
 *   onMessageChange={setMessageText}
 *   onSendMessage={handleSendMessage}
 *   renderMessage={renderMessage}
 * />
 * 
 * @remarks
 * - Supports keyboard avoidance for better mobile experience
 * - Includes theme-based styling using the app's design system
 * - Handles image selection and sending
 * - Provides a customizable header with back navigation
 */

export const ChatRoomTemplate: React.FC<ChatRoomTemplateProps> = ({
    chatName,
    participantAvatar,
    messages,
    messageText,
    isEditing,
    onBack,
    onMessageChange,
    onSendMessage,
    renderMessage,
    flatListRef,
}) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const { selectedImage, pickImageAsync, handleSend, removeImage } = useChatInput(onSendMessage);
    const canSend = !!messageText.trim() || !!selectedImage;

    return (
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={KEYBOARD_OFFSET}
        >
            <StatusBar style="auto" />
            <Stack.Screen
                options={{
                    headerStyle: {
                        backgroundColor: theme === 'light' ? themes.light.background.main : themes.dark.background.main,
                    },
                    headerTintColor: theme === 'light' ? themes.light.text.contrast : themes.dark.text.contrast,
                    headerTitle: () => (
                        <View style={styles.headerContainer}>
                            {participantAvatar && (
                                <Avatar
                                    user={participantAvatar.user}
                                    size={participantAvatar.size}
                                    showStatus={false}
                                />
                            )}
                            <ThemedText type="defaultSemiBold" numberOfLines={1}>
                                {chatName}
                            </ThemedText>
                        </View>
                    ),
                    headerLeft: () => (
                        <Pressable onPress={onBack}>
                            <IconSymbol name="chevron.left" size={24} color={theme === 'light' ? themes.light.text.black : colors.neutral[100]} />
                        </Pressable>
                    ),
                }}
            />

            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => renderMessage(item) as React.ReactElement}
                contentContainerStyle={styles.messagesContainer}
                ListEmptyComponent={EmptyMessageComponent}
            />

            <ThemedView style={[styles.inputContainer, Platform.OS === 'ios' && styles.iosInputContainer]}>
                <TouchableOpacity style={styles.mediaButton} onPress={pickImageAsync}>
                    <IconSymbol name="photo" size={24} color={theme === 'light' ? themes.light.text.black : colors.neutral[100]} />
                </TouchableOpacity>

                {selectedImage && (
                    <View style={styles.mediaPreviewContainer}>
                        <Image
                            source={{ uri: selectedImage }}
                            style={styles.previewImage}
                            resizeMode="cover"
                        />
                        <TouchableOpacity style={styles.removeMediaButton} onPress={removeImage}>
                            <IconSymbol name="xmark" size={16} color={colors.neutral[100]} />
                        </TouchableOpacity>
                    </View>
                )}

                <TextInput
                    style={styles.input}
                    value={messageText}
                    onChangeText={onMessageChange}
                    placeholder="Type a message..."
                    multiline
                    accessible
                    accessibilityLabel="Message input field"
                />

                <Pressable
                    style={[styles.sendButton, !canSend && styles.disabledButton]}
                    onPress={handleSend}
                    disabled={!canSend}
                >
                    <IconSymbol
                        name={isEditing ? "pencil.circle.fill" : "arrow.up.circle.fill"}
                        size={32}
                        color={theme === 'light' ? themes.light.text.black : colors.neutral[100]}
                    />
                </Pressable>
            </ThemedView>
        </KeyboardAvoidingView>
    );
};

export default ChatRoomTemplate;
