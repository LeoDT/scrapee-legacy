import { Resolvers } from '../server-types';

export const resolvers: Resolvers = {
  Query: {
    async allBuckets(_1, _2, { bucketStorage }) {
      return {
        buckets: (await bucketStorage.showAllBuckets()).map(id => ({
          __typename: 'Bucket',
          id
        }))
      };
    }
  },
  Mutation: {
    createBucket() {
      return 'create';
    }
  }
};
