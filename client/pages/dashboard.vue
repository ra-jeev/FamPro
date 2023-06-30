<script setup lang="js">
const {user} = usePassageUser();
const { getFamily } = useFamily();
const {getJars} = useJars();

const isOpen = ref(false);

definePageMeta({
  layout: 'authenticated',
});

const { data: family, pending: familyPending } = await useAsyncData('family', () =>
  getFamily()
);

const { data: jars, pending: jarsPending } = await useAsyncData('jars', () =>
  getJars()
);

const userRole = computed(() => user.value?.user_metadata?.roles);

const refreshJars = async () => {
  const res = await getJars()
  if (res) {
    jars.value = res
  }
}

const onJarsCreated = async () => {
  isOpen.value = false;
  await refreshJars()
};
</script>

<template>
  <div>
    <div class="flex justify-between items-baseline">
      <h2 class="text-lg md:text-2xl">
        {{ userRole === 'child' ? 'Your jars' : 'All family jars' }}
      </h2>
      <UButton
        v-if="userRole !== 'child'"
        icon="i-heroicons-plus"
        size="xs"
        variant="outline"
        @click="isOpen = true"
      >
        Add Jar
      </UButton>
    </div>

    <div
      v-for="jar in jars"
      :key="jar.$id"
      class="w-full md:w-3/4 lg:w-2/3 mt-6 mx-auto"
    >
      <JarCard :jar="jar" :family="family" @refresh-jars="refreshJars" />
    </div>
    <UModal v-model="isOpen">
      <AddJars @jars-created="onJarsCreated" />
    </UModal>
  </div>
</template>
