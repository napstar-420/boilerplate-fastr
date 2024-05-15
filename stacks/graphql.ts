import { Api, Function, use, type StackContext } from 'sst/constructs';

import { flags as flagsStack } from './flags.ts';
import { subdomain } from './helpers.ts';
import { id as idStack } from './id.ts';
import { queue as queueStack } from './queue.ts';
import { secrets as secretsStack } from './secrets.ts';

export async function graphql({ stack, app }: StackContext) {
  const secrets = use(secretsStack);
  const flags = use(flagsStack);
  const queue = use(queueStack);
  const id = use(idStack);

  /**
   * Compose the domain name for this service.
   */
  const domainName = subdomain(app, 'graphql');

  /**
   * Create the Lambda Function that will run this GraphQL
   * service.
   */
  const server = new Function(stack, 'server', {
    bind: [...Object.values(secrets), ...Object.values(flags), id.auth, queue.queue],
    handler: 'graphql/src/index.handler',
    runtime: 'nodejs20.x',
    timeout: '30 seconds',
    memorySize: 2048,
  });

  /**
   * Create the GraphQL API Handler to interface with the
   * public.
   */
  const handler = new Api(stack, 'graphql', {
    customDomain: {
      hostedZone: 'fastr.health',
      domainName,
    },
    routes: {
      'POST /': {
        type: 'graphql',
        function: server,
      },
    },
  });

  /**
   * Output some useful information.
   */
  stack.addOutputs({
    graphqlUrl: handler.customDomainUrl ?? domainName,
  });

  return { handler };
}
