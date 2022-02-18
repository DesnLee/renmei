import { Message } from 'node-telegram-bot-api';
import bot from '../lib/bot';
import groupCommands from '../modules/groupCommands';
import privateCommands from '../modules/privateCommands';
import { parse } from '../getConfig';

export default async (receivedMsg: Message) => {
  console.log(
    `用户: ${
      receivedMsg.from?.first_name + (receivedMsg.from?.last_name || '')
    }, ID: ${receivedMsg.from?.id}, command: ${receivedMsg.text?.split(' ')[0]}`
  );

  let message: string;

  /**
   * 非私聊命令
   */
  if (receivedMsg.chat.type !== 'private') {
    message = await groupCommands(receivedMsg);
  } else {
    /**
     * 私聊命令
     */
    message = await privateCommands(receivedMsg);
  }

  if (!message) return;
  await bot.sendMessage(receivedMsg.chat.id, message, parse.html);
};
