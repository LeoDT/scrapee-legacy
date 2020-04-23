import { ExecutionResult, GraphQLSchema } from 'graphql';

import { createStorage, BaseStorage } from 'core/storage';
import { loadSchema, graphqlExecutor } from 'core/server/schema';

import { SerializableGraphQLRequest } from 'core/types';

export interface Services {
  bucketStorage: BaseStorage;
  graphql: {
    schema: GraphQLSchema;
    execute: (r: SerializableGraphQLRequest) => Promise<ExecutionResult>;
  };
}

export async function initServices(): Promise<Services> {
  const bucketStorage = await createStorage()();
  const graphQLSchema = await loadSchema();

  return {
    bucketStorage,
    graphql: {
      schema: graphQLSchema,
      execute: (request: SerializableGraphQLRequest) =>
        graphqlExecutor(graphQLSchema, { bucketStorage }, request),
    },
  };
}
