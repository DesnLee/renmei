import { Message, ParseMode } from 'node-telegram-bot-api';
import { ConversationDoc } from '../../env';
import { parse } from '../getConfig';
import addRecTime from '../lib/addRecTime';
import bot from '../lib/bot';
import isExistRec from '../lib/isExistRec';
import operateId from '../lib/operateId';
import newRec from '../lib/operateRec/newRec';
import { Conversation } from '../mongo/models';

export default async (receivedMsg: Message) => {
  /**
   * 忽略非私聊和命令消息
   */
  if (receivedMsg.chat.type !== 'private') return;
  if (receivedMsg.text?.startsWith('/')) return;

  const chatId = receivedMsg.chat.id;
  const conversation: ConversationDoc | null = await Conversation.findOne({
    chat_id: receivedMsg.chat.id,
    user_id: receivedMsg.from?.id,
  }).exec();

  if (!conversation) {
    await bot.sendMessage(chatId, '请先发送命令开启会话');
    return;
  }

  /**
   * 定义通用选项
   */
  const options = {
    chat_id: receivedMsg.chat.id,
    message_id: conversation.message_id,
    parse_mode: `HTML` as ParseMode,
  };

  /**
   * 如未选择类型
   */
  if (!conversation.data.type) {
    await bot.sendMessage(chatId, '请先选择类型');
    return;
  }

  if (!receivedMsg.text) {
    await bot.sendMessage(chatId, '请输入内容');
    return;
  }

  /**
   * 如已选择类型,还未选择影视
   */
  if (!conversation.data.tmdb_id) {
    let tmdbId = '';

    /**
     * 如果发送的是 TMDB_ID
     */
    if (/^\d+$/.test(receivedMsg.text)) {
      tmdbId = receivedMsg.text;
    } else {
      await bot.sendMessage(receivedMsg.chat.id, 'id 输入错误');
      return;
    }

    const isExist = await isExistRec(conversation.data.type, tmdbId);
    const { message, reply_markup } = await operateId(
      tmdbId,
      conversation,
      isExist
    );
    await bot.editMessageText(message, { reply_markup, ...options });
    return;
  }

  /**
   * 如已选择影视,需要添加影评
   */
  if (conversation.addComment) {
    const rec = await newRec(
      conversation,
      receivedMsg.chat.id,
      receivedMsg.text
    );
    let message: string;

    if (typeof rec === 'string') {
      message = rec;
    } else {
      const addTimeResult = await addRecTime(receivedMsg.chat.id);
      message = !addTimeResult
        ? '添加成功，但修改推荐次数记录失败'
        : `<b>${rec.originTitle} ｜ ${rec.zhTitle}</b>\n\n添加推荐成功，目前你已推荐了 ${addTimeResult.recTime} 条数据，感谢你的贡献，会话已结束`;
    }

    await conversation.delete();
    await bot.deleteMessage(options.chat_id, options.message_id.toString());
    await bot.sendMessage(options.chat_id, message, parse.html);
    return;
  }
};
