import axios from 'axios';
import { pushkey } from '../getConfig';
import { PushMsg } from '../../env';

export default async (message: string) => {
  let params = {} as PushMsg;

  params.pushkey = pushkey;
  params.text = '【忍妹】' + message;
  // params.desp =  message;
  params.type = 'markdown';

  await axios({
    method: 'POST',
    baseURL: 'https://api2.pushdeer.com',
    url: '/message/push',
    data: params,
  });
};
