import { use, type StackContext } from 'sst/constructs';
import { Auth } from 'sst/constructs/future';

import { flags as flagsStack } from './flags.ts';
import { subdomain } from './helpers.ts';
import { queue as queueStack } from './queue.ts';
import { secrets as secretsStack } from './secrets.ts';

export async function id({ stack, app }: StackContext) {
  const secrets = use(secretsStack);
  const flags = use(flagsStack);
  const queue = use(queueStack);

  /**
   * Compose the domain name for this service.
   */
  const domainName = subdomain(app, 'id');

  /**
   * Create the Authentication Service itself.
   */
  const auth = new Auth(stack, 'auth', {
    customDomain: {
      hostedZone: 'fastr.health',
      domainName,
    },
    authenticator: {
      bind: [...Object.values(secrets), ...Object.values(flags), queue.queue],
      handler: 'id/src/index.handler',
      runtime: 'nodejs20.x',
      timeout: '30 seconds',
      memorySize: 512,
    },
  });

  /**
   * Output some useful information.
   */
  stack.addOutputs({
    idUrl: auth.url ?? domainName,
  });

  return { auth };
}
