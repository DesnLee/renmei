import schedule from 'node-schedule';
import { ConversationDoc } from '../../../env';
import { me } from '../../getConfig';
import { Conversation } from '../../mongo/models';
import bot from '../bot';
import clear from '../commands/clear';
import push from '../push';

const clearKeyboard = () => {
  schedule.scheduleJob('0 5 1 * * *', async () => {
    const message = await clear(me);
    if (message) await push(message);
  });
};

const cleanConversation = () => {
  schedule.scheduleJob('0 0 4,10,16,22 * * *', async () => {
    const now = new Date().getTime();
    const conversationList: ConversationDoc[] = await Conversation.find(
      {}
    ).exec();

    for (const conversation of conversationList) {
      const date = conversation.createDate;
      // @ts-ignore
      const createDate = new Date(date).getTime();
      if (now > createDate + 86400000) {
        const opts = {
          chat_id: conversation.chat_id,
          message_id: conversation.message_id,
        };

        conversation.delete();
        await bot.editMessageText(`超过24小时未操作，会话已自动关闭`, opts);
      }
    }
  });
};

export { clearKeyboard, cleanConversation };
