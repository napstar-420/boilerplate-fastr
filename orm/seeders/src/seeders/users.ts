import { AccountProviderKey, accountProviders, accounts, eq, takeFirstOrThrow, users as usersTable } from '@fastr/orm';

import type { DB } from './index';

export async function users(db: DB) {
  await db.delete(usersTable);
  await db.delete(accounts);

  await db.insert(usersTable).values({
    username: 'OYED',
    email: 'sophie@mosey.dev',
    image: 'https://lh3.googleusercontent.com/a/AGNmyxYgrTQRf7l331zM2y5L-2IFcvm_5KaeCqCV23kKKA=s96-c',
  });

  const findOYED = await db.select().from(usersTable).where(eq(usersTable.username, 'OYED')).then(takeFirstOrThrow);

  const google = await db
    .select({ id: accountProviders.id })
    .from(accountProviders)
    .where(eq(accountProviders.key, AccountProviderKey.GOOGLE))
    .then(takeFirstOrThrow);

  await db.insert(accounts).values([
    {
      provider_id: google.id,
      user_id: findOYED.id,
      identity: '104305458800871896531',
      name: 'OYΞD',
      image: 'https://lh3.googleusercontent.com/a/AGNmyxYgrTQRf7l331zM2y5L-2IFcvm_5KaeCqCV23kKKA=s96-c',
      scopes: [],
    },
  ]);
}
