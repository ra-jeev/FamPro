import { Transaction } from 'types';

export const useTransactions = () => {
  const transactions = useState<Transaction[]>('transactions', () => []);

  const getTransactions = async () => {
    console.log('inside getTransactions', transactions.value);

    try {
      const data = await $fetch(`/api/transactions`, {
        headers: useRequestHeaders(['cookie']),
      });

      console.log('response of get transactions', data);
      transactions.value = data.transactions;

      return transactions.value;
    } catch (error) {
      console.log('failed to fetch transactions');
    }

    return [];
  };

  return { getTransactions };
};
