import * as React from 'react';
import { Observer } from 'mobx-react-lite';

import { useJobStore } from './store';

export default function List(): JSX.Element {
  const jobStore = useJobStore();

  return (
    <Observer>
      {() => (
        <div>
          {jobStore.jobs.map((job) => (
            <div key={job.id} className="p-2 border-b-2">
              {job.type} - {job.status}
            </div>
          ))}
        </div>
      )}
    </Observer>
  );
}
