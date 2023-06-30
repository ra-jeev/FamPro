<script setup lang="ts">
const { user } = usePassageUser();

const emit = defineEmits(['membersAdded']);

const metadata = user.value?.user_metadata;

const defaultMember = {
  name: '',
  email: '',
  role: '',
};

const members = ref([{ ...defaultMember }]);

const errors = ref({ form: '' });
const loading = ref(false);

const addMembers = async () => {
  loading.value = true;
  try {
    const res: any = await $fetch('/api/families', {
      method: 'post',
      body: {
        type: 'ADD_MEMBERS',
        familyId: metadata?.family_id,
        members: members.value,
        onboardStep: metadata?.onboard_step,
      },
    });

    console.log('response of add members', res);
    if (res.user && user.value) {
      user.value.user_metadata = res.user.user_metadata;
    }

    emit('membersAdded');
  } catch (error) {
    console.log('error is adding members', error);
  }

  loading.value = false;
};

const onAddBtn = () => {
  members.value.push({ ...defaultMember });
};

const onDelete = (index: number) => {
  members.value.splice(index, 1);
};
</script>

<template>
  <UCard>
    <form id="membersForm" class="space-y-6" @submit.prevent="addMembers">
      <div class="flex justify-between items-baseline">
        <h2 class="text-2xl font-medium">Add family members</h2>
        <UButton
          icon="i-heroicons-plus"
          size="2xs"
          variant="outline"
          @click="onAddBtn"
        >
          Add
        </UButton>
      </div>

      <template v-if="members.length">
        <AddMember
          v-for="(member, index) in members"
          :key="`member-${index}`"
          :member="member"
          :index="index"
          @delete-member="onDelete"
        />

        <Alert
          v-if="errors.form"
          :message="errors.form"
          @alert-dismiss="errors.form = ''"
        />

        <UButton form="membersForm" block :loading="loading" type="submit">
          Add Members
        </UButton>
      </template>
      <p v-else class="text-center py-4">
        Please add at least one family member
      </p>
    </form>
  </UCard>
</template>
