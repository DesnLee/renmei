import axios from 'axios';
import { RecType, TmdbInfo } from '../../env';
import { tmdbApiKey } from '../getConfig';

export default async (type: RecType, tmdb_id: number) => {
  try {
    const res = await axios({
      baseURL: 'https://api.themoviedb.org',
      url: `/3/${type}/${tmdb_id}`,
      headers: {
        'Authorization': `Bearer ${tmdbApiKey}`,
        'Content-Type': 'application/json;charset=utf-8',
      },
      params: {
        language: 'zh',
      },
    });

    return res.data as TmdbInfo;
  } catch (error) {
    return `请求 TMDB 失败\nid: ${tmdb_id}\ntype: ${type}`;
  }
};
