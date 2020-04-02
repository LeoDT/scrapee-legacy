import { merge } from 'lodash';

import { Resolvers } from '../server-types';

import { IntString, DateTime } from '../server/scalars';

import { resolvers as bucketResolvers } from './bucket';
import { resolvers as scrapResolvers } from './scrap';
import { resolvers as libraryResolvers } from './library';

export function createResolvers(): Resolvers {
  return merge(
    {
      IntString,
      DateTime
    },
    bucketResolvers,
    scrapResolvers,
    libraryResolvers
  );
}
