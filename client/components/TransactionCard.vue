<script setup>
const { user } = usePassageUser();
const loading = ref(false);
const props = defineProps({
  transaction: {
    type: Object,
    required: true,
  },
  jars: {
    type: Array,
    required: true,
  },
});

const userRole = computed(() => user.value?.user_metadata?.roles);

const icon = computed(() => {
  if (props.transaction.credit) {
    if (props.transaction.comment === 'Auto credit') {
      return '💪';
    }

    return '🤑';
  }

  return '😥';
});

const jarName = computed(() => {
  const jar = props.jars.find((jar) => jar.$id === props.transaction.jarId);
  if (jar) {
    return jar.name;
  }

  return '';
});

const approveTransaction = async () => {
  loading.value = true;
  const res = await $fetch(`/api/transactions`, {
    method: 'POST',
    body: {
      type: 'PATCH',
      transaction: { id: props.transaction.$id, pending: false },
    },
  });

  if (res) {
    props.transaction.pending = false;
  }

  loading.value = false;
};
</script>

<template>
  <UCard>
    <div class="flex">
      <div class="text-center">
        <div class="text-3xl md:text-5xl">{{ icon }}</div>
      </div>
      <div class="mx-6 flex-grow">
        <div>
          <div class="text-md dark:text-gray-300">
            {{ transaction.comment }}
          </div>
          <div class="text-sm dark:text-gray-400">
            {{ jarName }}
          </div>
          <div class="flex items-center mt-3">
            <span class="text-xs dark:text-gray-400">{{
              formatDateTime(transaction.$updatedAt)
            }}</span>
          </div>
        </div>
      </div>

      <div class="text-center">
        <div>
          <UIcon
            v-if="transaction.pending"
            name="i-heroicons-exclamation-triangle-solid"
            class="mr-1 text-amber-400"
            color="red"
          />
          <span
            :class="{
              'text-green-400': transaction.credit,
              'text-red-400': !transaction.credit,
            }"
            class="text-2xl md:text-3xl"
          >
            {{ transaction.credit ? '' : '-' }}{{ transaction.currencySymbol
            }}{{ transaction.amount }}
          </span>
        </div>
        <UButton
          v-if="transaction.pending && userRole?.includes('member')"
          class="mt-2"
          size="2xs"
          variant="ghost"
          @click="approveTransaction"
        >
          Approve
        </UButton>
      </div>
    </div>
  </UCard>
</template>
