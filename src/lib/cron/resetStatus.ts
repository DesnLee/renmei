import schedule from 'node-schedule';
import { UserDoc } from '../../../env';
import { User } from '../../mongo/models';
import archiveRec from '../operateRec/archiveRec';
import selectNewRec from '../operateRec/selectNewRec';
import push from '../push';

const changeRec = () => {
  schedule.scheduleJob('0 3 16 * * *', async () => {
    let message: string;
    message = await archiveRec();
    message += '\n';
    message += await selectNewRec();
    await push(message);
  });
};

const reset = () => {
  schedule.scheduleJob('0 0 16 * * *', async () => {
    const userList: UserDoc[] = await User.find({ _id: { $exists: true } });
    for (const user of userList) {
      await user.updateOne({ today: 0 });
    }
    await push('点赞次数已重置');
  });
};

export { reset, changeRec };
