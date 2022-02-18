import { CallbackQuery } from 'node-telegram-bot-api';
import { RecommendDoc, UserDoc } from '../../env';
import { Recommend, User } from '../mongo/models';
import bot from './bot';
import updateScore from './updateScore';

export default async (message: CallbackQuery) => {
  const userId = message.from.id;
  const user: UserDoc | null = await User.findOne({ tg_id: userId }).exec();
  let keyboard: {} | undefined = undefined;
  let alert: string;

  if (!user) {
    alert = `大哥，你还没和忍妹说过话，先去和忍妹聊聊吧～`;
    return { alert, keyboard };
  }

  if (user.today) {
    alert = `大哥，你今天已经薅过了，明天再来薅吧～`;
    return { alert, keyboard };
  }

  /**
   * 获取该条已评论记录
   */
  const rec: RecommendDoc = await Recommend.findOne({
    rec_msg_id: message.message?.message_id,
  }).exec();
  const commentList = rec.comment.good.concat(rec.comment.nogood);

  /**
   * 判断该用户该条是否已评论
   */
  if (commentList.indexOf(userId) >= 0) {
    alert = `大哥，你已经薅过这条了，换一条薅吧～`;
    return { alert, keyboard };
  }

  /**
   * 更新用户和推荐今日评论记录
   */
  await user.updateOne({ today: 1 });

  if (message.data === 'good') {
    await rec.updateOne({ $push: { 'comment.good': userId } });
  } else if (message.data === 'nogood') {
    await rec.updateOne({ $push: { 'comment.nogood': userId } });
  }

  /**
   * 给用户加分
   */
  const updateScoreResult = await updateScore(userId, '+1');
  if (typeof updateScoreResult === 'string') {
    alert = updateScoreResult;
    return { alert, keyboard };
  }

  console.log(message.id);
  console.log(message.from);

  /**
   * 获取该条推荐最新数据
   */
  const newRec: RecommendDoc = await Recommend.findOne({
    rec_msg_id: message.message?.message_id,
  }).exec();

  /**
   * 如果点赞够 80，给作者奖励
   */
  if (message.data === 'good') {
    if (newRec.comment.good.length === 80) {
      const fromUser: UserDoc | null = await User.findById({
        _id: newRec.from,
      });
      if (fromUser) {
        const updateScoreResult = await updateScore(fromUser.tg_id, '+5');

        if (typeof updateScoreResult !== 'string') {
          await bot.sendMessage(
            fromUser.tg_id,
            `贡献推荐数据收获80个赞，奖励厂妹分 5 分！\n目前厂妹分：${updateScoreResult.score}`
          );
        }
      }
    }
  }

  /**
   * 返回提醒消息和最新 keyboard 内容
   */
  alert = `参与忍妹推剧评论，薅到了厂妹 1 分羊毛！\n目前厂妹分：${updateScoreResult.score}`;
  keyboard = {
    inline_keyboard: [
      [
        {
          text: `👍 喜欢  [${newRec.comment.good.length}]`,
          callback_data: `good`,
        },
        {
          text: `🌀 一般  [${newRec.comment.nogood.length}]`,
          callback_data: `nogood`,
        },
      ],
    ],
  };

  return { alert, keyboard };
};
