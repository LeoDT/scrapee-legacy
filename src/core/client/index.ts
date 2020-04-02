import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { withScalars } from 'apollo-link-scalars';
import {
  InMemoryCache,
  NormalizedCacheObject,
  IntrospectionFragmentMatcher
} from 'apollo-cache-inmemory';
import { ipcRenderer } from 'electron';
import { createIpcLink } from 'graphql-transport-electron';
import { makeExecutableSchema } from 'graphql-tools';

import introspectionQueryResultData from '../introspection-result';

import typeDefs from './schema.graphql';
import { initState } from './init';
import { createResolvers } from './resolvers';

export function createClient(): ApolloClient<NormalizedCacheObject> {
  const resolvers = createResolvers();
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers
  });

  const cache = new InMemoryCache({
    fragmentMatcher: new IntrospectionFragmentMatcher({ introspectionQueryResultData })
  });

  initState(cache);

  return new ApolloClient<NormalizedCacheObject>({
    cache,
    link: ApolloLink.from([withScalars({ schema }), createIpcLink({ ipc: ipcRenderer })]),
    typeDefs,
    resolvers
  });
}
