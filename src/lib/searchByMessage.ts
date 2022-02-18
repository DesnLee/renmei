import { Message } from 'node-telegram-bot-api';
import { ConversationDoc } from '../../env';
import { Conversation } from '../mongo/models';

export default async (message: Message) => {
  const conversation: ConversationDoc | null = await Conversation.findOne({
    chat_id: message.chat.id,
    user_id: message.from?.id,
  }).exec();

  return conversation;
};
