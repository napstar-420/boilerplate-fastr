import type { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { nanoid } from 'nanoid';
import { useQueryParam, useResponse } from 'sst/node/api';
import { Config } from 'sst/node/config';
import { AuthHandler, createSessionBuilder, GoogleAdapter } from 'sst/node/future/auth';

import { enabled } from '@fastr/flags';
import {
  AccountProviderKey,
  accountProviders,
  accounts,
  and,
  db,
  eq,
  invites,
  publicId,
  takeFirst,
  takeFirstOrThrow,
  users,
} from '@fastr/orm';

import { determineUser } from './user';

export const sessions = createSessionBuilder<{
  user: { user_id: number };
}>();

export const authHandler = AuthHandler({
  providers: {
    [AccountProviderKey.GOOGLE]: GoogleAdapter({
      clientID: Config.GOOGLE_CLIENT_ID,
      mode: 'oidc',
    }),
  },
  callbacks: {
    async index() {
      return {
        statusCode: 301,
        headers: { Location: Config.WEBSITE_URL },
      };
    },
    auth: {
      async allowClient(clientId, redirectUri) {
        const uri = new URL(redirectUri);

        if (clientId === 'local') {
          return uri.origin === 'http://localhost:3000' && uri.pathname === '/auth';
        } else if (clientId === 'production') {
          return uri.origin === 'https://fastr.health' && uri.pathname === '/auth';
        }

        return false;
      },
      async start() {
        const isConnect = useQueryParam('connect') === '1';

        useResponse().cookie({
          maxAge: isConnect ? 60 * 15 : -1,
          value: isConnect ? '1' : '0',
          key: 'fastr_connect',
          sameSite: 'None',
          httpOnly: true,
          secure: true,
        });
      },
      async success(input, response) {
        let isNewUser = false;

        // Fetch the Provider ID used.
        const { id: providerId } = await db()
          .select({ id: accountProviders.id })
          .from(accountProviders)
          .where(eq(accountProviders.key, input.provider))
          .then(takeFirstOrThrow);

        // Determine the User Identity.
        const { createAccount, createUser } = await determineUser(input.provider, input.tokenset);
        let userId: number | null = null;

        // Ensure we have an identity, otherwise we can't create the account.
        if (!createAccount || !createAccount.identity) {
          throw new Error('Unable to determine Identity');
        }

        // Figure out if an existing user exists.
        const fetch = await db()
          .select({ id: accounts.id, user_id: accounts.user_id })
          .from(accounts)
          .where(and(eq(accounts.provider_id, providerId), eq(accounts.identity, createAccount.identity)))
          .then(takeFirst);
        userId = fetch?.user_id ?? null;

        // If the User is already logged in, link the account.
        if (!!createUser.id && !isNaN(createUser.id)) {
          // Check if the Account is already linked.
          if (userId) {
            throw new Error('Account already linked');
          }

          // Log in as the existing session.
          userId = createUser.id;

          // Store this new Account against the existing user.
          await db()
            .insert(accounts)
            .values({
              provider_id: providerId,
              user_id: userId,
              ...createAccount,
              name: createAccount.name ?? 'Unknown',
              identity: createAccount.identity as string,
              scopes: createAccount.scopes as string[],
            });
        } else {
          // Check if the User is invited.
          if (enabled('FLAG_INVITE_ONLY')) {
            try {
              if (!createUser.email) {
                throw new Error();
              }

              await db().select({ id: invites.id }).from(invites).where(eq(invites.email, createUser.email)).then(takeFirstOrThrow);
            } catch {
              throw new Error('Sorry, you must be invited to join');
            }
          }

          // If no existing user was found, create a new one.
          if (!fetch || userId === null || isNaN(userId)) {
            try {
              const newId = publicId();

              await db()
                .insert(users)
                .values({
                  public_id: newId,
                  username: nanoid(16),
                  ...createUser,
                });

              const fetch = await db().select({ id: users.id }).from(users).where(eq(users.public_id, newId)).then(takeFirstOrThrow);
              userId = fetch.id;
              isNewUser = true;

              await db()
                .insert(accounts)
                .values({
                  provider_id: providerId,
                  user_id: userId,
                  image: createUser.image,
                  ...createAccount,
                  name: createAccount.name ?? 'Unknown',
                  identity: createAccount.identity as string,
                  scopes: createAccount.scopes as string[],
                });
            } catch (e) {
              throw new Error('Authentication failed');
            }
          } else {
            delete createAccount.identity;

            if (Object.keys(createAccount).length > 0) {
              await db()
                .update(accounts)
                .set({ ...createAccount })
                .where(eq(accounts.id, fetch.id));
            }
          }
        }

        // Check if we failed to find/create a user.
        if (userId === null || isNaN(userId)) {
          throw new Error('Authentication failed');
        }

        // Otherwise we can authenticate the user.
        return response.session({
          expiresIn: 1000 * 60 * 60 * 24 * 30, // 30 days
          properties: { user_id: userId },
          type: 'user',
        });
      },
    },
  },
});

export const handler: APIGatewayProxyHandlerV2 = async (event, context) => {
  try {
    return await authHandler(event, context);
  } catch (e) {
    const isConnect = (event.cookies ?? []).find(cookie => cookie.startsWith('fastr_connect=1'));

    const url = new URL(isConnect ? '/settings/connections' : '/sign-in', Config.WEBSITE_URL);
    url.searchParams.append('error', (e as Error)?.message ?? e);

    return {
      statusCode: 302,
      headers: { Location: url.toString() },
    };
  }
};
