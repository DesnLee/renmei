import { channel } from '../../getConfig';
import { Recommend } from '../../mongo/models';
import bot from '../bot';
import { btnList } from '../buttons';
import createRecMsg from '../createRecMsg';
import push from '../push';
import requestInfo from '../requestInfo';
import getTodayRec from './getTodayRec';

export default async () => {
  const data = await getTodayRec();
  const balance = await Recommend.countDocuments({ isRecommend: 0 });

  if (typeof data === 'string') {
    await push(data);
    return;
  }

  /**
   * 从 TMDB 获取数据
   */
  const info = await requestInfo(data.type, data.tmdb_id);

  if (typeof info === 'string') {
    await push(info);
    return;
  }

  /**
   * 构造推送消息
   */
  const message = await createRecMsg(info, data);
  try {
    /**
     * 推送消息
     */
    const sentMsg = await bot.sendPhoto(channel, message.imgUrl, {
      caption: message.message,
      parse_mode: `HTML`,
      reply_markup: {
        inline_keyboard: [[btnList.good, btnList.nogood]],
      },
    });

    /**
     * 更新该条消息的 message_id 至数据库
     */
    await data.updateOne({ rec_msg_id: sentMsg.message_id });
    await push(`Channel 推送成功！\n剩余待推荐数量：${balance}`);
  } catch (error) {
    await push(`Channel 推送失败\n${error}`);
  }
};
