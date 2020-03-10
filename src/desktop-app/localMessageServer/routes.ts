import { getChildBuckets } from 'shared/models/Bucket';
import { Scrap } from 'shared/models/Scrap';
import { success } from 'shared/utils/localMessage';

import { Routes } from './types';
import { readRootBucket, saveScrap } from '../db';

export const routes: Routes = {
  init: async ({ send }) => {
    send();
  },
  buckets: async ({ send }) => {
    const root = await readRootBucket();

    send(success({ buckets: getChildBuckets(root) }));
  },
  saveScrap: async ({ request, send }) => {
    const { bucketId, text } = request.body as { bucketId: string; text: string };

    if (bucketId && text) {
      const scrap = new Scrap();
      scrap.source = 'web-clipper';

      scrap.addTextContent(text);

      await saveScrap(bucketId, scrap);
    }

    send();
  }
};
