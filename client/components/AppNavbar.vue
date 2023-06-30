<script setup lang="ts">
const { getUser, signOut } = usePassageUser();

const { data: user } = await useAsyncData('user', () =>
  getUser(useCookie('psg_auth_token').value as string)
);
</script>

<template>
  <nav class="bg-white border-gray-200 dark:bg-gray-900">
    <UContainer class="flex flex-wrap items-center justify-between py-4">
      <a href="/" class="flex items-center">
        <span
          class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"
        >
          FamPro
        </span>
      </a>

      <div v-show="user?.id" class="flex items-center gap-4">
        <UButton @click="signOut"> Sign Out </UButton>
        <UButton
          color="white"
          variant="soft"
          :padded="false"
          size="xl"
          icon="i-heroicons-bars-3-bottom-right-20-solid"
          class="md:hidden"
          @click="$emit('drawerOpen')"
        />
      </div>
      <div v-show="!user?.id" class="flex md:order-2 space-x-4">
        <UButton variant="outline" to="/sign-up"> Sign Up </UButton>
        <UButton to="/sign-in">Sign In</UButton>
      </div>

      <!-- <button data-collapse-toggle="navbar-cta" type="button"
          class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-cta" aria-expanded="false">
          <span class="sr-only">Open main menu</span>
          <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clip-rule="evenodd"></path>
          </svg>
        </button> -->
    </UContainer>
  </nav>
</template>
