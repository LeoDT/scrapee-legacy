import { last, cloneDeep } from 'lodash';
import { JSDOM } from 'jsdom';
import { http, https } from 'follow-redirects';
import { IncomingMessage } from 'http';
import * as path from 'path';
import fs from 'fs';

import { xPathWithWindow } from 'shared/utils/domPath';
import uuid from 'shared/utils/uuid';

import { Scrap, Job } from 'core/server-types';

import { JobContext } from '../types';

type BaseScrap = Omit<Scrap, 'bucketId'>;

interface Media {
  key: string | number;
  xPath: string;
  oldUrl: string;
  filename: string;
}

function extractMedia(scrap: BaseScrap): Media[] {
  const medias: Media[] = [];

  scrap.content.forEach((content) => {
    const { window } = new JSDOM(content.value);
    const { document } = window;
    const xPath = xPathWithWindow(window.Node);

    document.querySelectorAll('img').forEach((img) => {
      const src = img.getAttribute('src');

      if (src?.startsWith('http')) {
        medias.push({
          key: content.key,
          xPath: xPath(img),
          oldUrl: src,
          filename: '',
        });
      }
    });
  });

  return medias;
}

function replaceMedias(scrap: BaseScrap, medias: Media[]): BaseScrap {
  const newScrap = cloneDeep(scrap);

  medias.forEach(({ key, xPath, oldUrl, filename }) => {
    const content = newScrap.content.find((c) => c.key === key);

    if (content) {
      const { document } = new JSDOM(content.value).window;
      const xResult = document.evaluate(xPath, document, null, 5);
      const node = xResult.iterateNext();

      if (node) {
        const el = node as Element;
        el.setAttribute('src', '');
        el.setAttribute('data-filename', filename);
        el.setAttribute('data-original-src', oldUrl);
      }

      content.value = document.body.innerHTML;
    }
  });

  return newScrap;
}

function guessFileExtFromResponse(response: IncomingMessage): string {
  const contentType = response.headers['content-type'];

  if (contentType) {
    return contentType.split('/')[1];
  }

  if (response.url) {
    return last(response.url.split('.')) || '';
  }

  return '';
}

export class PersistMediaJobProcessor {
  bucketId: string;
  scrapId: string;

  medias: Media[];

  constructor(job: Job) {
    const { data } = job;

    if (data?.__typename !== 'PersistMediaJobData') {
      throw TypeError(`need PersistMediaJobData but got ${data?.__typename}`);
    }

    this.scrapId = data.scrapId;
    this.bucketId = path.dirname(data.scrapId);
    this.medias = [];
  }

  async download(media: Media, pathRoot: string): Promise<Media> {
    return new Promise((resolve, reject) => {
      const client = media.oldUrl.startsWith('https:') ? https : http;

      client.get(media.oldUrl, (response) => {
        if (response.statusCode === 200) {
          const fileId = uuid.generate();
          const fileExt = guessFileExtFromResponse(response);
          const filename = `${fileId}${fileExt ? `.${fileExt}` : ''}`;
          const filePath = path.resolve(pathRoot, this.bucketId, filename);

          response.pipe(fs.createWriteStream(filePath));

          media.filename = filename;

          resolve(media);
        } else {
          reject(response.statusCode);
        }
      });
    });
  }

  async execute(context: JobContext): Promise<void> {
    const { bucketStorage } = context;

    const scrap = await bucketStorage.readScrapWithId(this.scrapId);

    if (scrap) {
      this.medias = extractMedia(scrap);
    } else {
      throw Error('Scrap not exist');
    }

    const all = await Promise.allSettled(
      this.medias.map((m) => this.download(m, bucketStorage.root))
    );

    const medias = all
      .filter((result): result is PromiseFulfilledResult<Media> => result.status === 'fulfilled')
      .map((result) => result.value);

    const newScrap = replaceMedias(scrap, medias);

    await bucketStorage.updateScrap(scrap.id, newScrap);
  }
}
