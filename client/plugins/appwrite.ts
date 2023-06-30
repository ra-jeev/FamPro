import { Client, Locale } from 'appwrite';

export default defineNuxtPlugin(() => {
  const {
    public: { appwriteEndpoint, appwriteProjectId },
  } = useRuntimeConfig();

  const client = new Client()
    .setEndpoint(appwriteEndpoint)
    .setProject(appwriteProjectId);

  const locale = new Locale(client);

  return {
    provide: {
      locale,
    },
  };
});
