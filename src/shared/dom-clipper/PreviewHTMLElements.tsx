import * as React from 'react';

import { sanitizeHTML } from 'shared/utils/html';

interface Props {
  els: HTMLElement[];
}

export default function PreviewHTMLElements({ els }: Props): JSX.Element {
  return (
    <div
      className="preview-html border mt-2 p-4 bg-white overflow-y-auto"
      style={{ maxHeight: 300 }}
    >
      {els.map((el, i) => (
        <div key={i} dangerouslySetInnerHTML={{ __html: sanitizeHTML(el.outerHTML) }} />
      ))}
    </div>
  );
}
