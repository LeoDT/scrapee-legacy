import { BaseStorage as BucketStorage } from '../storage';

export interface GraphQLServerContext {
  bucketStorage: BucketStorage;
}

export interface GraphQLClientContext {}
