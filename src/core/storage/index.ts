import path from 'path';
import { promises as fs } from 'fs';
import fsExtra from 'fs-extra';
import klaw from 'klaw';
import { DateTime } from 'luxon';

import uuid from 'shared/utils/uuid';
import { ROOT, ROOT_BUCKET_NAME, TRASH_BUCKET_NAME } from 'shared/constants';

import { Scrap } from '../server-types';

export const BUCKETS_ROOT = path.resolve(ROOT, ROOT_BUCKET_NAME);
export const TRASH_ROOT = path.resolve(ROOT, TRASH_BUCKET_NAME);

const SCRAP_FILENAME_REGEXP = /scrap.*\.json$/i;

type BaseScrap = Omit<Scrap, 'bucketId'>;

export class BaseStorage {
  root: string;
  rootRegex: RegExp;

  constructor(root: string) {
    this.root = root;

    this.rootRegex = new RegExp(`^${this.root}/?`);
  }

  private resolve(p: string): string {
    return path.resolve(this.root, p);
  }

  private unresolve(p: string): string {
    return p.replace(this.rootRegex, '');
  }

  isScrapFile(path: string): boolean {
    return SCRAP_FILENAME_REGEXP.test(path);
  }

  walk(
    p: string,
    walker: (item: klaw.Item) => void,
    options?: { depthLimit?: number }
  ): Promise<void> {
    return new Promise((resolve) => {
      klaw(this.resolve(p), options)
        .on('data', walker)
        .on('end', () => resolve());
    });
  }

  async showAllBuckets(): Promise<string[]> {
    const buckets: string[] = [];

    await this.walk(this.root, (item) => {
      if (item.stats.isDirectory()) {
        buckets.push(this.unresolve(item.path));
      }
    });

    return buckets;
  }

  async showBucket(
    p: string,
    withScraps = false
  ): Promise<{ paths: string[]; scraps?: BaseScrap[] }> {
    const fullPath = this.resolve(p);
    const paths: string[] = [];

    await this.walk(
      fullPath,
      (item) => {
        if (item.path !== fullPath) paths.push(this.unresolve(item.path));
      },
      { depthLimit: 0 }
    );

    const scraps: BaseScrap[] = [];

    if (withScraps) {
      const scrapPromises = paths
        .filter((p) => this.isScrapFile(p))
        .map(async (p) => this.readScrap(this.resolve(p)));

      const results = await Promise.allSettled(scrapPromises);
      results.forEach((r) => {
        if (r.status === 'fulfilled') {
          scraps.push(r.value);
        } else {
          console.log(r.reason);
        }
      });
    }

    return { paths, scraps };
  }

  async readScrap(fullPath: string): Promise<BaseScrap> {
    const file = (await fs.readFile(fullPath)).toString();

    return JSON.parse(file, (k, v) => {
      if (k === 'createdAt') {
        return DateTime.fromISO(v);
      }

      return v;
    });
  }

  async readScrapWithId(id: string): Promise<BaseScrap> {
    return this.readScrap(this.resolve(id));
  }

  async createBucket(name: string, parent: string): Promise<string> {
    const id = path.join(parent, name);
    const fullPath = this.resolve(id);

    await fs.mkdir(fullPath);

    return this.unresolve(fullPath);
  }

  async createScrapFromJSON(json: Record<string, unknown>, parent: string): Promise<BaseScrap> {
    const id = path.join(parent, `scrap.${uuid.generate()}.json`);
    const scrap = { ...json, id } as Scrap;
    const fullPath = this.resolve(id);

    console.log('craete scrap from json');
    await fs.writeFile(fullPath, JSON.stringify(scrap));

    return scrap;
  }

  async updateScrap(scrapId: string, update: Record<string, unknown>): Promise<BaseScrap> {
    const fullPath = this.resolve(scrapId);

    const scrap = await this.readScrap(fullPath);
    await fs.writeFile(fullPath, JSON.stringify({ ...scrap, ...update }));

    return scrap;
  }

  async move(src: string, dst: string, overwrite = false): Promise<void> {
    const srcFullPath = this.resolve(src);
    const dstFullPath = path.resolve(this.resolve(dst), path.basename(srcFullPath));

    await fsExtra.move(srcFullPath, dstFullPath, {
      overwrite,
    });
  }

  async trash(src: string): Promise<void> {
    await fsExtra.ensureDir(TRASH_ROOT);

    const srcFullPath = this.resolve(src);
    const basename = path.basename(srcFullPath);
    let dstFullPath = path.resolve(TRASH_ROOT, basename);

    try {
      await fsExtra.move(srcFullPath, dstFullPath, { overwrite: false });
    } catch (e) {
      if (e.message === 'dest already exists.') {
        const suffix = DateTime.local().toFormat('yyyy-LL-dd HH:mm:ss');
        dstFullPath = path.resolve(TRASH_ROOT, `${basename}(${suffix})`);

        await fsExtra.move(srcFullPath, dstFullPath, { overwrite: false });
      }
    }
  }
}

export function createStorage(root = BUCKETS_ROOT): () => Promise<BaseStorage> {
  let cache: BaseStorage | null = null;

  return async function storage(): Promise<BaseStorage> {
    if (cache) return cache;

    cache = new BaseStorage(root);

    return cache;
  };
}
