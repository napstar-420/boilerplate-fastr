<template>
  <div>
    <h1>Login</h1>
    <p v-if="loading">Loading...</p>
    <ul v-else>
      <li v-for="provider in authProviders" :key="provider.key">
        <q-btn :href="buildAuthUrl(provider.key)" color="primary" :label="`Login with ${provider.name}`" />
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { AccountProviderKey, useAccountProvidersQuery } from '@fastr/hooks';

const config = useRuntimeConfig();

definePageMeta({
  middleware: 'auth',
  layout: 'default',
});

const { result, loading } = useAccountProvidersQuery({
  fetchPolicy: 'cache-first',
});

const authProviders = computed(() => result.value?.accountProviders ?? []);

function buildAuthUrl(provider: AccountProviderKey) {
  const redirect = new URL('/auth', location.origin);

  const base = new URL(config.public.ID_URL);
  base.searchParams.append('client_id', config.public.ID_CLIENT);
  base.searchParams.append('redirect_uri', redirect.toString());
  base.searchParams.append('response_type', 'token');
  base.searchParams.append('provider', provider);
  base.pathname = '/authorize';

  return base.toString();
}
</script>
