import { User } from '../../mongo/models';
import { UserDoc } from '../../../env';

export default async () => {
  const userList: UserDoc[] = await User.find({ recTime: { $gt: 0 } })
    .sort('-recTime')
    .limit(10);

  let message = '以下为目前忍妹贡献榜前十名：\n\n';

  for (let i = 0; i < userList.length; i++) {
    const item = userList[i];
    const name = item.first_name + (item.last_name || '');
    const id = item.tg_id;
    const count = item.recTime;

    message += `${count} 条 -- <a href="tg://user?id=${id}">${name}</a>\n`;
  }

  return message;
};
