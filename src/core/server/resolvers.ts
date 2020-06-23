import { merge } from 'lodash';

import { customScalars } from 'shared/utils/graphql';

import { Resolvers } from '../server-types';

import { resolvers as appConfigResolvers } from './appConfig';
import { resolvers as bucketResolvers } from './bucket';
import { resolvers as scrapResolvers } from './scrap';
import { resolvers as jobResolvers } from './job';

export function createResolvers(): Resolvers {
  return merge(
    {
      ...customScalars,
    },
    appConfigResolvers,
    bucketResolvers,
    scrapResolvers,
    jobResolvers
  );
}
