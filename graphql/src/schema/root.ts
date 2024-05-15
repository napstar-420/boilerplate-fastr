import { enabled } from '@fastr/flags';

import { builder } from '../builder';

builder.queryField('maintenanceMode', t =>
  t.field({
    type: 'Boolean',
    resolve() {
      return enabled('FLAG_MAINTENANCE_MODE');
    },
  }),
);
