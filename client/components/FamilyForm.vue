<script setup lang="ts">
const { user } = usePassageUser();

const family = ref('');
const errors = ref({ family: '', form: '' });
const loading = ref(false);

const onSubmit = async () => {
  errors.value = { family: '', form: '' };

  if (!family.value) {
    errors.value.family = 'Please enter a family name';
    return;
  }

  loading.value = true;

  try {
    const res: any = await $fetch('/api/families', {
      method: 'post',
      body: { type: 'CREATE', name: family.value, email: user.value?.email },
    });

    console.log('create family response', res);

    if (user.value) {
      user.value.user_metadata = res.user.user_metadata;
    }
  } catch (error) {
    console.log(error);
    errors.value.form = 'Failed to create family. Pleases try again later.';
  }

  loading.value = false;
};
</script>

<template>
  <UCard>
    <form id="familyForm" class="space-y-6" @submit.prevent="onSubmit">
      <h2 class="text-2xl font-medium">
        Hi {{ user?.user_metadata?.name }} 👋,
      </h2>

      <p>
        Welcome to <strong>FamPro</strong>. Let's get started by creating your
        family group.
      </p>

      <UFormGroup
        name="family"
        label="Your family name"
        :error="errors.family"
        required
      >
        <UInput
          v-model.trim="family"
          placeholder="Give your family a name"
          icon="i-heroicons-user-group"
        />
      </UFormGroup>

      <Alert
        v-if="errors.form"
        :message="errors.form"
        @alert-dismiss="errors.form = ''"
      />

      <UButton form="familyForm" block :loading="loading" type="submit">
        Create your family
      </UButton>
    </form>
  </UCard>
</template>
