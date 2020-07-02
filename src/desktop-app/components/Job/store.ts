import { createContextNoNullCheck } from 'shared/utils/react';

import { loadJobsQuery } from 'core/client/queries';
import { Client } from 'core/client/types';
import { Job, LoadJobsQuery } from 'core/client-types';

export class JobStore {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  async loadJobs(): Promise<void> {
    await this.client.send<LoadJobsQuery>({
      query: loadJobsQuery,
    });
  }

  get jobs(): Job[] {
    return this.client.cache.readAll<Job>('Job');
  }
}

export const [useJobStore, JobStoreContext] = createContextNoNullCheck<JobStore>();
