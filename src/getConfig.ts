import { readFileSync } from 'fs';
import { load } from 'js-yaml';
import { resolve } from 'path';
import { SendMessageOptions } from 'node-telegram-bot-api';

interface Config {
  database_url: string;
  bot_token: string;
  me: number;
  super_admin: number[];
  channel: number;
  msg: { start: string; help: string };
  push_key: string;
  tmdb_api_key: string;
  // search_url: string;
  // score_path: string;
  parse: {
    html: SendMessageOptions;
    mark: SendMessageOptions;
    mark2: SendMessageOptions;
  };
}

/**
 * 读取配置文件为config
 */
const input = readFileSync(resolve('./env/config.yaml')).toString();
const config = load(input) as Config;

const {
  database_url: databaseUrl,
  bot_token: botToken,
  me,
  super_admin: superAdmin,
  channel,
  msg: configMsg,
  push_key: pushkey,
  tmdb_api_key: tmdbApiKey,
  // search_url: searchUrl,
  // score_path: scorePath,

  parse,
} = config;

export {
  databaseUrl,
  botToken,
  me,
  superAdmin,
  channel,
  configMsg,
  pushkey,
  tmdbApiKey,
  // searchUrl,
  // scorePath,
  parse,
};
