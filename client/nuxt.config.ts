// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxthq/ui'],
  runtimeConfig: {
    appwriteApiKey: process.env.APPWRITE_API_KEY,
    passageApiKey: process.env.PASSAGE_API_KEY,
    public: {
      appwriteEndpoint: process.env.APPWRITE_ENDPOINT,
      appwriteProjectId: process.env.APPWRITE_PROJECT_ID,
      appwriteDbId: process.env.APPWRITE_DATABASE_ID,
      appwriteJarColId: process.env.APPWRITE_JAR_COLLECTION_ID,
      appwriteTransactionColId: process.env.APPWRITE_TRANSACTION_COLLECTION_ID,
      passageAppId: process.env.PASSAGE_APP_ID,
    },
  },
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith('passage-'),
    },
  },

  build: {
    // You can extend webpack config here
    // transpile: ['@passageidentity/passage-elements'],
  },
});
