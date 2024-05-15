<template>
  <p v-if="!!user">Welcome, {{ user.username }}! <nuxt-link to="/logout">Logout?</nuxt-link></p>
</template>

<script lang="ts" setup>
const { user } = useUser();
</script>
