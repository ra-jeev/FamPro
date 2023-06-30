const sdk = require('node-appwrite');

function getNextMoneyAt(schedule) {
  if (!schedule) {
    return;
  }

  const date = new Date();
  const currDate = date.getDate();
  const currMonth = date.getMonth();

  date.setUTCHours(0, 0, 0, 0);

  if (schedule === 'Daily') {
    date.setUTCDate(currDate + 1);
  } else if (schedule === 'Weekly') {
    // Pay after 7 Days
    date.setUTCDate(currDate + 7);
  } else if (schedule === 'Fortnightly') {
    // Pay after 14 Days
    date.setUTCDate(currDate + 14);
  } else if (schedule === 'Monthly') {
    // Pay on the 1st of every month
    date.setUTCMonth(currMonth + 1, 1);
  }

  return date.toISOString();
}

module.exports = async function (req, res) {
  const client = new sdk.Client();
  const eventData = JSON.parse(req.variables.APPWRITE_FUNCTION_EVENT_DATA);
  const nextMoneyAt = getNextMoneyAt(eventData.autoCreditSchedule);
  const autoCreditAmount = eventData.autoCreditAmount;

  console.log('eventData: ', JSON.stringify(eventData, null, 2));

  if (!autoCreditAmount || !nextMoneyAt) {
    console.log('No autoCreditAmount or nextMoneyAt');
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

    await database.updateDocument(
      eventData.$databaseId,
      eventData.$collectionId,
      eventData.$id,
      { nextMoneyAt }
    );
  }

  res.json({
    status: 'ok',
  });
};
