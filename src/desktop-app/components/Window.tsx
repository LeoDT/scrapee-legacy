import * as React from 'react';
import { css, cx } from 'emotion';

const titleBarClassName = css({
  minHeight: 25
});

export default function Window({
  children,
  className
}: React.HTMLProps<HTMLDivElement>): JSX.Element {
  return (
    <div className={cx('flex flex-col h-screen overflow-hidden select-none', className)}>
      <div className={cx(titleBarClassName, 'webkit-app-region-drag z-50 bg-gray-800')} />
      <div className="flex flex-grow overflow-hidden">{children}</div>
    </div>
  );
}
