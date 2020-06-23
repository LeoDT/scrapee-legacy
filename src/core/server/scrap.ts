import { Resolvers, Scrap, JobType } from '../server-types';

export const resolvers: Resolvers = {
  Query: {
    async scraps(_, { bucketId }, { bucketStorage }) {
      const { scraps } = await bucketStorage.showBucket(bucketId, true);

      return (scraps || []).map((s) => ({ ...s, bucketId }));
    },
  },
  Mutation: {
    async createScrap(_, { input }, { bucketStorage, jobManager }) {
      const { bucketId, title, source, sourceUrl, createdAt, content } = input;

      const scrapJSON: Partial<Scrap> = {
        title,
        source,
        sourceUrl,
        createdAt,
        content: content.map((c, i) => ({ ...c, key: c.key || i })),
      };

      const scrap = await bucketStorage.createScrapFromJSON(scrapJSON, bucketId);

      jobManager.createAndStartJob(JobType.PersistMedia, {
        __typename: 'PersistMediaJobData',
        scrapId: scrap.id,
      });

      return {
        __typename: 'Scrap' as const,
        ...scrap,
        bucketId,
      };
    },
  },
};
