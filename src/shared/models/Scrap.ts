import uuid from '../../shared/utils/uuid';

export type ScrapType = 'text' | 'file';
export type ScrapSource = 'web-clipper';

export interface ScrapContent {
  key: string | number;
  value: string;
}

export class Scrap {
  id: string;
  name?: string;

  type: ScrapType;
  source?: ScrapSource;

  url?: URL;
  originalHTML?: string;
  content: ScrapContent[];

  constructor(name = '', type: ScrapType = 'text') {
    this.name = name;
    this.type = type;

    this.id = uuid.new();

    this.content = [];
  }

  generateKeyForNewContent(): number {
    const numberKeys = this.content
      .map(({ key }) => key)
      .filter((k): k is number => typeof k === 'number');

    return Math.max(0, ...numberKeys);
  }

  addTextContent(value: string, key?: string): ScrapContent {
    const content = { value, key: key ?? this.generateKeyForNewContent() };

    this.content.push(content);

    return content;
  }
}
