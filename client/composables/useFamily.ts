import { Family } from 'types';

export const useFamily = () => {
  const family = useState<Family | null>('family', () => null);

  const getFamily = async () => {
    console.log('inside getFamily', family.value);
    if (family.value) {
      return family.value;
    }

    try {
      const data = await $fetch(`/api/families`, {
        headers: useRequestHeaders(['cookie']),
      });
      console.log('response of get family', data);
      family.value = data.family;

      return family.value;
    } catch (error) {
      console.log('failed to fetch family members');
    }

    return null;
  };

  return { getFamily };
};
