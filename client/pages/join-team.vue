<script setup>
const { query } = useRoute();
const { $teams, $account } = useNuxtApp();
const user = useState('account');
const passwordVisible = ref(false);
const loading = ref(false);
const form = ref({ password: '' });
const errors = ref({ password: '', form: '' });

console.log('query params', query);

const onSubmit = async () => {
  errors.value = { password: '', form: '' };

  if (!form.value.password) {
    errors.value.password = 'Password should at least be 8 characters long.';
    return;
  }

  loading.value = true;

  const res = await $teams.updateMembershipStatus(
    query.teamId,
    query.membershipId,
    query.userId,
    query.secret
  );

  console.log('accept invitation res', res);

  const account = await $account.updatePassword(form.value.password);
  console.log('updatePassword res', account);

  const prefsRes = await $account.updatePrefs({
    teamId: query.teamId,
    onboardingDone: true,
  });
  console.log('updatePrefsRes', updatePrefsRes);

  user.value = prefsRes;
  await navigateTo('/dashboard');
  loading.value = false;
};
</script>

<template>
  <UContainer>
    <UCard class="max-w-lg mx-auto my-6">
      <form class="space-y-6" @submit.prevent="onSubmit">
        <h2 class="text-2xl font-medium">Join team</h2>
        <UFormGroup
          name="password"
          label="Create password"
          :error="errors.password"
          required
        >
          <UInput
            v-model.trim="form.password"
            :type="passwordVisible ? 'text' : 'password'"
            placeholder="password"
            icon="i-heroicons-key"
            :ui="{ icon: { trailing: { pointer: '' } } }"
          >
            <template #trailing>
              <UButton
                v-if="passwordVisible"
                icon="i-heroicons-eye-slash-solid"
                :padded="false"
                color="gray"
                variant="link"
                @click="passwordVisible = false"
              />
              <UButton
                v-else
                icon="i-heroicons-eye-solid"
                :padded="false"
                color="gray"
                variant="link"
                @click="passwordVisible = true"
              />
            </template>
          </UInput>
        </UFormGroup>
        <Alert
          v-if="errors.form"
          :message="errors.form"
          @alert-dismiss="errors.form = ''"
        />

        <UButton block :loading="loading" type="submit">
          Accept invitation
        </UButton>
      </form>
    </UCard>
  </UContainer>
</template>
