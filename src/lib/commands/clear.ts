import { RecommendDoc } from '../../../env';
import { channel, me } from '../../getConfig';
import { Recommend } from '../../mongo/models';
import bot from '../bot';
import getTodayRec from '../operateRec/getTodayRec';
import push from '../push';

export default async (id: number) => {
  if (id !== me) return '你没有此命令的权限';

  const todayRec = await getTodayRec();

  if (typeof todayRec === 'string') {
    await push(todayRec);
  } else {
    /**
     * 查找最近两条推荐数据
     */
    const findRec: RecommendDoc[] = await Recommend.find({
      rec_msg_id: { $lt: todayRec.rec_msg_id },
    })
      .sort('-rec_msg_id')
      .limit(2);

    /**
     * 选择上上一条为需要清除键盘的数据
     */
    const target = findRec[1];

    try {
      /**
       * 清除内联键盘
       */
      const result = await bot.editMessageReplyMarkup(
        {
          inline_keyboard: [],
        },
        {
          chat_id: channel,
          message_id: target.rec_msg_id,
        }
      );

      if (typeof result !== 'boolean') {
        await push(
          `${target.originTitle} | ${target.zhTitle}\n内联键盘清除成功！\n`
        );
      }
    } catch (error) {
      await push(
        `${target.originTitle} | ${target.zhTitle}\n内联键盘清除失败！${error}\n`
      );
    }
  }
};
