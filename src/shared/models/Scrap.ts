import uuid from '../../shared/utils/uuid';

export type ScrapType = 'text' | 'file';
export type ScrapSource = 'web-clipper';

export interface ScrapContent {
  key: string;
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
}
