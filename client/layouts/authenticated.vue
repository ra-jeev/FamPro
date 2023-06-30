<script setup lang="ts">
const isOpen = ref(false);
</script>

<template>
  <div class="flex flex-col bg-white dark:bg-gray-950 min-h-screen">
    <AppNavbar @drawer-open="isOpen = true" />
    <div class="flex-grow">
      <UContainer :ui="{ constrained: 'max-w-5xl' }">
        <div class="flex">
          <AppDrawer class="hidden md:block" />
          <div class="w-full lg:px-6 py-6">
            <slot />
          </div>
        </div>
      </UContainer>
    </div>
    <USlideover :ui="{ width: 'max-w-xs' }" class="md:hidden" v-model="isOpen">
      <div class="flex justify-between items-center p-4">
        <h2 class="text-2xl font-medium">FamPro</h2>
        <UButton
          icon="i-heroicons-x-mark-solid"
          size="xs"
          :padding="false"
          color="white"
          variant="soft"
          @click="isOpen = false"
        />
      </div>
      <AppDrawer @drawer-close="isOpen = false" />
    </USlideover>
  </div>
</template>

<style>
passage-profile {
  --passage-header-text-color: #ffffff;
  --passage-container-background-color: #333333;
  --passage-body-text-color: #d7d7d7;
  --passage-primary-color: #fbbf24;
  --passage-onprimary-color: #0f172a;
  --passage-hover-color: #f59e0b;
  --passage-button-font-weight: 500;
  --passage-container-max-width: 100%;
  --passage-container-padding: 0;
  --passage-button-width: 100%;
  --passage-control-border-color: #6b6b6b;
  --passage-otp-input-background-color: #434343;

  /* Table Styles */
  --passage-table-header-border-color: #d7d7d7;
  --passage-table-row-hover-color: #e0e0e0;
  --passage-table-row-border-color: #e8e8e8;
  --passage-table-paginator-selected-color: #d7d7d7;
  --passage-table-paginator-hover-color: #e8e8e8;
}
</style>
