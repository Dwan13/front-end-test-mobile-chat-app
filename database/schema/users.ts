import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import uuid from 'react-native-uuid';

/**
 * Table representing users in the application
 */
export const users = sqliteTable("users", {
  /** Unique identifier for the user */
  id: text("id").primaryKey().default(uuid.v4() as string),
  /** Display name of the user */
  name: text("name").notNull(),
  /** URL or path to the user's avatar image */
  avatar: text("avatar").notNull(),
  /** Current status of the user */
  status: text("status", { enum: ["online", "offline", "away"] }).notNull(),
});