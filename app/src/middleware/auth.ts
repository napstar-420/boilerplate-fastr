import { CurrentUserDocument, type CurrentUserQuery } from '@fastr/hooks';

export default defineNuxtRouteMiddleware(async to => {
  const { clients, getToken } = useApollo();
  const token = await getToken();
  let authenticated = false;

  if (!!token && token.length > 0) {
    const apollo = clients?.default;

    try {
      const response = await apollo!.query<CurrentUserQuery>({
        query: CurrentUserDocument,
        fetchPolicy: 'cache-first',
      });
      authenticated = !!response.data?.me?.id;
    } catch {}
  }

  if (authenticated && to?.name === 'login') {
    return navigateTo('/');
  } else if (!authenticated && to?.name !== 'login') {
    abortNavigation();
    return navigateTo('/login');
  }
});
