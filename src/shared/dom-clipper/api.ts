import { Bucket } from 'shared/models/Bucket';

export interface DOMClipperApi {
  loadBuckets(): Promise<{ buckets: Bucket[] }>;
}
