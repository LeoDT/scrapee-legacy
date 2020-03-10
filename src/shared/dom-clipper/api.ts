import { Bucket } from 'shared/models/Bucket';

export interface DOMClipperApi {
  // native requests
  init(): Promise<{}>;
  loadBuckets(): Promise<{ buckets: Bucket[] }>;
  saveScrap(request: { bucketId: string; text: string }): Promise<{}>;
}
