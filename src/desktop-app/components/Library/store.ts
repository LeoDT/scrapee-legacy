import { basename } from 'path';
import { decorate, computed, action, observable } from 'mobx';

import { createContextNoNullCheck } from 'shared/utils/react';
import { treeFromPaths, TreeNode } from 'shared/utils/tree';

import { isRootBucket } from 'core/storage/utils';
import { Client } from 'core/client/types';
import { bucketFields, scrapFields, loadBucketQuery } from 'core/client/queries';
import { StatesForCacheEntities } from 'core/client/cacheEntity';
import {
  Bucket,
  Scrap,
  LoadBucketsQuery,
  CreateBucketMutation,
  CreateBucketMutationVariables,
  TrashBucketMutation,
  TrashBucketMutationVariables,
} from 'core/client-types';

interface BucketState {
  expanded: boolean;
  isRoot: boolean;
  name: string;
}

interface ScrapState {
  expanded: boolean;
}

export class LibraryStore {
  client: Client;
  bucketStates: StatesForCacheEntities<Bucket, BucketState>;
  scrapStates: StatesForCacheEntities<Scrap, ScrapState>;

  constructor(client: Client) {
    this.client = client;

    this.bucketStates = new StatesForCacheEntities<Bucket, BucketState>((b) => ({
      expanded: false,
      get isRoot() {
        return isRootBucket(b.id);
      },
      get name() {
        return basename(b.id);
      },
    }));

    this.scrapStates = new StatesForCacheEntities<Scrap, ScrapState>(() => ({
      expanded: false,
    }));

    this.client.send({ query: `query { appConfig { rootPath }}` }).then((c) => console.log(c));
  }

  async loadBuckets(): Promise<void> {
    await this.client.send<LoadBucketsQuery>({
      query: loadBucketQuery,
    });
  }

  async createBucket(name: string, parent: Bucket): Promise<void> {
    await this.client.send<CreateBucketMutation, CreateBucketMutationVariables>({
      query: /* GraphQL */ `
        ${bucketFields}

        mutation CreateBucketMutation($input: CreateBucketInput!) {
          createBucket(input: $input) {
            ...bucketFields
          }
        }
      `,
      variables: {
        input: { id: name, parentId: parent.id },
      },
    });
  }

  async trashBucket(b: Bucket): Promise<void> {
    await this.client.send<TrashBucketMutation, TrashBucketMutationVariables>({
      query: /* GraphQL */ `
        mutation TrashBucketMutation($input: TrashBucketInput!) {
          trashBucket(input: $input)
        }
      `,
      variables: {
        input: { id: b.id },
      },
    });

    this.client.cache.invalidate(b);

    await this.loadBuckets();
  }

  async loadScraps(b: Bucket): Promise<void> {
    await this.client.send({
      query: /* GraphQL */ `
        ${scrapFields}

        query LoadScraps($id: ID!) {
          scraps(bucketId: $id) {
            ...scrapFields
          }
        }
      `,
      variables: {
        id: b.id,
      },
    });
  }

  get buckets(): Bucket[] {
    return this.client.cache.readAll<Bucket>('Bucket');
  }
  get bucketTree(): TreeNode<Bucket> | null {
    return this.buckets.length ? treeFromPaths(this.buckets, (b) => b.id) : null;
  }

  selectedBucketId = '';
  selectBucket(b: Bucket): void {
    this.selectedBucketId = b.id;
  }

  toggleBucket(b: Bucket): BucketState {
    const state = this.bucketStates.get(b);

    state.expanded = !state.expanded;

    return state;
  }

  get scrapsOfSelectedBucket(): Scrap[] {
    return this.client.cache
      .readAll<Scrap>('Scrap')
      .filter((s) => s.bucketId === this.selectedBucketId);
  }

  toggleScrap(s: Scrap): ScrapState {
    const state = this.scrapStates.get(s);

    state.expanded = !state.expanded;

    return state;
  }
}

decorate(LibraryStore, {
  selectedBucketId: observable,
  buckets: computed,
  bucketTree: computed,
  toggleBucket: action,
});

export const [useLibraryStore, LibraryStoreContext] = createContextNoNullCheck<LibraryStore>();
