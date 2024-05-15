import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { Queue } from 'sst/node/queue';

import type { DispatchPayload, JobType } from './types';

export let jobQueueClient!: SQSClient;

export function jobQueue() {
  if (!jobQueueClient) {
    jobQueueClient = new SQSClient({});
  }

  return jobQueueClient;
}

export async function dispatch<T extends JobType>({ type, payload, retries = 0 }: DispatchPayload<T>) {
  return jobQueue().send(
    new SendMessageCommand({
      MessageBody: JSON.stringify({ type, payload, retries }),
      QueueUrl: Queue.queue.queueUrl,
    }),
  );
}

export * from './types';
