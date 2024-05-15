import * as ORM from '@fastr/orm';

import { builder } from '../builder';

export const AccountProviderKey = builder.enumType(ORM.AccountProviderKey, {
  name: 'AccountProviderKey',
});
