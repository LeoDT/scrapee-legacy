import { Bucket } from 'shared/models/Bucket';
import { Scrap } from 'shared/models/Scrap';

export interface DOMClipperApi {
  // native requests
  init(): Promise<{}>;
  loadBuckets(): Promise<{ buckets: Bucket[] }>;
  saveScrap(request: { bucketId: string; scrap: Scrap }): Promise<{}>;
}
