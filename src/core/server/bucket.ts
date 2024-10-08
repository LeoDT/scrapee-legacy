import { Resolvers } from '../server-types';

export const resolvers: Resolvers = {
  Subscription: {
    bucketsUpdate: {
      subscribe(_1, _2, { pubsub }) {
        return pubsub.asyncIterator('bucketsUpdate');
      },
    },
  },
  Query: {
    async buckets(_1, _2, { bucketStorage }) {
      return (await bucketStorage.showAllBuckets()).map((id) => ({
        __typename: 'Bucket' as const,
        id,
      }));
    },
  },
  Mutation: {
    async createBucket(_, { input }, { bucketStorage }) {
      const { id, parentId } = input;

      const newId = await bucketStorage.createBucket(id, parentId);

      return {
        __typename: 'Bucket' as const,
        id: newId,
      };
    },
    async trashBucket(_, { input }, { bucketStorage }) {
      const { id } = input;

      await bucketStorage.trash(id);

      return true;
    },
  },
};
