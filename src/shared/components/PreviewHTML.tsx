import * as React from 'react';

interface Props {
  html: string;
}

export default function PreviewHTML({ html }: Props): JSX.Element {
  return (
    <div
      className="preview-html"
      dangerouslySetInnerHTML={{
        __html: html
      }}
    />
  );
}
