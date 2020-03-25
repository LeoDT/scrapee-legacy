export type JobStatus = 'created' | 'queued' | 'started' | 'failed' | 'finished';

export abstract class Job {
  type: string;
  priority: number;
  status: JobStatus;

  failReason?: string;

  constructor(type: string) {
    this.priority = 0;
    this.status = 'created';

    this.type = type;
  }

  start(): void {
    this.status = 'started';
  }

  fail(reason: string): void {
    this.failReason = reason;
    this.status = 'failed';
  }
}
