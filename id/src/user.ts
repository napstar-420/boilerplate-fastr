import type { TokenSet } from 'openid-client';
import { useCookie } from 'sst/node/api';

import { AccountProviderKey, db, eq, takeFirst, users, type NewAccount, type NewUser } from '@fastr/orm';

import { sessions } from '.';

export async function determineUser<K extends AccountProviderKey>(provider: K, tokenset: TokenSet) {
  // Fetch the current session, if any.
  const isConnect = useCookie('fastr_connect') === '1';
  const session = sessions.use();

  // Figure out user data from the given tokenset/claims.
  let createAccount: Partial<
    Pick<NewAccount, 'name' | 'identity' | 'image' | 'scopes' | 'access_token' | 'refresh_token' | 'expires_at'>
  > | null = {
    scopes: Array.isArray(tokenset.scope) ? tokenset.scope : tokenset.scope?.split(' ') ?? [],
    access_token: tokenset.access_token,
    refresh_token: tokenset.refresh_token,
    expires_at: tokenset.expires_in
      ? new Date(new Date().getTime() + tokenset.expires_in * 1000)
      : tokenset.expires_at
        ? new Date(tokenset.expires_at * 1000)
        : null,
  };
  let createUser: Pick<NewUser, 'image' | 'email'> & { id?: number } = { image: null, email: null };

  switch (provider) {
    // Handle generic OIDC providers.
    case AccountProviderKey.GOOGLE: {
      const { email, email_verified, sub, picture, name, given_name } = tokenset.claims();
      createAccount.name = name ?? given_name ?? '';
      createAccount.identity = sub;

      if (email && email_verified) {
        createUser.email = email;
      }

      if (picture) {
        createUser.image = picture;
        createAccount.image = createUser.image;
      }
      break;
    }
  }

  if (session.type === 'user' && isConnect) {
    const existingUser = await db()
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        image: users.image,
      })
      .from(users)
      .where(eq(users.id, session.properties.user_id))
      .then(takeFirst);

    if (existingUser) {
      createUser = { ...existingUser };
    }
  }

  return { createAccount, createUser, session };
}
