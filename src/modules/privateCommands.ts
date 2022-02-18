import { Message } from 'node-telegram-bot-api';
import { configMsg, me } from '../getConfig';
import auth from '../lib/auth';

import bot from '../lib/bot';
import addAdmin from '../lib/commands/addAdmin';
import balance from '../lib/commands/balance';
import cancel from '../lib/commands/cancel';
import clear from '../lib/commands/clear';
import operate from '../lib/commands/operate';
import rank from '../lib/commands/rank';
import refresh from '../lib/commands/refresh';
import register from '../lib/commands/register';
import sendRec from '../lib/operateRec/sendRec';

import { User } from '../mongo/models';

export default async (receivedMsg: Message) => {
  const command = receivedMsg.text?.split(' ')[0];
  let message = '';

  /**
   * 获取用户权限码
   */
  const authCode = await auth(receivedMsg);

  if (authCode === -1 && command !== '/start' && command !== '/register') {
    return '你还不是忍妹用户，请先发送 /register 进行登记';
  }

  switch (command) {
    case '/start':
      message = configMsg.start;
      break;

    case '/register':
      message = await register(authCode, receivedMsg);
      break;

    /**
     * 添加 admin
     */
    case '/admin':
      const id = receivedMsg.text?.split(' ')[1];
      message = await addAdmin(authCode, id);
      break;

    /**
     * 查询待推荐
     */
    case '/balance':
      message = await balance(authCode);
      break;

    /**
     * 查询排行榜
     */
    case '/rank':
      message = await rank();
      break;

    /**
     * 查询自身推荐数
     */
    case '/mycount':
      const count = await User.findOne({ tg_id: receivedMsg.from?.id }).exec();
      message = `你目前向忍妹贡献了 ${count.recTime} 条数据，谢谢你🙏`;
      break;

    case '/operate':
      message = await operate(authCode, receivedMsg);
      break;

    case '/cancel':
      message = await cancel(receivedMsg);
      break;

    /**
     * 私聊推荐
     */
    case '/rec':
      await sendRec('person', receivedMsg);
      break;

    /**
     * 手动推送推荐
     */
    case '/push':
      if (authCode < 2) {
        await bot.sendMessage(me, '此命令仅超级管理员可用');
      } else {
        await sendRec('channel');
      }
      break;

    /**
     * 以下为自用命令
     */
    case '/refresh':
      message = await refresh(receivedMsg);
      break;

    case '/clear':
      await clear(receivedMsg.chat.id);
      break;

    default:
      await bot.sendMessage(me, '未知命令');
  }

  return message;
};
