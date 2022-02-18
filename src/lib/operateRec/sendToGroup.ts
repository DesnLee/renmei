import { GroupDoc } from '../../../env';
import { channel } from '../../getConfig';
import { Group, Recommend } from '../../mongo/models';
import bot from '../bot';
import createRecMsg from '../createRecMsg';
import push from '../push';
import requestInfo from '../requestInfo';
import getTodayRec from './getTodayRec';

export default async () => {
  const data = await getTodayRec();
  const balance = await Recommend.countDocuments({ isRecommend: 0 });
  const groupList: GroupDoc[] = await Group.find({
    type: { $ne: 'channel' },
  }).exec();

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
    for (const group of groupList) {
      await bot.sendPhoto(group.tg_id, message.imgUrl, {
        caption: message.message,
        parse_mode: `HTML`,
      });
    }

    await push(`Channel 推送成功！\n剩余待推荐数量：${balance}`);
  } catch (error) {
    await push(`Channel 推送失败\n${error}`);
  }
};
