import { Recommend } from '../../mongo/models';

export default async (code: -1 | 0 | 1 | 2) => {
  if (code < 1) return '此命令仅管理员可用';

  let message: string;

  try {
    const count = await Recommend.countDocuments({ isRecommend: 0 });
    message = `剩余待推荐数量为 ${count.toString()}`;
  } catch (error) {
    message = `查询失败！\n\n${error}`;
  }

  return message;
};
