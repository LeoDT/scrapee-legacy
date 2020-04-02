import { Scrap } from 'core/client-types';

export interface DOMClipperApi {
  // native requests
  init(): Promise<{}>;
  loadBuckets(): Promise<{ buckets: string[] }>;
  createScrap(request: { bucketId: string; scrap: Scrap }): Promise<{}>;
}
