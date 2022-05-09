import TelegramBot, { CallbackQuery } from 'node-telegram-bot-api';
import addRecTime from '../lib/addRecTime';
import bot from '../lib/bot';
import { btnList } from '../lib/buttons';
// import onClickGood from '../lib/onClickGood';
import newRec from '../lib/operateRec/newRec';
import searchByQuery from '../lib/searchByQuery';

export default async (result: CallbackQuery) => {
  const action = result.data;
  const conversation = await searchByQuery(result);

  const chatId = result.message?.chat.id;
  const messageId = result.message?.message_id;
  let options = {
    chat_id: chatId,
    message_id: messageId,
    reply_markup: { inline_keyboard: [[btnList.cancel]] },
  };
  let message = '';
  let alert: { keyboard: undefined | {}; alert: string } = {
    alert: '',
    keyboard: undefined,
  };

  // await bot.answerCallbackQuery(result.id, { text: '开始处理请求' });

  /**
   * 处理内联键盘消息
   */
  switch (action) {
    case 'cancel':
      if (typeof conversation === 'string') {
        message = conversation;
      } else {
        await conversation.delete();
        await bot.deleteMessage(chatId!, messageId!.toString());
        message = '会话已结束';
      }
      break;

    case 'movie':
      if (typeof conversation === 'string') {
        message = conversation;
      } else {
        const selectMovie = await conversation.updateOne({
          data: { type: 'movie' },
        });
        await bot.editMessageText(
          `OK，你选择的是:  <b>🎬 电影</b>\n\n请将该影片的 <b>TMDB ID</b> 发送给我`,
          {
            ...options,
            parse_mode: 'HTML',
            disable_web_page_preview: true,
          }
        );
      }
      break;

    case 'tv':
      if (typeof conversation === 'string') {
        message = conversation;
      } else {
        const selectMovie = await conversation.updateOne({
          data: { type: 'tv' },
        });
        await bot.editMessageText(
          `OK，你选择的是:  <b>📺 剧集</b>\n\n请将该剧集的 <b>TMDB ID</b> 发送给我`,
          {
            ...options,
            parse_mode: 'HTML',
            disable_web_page_preview: true,
          }
        );
      }
      break;

    case 'yes':
      if (typeof conversation === 'string') {
        message = conversation;
      } else {
        const selectMovie = await conversation.updateOne({ addComment: true });
        await bot.editMessageText(`OK，那就请把你的 <b>影评</b> 发送给我吧`, {
          ...options,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        });
      }
      break;

    case 'no':
      if (typeof conversation === 'string') {
        message = conversation;
      } else {
        const addResult = await newRec(conversation, chatId!);
        if (typeof addResult === 'string') {
          message = addResult;
        } else {
          const addTimeResult = await addRecTime(chatId!);
          message = !addTimeResult
            ? '添加成功，但修改推荐次数记录失败'
            : `<b>${addResult.originTitle} ｜ ${addResult.zhTitle}</b>\n\n添加推荐成功，目前你已推荐了 ${addTimeResult.recTime} 条数据，感谢你的贡献，会话已结束`;
        }
        await conversation.delete();
        await bot.deleteMessage(chatId!, messageId!.toString());
      }
      break;

    // case 'good':
    //   alert = await onClickGood(result);
    //   break;
    //
    // case 'nogood':
    //   alert = await onClickGood(result);
    //   break;

    default:
      break;
  }

  if (message) {
    await bot.sendMessage(chatId!, message, {
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    });
  }

  // if (alert.alert) {
  //   if (alert.keyboard) {
  //     try {
  //       await bot.editMessageReplyMarkup(
  //         <TelegramBot.InlineKeyboardMarkup>alert.keyboard,
  //         {
  //           chat_id: chatId,
  //           message_id: messageId!,
  //         }
  //       );
  //     } catch {
  //       console.log('更新 inlineKeyBoard 统计数据错误');
  //     }
  //   }
  //
  //   try {
  //     await bot.answerCallbackQuery(result.id, {
  //       text: alert.alert,
  //       show_alert: true,
  //     });
  //   } catch {
  //     console.log('用户退出聊天界面，无法弹窗');
  //   }
  // }
};
