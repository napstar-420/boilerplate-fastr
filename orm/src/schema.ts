import { relations, sql, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { boolean, index, int, json, mysqlTable, serial, text, timestamp, uniqueIndex, varchar } from 'drizzle-orm/mysql-core';

import type { AccountProviderKey } from './enums';
import { publicId } from './helpers';

export const accountProviders = mysqlTable(
  'account_providers',
  {
    id: serial('id').primaryKey(),
    public_id: varchar('public_id', { length: 16 }).notNull().$defaultFn(publicId),
    key: varchar('key', { length: 256 }).$type<AccountProviderKey>().notNull(),
    name: varchar('name', { length: 256 }).notNull(),
    enabled: boolean('enabled').notNull().default(true),
    order: int('order').notNull().default(0),
  },
  table => ({
    publicIdIdx: uniqueIndex('public_id_idx').on(table.public_id),
    keyIdx: uniqueIndex('key_idx').on(table.key),
  }),
);

export const accountProvidersRelations = relations(accountProviders, ({ many }) => ({
  accounts: many(accounts),
}));

export type NewAccountProvider = InferInsertModel<typeof accountProviders>;
export type AccountProvider = InferSelectModel<typeof accountProviders>;

export const accounts = mysqlTable(
  'accounts',
  {
    id: serial('id').primaryKey(),
    public_id: varchar('public_id', { length: 16 }).notNull().$defaultFn(publicId),
    user_id: int('user_id').notNull(),
    provider_id: int('provider_id').notNull(),
    identity: varchar('identity', { length: 256 }).notNull(),
    name: varchar('name', { length: 256 }).notNull(),
    image: text('image'),
    scopes: json('scopes').$type<string[]>().notNull(),
    access_token: text('access_token'),
    refresh_token: text('refresh_token'),
    expires_at: timestamp('expires_at'),
    created_at: timestamp('created_at')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  table => ({
    identityProviderIdx: index('identity_provider_idx').on(table.provider_id, table.identity),
    publicIdIdx: uniqueIndex('public_id_idx').on(table.public_id),
    providerIdIdx: index('provider_id_idx').on(table.provider_id),
    userIdIdx: index('user_id_idx').on(table.user_id),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  provider: one(accountProviders, {
    fields: [accounts.provider_id],
    references: [accountProviders.id],
  }),
  user: one(users, {
    fields: [accounts.user_id],
    references: [users.id],
  }),
}));

export type NewAccount = InferInsertModel<typeof accounts>;
export type Account = InferSelectModel<typeof accounts>;

export const invites = mysqlTable(
  'invites',
  {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 256 }).notNull(),
    created_at: timestamp('created_at')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  table => ({
    emailIdx: uniqueIndex('email_idx').on(table.email),
  }),
);

export type NewInvite = InferInsertModel<typeof invites>;
export type Invite = InferSelectModel<typeof invites>;

export const users = mysqlTable(
  'users',
  {
    id: serial('id').primaryKey(),
    public_id: varchar('public_id', { length: 16 }).notNull().$defaultFn(publicId),
    username: varchar('username', { length: 256 }).notNull(),
    email: varchar('email', { length: 256 }),
    image: text('image'),
    last_login_at: timestamp('last_login_at')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    created_at: timestamp('created_at')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  table => ({
    publicIdIdx: uniqueIndex('public_id_idx').on(table.public_id),
    usernameIdx: uniqueIndex('username_idx').on(table.username),
    emailIdx: index('email_idx').on(table.email),
  }),
);

export const usersRelations = relations(users, ({ many }) => ({
  accessLogs: many(userAccessLogs),
  accounts: many(accounts),
}));

export type NewUser = InferInsertModel<typeof users>;
export type User = InferSelectModel<typeof users>;

export const userAccessLogs = mysqlTable(
  'user_access_logs',
  {
    id: serial('id').primaryKey(),
    user_id: int('user_id').notNull(),
    created_at: timestamp('created_at')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  table => ({
    userIdIdx: index('user_id_idx').on(table.user_id),
  }),
);

export const userAccessLogsRelations = relations(userAccessLogs, ({ one }) => ({
  user: one(users, {
    fields: [userAccessLogs.user_id],
    references: [users.id],
  }),
}));

export type NewUserAccessLog = InferInsertModel<typeof userAccessLogs>;
export type UserAccessLog = InferSelectModel<typeof userAccessLogs>;
