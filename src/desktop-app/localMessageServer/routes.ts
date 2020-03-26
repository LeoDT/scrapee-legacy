import { success, fail } from 'shared/utils/localMessage';

import { Routes } from './types';
import { db } from '../db/main';
import { Bucket, walkBucket } from 'shared/models/Bucket';

export const routes: Routes = {
  init: async ({ send }) => {
    send();
  },
  rootBucket: async ({ send }) => {
    const root = await db.loadBucket('');

    // only buckets remained
    walkBucket(root, b => {
      if (b instanceof Bucket) {
        b.children.replace(b.childrenBuckets);
      }
    });

    send(success({ root }));
  },
  saveScrap: async ({ request, send }) => {
    const { bucketId, scrap } = request.body as { bucketId: string; scrap: PlainObject };

    if (typeof bucketId === 'string' && scrap) {
      const bucket = await db.loadBucket(bucketId);
      await db.createScrapFromJSON(scrap, bucket);

      send();
    } else {
      send(fail());
    }
  }
};
