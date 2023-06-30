<script setup lang="ts">
const { user } = usePassageUser();
const { getFamily } = useFamily();
const isOpen = ref(false);

definePageMeta({
  layout: 'authenticated',
});

const userRole = computed(() => user.value?.user_metadata?.roles);

const columns = [
  {
    key: 'userName',
    label: 'Name',
  },
  {
    key: 'userEmail',
    label: 'Email',
  },
  {
    key: 'roles',
    label: 'Roles',
  },
];

const { data: family, pending } = await useAsyncData('family', () =>
  getFamily()
);

const onMembersAdded = async () => {
  isOpen.value = false;
  const res = await getFamily();
  if (res) {
    family.value = res;
  }
};
</script>

<template>
  <UCard>
    <div class="flex justify-between items-baseline">
      <h2 v-if="family" class="text-lg md:text-2xl mb-4">
        {{ family.name }}
      </h2>
      <UButton
        v-if="userRole !== 'child'"
        icon="i-heroicons-plus"
        size="xs"
        variant="outline"
        @click="isOpen = true"
      >
        Add Member
      </UButton>
    </div>
    <UTable :rows="family?.members" :columns="columns" :loading="pending">
      <template #roles-data="{ row }">
        {{ row.roles.join(', ') }}
      </template>
    </UTable>
    <UModal v-model="isOpen">
      <AddMembers @members-added="onMembersAdded" />
    </UModal>
  </UCard>
</template>
