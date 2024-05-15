import { Duration } from 'aws-cdk-lib';
import { Function, Queue, use, type StackContext } from 'sst/constructs';

import { flags as flagsStack } from './flags.ts';
import { secrets as secretsStack } from './secrets.ts';

export async function queue({ stack }: StackContext) {
  const secrets = use(secretsStack);
  const flags = use(flagsStack);

  /**
   * Create the SQS Lambda Handler for the Queue Consumer.
   */
  const consumer = new Function(stack, 'queueConsumer', {
    bind: [...Object.values(secrets), ...Object.values(flags)],
    handler: 'queue/src/index.handler',
    runtime: 'nodejs20.x',
    timeout: '30 seconds',
    memorySize: 1024,
  });

  /**
   * Create the SQS Queue itself.
   */
  const queue = new Queue(stack, 'queue', {
    consumer: {
      function: consumer,
      cdk: {
        eventSource: {
          batchSize: 5,
        },
      },
    },
    cdk: {
      queue: {
        visibilityTimeout: Duration.seconds(30),
      },
    },
  });

  return { queue, consumer };
}
