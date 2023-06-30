<template>
  <div class="flex flex-col bg-white dark:bg-gray-950 min-h-screen">
    <AppNavbar />
    <div class="flex-grow">
      <slot />
    </div>
  </div>
</template>

<style>
passage-register,
passage-login {
  --passage-container-background-color: transparent;
  --passage-body-text-color: #ffffff;
  --passage-primary-color: #fbbf24;
  --passage-onprimary-color: #0f172a;
  --passage-hover-color: #f59e0b;
  --passage-button-font-weight: 500;
  --passage-container-max-width: 100%;
  --passage-container-padding: 30px 0 10px;
  --passage-button-width: 100%;
  --passage-control-border-color: #6b6b6b;
  --passage-otp-input-background-color: #434343;
}
</style>
