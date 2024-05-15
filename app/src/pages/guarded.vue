<template>
  <div>
    <h1>Super secret!</h1>
    <p>Shhhh</p>
    <q-btn color="primary" label="Trigger Demo Job" @click="triggerDemoJob" :disable="loading.value" />
  </div>
</template>

<script lang="ts" setup>
import { useTriggerDemoJobMutation } from '@fastr/hooks';

definePageMeta({
  middleware: 'auth',
  layout: 'default',
});

const { mutate: trigger, loading } = useTriggerDemoJobMutation();

function triggerDemoJob() {
  console.log('x');
  trigger({
    email: 'hello@example.com',
  });
}
</script>
