import { Client, ID, Users, Teams, Databases } from 'node-appwrite';

type id = () => string;

interface Appwrite {
  $users: Users;
  $teams: Teams;
  $db: Databases;
  $id: id;
  DB_ID: string;
  JARS_COL_ID: string;
  TRANSACTIONS_COL_ID: string;
}

let appClient: Appwrite | null = null;

export const useAppwrite = () => {
  const {
    public: {
      appwriteEndpoint,
      appwriteProjectId,
      appwriteDbId,
      appwriteJarColId,
      appwriteTransactionColId,
    },
    appwriteApiKey,
  } = useRuntimeConfig();

  console.log(
    `inside appwrite: appwriteEndpoint ${appwriteEndpoint}, appwriteProjectId: ${appwriteProjectId}`
  );

  if (!appClient) {
    const client = new Client()
      .setEndpoint(appwriteEndpoint)
      .setProject(appwriteProjectId)
      .setKey(appwriteApiKey);

    appClient = {
      $users: new Users(client),
      $teams: new Teams(client),
      $db: new Databases(client),
      $id: ID.unique,
      DB_ID: appwriteDbId,
      JARS_COL_ID: appwriteJarColId,
      TRANSACTIONS_COL_ID: appwriteTransactionColId,
    };
  } else {
    console.log('appclient already present, simply reuse');
  }

  return appClient;
};
