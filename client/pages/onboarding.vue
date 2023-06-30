<script setup lang="ts">
const { user } = usePassageUser();

const onboardStep = computed(() => user.value?.user_metadata?.onboard_step);
console.log(`onboardStep: ${onboardStep.value}`);
</script>

<template>
  <UContainer>
    <div class="max-w-lg mx-auto my-6">
      <FamilyForm v-if="!onboardStep" />
      <AddMembers v-else-if="onboardStep === 'family'" />
      <AddJars v-else-if="onboardStep === 'jar'" />
    </div>
  </UContainer>
</template>
