import { accountProviders, accounts, db, eq, takeFirstOrThrow, userAccessLogs, users } from '@fastr/orm';

import { builder } from '../builder';
import { Account } from './account';
import { FieldError } from './field-error';

export const User = builder.objectType('User', {
  fields: t => ({
    id: t.expose('public_id', { type: 'ID' }),
    username: t.exposeString('username'),
    email: t.expose('email', {
      type: 'EmailAddress',
      nullable: true,
      authScopes: _ => ({ self: _.id }),
    }),
    image: t.field({
      type: 'URL',
      resolve(_) {
        return _.image ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(_.username)}&size=256`;
      },
    }),
    accounts: t.field({
      type: [Account],
      async resolve(_) {
        return (
          await db()
            .select({ accounts })
            .from(accounts)
            .leftJoin(accountProviders, eq(accounts.provider_id, accountProviders.id))
            .where(eq(accounts.user_id, _.id))
        ).map(({ accounts }) => accounts);
      },
    }),
    touch: t.boolean({
      authScopes: _ => ({ self: _.id }),
      async resolve(_, args, { user }) {
        await db().insert(userAccessLogs).values({ user_id: user.id });
        await db().update(users).set({ last_login_at: new Date() }).where(eq(users.id, user.id));

        return true;
      },
    }),
    last_login_at: t.expose('last_login_at', { type: 'DateTime' }),
    created_at: t.expose('created_at', { type: 'DateTime' }),
  }),
});

builder.queryField('me', t =>
  t.field({
    nullable: true,
    type: User,
    authScopes: {
      loggedIn: true,
    },
    resolve(_, args, { user }) {
      return user ?? null;
    },
  }),
);

builder.mutationField('changeEmailAddress', t =>
  t.field({
    type: User,
    args: {
      email: t.arg({ type: 'EmailAddress' }),
    },
    errors: {
      types: [FieldError],
    },
    authScopes: {
      loggedIn: true,
    },
    async resolve(_, { email }, { user }) {
      await db().update(users).set({ email }).where(eq(users.id, user.id));

      return db().select().from(users).where(eq(users.id, user.id)).then(takeFirstOrThrow);
    },
  }),
);

builder.mutationField('disconnectAccount', t =>
  t.field({
    type: User,
    args: {
      id: t.arg({ type: 'ID' }),
    },
    errors: {
      types: [Error],
    },
    authScopes: (_, { id }) => ({
      $all: {
        loggedIn: true,
        owns: { table: accounts, id },
      },
    }),
    async resolve(_, { id }, { user }) {
      const existing = await db().select({ id: accounts.id }).from(accounts).where(eq(accounts.user_id, user.id));

      if (existing.length < 2) {
        throw new Error('Must retain at least 1 login method');
      }

      await db().delete(accounts).where(eq(accounts.public_id, id));

      return db().select().from(users).where(eq(users.id, user.id)).then(takeFirstOrThrow);
    },
  }),
);
