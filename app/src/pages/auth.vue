<template>
  <div>
    <p>Loading...</p>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'default',
});

const { login } = useUser();
const router = useRouter();
const route = useRoute();

onMounted(async () => {
  // Process the access token from the hash url.
  const hashValue = new URLSearchParams(route.hash.substring(1) ?? '');

  // Store it if it's valid.
  if (hashValue.has('access_token')) {
    await login(hashValue.get('access_token')!);
  }

  navigateTo('/');
});
</script>
