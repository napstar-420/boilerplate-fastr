import { Cron, Function, use, type StackContext } from 'sst/constructs';

import { flags as flagsStack } from './flags.ts';
import { queue as queueStack } from './queue.ts';
import { secrets as secretsStack } from './secrets.ts';

export async function cron({ stack }: StackContext) {
  const secrets = use(secretsStack);
  const flags = use(flagsStack);
  const queue = use(queueStack);

  /**
   * Create the EventBridge Lambda Handler for the Cron Consumer.
   */
  const consumer = new Function(stack, 'cronConsumer', {
    bind: [...Object.values(secrets), ...Object.values(flags), queue.queue],
    handler: 'cron/src/index.handler',
    runtime: 'nodejs20.x',
    timeout: '30 seconds',
    memorySize: 512,
  });

  /**
   * Create the Cron Schedule.
   */
  const cron = new Cron(stack, 'cron', {
    schedule: 'rate(1 minute)',
    job: consumer,
  });

  return { cron, consumer };
}
