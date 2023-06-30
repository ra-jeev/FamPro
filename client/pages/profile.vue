<script setup lang="ts">
definePageMeta({
  layout: 'authenticated',
});
</script>

<template>
  <ClientOnly>
    <Profile />
  </ClientOnly>
</template>
