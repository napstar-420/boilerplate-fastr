import { dispatch, JobType } from '@fastr/jobs';

import { builder } from '../builder';

builder.mutationField('triggerDemoJob', t =>
  t.field({
    type: 'Boolean',
    args: {
      email: t.arg({ type: 'EmailAddress' }),
    },
    authScopes: {
      loggedIn: true,
    },
    async resolve(_, { email }, { user }) {
      await dispatch({
        type: JobType.EXAMPLE,
        payload: {
          user_id: user.id,
          email,
        },
      });

      return true;
    },
  }),
);
