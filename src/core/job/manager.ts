import { Job, JobStatus, JobType, JobData } from '../server-types';

import { JobContext } from './types';
import * as allJobs from './jobs';

export class JobManager {
  context: JobContext;

  constructor(context: JobContext) {
    this.context = context;
  }

  createJob(type: JobType, data: JobData, priority = 0): Job {
    return this.context.db.job.create({
      type,
      data,
      priority,
      status: JobStatus.Created,
    });
  }

  createAndStartJob(type: JobType, data: JobData, priority = 0): Job {
    const job = this.createJob(type, data, priority);

    this.startJob(job);

    return job;
  }

  updateJob(j: Job, update: Partial<Job>): Job {
    return this.context.db.job.update(j, update);
  }

  async startJob(j: Job): Promise<void> {
    const job = this.updateJob(j, { status: JobStatus.Started });

    let processor;

    console.log(typeof job.type, typeof JobType.PersistMedia);
    switch (job.type) {
      case JobType.PersistMedia:
        processor = new allJobs.PersistMediaJobProcessor(job);
        break;

      default:
        break;
    }

    if (processor) {
      try {
        await processor.execute(this.context);

        this.updateJob(job, { status: JobStatus.Finished });
      } catch (err) {
        console.error(err);
        this.updateJob(job, { status: JobStatus.Failed, failReason: err.message });
      }
    } else {
      this.updateJob(job, { status: JobStatus.Failed, failReason: 'Invalid job' });
    }
  }
}
