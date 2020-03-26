import { omit } from 'lodash';
import { DateTime } from 'luxon';

import uuid from 'shared/utils/uuid';
import { Bucket } from './Bucket';

export type ScrapType = 'text' | 'file';
export type ScrapSource = 'web-clipper';

export interface ScrapContent {
  key: string | number;
  type: ScrapType;
  value: string;

  originalHTML?: string;
  xPath?: string;
}

export type ScrapContentMeta = Partial<Omit<ScrapContent, 'value'>>;

export type RawScrap = Partial<Pick<Scrap, 'id' | 'name' | 'source' | 'sourceUrl' | 'content'>>;

export class Scrap {
  static fromJSON(json: PlainObject, parent: Bucket): Scrap {
    const scrap = new Scrap((json.id as string) ?? uuid.generate(), parent);

    scrap.name = json.name as string;
    scrap.source = json.source as ScrapSource;
    scrap.sourceUrl = json.sourceUrl as string;
    scrap.createdAt = DateTime.fromISO(json.createdAt as string);

    scrap.content = json.content as ScrapContent[];

    return scrap;
  }

  static clone(scrap: Scrap, id?: string): Scrap {
    const clone = new Scrap(id ?? uuid.generate());

    clone.id = scrap.id;
    clone.source = scrap.source;
    clone.sourceUrl = scrap.sourceUrl;
    clone.createdAt = scrap.createdAt;

    clone.content = scrap.content.map(c => ({ ...c }));

    return clone;
  }

  id: string;
  parent?: Bucket;

  name?: string;
  source?: ScrapSource;
  sourceUrl?: string;

  content: ScrapContent[];

  createdAt: DateTime;

  constructor(id: string, parent?: Bucket) {
    this.id = id;
    this.parent = parent;

    this.createdAt = DateTime.local();

    this.content = [];
  }

  toJSON(): PlainObject {
    return omit(this, 'parent');
  }

  generateKeyForNewContent(): number {
    const numberKeys = this.content
      .map(({ key }) => key)
      .filter((k): k is number => typeof k === 'number');

    return Math.max(0, ...numberKeys) + 1;
  }

  addTextContent(
    value: string,
    { originalHTML, key, xPath, type = 'text' }: ScrapContentMeta
  ): ScrapContent {
    const content: ScrapContent = {
      type,
      value,
      key: key ?? this.generateKeyForNewContent(),
      originalHTML,
      xPath
    };

    this.content.push(content);

    return content;
  }
}
