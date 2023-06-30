<script setup lang="ts">
import '@passageidentity/passage-elements/passage-login';
import { authResult } from '@passageidentity/passage-elements';

const {
  public: { passageAppId },
} = useRuntimeConfig();

const { getUser } = usePassageUser();

const onLoginDone = async (authResult: authResult) => {
  console.log('login auth result', authResult);

  const user = await getUser(authResult.auth_token);
  console.log('fetched user in login', user);
  if (user?.user_metadata?.onboard_step === 'done') {
    navigateTo(authResult.redirect_url);
  } else {
    navigateTo('/onboarding');
  }
};
</script>

<template>
  <passage-login :app-id="passageAppId" .onSuccess="onLoginDone" />
</template>
