import * as React from 'react';

import { sanitizeHTML } from 'shared/utils/html';

interface Props {
  html: string;
}

export default function PreviewHTML({ html }: Props): JSX.Element {
  return (
    <div
      className="preview-html"
      dangerouslySetInnerHTML={{
        __html: sanitizeHTML(html, { absolutifyURLs: false })
      }}
    />
  );
}
