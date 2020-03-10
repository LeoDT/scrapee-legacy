import * as React from 'react';

interface Props {
  els: HTMLElement[];
}

export default function PreviewHTMLElements({ els }: Props): JSX.Element {
  return (
    <div
      className="preview-html-elements border mt-2 p-2 bg-white whitespace-pre-wrap overflow-y-auto"
      style={{ maxHeight: 300 }}
    >
      {els.map((el, i) => (
        <div key={i}>{el.textContent}</div>
      ))}
    </div>
  );
}
