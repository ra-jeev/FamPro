<template>
  <ClientOnly>
    <UContainer>
      <UCard class="max-w-md mx-auto mt-8 text-center">
        <h1 class="text-3xl font-medium">Sign up</h1>

        <sign-up />

        <div
          class="text-sm font-medium text-gray-500 dark:text-gray-300 text-center"
        >
          Already have an account?
          <UButton variant="link" :padded="false" to="/sign-in">
            Sign in
          </UButton>
        </div>
      </UCard>
    </UContainer>
  </ClientOnly>
</template>
