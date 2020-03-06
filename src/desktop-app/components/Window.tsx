import * as React from 'react';
import { css, cx } from 'emotion';

const titleBarClassName = css({
  minHeight: 25
});

export default function Window({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <div className="flex flex-col h-screen">
      <div className={cx(titleBarClassName, 'webkit-app-region-drag', 'bg-gray-800')} />
      <div className="flex flex-grow">{children}</div>
    </div>
  );
}
