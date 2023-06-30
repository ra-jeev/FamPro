<script setup lang="ts">
const { user } = usePassageUser();
const { getFamily } = useFamily();
const { $locale } = useNuxtApp();

const emit = defineEmits(['jarsCreated']);

const selectedCurrency = ref();

const { data: family, pending: familyPending } = await useAsyncData(
  'family',
  () => getFamily()
);

const { data: locale } = await useAsyncData('locale', () => $locale.get());

const { data: currencyList } = await useAsyncData('currencies', () =>
  $locale.listCurrencies()
);

const matchedCurrency = currencyList.value?.currencies.find(
  (currency) => currency.code === locale.value?.currency
);

if (matchedCurrency) {
  selectedCurrency.value = matchedCurrency;
}

const defaultJar = {
  name: '',
  balance: '',
  autoCreditAmount: '',
  autoCreditSchedule: '',
  familyId: family.value?.$id,
  ownerId: '',
};

const jars = ref([{ ...defaultJar }]);

const errors = ref({ form: '' });
const loading = ref(false);

const addJars = async () => {
  loading.value = true;
  try {
    const res: any = await $fetch('/api/jars', {
      method: 'post',
      body: {
        jars: jars.value,
        currencyCode: selectedCurrency.value.code,
        currencySymbol: selectedCurrency.value.symbolNative,
      },
    });

    console.log('response of add members', res);
    if (user.value && res.user) {
      user.value.user_metadata = res.user.user_metadata;
      navigateTo('/dashboard');
    }

    emit('jarsCreated');
  } catch (error) {
    console.log('error is adding members', error);
  }

  loading.value = false;
};

const onAddBtn = () => {
  jars.value.push({ ...defaultJar });
};

const onDelete = (index: number) => {
  jars.value.splice(index, 1);
};
</script>

<template>
  <UCard>
    <form id="membersForm" class="space-y-6" @submit.prevent="addJars">
      <div class="flex justify-between items-baseline">
        <h2 class="text-2xl font-medium">Add Jars</h2>

        <UButton
          icon="i-heroicons-plus"
          size="2xs"
          variant="outline"
          @click="onAddBtn"
        >
          Add
        </UButton>
      </div>

      <template v-if="jars.length">
        <UFormGroup name="currency" label="Your currency" required>
          <USelectMenu
            v-model="selectedCurrency"
            :options="currencyList?.currencies"
            option-attribute="name"
            searchable
          >
            <template #label>
              <span v-if="selectedCurrency" class="truncate">
                {{
                  selectedCurrency.name +
                  ' (' +
                  selectedCurrency.symbolNative +
                  ')'
                }}
              </span>
              <span v-else>Select</span>
            </template>
          </USelectMenu>
        </UFormGroup>

        <AddJar
          v-for="(jar, index) in jars"
          :key="`jar-${index}`"
          :jar="jar"
          :members="(family?.members as any)"
          :index="index"
          @delete-jar="onDelete"
        />

        <Alert
          v-if="errors.form"
          :message="errors.form"
          @alert-dismiss="errors.form = ''"
        />

        <UButton form="membersForm" block :loading="loading" type="submit">
          Add Jars
        </UButton>
      </template>
      <p v-else class="text-center py-4">Please add at least one jar</p>
    </form>
  </UCard>
</template>
