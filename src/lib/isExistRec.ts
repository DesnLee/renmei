import { RecommendDoc, RecType } from '../../env';
import { Recommend } from '../mongo/models';

export default async (type: RecType, id: string) => {
  const recDoc: RecommendDoc | null = await Recommend.findOne({
    type,
    tmdb_id: parseInt(id, 10),
  });

  return recDoc;
};
