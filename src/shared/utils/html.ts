import createDOMPurify from 'dompurify';

import { absoluteURL } from './url';

const purify = createDOMPurify(window);

/* #region configs */
purify.setConfig({
  ALLOWED_TAGS: [
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
    'wbr'
  ],
  ALLOWED_ATTR: [
    'title',
    'id',
    'href',
    'src',
    'srcset',
    'alt',
    'max',
    'value',
    'rowspan',
    'colspan',
    'datetime'
  ]
});
/* #endregion */

purify.addHook('uponSanitizeElement', node => {
  if (node instanceof Element) {
    if (node.hasAttribute('data-scrapee-ignore')) {
      return node.parentNode?.removeChild(node);
    }

    if (node.hasAttribute('src')) {
      const src = node.getAttribute('src');

      if (src) node.setAttribute('src', absoluteURL(src));
    }
  }

  return node;
});

export function sanitizeHTML(html: string): string {
  return purify.sanitize(html).trim();
}
