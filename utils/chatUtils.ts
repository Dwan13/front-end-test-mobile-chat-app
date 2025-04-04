import { Message } from '@/types/Chat';

export const getUserReaction = (message: Message, userId: string) => {
  return message.reactions.find(reaction => reaction.userId === userId);
};

export const hasUserReacted = (message: Message, userId: string) => {
  return message.reactions.some(reaction => reaction.userId === userId);
};
