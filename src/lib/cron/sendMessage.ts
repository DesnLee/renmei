import schedule from 'node-schedule';
import sendRec from '../operateRec/sendRec';

const channel = () => {
  schedule.scheduleJob('0 0 1 * * *', async () => {
    await sendRec('channel');
  });
};
const group = () => {
  schedule.scheduleJob('0 0 2,13 * * *', async () => {
    await sendRec('group');
  });
};

export { channel, group };
