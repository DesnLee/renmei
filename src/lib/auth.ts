import { Message } from 'node-telegram-bot-api';
import { User as MongoUser } from '../mongo/models';
import { UserDoc } from '../../env';

export default async (receivedMsg: Message) => {
  const user: UserDoc | null = await MongoUser.findOne({
    tg_id: receivedMsg.from?.id,
  }).exec();

  // 未入库用户
  if (!user) return -1;

  return user.level;
};
