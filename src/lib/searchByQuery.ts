import { CallbackQuery } from 'node-telegram-bot-api';
import { ConversationDoc } from '../../env';
import { Conversation } from '../mongo/models';

export default async (message: CallbackQuery) => {
  try {
    const conversation: ConversationDoc = await Conversation.findOne({
      chat_id: message.message?.chat.id,
      user_id: message.from?.id,
    }).exec();

    return conversation;
  } catch {
    return '查询会话失败，请稍后再试';
  }
};
