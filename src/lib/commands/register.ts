import { Message } from 'node-telegram-bot-api';
import { User } from '../../mongo/models';
import { UserDoc } from '../../../env';

export default async (code: 0 | 1 | 2 | -1, receivedMsg: Message) => {
  if (code !== -1) return '你已经登记过了';

  try {
    const doc: UserDoc = await new User({
      tg_id: receivedMsg.from?.id,
      first_name: receivedMsg.from?.first_name,
      last_name: receivedMsg.from?.last_name,
      username: receivedMsg.from?.username,
    });

    await doc.save();
    return `用户登记成功！\n\nid: ${doc.tg_id}\nname: ${doc.first_name}`;
  } catch (error) {
    return `用户登记失败！\n\n${error}`;
  }
};
