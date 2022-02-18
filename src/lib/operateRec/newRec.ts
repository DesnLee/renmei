import { ConversationDoc, RecommendDoc } from '../../../env';
import { Recommend, User } from '../../mongo/models';

export default async (
  conversation: ConversationDoc,
  id: number,
  text?: string
) => {
  const user = await User.findOne({ tg_id: id }).exec();
  const comment = text || '';

  const reg =
    /[\s|\~|`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\|\[|\]|\{|\}|\;|\:|\"|\'|\,|‘|·|，|。|\<|\.|\>|\/|\?]/g;

  const commentWeight = comment
    ? Math.round(comment.replace(reg, '').length / 5) * 2
    : 0;

  const weight = user.weight + commentWeight;

  try {
    const newRecommend: RecommendDoc = await new Recommend({
      tmdb_id: conversation.data.tmdb_id,
      type: conversation.data.type,
      originTitle: conversation.data.originTitle,
      zhTitle: conversation.data.zhTitle,
      text: comment,
      from: user._id,
      weight: weight,
    });

    await newRecommend.save();
    return newRecommend;
  } catch (error) {
    return `保存推荐数据出错，会话结束\n${error}`;
  }
};
