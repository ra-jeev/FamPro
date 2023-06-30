<script setup>
const props = defineProps({
  jar: {
    type: Object,
    required: true,
  },
  family: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['refreshJars']);

const isOpen = ref(false);
const isCredit = ref(true);

const autoCredit = computed(() => {
  if (props.jar) {
    return (
      props.jar.currencySymbol +
      '' +
      (props.jar.autoCreditAmount || 0) +
      (props.jar.autoCreditSchedule ? ', ' + props.jar.autoCreditSchedule : '')
    );
  }

  return '';
});

const owner = computed(() => {
  if (props.family && props.jar) {
    const member = props.family.members.find(
      (member) => member.userId === props.jar.ownerId
    );

    if (member) {
      console.log('found member', member);
      return member;
    }
  }

  return null;
});

const openModal = (credit) => {
  isCredit.value = credit;
  isOpen.value = true;
};

const onTransactionDone = () => {
  isOpen.value = false;
  emit('refreshJars');
};
</script>

<template>
  <UCard>
    <div class="flex items-center">
      <div class="text-center">
        <div class="text-5xl md:text-7xl">💰</div>
        <div class="text-xs dark:text-gray-400 mt-2">Credit:</div>
        <div class="text-xs dark:text-gray-300">{{ autoCredit }}</div>
      </div>
      <div class="ml-6">
        <div class="text-md dark:text-gray-300">
          {{ jar.name }} <small v-if="owner">({{ owner.userName }})</small>
        </div>

        <div class="text-medium text-3xl mt-3 mb-4">
          {{ jar.currencySymbol }}{{ jar.balance }}
        </div>
        <div v-if="jar.nextMoneyAt" class="text-sm dark:text-amber-400 mt-6">
          Next credit: {{ new Date(jar.nextMoneyAt).toLocaleString() }}
        </div>
        <div class="flex gap-x-4 justify-center">
          <UButton size="2xs" variant="outline" @click="openModal(false)">
            Deduct Money
          </UButton>
          <UButton size="2xs" @click="openModal(true)"> Add Money </UButton>
        </div>
      </div>
    </div>

    <UModal :model-value="isOpen">
      <TransactionForm
        :isCredit="isCredit"
        :jar="jar"
        @transaction-cancel="isOpen = false"
        @transaction-done="onTransactionDone"
      />
    </UModal>
  </UCard>
</template>
