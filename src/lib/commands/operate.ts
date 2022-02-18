import { Message } from 'node-telegram-bot-api';
import { Conversation } from 'src/mongo/models';
import { ConversationDoc } from '../../../env';
import { parse } from '../../getConfig';
import bot from '../bot';
import { btnList } from '../buttons';
import createConversation from '../createConversation';

type Code = -1 | 0 | 1 | 2;

export default async (code: Code, receivedMsg: Message) => {
  if (code < 1) {
    return `你没有权限管理推荐，请联系 <a href="https://t.me/DesnLeeBot">Lee</a> 开通`;
  }

  const chatId = receivedMsg.chat.id;

  /**
   * 查找已存在会话
   */
  const conversation: ConversationDoc | null = await Conversation.findOne({
    cha_tid: receivedMsg.chat.id,
    user_id: receivedMsg.from?.id,
  }).exec();

  /**
   * 如果已经开始对话
   */
  if (conversation) return '还有未结束的会话，请先完成该会话或关闭会话后重试';

  /**
   * 创建会话，取得结果
   */
  const doc = await createConversation('/operate', receivedMsg);

  /**
   * 创建出错
   */
  if (typeof doc === 'string') {
    return doc;
  }

  /**
   * 创建成功，发送带按钮的消息，并记录 message_id
   */
  const message = `<b>Hello，我是忍妹～</b>\n\n感谢你向 <b><a href="https://t.me/EmbyPublic">Terminus 终点站</a></b> 推荐好的影视作品，辛苦了！\n\n我每日会从推荐库中随机推送一部至 <b><a href="https://t.me/TerminusMediaFeed">终点站影视推荐频道</a></b>\n\n要开始推荐，请先选择影视类型`;

  try {
    const sentMsg = await bot.sendMessage(chatId, message, {
      ...parse.html,
      reply_markup: {
        inline_keyboard: [[btnList.movie, btnList.tv], [btnList.cancel]],
      },
    });

    await doc.updateOne({ message_id: sentMsg.message_id });
    return '';
  } catch (error) {
    return `开始推荐出错，请 /cancel 之后重试\n${error}`;
  }
};
