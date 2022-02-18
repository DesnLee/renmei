import { Message } from 'node-telegram-bot-api';
import { ConversationDoc } from '../../../env';
import bot from '../bot';
import searchByMessage from '../searchByMessage';

export default async (receivedMsg: Message) => {
  try {
    const conversation = await searchByMessage(receivedMsg);

    if (!conversation) return '你没有未结束的会话';

    const result: ConversationDoc = await conversation.delete();
    await bot.deleteMessage(result.chat_id, result.message_id.toString());
    return '会话已结束';
  } catch (error) {
    return `结束会话出错\n\n${error}`;
  }
};
