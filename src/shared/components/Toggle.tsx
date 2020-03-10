import * as React from 'react';
import { cx } from 'emotion';

interface Props extends Omit<React.HTMLProps<HTMLDivElement>, 'label'> {
  checked?: boolean;
  label?: React.ReactNode;
}

export default function Toggle({
  className,
  checked = false,
  label,
  ...restProps
}: Props): JSX.Element {
  return (
    <div {...restProps} className={cx('toggle flex items-center cursor-pointer', className)}>
      <div
        className={cx('bg-gray-300 rounded-full w-10 transition duration-200 ease-in-out', {
          'bg-green-500': checked
        })}
        style={{ padding: '0.12rem 0.1rem' }}
      >
        <div
          className={cx(
            'bg-white rounded-full w-5 h-5 shadow-sm transform transition duration-200 ease-in-out',
            {
              'translate-x-4': checked
            }
          )}
        />
      </div>
      <div className="ml-2">{label}</div>
    </div>
  );
}
