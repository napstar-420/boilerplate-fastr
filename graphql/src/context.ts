import { initContextCache } from '@pothos/core';

import { sessions } from '@fastr/id';
import { db, eq, takeFirstOrThrow, users } from '@fastr/orm';

import type { RequestContext, ServerContext, UserContext } from './types';

export async function context(serverContext: ServerContext): Promise<RequestContext> {
  let userContext: UserContext | null = null;

  // If the session is authenticated.
  try {
    const session = sessions.use();

    if (session.type !== 'public') {
      const data = await db().select().from(users).where(eq(users.id, session.properties.user_id)).then(takeFirstOrThrow);

      userContext = {
        user: data,
      };
    }
  } catch (e) {
    console.error('failed to fetch user context', e);
  }

  return {
    ...initContextCache(),
    ...serverContext,
    ...(userContext as UserContext),
  };
}
