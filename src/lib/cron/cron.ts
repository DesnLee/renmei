import { cleanConversation, clearKeyboard } from './clearSomething';
import { changeRec, reset } from './resetStatus';
import { channel, group } from './sendMessage';

export default () => {
  channel();
  group();
  clearKeyboard();
  cleanConversation();
  reset();
  changeRec();
  return '定时任务已开启';
};
