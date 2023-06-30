<template>
  <ClientOnly>
    <UContainer>
      <UCard class="max-w-md mx-auto mt-8 text-center">
        <h1 class="text-3xl font-medium">Sign in</h1>

        <sign-in />

        <div
          class="text-sm font-medium text-gray-500 dark:text-gray-300 text-center"
        >
          Don't have an account?
          <UButton variant="link" :padded="false" to="/sign-up">
            Create one now
          </UButton>
        </div>
      </UCard>
    </UContainer>
  </ClientOnly>
</template>
