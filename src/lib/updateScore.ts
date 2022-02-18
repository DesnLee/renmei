import axios from 'axios';
import { scorePath, searchUrl } from '../getConfig';

export default async (id: number, score: string) => {
  const isUser = await axios({
    url: searchUrl + id,
    method: 'GET',
  });

  if (isUser.data.error) {
    return (isUser.data.error + '，无法增加积分') as string;
  } else {
    const updateResult = await axios({
      url: searchUrl + id + scorePath + score,
      method: 'GET',
    });
    return updateResult.data;
  }
};
