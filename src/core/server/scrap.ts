import { Resolvers } from '../server-types';

export const resolvers: Resolvers = {
  Query: {
    async scraps(_, { bucketId }, { bucketStorage }) {
      const { scraps } = await bucketStorage.showBucket(bucketId, true);

      return (scraps || []).map((s) => ({ ...s, bucketId }));
    },
  },
};
