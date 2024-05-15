import { provideApolloClient } from '@vue/apollo-composable';

import { useCurrentUserQuery } from '@fastr/hooks';

export default function useUser() {
  const { clients, onLogin, onLogout } = useApollo();

  const apollo = clients?.default;
  provideApolloClient(apollo!);

  const { result, loading: fetching } = useCurrentUserQuery({ fetchPolicy: 'cache-first' });

  const loading = computed(() => fetching);
  const authenticated = computed(() => (loading.value ? false : !!result?.value?.me?.id));

  const user = computed(() => result?.value?.me);

  async function login(token: string) {
    await onLogin(token);
  }

  async function logout() {
    await onLogout('default', true);
  }

  return { authenticated, loading, login, logout, user };
}
