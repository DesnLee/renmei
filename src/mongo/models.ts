import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  tg_id: Number,
  first_name: String,
  last_name: String,
  username: String,
  level: { type: Number, default: 0 },
  weight: { type: Number, default: 0 },
  today: { type: Number, default: 0 },
  recTime: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
});

const GroupSchema = new Schema({
  tg_id: Number,
  name: String,
  type: { type: String, default: 'group' },
  date: { type: Date, default: Date.now },
});

const RecommendSchema = new Schema({
  tmdb_id: Number,
  type: String,
  originTitle: String,
  zhTitle: String,
  text: String,
  isRecommend: { type: Number, default: 0 },
  weight: { type: Number, default: 0 },
  comment: {
    type: Object,
    default: {
      good: Array,
      nogood: Array,
    },
  },
  rec_msg_id: { type: Number, default: 0 },
  black_list: { type: Boolean, default: false },
  from: { type: Schema.Types.ObjectId, ref: 'User' },
  addDate: { type: Date, default: Date.now },
});

const ConversationSchema = new Schema({
  chat_id: Number,
  user_id: Number,
  message_id: Number,
  command: String,
  addComment: Boolean,
  data: {
    type: Object,
    default: {
      tmdb_id: Number,
      type: String,
      originTitle: String,
      zhTitle: String,
    },
  },
  createDate: { type: Date, default: Date.now },
});

// 使用模式“编译”模型
const User = model('User', UserSchema);
const Recommend = model('Recommend', RecommendSchema);
const Group = model('Group', GroupSchema);
const Conversation = model('Conversation', ConversationSchema);

export { User, Recommend, Group, Conversation };
