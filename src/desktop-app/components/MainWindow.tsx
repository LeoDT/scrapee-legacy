import * as React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import Window from './Window';
import NavigationBar from './NavigationBar';

import Library from './Library';

export default function MainWindow(): JSX.Element {
  return (
    <BrowserRouter>
      <Window>
        <div className="flex-grow-0 flex-shrink-0 flex items-stretch">
          <NavigationBar />
        </div>
        <div className="main flex flex-grow min-w-0">
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
