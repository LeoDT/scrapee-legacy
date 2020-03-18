import * as React from 'react';
import { cx } from 'emotion';

import ChevronDownIcon from '../../assets/icon/chevron-down.svg';

interface Option {
  text: string;
  value: string;
}

interface Props extends React.HTMLProps<HTMLSelectElement> {
  options: Option[];
}

export default function Select({ className, options, ...restProps }: Props): JSX.Element {
  return (
    <div className={cx('select inline-block relative w-64', className)}>
      <select
        {...restProps}
        className={cx(
          'form-control block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 pr-8 shadow focus:outline-none focus:shadow-outline',
          {
            'is-disabled': restProps.disabled
          }
        )}
      >
        {options.map(o => (
          <option value={o.value} key={o.value}>
            {o.text}
          </option>
        ))}
      </select>
      <div
        className={cx('pointer-events-none absolute inset-y-0 right-0 flex items-center px-2', {
          'opacity-50': restProps.disabled
        })}
      >
        <ChevronDownIcon />
      </div>
    </div>
  );
}
