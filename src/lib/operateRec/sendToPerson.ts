import { Message } from 'node-telegram-bot-api';
import { RecommendDoc } from '../../../env';
import { Recommend } from '../../mongo/models';
import bot from '../bot';
import createRecMsg from '../createRecMsg';
import random from '../random';
import requestInfo from '../requestInfo';

export default async (receivedMsg: Message) => {
  const count = await Recommend.countDocuments({ isRecommend: 2 });
  const num = random(0, count);
  const recList: RecommendDoc[] = await Recommend.find({ isRecommend: 2 })
    .skip(num)
    .limit(1);

  const data = recList[0];
  const info = await requestInfo(data.type, data.tmdb_id);

  if (typeof info === 'string') {
    await bot.sendMessage(receivedMsg.chat.id, info);
    return;
  }

  const { img,message } = await createRecMsg(info, data);
  await bot.sendPhoto(receivedMsg.chat.id, img, {
    caption: message,
    parse_mode: `HTML`,
  });
};
