<script setup lang="ts">
defineProps({
  member: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['deleteMember'])

const roles = ['member', 'child'];

const errors = {
  email: '',
  name: '',
  role: '',
};
</script>

<template>
  <UCard :ui="{
    background: 'bg-gray-100 dark:bg-gray-800',
  }">
    <div class="space-y-4">
      <div class="flex justify-between items-baseline">
        <span class="font-medium">{{ member.name || `Member ${index + 1}:` }}</span>
        <UButton icon="i-heroicons-trash" size="2xs" color="red" variant="outline" @click="emit('deleteMember', index)" />
      </div>
      <UFormGroup name="name" label="Member's name" :error="errors.name" required>
        <UInput v-model.trim="member.name" placeholder="John Doe" icon="i-heroicons-user" />
      </UFormGroup>
      <UFormGroup name="email" label="Member's email" :error="errors.email" required>
        <UInput v-model="member.email" placeholder="you@example.com" icon="i-heroicons-envelope" type="email" />
      </UFormGroup>
      <UFormGroup name="role" label="Member's role" :error="errors.role" required>
        <USelect leading-icon="i-heroicons-check-badge" v-model="member.role" :options="roles" placeholder="Select" />
      </UFormGroup>
    </div>
  </UCard>
</template>