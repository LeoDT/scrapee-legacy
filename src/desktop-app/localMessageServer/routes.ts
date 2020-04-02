import { success, fail } from 'shared/utils/localMessage';

import { Routes, LocalMessageServerContext } from './types';

export function createRoutes(context: LocalMessageServerContext): Routes {
  return {
    init: async ({ send }) => {
      send();
    },
    buckets: async ({ send }) => {
      send(success({ buckets: await context.bucketStorage.showAllBuckets() }));
    },
    createScrap: async ({ request, send }) => {
      const { bucketId, scrap } = request.body as { bucketId: string; scrap: PlainObject };

      if (typeof bucketId === 'string' && scrap) {
        await context.bucketStorage.createScrapFromJSON(scrap, bucketId);

        send();
      } else {
        send(fail());
      }
    }
  };
}
