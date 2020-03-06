import * as React from 'react';
import { cx } from 'emotion';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import Window from './Window';
import NavigationBar from './NavigationBar';

import Library from './Library';

export default function MainWindow(): JSX.Element {
  return (
    <BrowserRouter>
      <Window>
        <div className={cx('flex-grow-0', 'flex-shrink-0', 'flex', 'items-stretch')}>
          <NavigationBar />
        </div>
        <div className="main flex flex-grow">
          <Switch>
            <Route path="/library">
              <Library />
            </Route>
            <Redirect from="/" to="/library" />
          </Switch>
        </div>
      </Window>
    </BrowserRouter>
  );
}
