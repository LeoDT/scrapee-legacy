import { Resolvers, Scrap } from '../server-types';

export const resolvers: Resolvers = {
  Query: {
    async scraps(_, { bucketId }, { bucketStorage }) {
      const { scraps } = await bucketStorage.showBucket(bucketId, true);

      return (scraps || []).map((s) => ({ ...s, bucketId }));
    },
  },
  Mutation: {
    async createScrap(_, { input }, { bucketStorage }) {
      const { bucketId, title, source, sourceUrl, createdAt, content } = input;

      const scrapJSON: Partial<Scrap> = {
        title,
        source,
        sourceUrl,
        createdAt,
        content: content.map((c, i) => ({ ...c, key: c.key || i })),
      };

      const scrap = await bucketStorage.createScrapFromJSON(scrapJSON, bucketId);

      return {
        __typename: 'Scrap',
        ...scrap,
        bucketId,
      };
    },
  },
};
