import { Bucket } from 'shared/models/Bucket';

export interface DOMClipperApi {
  init(): Promise<{}>;
  loadBuckets(): Promise<{ buckets: Bucket[] }>;
}
