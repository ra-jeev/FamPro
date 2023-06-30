const sdk = require('node-appwrite');

module.exports = async function (req, res) {
  const client = new sdk.Client();

  const eventData = JSON.parse(req.variables.APPWRITE_FUNCTION_EVENT_DATA);
  console.log('eventData: ', JSON.stringify(eventData, null, 2));

  if (eventData.pending) {
    console.log('pending transaction, return');
    return;
  }

  if (
    !req.variables['APPWRITE_FUNCTION_ENDPOINT'] ||
    !req.variables['APPWRITE_FUNCTION_API_KEY']
  ) {
    console.log(
      'Environment variables are not set. Function cannot use Appwrite SDK.'
    );
  } else {
    const database = new sdk.Databases(client);

    client
      .setEndpoint(req.variables['APPWRITE_FUNCTION_ENDPOINT'])
      .setProject(req.variables['APPWRITE_FUNCTION_PROJECT_ID'])
      .setKey(req.variables['APPWRITE_FUNCTION_API_KEY']);

    const jarCollectionId =
      req.variables['APPWRITE_FUNCTION_JARS_COLLECTION_ID'];
    const jar = await database.getDocument(
      eventData.$databaseId,
      jarCollectionId,
      eventData.jarId
    );

    const currBalance = parseFloat(jar.balance);
    const amount = parseFloat(eventData.amount);

    const finalBalance = currBalance + (eventData.credit ? amount : -amount);

    await database.updateDocument(
      eventData.$databaseId,
      jarCollectionId,
      eventData.jarId,
      { balance: finalBalance }
    );
  }

  res.json({
    status: 'ok',
  });
};
