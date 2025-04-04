import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { users } from "./users";
import uuid from 'react-native-uuid';

/**
 * Table representing chat rooms
 */
export const chats = sqliteTable("chats", {
  id: text("id").primaryKey().default(uuid.v4() as string),
});

/**
 * Table representing participants in chat rooms
 */
export const chatParticipants = sqliteTable("chat_participants", {
  id: text("id").primaryKey().default(uuid.v4() as string),
  chatId: text("chat_id").notNull().references(() => chats.id),
  userId: text("user_id").notNull().references(() => users.id),
});

/**
 * Table representing messages in chat rooms
 */
export const messages = sqliteTable("messages", {
  id: text("id").primaryKey().default(uuid.v4() as string),
  chatId: text("chat_id").notNull().references(() => chats.id),
  senderId: text("sender_id").notNull().references(() => users.id),
  text: text("text"),
  timestamp: integer("timestamp").notNull(),
  editedAt: integer("edited_at"),
  hasMultimedia: integer("has_multimedia").default(0),
  multimediaType: text("multimedia_type"),
  multimediaUrl: text("multimedia_url"),
  thumbnailUrl: text("thumbnail_url"),
  duration: integer("duration"),
  size: integer("size"),
  isRead: integer("is_read").default(0),
  readAt: integer("read_at"),
  forwardedFrom: text("forwarded_from"),
});

/**
 * Table tracking historical participation in chat rooms
 */
export const chatParticipantsHistory = sqliteTable("chat_participants_history", {
  id: text("id").primaryKey().default(uuid.v4() as string),
  chatId: text("chat_id").notNull().references(() => chats.id),
  userId: text("user_id").notNull().references(() => users.id),
  leftAt: integer("left_at").notNull(),
});


/**
 * Table tracking deleted messages
 */
export const deletedMessages = sqliteTable("deleted_messages", {
  id: text("id").primaryKey().default(uuid.v4() as string),
  messageId: text("message_id").notNull().references(() => messages.id),
  userId: text("user_id").notNull().references(() => users.id),
  chatId: text("chat_id").notNull().references(() => chats.id),
  deletedAt: integer("deleted_at").notNull(),
});


/**
 * Table representing reactions to messages
 */
export const messageReactions = sqliteTable("message_reactions", {
  id: text("id").primaryKey().default(uuid.v4() as string),
  messageId: text("message_id").notNull().references(() => messages.id),
  userId: text("user_id").notNull().references(() => users.id),
  emoji: text("emoji").notNull(),
  createdAt: integer("created_at").notNull(),
});
