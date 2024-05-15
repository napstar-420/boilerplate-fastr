import { StaticSite, use, type StackContext } from 'sst/constructs';

import { graphql as graphqlStack } from './graphql.ts';
import { subdomain } from './helpers.ts';
import { id as idStack } from './id.ts';

export async function app({ stack, app }: StackContext) {
  const graphql = use(graphqlStack);
  const id = use(idStack);

  /**
   * Compose the domain name for this service.
   */
  const domainName = subdomain(app);

  /**
   * Create the static site infrastructure.
   */
  const site = new StaticSite(stack, 'appSite', {
    buildCommand: 'pnpm build',
    buildOutput: 'build',
    path: 'app',
    customDomain: {
      hostedZone: 'fastr.health',
      domainName,
    },
    environment: {
      GRAPHQL_URL: graphql.handler.customDomainUrl ?? 'https://graphql.fastr.health',
      ID_CLIENT: app.stage === 'production' ? 'production' : 'local',
      ID_URL: id.auth.url ?? 'https://id.fastr.health',
    },
  });

  /**
   * Output the app URL to make life easier.
   */
  stack.addOutputs({
    appUrl: site.customDomainUrl ?? domainName,
  });

  return { site };
}
