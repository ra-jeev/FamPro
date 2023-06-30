import { Jar } from 'types';

export const useJars = () => {
  const jars = useState<Jar[]>('jars', () => []);

  const getJars = async () => {
    try {
      const data = await $fetch(`/api/jars`, {
        headers: useRequestHeaders(['cookie']),
      });

      console.log('response of get jars', data);
      jars.value = data.jars;

      return jars.value;
    } catch (error) {
      console.log('failed to fetch jars');
    }

    return [];
  };

  return { getJars };
};
