import { RecommendDoc, TmdbInfo, UserDoc } from '../../env';
import { User } from '../mongo/models';

export default async (data: TmdbInfo, doc: RecommendDoc) => {
  const user: UserDoc = await User.findById(doc.from).exec();
  const text = doc.text || '';
  const userName = user.first_name + ' ' + (user.last_name || '');
  const imgUrl = 'https://www.themoviedb.org/t/p/w500' + data.poster_path;
  const {
    genres,
    status,
    production_countries,
    origin_country,
    revenue,
    overview,
    title,
    original_title,
    original_language,
    original_name,
    name,
    release_date,
    first_air_date,
    runtime,
    vote_average,
    number_of_seasons,
    number_of_episodes,
    episode_run_time,
    imdb_id,
  } = data;

  /**
   * 构造类型标签
   */
  let tags = '';
  let tagList = [] as string[];
  for (const tag of genres) {
    tagList.push(`#${tag.name}`);
  }
  tags += tagList.join(' ');

  /**
   * 构造地区标签
   */
  let countries = '';
  if (production_countries.length === 0) {
    countries += '未知';
  }

  let countryList = [] as string[];
  for (const country of production_countries) {
    countryList.push(country.iso_3166_1);
  }
  countries += countryList.join(', ');

  /**
   * 构造票房
   */
  let boxOffice = '';
  if (!revenue) {
    boxOffice = '暂无';
  } else {
    boxOffice += '$' + revenue;
  }

  /**
   * 限制字数
   */
  const profiles =
    overview.length > 360 ? overview.slice(0, 360) + '...' : overview;

  /**
   * 电影
   */
  let message = '';

  if (runtime || runtime === 0) {
    message += '#每日推荐  #电影\n\n';
    message += `${tags}\n\n`;
    message += `<b>${original_title} ｜ ${title}</b>\n\n`;
    message += `&#128197 Release Date:  <b>${release_date}</b>\n\n`;
    message += `&#127757 Region:  <b>${countries}</b>\n\n`;
    message += `&#128139 Language:  <b>${original_language.toUpperCase()}</b>\n\n`;
    message += `&#128338 Run Time:  <b>${
      runtime === 0 ? '暂无' : runtime + 'MIN'
    } </b>\n\n`;
    message += `&#128176 Revenue:  <b>${boxOffice}</b>\n\n`;
    message += `&#11088 Vote Average:  <b>${vote_average}</b>\n\n`;
    message += `&#129516 IMDB:  <b>${imdb_id}</b>\n\n\n`;
    message += `${profiles}\n\n\n`;
    message += `Via <a href="https://t.me/TerminusMediaFeed">终点站影视推荐频道</a>\n`;
    message += `From <a href="tg://user?id=${user.tg_id}">${userName}</a>\n\n`;
    message += `${text}`;
  } else {
    message += '#每日推荐  #剧集\n\n';
    message += `${tags}\n\n`;
    message += `<b>${original_name} ｜ ${name}</b>\n\n`;
    message += `&#128197 FirstAir Date:  <b>${first_air_date}</b>\n\n`;
    message += `&#8987 Status:  <b>${status}</b>\n\n`;
    message += `&#127757 Region:  <b>${origin_country}</b>\n\n`;
    message += `&#128139 Language:  <b>${original_language.toUpperCase()}</b>\n\n`;
    message += `&#128250 TV Detail:  <b>${number_of_seasons}季  共${number_of_episodes}集</b>\n\n`;
    message += `&#128338 Run Time:  <b>${
      episode_run_time[0] ? episode_run_time[0] + ' MIN' : '暂无'
    } </b>\n\n`;
    message += `&#11088 Vote Average:  <b>${vote_average}</b>\n\n\n`;
    message += `${profiles}\n\n\n`;
    message += `Via <a href="https://t.me/TerminusMediaFeed">终点站影视推荐频道</a>\n`;
    message += `From <a href="tg://user?id=${user.tg_id}">${userName}</a>\n\n`;
    message += `${text}`;
  }
  return { imgUrl: imgUrl, message: message };
};
