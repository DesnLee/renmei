import { Message } from 'node-telegram-bot-api';
import sendToChannel from './sendToChannel';
import sendToGroup from './sendToGroup';
import sendToPerson from './sendToPerson';

type Type = 'channel' | 'group' | 'person';

export default async (type: Type, receivedMsg?: Message) => {
  switch (type) {
    /**
     * 私聊推送
     */
    case 'person':
      await sendToPerson(receivedMsg!);
      break;

    /**
     * 群组推送
     */
    case 'group':
      await sendToGroup();
      break;

    /**
     * 频道推送
     */
    case 'channel':
      await sendToChannel();
      break;
  }
};
