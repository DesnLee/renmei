import { InlineKeyboardMarkup } from 'node-telegram-bot-api';
import { ConversationDoc, RecommendDoc, UserDoc } from '../../env';
import { User } from '../mongo/models';
import { btnList } from './buttons';
import requestInfo from './requestInfo';

type Conversation = ConversationDoc;
type IsExist = RecommendDoc | null;

export default async (
  tmdb_id: string,
  conversation: Conversation,
  isExist: IsExist
) => {
  let message = '';
  let reply_markup: InlineKeyboardMarkup = { inline_keyboard: [] };

  /**
   * 还未被推荐过，操作添加
   */
  if (!isExist) {
    const type = conversation.data.type;
    const id = parseInt(tmdb_id, 10);
    const info = await requestInfo(type, id);

    if (typeof info === 'string') {
      reply_markup.inline_keyboard = [[btnList.cancel]];
      return {
        reply_markup,
        message: info + '，请稍后再试',
      };
    }

    reply_markup.inline_keyboard = [
      [btnList.yes, btnList.no],
      [btnList.cancel],
    ];

    const typeStr = type === 'tv' ? '剧集' : '电影';
    const titleStr = type === 'tv' ? info.name : info.title;
    const originStr = type === 'tv' ? info.original_name : info.original_title;

    await conversation.updateOne({
      data: {
        type: conversation.data.type,
        tmdb_id: id,
        originTitle: originStr,
        zhTitle: titleStr,
      },
    });

    message = `该${typeStr}未入库，忍妹从 <b>TMDB</b> 找到了\n\n<b>${originStr} ｜ ${titleStr}</b>\n\n是否需要添加评论？`;

    return {
      reply_markup,
      message,
    };
  } else {
    /**
     * 如果已经被推荐过了
     */
    const user: UserDoc = await User.findById(isExist.from).exec();
    const name = user.first_name + (user.last_name || '');
    reply_markup.inline_keyboard = [[btnList.cancel]];

    message = `忍妹从库里找到了由 <a href="tg://user?id=${user.tg_id}">${name}</a> 创建`;

    switch (isExist.isRecommend) {
      case 0:
        message += '但还未推荐的';
        break;
      case 1:
        message += '并已进入今日推荐队列的';
        break;
      case 2:
        message += '并已经推荐过的';
        break;
    }

    message += `\n\n<b>${isExist.originTitle} ｜ ${isExist.zhTitle}</b>\n\n暂不支持操作该数据，请重新发送 TMDB ID 给我`;

    return {
      reply_markup,
      message,
    };
  }
};
