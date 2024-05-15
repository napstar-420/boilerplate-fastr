import type { SSTConfig } from 'sst';

import { app as appStack } from './stacks/app.ts';
import { cron } from './stacks/cron.ts';
import { flags } from './stacks/flags.ts';
import { graphql } from './stacks/graphql.ts';
import { id } from './stacks/id.ts';
import { queue } from './stacks/queue.ts';
import { secrets } from './stacks/secrets.ts';

export default {
  config({ region }) {
    let postfix = '';

    if (region === 'us-east-1') {
      postfix = '-edge';
    }

    return {
      name: `fastr${postfix}`,
      profile: 'freedom',
      region: region ?? 'us-east-2',
    };
  },
  async stacks(app) {
    app.setDefaultFunctionProps({
      logRetention: 'one_week',
      runtime: 'nodejs20.x',
      nodejs: {
        format: 'esm',
        minify: true,
      },
      environment: {
        REGION: app.region,
      },
    });

    if (app.stage !== 'production') {
      app.setDefaultRemovalPolicy('destroy');
    }

    /**
     * Non-edge resources.
     */
    if (app.region !== 'us-east-1') {
      /**
       * Zero-dependency stacks.
       * Just makes life easier not having to worry about order further down the stacks.
       */
      await app.stack(flags);
      await app.stack(secrets);

      /**
       * Misc. service stacks.
       * SST supports dev mode for all these stacks.
       */
      await app.stack(queue);
      await app.stack(id);
      await app.stack(cron);
      await app.stack(graphql);
      await app.stack(appStack);
    }
  },
} satisfies SSTConfig;
