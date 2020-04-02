import { bucketName } from '../storage/utils';
import { Resolvers, BucketFieldsFragment } from '../client-types';
import { bucketFields } from './fragments';

export const resolvers: Resolvers = {
  Bucket: {
    expanded({ id, expanded }) {
      if (typeof expanded === 'undefined') {
        return id === '';
      }

      return expanded;
    },
    name({ id }) {
      return bucketName(id);
    }
  },
  Query: {
    bucket(_, { id }, { cache, getCacheKey }) {
      return cache.readFragment<BucketFieldsFragment>({
        fragment: bucketFields,
        id: getCacheKey({ __typename: 'Bucket', id })
      });
    }
  },
  Mutation: {
    toggleBucket(_, { id, expanded }, { cache, getCacheKey }) {
      const cacheId = getCacheKey({ __typename: 'Bucket', id });
      const old = cache.readFragment<BucketFieldsFragment>({
        fragment: bucketFields,
        id: cacheId
      });

      cache.writeFragment({
        id: cacheId,
        fragment: bucketFields,
        data: { ...old, expanded: expanded ?? !old?.expanded }
      });

      return true;
    }
  }
};
