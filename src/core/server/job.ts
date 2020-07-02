import { Resolvers } from '../server-types';

export const resolvers: Resolvers = {
  Job: {
    __resolveType() {
      return 'PersistMediaJob';
    },
  },
  Query: {
    jobs(_1, _2, { db }) {
      return db.job.list();
    },
  },
};
