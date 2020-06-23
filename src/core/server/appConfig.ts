import { Resolvers } from '../server-types';

export const resolvers: Resolvers = {
  Query: {
    appConfig(_1, _2, { bucketStorage }) {
      return {
        rootPath: bucketStorage.root,
      };
    },
  },
};
