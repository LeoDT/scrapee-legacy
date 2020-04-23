import { computed, decorate, observable } from 'mobx';
import { DateTime } from 'luxon';

import { sanitizeHTMLElement } from 'shared/utils/html';
import { xPathWithWindow } from 'shared/utils/domPath';

import { isRootBucket } from 'core/storage/utils';
import { Client } from 'core/client/types';
import { loadBucketQuery, createScrapMutation } from 'core/client/queries';
import {
  ScrapSource,
  Bucket,
  LoadBucketsQuery,
  ScrapType,
  CreateScrapMutation,
  CreateScrapMutationVariables,
} from 'core/client-types';

export class Store {
  client: Client;

  selectedBucket: Bucket | null;

  constructor(client: Client) {
    this.client = client;

    this.selectedBucket = null;
  }

  get buckets(): Bucket[] {
    return this.client.cache.readAll<Bucket>('Bucket');
  }

  selectBucket(b: Bucket): void {
    this.selectedBucket = b;
  }

  selectBucketWithId(id: string): void {
    const b = this.buckets.find((b) => b.id === id);

    if (b) {
      this.selectBucket(b);
    }
  }

  async loadBuckets(): Promise<void> {
    await this.client.send<LoadBucketsQuery>({
      query: loadBucketQuery,
    });

    const root = this.buckets.find((b) => isRootBucket(b.id));

    if (root) {
      this.selectBucket(root);
    }
  }

  async saveScrap(els: HTMLElement[]): Promise<void> {
    if (!this.selectedBucket) return;

    const xPath = xPathWithWindow(window.Node);
    const input = {
      bucketId: this.selectedBucket.id,
      title: document.title,
      source: ScrapSource.Clipper,
      sourceUrl: location.href,
      content: els.map((el) => ({
        type: ScrapType.Text,
        value: sanitizeHTMLElement(el, { absolutifyURLs: true }),
        originalHTML: el.outerHTML,
        xPath: xPath(el),
      })),
      createdAt: DateTime.local(),
    };

    await this.client.send<CreateScrapMutation, CreateScrapMutationVariables>({
      query: createScrapMutation,
      variables: { input },
    });
  }
}

decorate(Store, {
  selectedBucket: observable.ref,
  buckets: computed,
});
