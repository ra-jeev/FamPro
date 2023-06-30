<script setup lang="ts">
import '@passageidentity/passage-elements/passage-register';
import { authResult } from '@passageidentity/passage-elements';
const { getUser } = usePassageUser();

const {
  public: { passageAppId },
} = useRuntimeConfig();

const onRegistrationDone = async (authResult: authResult) => {
  try {
    const res = await $fetch('/api/users', {
      method: 'post',
    });

    console.log('got response from user create', res);
    await getUser(authResult.auth_token);
    navigateTo('/onboarding');
  } catch (error) {
    console.log('failed to create user in appwrite');
  }
};
</script>

<template>
  <passage-register :app-id="passageAppId" .onSuccess="onRegistrationDone" />
</template>
