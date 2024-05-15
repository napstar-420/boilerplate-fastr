<template>
  <div>
    <h1>Home</h1>
    <p>Look, Quasar components!</p>
    <q-btn color="primary" label="Primary" />
    <QBtn color="secondary" label="Secondary" />
    <LazyQBtn color="amber" glossy label="Amber" />
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'default',
});
</script>
