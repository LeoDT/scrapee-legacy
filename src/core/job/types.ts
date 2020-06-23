import { BaseStorage as BucketStorage } from '../storage';
import { Database } from '../database';

export interface JobContext {
  bucketStorage: BucketStorage;
  db: Database;
}
