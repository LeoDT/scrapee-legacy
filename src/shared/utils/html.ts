import { absoluteURL } from './url';

const VALID_TAGS = new Set([
  'a',
  'abbr',
  'address',
  'article',
  'aside',
  'audio',
  'b',
  'bdi',
  'bdo',
  'big',
  'blockquote',
  'br',
  'caption',
  'cite',
  'code',
  'content',
  'dd',
  'del',
  'details',
  'dfn',
  'div',
  'dl',
  'dt',
  'em',
  'fieldset',
  'figcaption',
  'figure',
  'footer',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'header',
  'hgroup',
  'hr',
  'i',
  'img',
  'ins',
  'kbd',
  'label',
  'legend',
  'li',
  'main',
  'mark',
  'menu',
  'menuitem',
  'meter',
  'nav',
  'ol',
  'p',
  'picture',
  'pre',
  'progress',
  'q',
  'rp',
  'rt',
  'ruby',
  's',
  'samp',
  'section',
  'small',
  'source',
  'span',
  'strike',
  'strong',
  'sub',
  'summary',
  'sup',
  'table',
  'tbody',
  'td',
  'tfoot',
  'th',
  'thead',
  'time',
  'tr',
  'track',
  'u',
  'ul',
  'var',
  'video',
  'wbr',
  'svg',
]);

const VALID_ATTRS = ['title', 'id'];
const VALID_ATTRS_BY_TAG: Record<string, string[] | string> = {
  a: ['href'],
  img: ['src', 'alt', 'width', 'height'],
  video: ['src', 'width', 'height'],
  audio: ['src'],
  td: ['rowspan', 'colspan'],
  time: ['datetime'],
  progress: ['max', 'value'],
  source: '*',
  track: '*',
};

interface SanitizeHTMLOptions {
  absolutifyURLs?: boolean;
}

function shouldBeRejected(el: Element): boolean {
  const style = getComputedStyle(el);
  const tagName = el.tagName.toLowerCase();

  /* Take care of an mXSS pattern using p, br inside svg */
  if (tagName === 'svg' && el.querySelectorAll('p, br').length > 0) {
    return true;
  }

  return (
    style.display === 'none' || !VALID_TAGS.has(tagName) || el.hasAttribute('data-scrapee-ignore')
  );
}

function createTreeWalker(root: Element): TreeWalker {
  return document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        return shouldBeRejected(node as Element)
          ? NodeFilter.FILTER_REJECT
          : NodeFilter.FILTER_ACCEPT;
      }

      return NodeFilter.FILTER_ACCEPT;
    },
  });
}

function cleanAttrs(el: Element): void {
  const validAttrs = VALID_ATTRS_BY_TAG[el.tagName.toLowerCase()];

  for (let i = 0; i < el.attributes.length; i++) {
    const { name } = el.attributes[i];

    if (validAttrs === '*' || validAttrs?.includes(name) || VALID_ATTRS.includes(name)) {
      continue;
    } else {
      el.removeAttribute(name);
    }
  }
}

function absolutifyURLAttrs(el: Element): void {
  const src = el.getAttribute('src');
  const href = el.getAttribute('href');

  if (src) el.setAttribute('src', absoluteURL(src));
  if (href) el.setAttribute('href', absoluteURL(href));
}

function cleanImportNode(options?: SanitizeHTMLOptions): (el: Element, deep?: boolean) => Element {
  const doc = document.implementation.createHTMLDocument();

  return function importNode(el: Element, deep = false): Element {
    const newEl = doc.importNode(el, el.tagName === 'svg' ? true : deep);

    if (newEl.nodeType === Node.ELEMENT_NODE) {
      if (newEl.tagName !== 'svg') {
        cleanAttrs(newEl);
      }

      if (options && options.absolutifyURLs) {
        absolutifyURLAttrs(newEl);
      }
    }

    return newEl;
  };
}

export function sanitizeHTMLElement(root: Element, options?: SanitizeHTMLOptions): string {
  if (process.env.NODE_ENV === 'development') {
    console.time('sanitize html element');
  }

  const importNode = cleanImportNode(options);
  const dstRoot = importNode(root);
  const walker = createTreeWalker(root);

  let nodeCounter = 0;

  let src: Element;
  let dst: Element;
  let lastSrc: Element;
  let lastDst: Element;

  const lastEls: Array<[Element, Element]> = [[root, dstRoot]];

  function walk(): void {
    [lastSrc, lastDst] = lastEls[lastEls.length - 1];
    dst = importNode(src);

    function check(): boolean {
      if (src.parentNode === lastSrc) {
        lastDst.appendChild(dst);
      } else if (src.previousSibling === lastSrc) {
        lastDst.parentNode?.appendChild(dst);
      } else {
        return false;
      }

      lastEls.push([src, dst]);

      return true;
    }

    let noHit;

    if (!check()) {
      lastEls.pop();

      while ((noHit = lastEls.pop())) {
        [lastSrc, lastDst] = noHit;

        if (check()) {
          break;
        }
      }
    }
  }

  while ((src = walker.nextNode() as Element)) {
    nodeCounter += 1;
    walk();
  }

  if (process.env.NODE_ENV === 'development') {
    console.timeEnd('sanitize html element');
    console.log(`sanitize ${nodeCounter} html element`);
  }

  return dstRoot.outerHTML;
}
