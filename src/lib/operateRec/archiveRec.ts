import { RecommendDoc } from '../../../env';
import { Recommend } from '../../mongo/models';

export default async () => {
  const rec: RecommendDoc = await Recommend.findOne({ isRecommend: 1 }).exec();

  try {
    await rec.updateOne({ isRecommend: 2 });
    return `${rec.originTitle} | ${rec.zhTitle} 推荐结束，已归档`;
  } catch (error) {
    return `${rec.originTitle} | ${rec.zhTitle} 归档失败`;
  }
};
