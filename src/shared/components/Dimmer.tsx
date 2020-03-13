import * as React from 'react';
import { cx } from 'emotion';

interface DimmableProps extends React.HTMLProps<HTMLDivElement> {
  dimmed?: boolean;
}

export function Dimmable({ className, dimmed = false, ...restProps }: DimmableProps): JSX.Element {
  return (
    <div
      {...restProps}
      className={cx('dimmable relative', { 'overflow-hidden': dimmed }, className)}
    />
  );
}

interface DimmerProps extends React.HTMLProps<HTMLDivElement> {}

export function Dimmer({ children, className, ...restProps }: DimmerProps): JSX.Element {
  return (
    <div
      {...restProps}
      className={cx(
        'dimmer absolute top-0 left-0 h-full w-full flex justify-center items-center',
        className
      )}
    >
      <div className="bg-black opacity-75 absolute top-0 left-0 h-full w-full z-10" />
      {children ? <div className="relative text-white text-2xl z-10">{children}</div> : null}
    </div>
  );
}
