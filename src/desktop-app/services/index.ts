import { GraphQLSchema } from 'graphql';
import { PubSub } from 'graphql-subscriptions';

import { createStorage, BaseStorage } from 'core/storage';
import {
  loadSchema,
  graphqlExecutor,
  graphqlSubscribeExecutor,
  GraphQLExecutorResult,
  GraphQLSubscribeExecutorResult,
} from 'core/server/schema';
import { initDatabase, Database } from 'core/database';
import { JobManager } from 'core/job/manager';

import { SerializableGraphQLRequest } from 'core/types';

import { BucketWatcher } from './bucketWatcher';

export interface Services {
  bucketStorage: BaseStorage;
  graphql: {
    schema: GraphQLSchema;
    execute: (r: SerializableGraphQLRequest) => GraphQLExecutorResult;
    subscribe: (
      r: SerializableGraphQLRequest
    ) => GraphQLSubscribeExecutorResult;
  };
  db: Database;
  jobManager: JobManager;
  pubsub: PubSub;
  bucketWatcher: BucketWatcher;
}

export async function initServices(): Promise<Services> {
  const bucketStorage = await createStorage()();
  const graphQLSchema = await loadSchema();
  const db = initDatabase();
  const jobManager = new JobManager({
    db,
    bucketStorage,
  });
  const pubsub = new PubSub();
  const graphQLServerContext = { bucketStorage, jobManager, db, pubsub };
  const bucketWatcher = new BucketWatcher(bucketStorage, pubsub);

  return {
    bucketStorage,
    graphql: {
      schema: graphQLSchema,
      execute: (request: SerializableGraphQLRequest) =>
        graphqlExecutor(graphQLSchema, graphQLServerContext, request),
      subscribe: (request: SerializableGraphQLRequest) =>
        graphqlSubscribeExecutor(graphQLSchema, graphQLServerContext, request),
    },
    db,
    jobManager,
    pubsub,
    bucketWatcher,
  };
}
