import { accountProviders, asc, db, eq, takeFirst, takeFirstOrThrow } from '@fastr/orm';

import { builder } from '../builder';
import { AccountProviderKey } from './enums';

export const AccountProvider = builder.objectType('AccountProvider', {
  fields: t => ({
    id: t.expose('public_id', { type: 'ID' }),
    key: t.expose('key', { type: AccountProviderKey }),
    name: t.exposeString('name'),
    order: t.exposeInt('order'),
  }),
});

export const Account = builder.objectType('Account', {
  fields: t => ({
    id: t.expose('public_id', { type: 'ID' }),
    provider: t.field({
      type: AccountProvider,
      async resolve(_) {
        return db().select().from(accountProviders).where(eq(accountProviders.id, _.provider_id)).then(takeFirstOrThrow);
      },
    }),
    identity: t.exposeString('identity', {
      authScopes: _ => ({ self: _.user_id }),
    }),
    name: t.exposeString('name'),
    image: t.exposeString('image', { nullable: true }),
    access_token: t.exposeString('access_token', {
      authScopes: _ => ({ self: _.user_id }),
      nullable: true,
    }),
    refresh_token: t.exposeString('refresh_token', {
      authScopes: _ => ({ self: _.user_id }),
      nullable: true,
    }),
    expires_at: t.expose('expires_at', {
      authScopes: _ => ({ self: _.user_id }),
      type: 'DateTime',
      nullable: true,
    }),
    created_at: t.expose('created_at', { type: 'DateTime' }),
  }),
});

builder.queryField('accountProviders', t =>
  t.field({
    type: [AccountProvider],
    async resolve(_) {
      return db().select().from(accountProviders).where(eq(accountProviders.enabled, true)).orderBy(asc(accountProviders.order));
    },
  }),
);

builder.queryField('accountProvider', t =>
  t.field({
    type: AccountProvider,
    nullable: true,
    args: {
      id: t.arg({ type: 'ID' }),
    },
    async resolve(_, { id }) {
      return db().select().from(accountProviders).where(eq(accountProviders.public_id, id)).then(takeFirst);
    },
  }),
);

builder.queryField('accountProviderKey', t =>
  t.field({
    type: AccountProvider,
    nullable: true,
    args: {
      key: t.arg({ type: AccountProviderKey }),
    },
    async resolve(_, { key }) {
      return db().select().from(accountProviders).where(eq(accountProviders.key, key)).then(takeFirst);
    },
  }),
);
