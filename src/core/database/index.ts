import * as path from 'path';

import DB from 'better-sqlite3';

import { ROOT } from 'shared/constants';

import { migrate } from './migrate';
import { Collection } from './collection';

import { Job } from '../server-types';

export interface Database {
  job: Collection<Job>;
}

export function initDatabase(): Database {
  const db = DB(path.resolve(ROOT, 'root.db'));

  migrate(db);

  return {
    job: new Collection(db, 'job'),
  };
}
