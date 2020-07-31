import { computed, decorate, observable, IObservableArray } from 'mobx';
import { DateTime } from 'luxon';

import { sanitizeHTMLElement } from 'shared/utils/html';
import { xPathWithWindow } from 'shared/utils/domPath';

import { isRootBucket } from 'core/storage/utils';
import { Client } from 'core/client/types';
import { loadBucketsQuery, createScrapMutation } from 'core/client/queries';
import {
  ScrapSource,
  Bucket,
  LoadBucketsQuery,
  ScrapType,
  ScrapContentInput,
  CreateScrapMutation,
  CreateScrapMutationVariables,
} from 'core/client-types';

export class Store {
  client: Client;
  xPath: ReturnType<typeof xPathWithWindow>;

  selectedBucket: Bucket | null;

  constructor(client: Client) {
    this.client = client;

    this.selectedBucket = null;

    this.xPath = xPathWithWindow(window.Node);
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
      query: loadBucketsQuery,
    });

    const root = this.buckets.find((b) => isRootBucket(b.id));

    if (root) {
      this.selectBucket(root);
    }
  }

  scrapContents: IObservableArray<ScrapContentInput> = observable.array([]);

  addScrapContent(el: HTMLElement): ScrapContentInput {
    const scrapContent: ScrapContentInput = {
      type: ScrapType.Text,
      value: sanitizeHTMLElement(el, { absolutifyURLs: true }),
      originalHTML: el.outerHTML,
      xPath: this.xPath(el),
    };

    this.scrapContents.push(scrapContent);

    return scrapContent;
  }

  async saveScrap(): Promise<void> {
    if (!this.selectedBucket) return;

    const input = {
      bucketId: this.selectedBucket.id,
      title: document.title,
      source: ScrapSource.Clipper,
      sourceUrl: location.href,
      content: this.scrapContents,
      createdAt: DateTime.local(),
    };

    await this.client.send<CreateScrapMutation, CreateScrapMutationVariables>({
      query: createScrapMutation,
      variables: { input },
    });

    this.scrapContents.replace([]);
  }
}

decorate(Store, {
  selectedBucket: observable.ref,
  buckets: computed,
});
