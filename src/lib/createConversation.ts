import { Message } from 'node-telegram-bot-api';
import { ConversationDoc } from '../../env';
import { Conversation } from '../mongo/models';

export default async (command: string, receivedMsg: Message) => {
  try {
    const newConversation: ConversationDoc = new Conversation({
      chat_id: receivedMsg.chat.id,
      user_id: receivedMsg.from?.id,
      command,
    });

    await newConversation.save();
    return newConversation;
  } catch (error) {
    return `创建会话出错\n${error}`;
  }
};
