import { Document, Schema } from 'mongoose';

type RecType = 'movie' | 'tv';

interface UserDoc extends Document {
  tg_id: number;
  first_name: string;
  last_name: string;
  username: string;
  level: 0 | 1 | 2;
  weight: number;
  today: 0 | 1;
  recTime: number;
  date: Schema.Types.Date;
}

interface GroupDoc extends Document {
  tg_id: number;
  name: string;
  type: 'group' | 'channel';
  date: Schema.Types.Date;
}

interface RecommendDoc extends Document {
  tmdb_id: number;
  type: RecType;
  originTitle: string;
  zhTitle: string;
  text: string;
  isRecommend: 0 | 1 | 2;
  weight: number;
  comment: { good: number[]; nogood: number[] };
  rec_msg_id: number;
  black_list: boolean;
  from: Schema.Types.ObjectId;
  addDate: Schema.Types.Date;
}

interface ConversationDoc extends Document {
  chat_id: number;
  user_id: number;
  message_id: number;
  command: string;
  addComment: boolean;
  data: {
    tmdb_id: number;
    type: RecType;
    originTitle: string;
    zhTitle: string;
  };
  createDate: Schema.Types.Date;
}

interface PushMsg {
  pushkey: string;
  text: string;
  desp?: string;
  type: 'markdown' | 'text' | 'image';
}

interface TmdbInfo {
  first_air_date: string;
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: {
    id: number;
    name: string;
    poster_path: string;
    backdrop_path: string;
  };
  budget: number;
  genres: { id: number; name: string }[];
  homepage: string;
  id: number;
  imdb_id?: string;
  original_language: string;
  original_title?: string;
  original_name?: string;
  overview: string;
  popularity: number;
  poster_path: string;
  origin_country: string[];
  number_of_seasons: number;
  number_of_episodes: number;
  production_companies: {
    id: number;
    logo_path: string;
    name: string;
    origin_country: string;
  }[];
  production_countries: { iso_3166_1: string; name: string }[];
  release_date: string;
  revenue?: number;
  runtime: number;
  spoken_languages: { english_name: string; iso_639_1: string; name: string }[];
  status: string;
  tagline: string;
  title?: string;
  name?: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  episode_run_time: number[];
  type: string;
}
