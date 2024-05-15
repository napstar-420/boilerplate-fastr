import type { ScheduledHandler } from 'aws-lambda';

import { dispatch, DispatchPayload } from '@fastr/jobs';

import { tasks, type TaskContext } from './tasks';

export const handler: ScheduledHandler = async event => {
  const date = new Date(event.time);
  date.setMilliseconds(0);
  date.setSeconds(0);

  const context: TaskContext = { date };

  console.info('running tasks for', date.toISOString());

  const results = await Promise.allSettled(
    tasks.reduce<Promise<void | DispatchPayload<any> | DispatchPayload<any>[]>[]>((arr, task) => {
      arr.push(task(context));
      return arr;
    }, []),
  );

  console.info('compiling jobs list');

  const taskJobs = results.reduce<DispatchPayload<any>[]>((arr, result) => {
    if (result.status === 'fulfilled') {
      let jobs = result.value ? result.value : [];

      if (!Array.isArray(jobs)) {
        jobs = [jobs];
      }

      const total = jobs.length;

      for (let i = 0; i < total; i++) {
        arr.push(jobs[i]);
      }
    } else {
      console.error(`task failed: ${result.reason}`);
    }

    return arr;
  }, []);

  if (!taskJobs.length) {
    console.info('nothing to do');
    return;
  }

  console.info(`queueing ${taskJobs.length} jobs`);

  const jobResults = await Promise.allSettled(
    taskJobs.reduce<Promise<unknown>[]>((arr, job) => {
      arr.push(dispatch(job));
      return arr;
    }, []),
  );

  const failed = jobResults.filter(item => item.status === 'rejected');

  if (failed.length) {
    console.error(`${failed.length} jobs failed to queue`);
  }

  console.info('done');
};
