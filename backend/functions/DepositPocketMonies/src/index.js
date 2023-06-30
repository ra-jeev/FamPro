const sdk = require('node-appwrite');

module.exports = async function (req, res) {
  const client = new sdk.Client();

  if (
    !req.variables['APPWRITE_FUNCTION_ENDPOINT'] ||
    !req.variables['APPWRITE_FUNCTION_API_KEY']
  ) {
    console.log(
      'Environment variables are not set. Function cannot use Appwrite SDK.'
    );
  } else {
    const date = new Date();
    date.setUTCHours(0, 0, 0, 0);
    const database = new sdk.Databases(client);
    client
      .setEndpoint(req.variables['APPWRITE_FUNCTION_ENDPOINT'])
      .setProject(req.variables['APPWRITE_FUNCTION_PROJECT_ID'])
      .setKey(req.variables['APPWRITE_FUNCTION_API_KEY']);

    const dbId = req.variables['APPWRITE_FUNCTION_DATABASE_ID'];
    const jarsCollectionId =
      req.variables['APPWRITE_FUNCTION_JARS_COLLECTION_ID'];
    const transactionsCollectionId =
      req.variables['APPWRITE_FUNCTION_TRANSACTIONS_COLLECTION_ID'];

    const eligibleJars = await database.listDocuments(dbId, jarsCollectionId, [
      sdk.Query.equal('nextMoneyAt', date.toISOString()),
    ]);

    console.log('eligibleJars: ', JSON.stringify(eligibleJars, null, 2));

    if (eligibleJars.total > 0) {
      const promises = [];
      for (const jar of eligibleJars.documents) {
        promises.push(
          database.createDocument(
            dbId,
            transactionsCollectionId,
            sdk.ID.unique(),
            {
              amount: jar.autoCreditAmount,
              comment: 'Auto credit',
              credit: true,
              pending: false,
              userId: jar.ownerId,
              familyId: jar.familyId,
              jarId: jar.$id,
              currencyCode: jar.currencyCode,
              currencySymbol: jar.currencySymbol,
            }
          )
        );
      }

      await Promise.all(promises);
    }
  }

  res.json({
    status: 'ok',
  });
};
