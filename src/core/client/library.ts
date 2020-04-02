import { InMemoryCache } from 'apollo-cache-inmemory';

import { Resolvers, LibraryStateQuery } from '../client-types';

import { libraryStateQuery } from './queries';

const INITIAL_STATE = { __typename: 'LibraryState', selectedBucketId: '' };

export function initState(cache: InMemoryCache): void {
  cache.writeData({ data: { libraryState: INITIAL_STATE } });
}

export const resolvers: Resolvers = {
  Mutation: {
    selectBucket(_, { id }, { cache }) {
      const state = cache.readQuery<LibraryStateQuery>({ query: libraryStateQuery });

      if (state?.libraryState.selectedBucketId === id) {
        return true;
      }

      cache.writeQuery({
        query: libraryStateQuery,
        data: {
          libraryState: { ...(state ? state.libraryState : INITIAL_STATE), selectedBucketId: id }
        }
      });

      return true;
    }
  }
};
