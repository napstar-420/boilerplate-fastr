import { invites as invitesTable } from '@fastr/orm';

import type { DB } from './index';

export async function invites(db: DB) {
  await db.delete(invitesTable);

  await db.insert(invitesTable).values([{ email: 'sophie@mosey.dev' }]);
}
