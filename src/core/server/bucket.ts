import { Resolvers } from '../server-types';

export const resolvers: Resolvers = {
  Query: {
    async buckets(_1, _2, { bucketStorage }) {
      return (await bucketStorage.showAllBuckets()).map((id) => ({
        __typename: 'Bucket',
        id,
      }));
    },
  },
  Mutation: {
    async createBucket(_, { input }, { bucketStorage }) {
      const { id, parentId } = input;

      const newId = await bucketStorage.createBucket(id, parentId);

      return {
        __typename: 'Bucket',
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
