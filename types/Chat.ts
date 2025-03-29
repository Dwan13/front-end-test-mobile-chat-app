export interface MessageReaction {
  id: string;
  userId: string;
  emoji: string;
  createdAt: number;
}

export interface MessageReadReceipt {
  userId: string;
  readAt: number;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
  reactions: MessageReaction[];
  editedAt?: number;
  status?: 'sent' | 'delivered' | 'read';
  readReceipts?: MessageReadReceipt[];
}

export interface Chat {
  id: string;
  participants: string[];
  messages: Message[];
  lastMessage?: Message;
}