import * as React from 'react';
import { cx } from 'emotion';

interface Props extends React.HTMLProps<HTMLButtonElement> {}

export default function Button({ children, className, ...restProps }: Props): JSX.Element {
  return (
    <button
      {...restProps}
      type="button"
      className={cx(
        'form-control bg-gray-300 hover:bg-gray-400 text-gray-800',
        {
          'is-disabled': restProps.disabled
        },
        className
      )}
    >
      {children}
    </button>
  );
}
