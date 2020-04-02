import { InMemoryCache } from 'apollo-cache-inmemory';

export interface GraphQLClientContext {
  cache: InMemoryCache;
  getCacheKey(obj: { __typename: string; id: string }): string;
}
