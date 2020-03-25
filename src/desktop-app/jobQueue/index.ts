import { resolve } from 'path';
import DataStore from 'nedb';

import { ROOT } from 'shared/constants';

const persistFileName = resolve(ROOT, 'jobs');
export const db = new DataStore({ filename: persistFileName, autoload: true });
