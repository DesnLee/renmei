import { Recommend } from '../../mongo/models';
import { RecommendDoc } from '../../../env';

export default async (): Promise<string | RecommendDoc> => {
  try {
    const doc: RecommendDoc | null = await Recommend.findOne({
      isRecommend: 1,
    }).exec();

    if (!doc) return '未找到今日推荐数据';

    return doc;
  } catch (error) {
    return `获取今日推荐数据失败\n\n${error}`;
  }
};
