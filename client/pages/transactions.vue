<script setup lang="ts">
definePageMeta({
  layout: 'authenticated',
});

const { data: jars, pending: jarsPending } = await useFetch('/api/jars');
const { data, pending } = await useFetch('/api/transactions');
</script>

<template>
  <div>
    <h2 class="text-xl md:text-2xl mb-4">Transactions</h2>
    <p v-if="jarsPending || pending" class="text-center">Loading...</p>
    <template v-else>
      <div
        v-for="transaction in data?.transactions"
        :key="transaction.$id"
        class="w-full md:w-3/4 lg:w-2/3 mt-6 mx-auto"
      >
        <TransactionCard :jars="jars?.jars" :transaction="transaction" />
      </div>
    </template>
  </div>
</template>
