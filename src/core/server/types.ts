import { BaseStorage as BucketStorage } from '../storage';
import { JobManager } from '../job/manager';

export interface GraphQLServerContext {
  bucketStorage: BucketStorage;
  jobManager: JobManager;
}
