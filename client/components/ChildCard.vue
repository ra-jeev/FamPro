<script setup>
const isOpen = ref(false);
const isCredit = ref(true);

defineProps({
  member: {
    type: Object,
    required: true,
  },
});

const openModal = (credit) => {
  isCredit.value = credit;
  isOpen.value = true;
};
</script>

<template>
  <UCard class="max-w-md mx-auto my-6 text-center">
    <div class="text-lg font-medium dark:text-white">
      {{ member.childName }}
    </div>
    <div class="text-sm dark:text-gray-400">
      Pocket money: {{ member.pocketMoney || 0
      }}{{
        member.pocketMoneySchedule ? `, ${member.pocketMoneySchedule}` : ''
      }}
    </div>
    <div class="flex justify-center items-center mt-8">
      <div>
        <div class="text-sm dark:text-gray-400">Balance</div>
        <div class="text-right text-2xl">
          {{ member.balance }}
        </div>
      </div>
      <div class="ml-3 self-center text-5xl md:text-6xl">💰</div>
    </div>
    <div v-if="member.nextMoneyAt" class="text-sm dark:text-amber-400 mt-6">
      Next credit: {{ new Date(member.nextMoneyAt).toLocaleString() }}
    </div>
    <template #footer>
      <div class="flex gap-x-4 justify-center">
        <UButton variant="outline" @click="openModal(false)">
          Deduct Money
        </UButton>
        <UButton @click="openModal(true)"> Add Money </UButton>
      </div>
    </template>
    <UModal v-model="isOpen">
      <TransactionForm
        :isCredit="isCredit"
        @transaction-cancel="isOpen = false"
      />
    </UModal>
  </UCard>
</template>
