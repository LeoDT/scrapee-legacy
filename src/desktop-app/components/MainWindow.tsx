import * as React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import { useClient } from '../ipcClient';

import Window from './Window';
import NavigationBar from './NavigationBar';

import { MainStore, MainStoreContext } from './store';
import Library from './Library';
import Job from './Job';

export default function MainWindow(): JSX.Element {
  const client = useClient();
  const [mainStore] = React.useState(() => new MainStore(client));
  const [inited, setInited] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      await mainStore.init();
      setInited(true);
    })();
  }, []);

  return (
    <MainStoreContext.Provider value={mainStore}>
      <BrowserRouter>
        <Window>
          <div className="flex-grow-0 flex-shrink-0 flex items-stretch">
            <NavigationBar />
          </div>
          <div className="main flex flex-grow min-w-0">
            {inited ? (
              <Switch>
                <Route path="/library">
                  <Library />
                </Route>
                <Route path="/job">
                  <Job />
                </Route>
                <Redirect from="/" to="/library" />
              </Switch>
            ) : null}
          </div>
        </Window>
      </BrowserRouter>
    </MainStoreContext.Provider>
  );
}
