import SchemaBuilder from '@pothos/core';
import ErrorsPlugin from '@pothos/plugin-errors';
import ScopeAuthPlugin from '@pothos/plugin-scope-auth';
import SimpleObjectsPlugin from '@pothos/plugin-simple-objects';
import WithInputPlugin from '@pothos/plugin-with-input';
import { EmailAddressResolver, ObjectIDResolver, TimestampResolver, URLResolver } from 'graphql-scalars';

import { and, db, eq, takeFirst, type AnyTable, type Objects } from '@fastr/orm';

import type { RequestContext, Scalars } from './types';

export const builder = new SchemaBuilder<{
  DefaultInputFieldRequiredness: true;
  Context: RequestContext;
  AuthScopes: {
    owns: { table: AnyTable; id: string };
    loggedIn: boolean;
    self: number;
  };
  Objects: Objects;
  Scalars: Scalars;
}>({
  defaultInputFieldRequiredness: true,
  plugins: [ScopeAuthPlugin, ErrorsPlugin, SimpleObjectsPlugin, WithInputPlugin],
  errorOptions: {
    directResult: false,
    defaultTypes: [],
  },
  async authScopes(context) {
    return {
      owns: async ({ table, id }) => {
        const find = await db()
          .select({ id: (table as any).id })
          .from(table)
          .where(and(eq((table as any).public_id, id), eq((table as any).user_id, context.user.id)))
          .then(takeFirst);

        return !!find?.id;
      },
      self: id => context.user?.id === id,
      loggedIn: !!context.user,
    };
  },
});

builder.queryType({});
builder.mutationType({});

builder.addScalarType('DateTime', TimestampResolver, {});
builder.addScalarType('EmailAddress', EmailAddressResolver, {});
builder.addScalarType('ID', ObjectIDResolver, {});
builder.addScalarType('URL', URLResolver, {});
