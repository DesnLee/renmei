import { Message } from 'node-telegram-bot-api';
import { Group } from '../../mongo/models';
import { GroupDoc } from '../../../env';

export default async (receivedMsg: Message) => {
  try {
    const group: GroupDoc | null = await Group.findOne({
      tg_id: receivedMsg.chat.id,
    }).exec();

    if (group) return '群组已存在';

    const doc: GroupDoc = await new Group({
      tg_id: receivedMsg.chat.id,
      name: receivedMsg.chat.title,
      type: receivedMsg.chat.type,
    });
    await doc.save();
    return `群组添加成功！\n\nid: ${doc.tg_id}\nname: ${doc.name}`;
  } catch (error) {
    return `群组添加失败！\n\n${error}`;
  }
};
