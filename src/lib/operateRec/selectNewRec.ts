import { RecommendDoc } from '../../../env';
import { Recommend } from '../../mongo/models';
import random from '../random';

export default async () => {
  const all: RecommendDoc[] = await Recommend.find({ isRecommend: 0 }).sort(
    '-weight'
  );
  const first = all[0].weight;
  const last = all[all.length - 1].weight;
  let newDoc: RecommendDoc;

  /**
   * 如果权重都一样
   */
  if (first === last) {
    let num = random(0, all.length);
    let select: RecommendDoc[];
    try {
      select = await Recommend.find({ isRecommend: 0 })
        .skip(num)
        .limit(1)
        .exec();
    } catch (error) {
      return '查询随机待推荐数据错误';
    }
    newDoc = select[0];
  } else {
    newDoc = all[0];
  }

  try {
    await newDoc.updateOne({ isRecommend: 1 });
    return `${newDoc.originTitle} | ${newDoc.zhTitle} 推荐开始`;
  } catch (error) {
    return `${newDoc.originTitle} | ${newDoc.zhTitle} 设置新的推荐数据失败`;
  }
};
