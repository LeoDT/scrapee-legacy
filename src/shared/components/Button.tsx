import * as React from 'react';
import { cx } from 'emotion';

interface Props extends React.HTMLProps<HTMLButtonElement> {
  primary?: boolean;
  danger?: boolean;
}

export default function Button({
  children,
  className,
  primary = false,
  danger = false,
  ...restProps
}: Props): JSX.Element {
  return (
    <button
      {...restProps}
      type="button"
      className={cx(
        'form-control transition-colors duration-200 ease-out',
        {
          'is-disabled': restProps.disabled,
          'bg-gray-400 hover:bg-gray-500 text-gray-800': !danger && !primary,
          'bg-gray-700 hover:bg-gray-800 text-white': primary,
          'bg-red-700 hover:bg-red-800 text-white': danger
        },
        className
      )}
    >
      {children}
    </button>
  );
}
