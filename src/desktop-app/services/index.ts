import { ExecutionResult, GraphQLSchema } from 'graphql';

import { createStorage, BaseStorage } from 'core/storage';
import { loadSchema, graphqlExecutor } from 'core/server/schema';
import { initDatabase, Database } from 'core/database';
import { JobManager } from 'core/job/manager';

import { SerializableGraphQLRequest } from 'core/types';

export interface Services {
  bucketStorage: BaseStorage;
  graphql: {
    schema: GraphQLSchema;
    execute: (r: SerializableGraphQLRequest) => Promise<ExecutionResult>;
  };
  db: Database;
  jobManager: JobManager;
}

export async function initServices(): Promise<Services> {
  const bucketStorage = await createStorage()();
  const graphQLSchema = await loadSchema();
  const db = initDatabase();
  const jobManager = new JobManager({
    db,
    bucketStorage,
  });

  return {
    bucketStorage,
    graphql: {
      schema: graphQLSchema,
      execute: (request: SerializableGraphQLRequest) =>
        graphqlExecutor(graphQLSchema, { bucketStorage, jobManager }, request),
    },
    db,
    jobManager,
  };
}
