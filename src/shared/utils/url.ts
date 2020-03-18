const absoluteURLAnchor = document.createElement('a');

export function absoluteURL(url: string): string {
  absoluteURLAnchor.href = url;

  return absoluteURLAnchor.href;
}
