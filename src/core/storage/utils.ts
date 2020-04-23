import { dirname, basename } from 'path';

export function isRootBucket(id: string): boolean {
  return id === '';
}

export function bucketName(p: string): string {
  return basename(p);
}

export function getParent(p: string): string {
  const d = dirname(p);

  return d === '.' ? '' : d;
}
