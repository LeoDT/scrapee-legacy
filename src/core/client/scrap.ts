import { Resolvers, ScrapFieldsFragment } from '../client-types';

import { scrapFields } from './fragments';

export const resolvers: Resolvers = {
  Scrap: {
    expanded({ expanded }) {
      return expanded ?? true;
    }
  },
  Mutation: {
    toggleScrap(_, { id, expanded }, { cache, getCacheKey }) {
      const cacheId = getCacheKey({ __typename: 'Scrap', id });
      const old = cache.readFragment<ScrapFieldsFragment>({
        fragment: scrapFields,
        id: cacheId
      });

      cache.writeFragment({
        id: cacheId,
        fragment: scrapFields,
        data: { ...old, expanded: expanded ?? !old?.expanded }
      });

      return true;
    }
  }
};
