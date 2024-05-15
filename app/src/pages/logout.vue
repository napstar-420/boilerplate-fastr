<template>
  <div>
    <p>Loading...</p>
  </div>
</template>

<script lang="ts" setup>
const { logout } = useUser();

definePageMeta({
  layout: 'default',
});

onMounted(() => {
  logout().then(() => {
    window.location.href = '/';
  });
});
</script>
