import type { db as getDb } from '@fastr/orm';

import { accounts } from './accounts';
import { users } from './users';

export const seeders: SeedHandler[] = [accounts, users];

export type DB = ReturnType<typeof getDb>;
export type SeedHandler = (db: DB) => Promise<void>;
