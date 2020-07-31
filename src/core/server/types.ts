import { PubSub } from 'graphql-subscriptions';

import { BaseStorage as BucketStorage } from '../storage';
import { JobManager } from '../job/manager';
import { Database } from '../database';

export interface GraphQLServerContext {
  bucketStorage: BucketStorage;
  jobManager: JobManager;
  db: Database;
  pubsub: PubSub;
}
