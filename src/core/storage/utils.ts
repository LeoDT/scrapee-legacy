import { dirname, basename } from 'path';
import { Scrap, ScrapContent, ScrapType } from '../server-types';

export function generateKeyForNewContent(scrap: Scrap): number {
  const numberKeys = scrap.content
    .map(({ key }) => key)
    .filter((k): k is number => typeof k === 'number');

  return Math.max(0, ...numberKeys) + 1;
}

export function addTextContentToScrap(
  scrap: Scrap,
  value: string,
  partials: Partial<ScrapContent>
): ScrapContent {
  const content: ScrapContent = {
    key: generateKeyForNewContent(scrap),
    ...partials,
    type: ScrapType.Text,
    value
  };

  scrap.content.push(content);

  return content;
}

export function bucketName(p: string): string {
  return basename(p);
}

export function getParent(p: string): string {
  const d = dirname(p);

  return d === '.' ? '' : d;
}
