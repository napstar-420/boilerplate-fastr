import type { SQSHandler } from 'aws-lambda';

import { dispatch, type DispatchPayload, type JobType } from '@fastr/jobs';

import { handlers, type JobResponse } from './handlers';

export const handler: SQSHandler = async event => {
  const maxRetries = 15;

  const items = event.Records.map<DispatchPayload<any>>(record => {
    return JSON.parse(record.body);
  });

  console.debug(`starting processing for ${items.length} jobs`);

  const results = await Promise.allSettled(
    items.reduce<Promise<JobResponse<any>>[]>((promises, item) => {
      if (Object.keys(handlers).indexOf(item.type) !== -1) {
        promises.push(handlers[item.type as JobType](item.payload));
      } else {
        console.error(`no handler available for "${item.type}"`);
      }

      return promises;
    }, []),
  );

  const failed = results.filter(item => item.status === 'rejected');
  console.debug(`${failed.length} failed jobs`);

  const requeue = results
    .filter(item => item.status === 'fulfilled' && !!item.value && (item.value.retries ?? 0) < maxRetries)
    .map(item => (item as any).value as DispatchPayload<any>);
  console.debug(`${requeue.length} jobs to re-queue`);

  if (requeue.length > 0) {
    console.debug('re-queueing jobs');

    const requeueResults = await Promise.allSettled(requeue.map(item => dispatch({ ...item, retries: (item.retries ?? 0) + 1 })));
    const failedRetries = requeueResults.filter(item => item.status === 'rejected');
    console.debug(`${failedRetries.length} failed re-queued jobs`);
  }

  console.debug('done');
};
