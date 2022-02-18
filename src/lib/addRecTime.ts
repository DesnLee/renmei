import { User } from 'src/mongo/models';
import { UserDoc } from '../../env';

export default async (id: number) => {
  try {
    const user: UserDoc = await User.findOne({ tg_id: id }).exec();
    await user.updateOne({ $inc: { recTime: 1 } });
    return user;
  } catch {
    return false;
  }
};
