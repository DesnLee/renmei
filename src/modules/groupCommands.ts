import { Message } from 'node-telegram-bot-api';
import addGroup from '../lib/commands/addGroup';

export default async (receivedMsg: Message) => {
  const command = receivedMsg.text?.split(' ')[0];
  let message = '';

  switch (command) {
    case '/addgroup':
      message = await addGroup(receivedMsg);
  }

  return message;
};
