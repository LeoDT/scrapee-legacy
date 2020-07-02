import * as React from 'react';

import { useClient } from '../../ipcClient';

import { JobStore, JobStoreContext } from './store';

import List from './List';

export default function Job(): JSX.Element {
  const client = useClient();
  const [store] = React.useState(() => new JobStore(client));

  React.useEffect(() => {
    store.loadJobs();
  }, []);

  return (
    <JobStoreContext.Provider value={store}>
      <div className="job-main flex-grow">
        <List />
      </div>
    </JobStoreContext.Provider>
  );
}
