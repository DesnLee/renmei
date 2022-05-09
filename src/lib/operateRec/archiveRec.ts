import { RecommendDoc } from '../../../env';
import { Recommend } from '../../mongo/models';

export default async () => {
  let rec: RecommendDoc
  try {
    rec = await Recommend.findOne({ isRecommend: 1 }).exec()
  } catch (error) {
    return `查找本日推荐数据失败`;
  }

  try {
    await rec.updateOne({ isRecommend: 2 });
    return `${rec.originTitle} | ${rec.zhTitle} 推荐结束，已归档`;
  } catch (error) {
    return `${rec.originTitle} | ${rec.zhTitle} 归档失败`;
  }
};
