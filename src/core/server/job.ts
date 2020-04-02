import { Resolvers } from '../server-types';

export const resolvers: Resolvers = {
  Job: {
    __resolveType() {
      return 'PersistMediaJob';
    }
  }
};
