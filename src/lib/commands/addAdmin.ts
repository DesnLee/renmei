import { User } from '../../mongo/models';
import { UserDoc } from '../../../env';

type Code = -1 | 0 | 1 | 2;
type Id = number | string | undefined;

export default async (code: Code, id: Id) => {
  if (code < 2) return '此命令仅超级管理员可用';

  if (!id) return '缺少参数';

  let idNumber: number;
  if (typeof id === 'string') {
    idNumber = parseInt(id);
  } else {
    idNumber = id;
  }

  try {
    const user: UserDoc | null = await User.findOne({ tg_id: idNumber }).exec();
    if (!user) return '未找到对应用户';

    const result = await user.updateOne({ level: 1 });
    return `匹配到 ${result.matchedCount}条文档\n更新了 ${result.modifiedCount}条文档`;
  } catch (error) {
    return `修改用户权限失败！\n\n${error}`;
  }
};
