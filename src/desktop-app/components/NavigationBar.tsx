import * as React from 'react';
import { css, cx } from 'emotion';
import { NavLink } from 'react-router-dom';

import LibraryIcon from '../../assets/library.svg';

interface NavigationBarItemProps {
  children: React.ReactNode;
  to: string;
}

function NavigationBarItem({ children, to }: NavigationBarItemProps): JSX.Element {
  return (
    <NavLink
      to={to}
      activeClassName="bg-gray-600"
      className={cx(css({ height: 60 }), 'flex justify-center items-center')}
    >
      {children}
    </NavLink>
  );
}

export default function NavigationBar(): JSX.Element {
  return (
    <div className={cx(css({ width: 60 }), 'bg-gray-700 text-white')}>
      <NavigationBarItem to="/library">
        <LibraryIcon className="fill-current" />
      </NavigationBarItem>
    </div>
  );
}
