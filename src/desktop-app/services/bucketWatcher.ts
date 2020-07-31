import { Stats as FSStats } from 'fs';
import { PubSub } from 'graphql-subscriptions';
import chokidar from 'chokidar';
import { DateTime } from 'luxon';

import { BaseStorage } from 'core/storage';
import { bucketName } from 'core/storage/utils';

export class BucketWatcher {
  bucketStorage: BaseStorage;
  pubsub: PubSub;

  watcher: chokidar.FSWatcher;

  constructor(bucketStorage: BaseStorage, pubsub: PubSub) {
    this.bucketStorage = bucketStorage;
    this.pubsub = pubsub;

    this.watcher = chokidar.watch(this.bucketStorage.root, {
      ignoreInitial: true,
    });

    this.start();
  }

  start(): void {
    this.watcher.on('addDir', this.onFileUpdate);
    this.watcher.on('add', this.onFileUpdate);
    this.watcher.on('change', this.onFileUpdate);
    this.watcher.on('unlinkDir', this.onFileRemove);
    this.watcher.on('unlink', this.onFileRemove);
  }

  onFileRemove = (): void => {};

  onFileUpdate = (path: string, stats?: FSStats): void => {
    const isBucket =
      stats?.isDirectory() || !this.bucketStorage.isScrapFile(path);
    const bucket = isBucket
      ? this.bucketStorage.unresolve(path)
      : this.bucketStorage.unresolve(bucketName(path));

    if (isBucket) {
      this.pubsub.publish('bucketsUpdate', {
        bucketsUpdate: DateTime.local(),
      });
    } else {
      this.pubsub.publish('bucketUpdate', {
        bucketUpdate: {
          id: bucket,
          __typename: 'Bucket',
        },
      });
    }
  };
}
