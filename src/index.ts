import bot from './lib/bot';
import onCallBackQuery from './listener/onCallBackQuery';
import onMessage from './listener/onMessage';
import onCommand from './listener/onCommand';
import connectDB from './mongo/connectDB';
import { me } from './getConfig';
import cron from './lib/cron/cron';

/**
 * 连接 mongoDB
 */
connectDB().then(async () => {
  await bot.sendMessage(me, `忍妹启动，MongoDB 连接成功！${cron()}`);
});

/**
 * 创建 bot 错误
 */
bot.on('polling_error', console.log);

/**
 * 处理命令
 */
bot.onText(/^\//, onCommand);

/**
 * 处理消息
 */
bot.on('message', onMessage);

/**
 * 处理内联键盘的回调消息
 */
bot.on('callback_query', onCallBackQuery);
