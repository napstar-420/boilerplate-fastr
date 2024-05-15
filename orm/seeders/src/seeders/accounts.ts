import { AccountProviderKey, accountProviders as accountProvidersTable } from '@fastr/orm';

import type { DB } from './index';

export async function accounts(db: DB) {
  await db.delete(accountProvidersTable);

  await db.insert(accountProvidersTable).values([
    {
      key: AccountProviderKey.GOOGLE,
      name: 'Google',
      order: 0,
    },
  ]);
}
