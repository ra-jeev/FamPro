import { UserObject } from '@passageidentity/passage-node';
import { useAppwrite } from '../useAppwrite';
import { protectRoute } from '../usePassage';
import { Query } from 'node-appwrite';

export default defineEventHandler(async (event) => {
  console.log('incoming get event for api/transactions/');
  await protectRoute(event);

  const queryParams = getQuery(event);

  console.log('queryParams', queryParams);

  const user = event.context.auth.user as UserObject;
  const roles = user.user_metadata?.roles as string;

  const query = [];
  if (roles.includes('child')) {
    query.push(Query.equal('userId', user.id));

    if (queryParams.jarId) {
      query.push(Query.equal('jarId', queryParams.jarId as string));
    }
  } else {
    query.push(
      Query.equal('familyId', user.user_metadata?.family_id as string)
    );

    if (queryParams.userId) {
      query.push(Query.equal('userId', queryParams.userId as string));
    }

    if (queryParams.jarId) {
      query.push(Query.equal('userId', queryParams.userId as string));
    }
  }

  query.push(Query.orderDesc('$updatedAt'));
  query.push(Query.limit(25));

  const { $db, DB_ID, TRANSACTIONS_COL_ID } = useAppwrite();
  try {
    const res = await $db.listDocuments(DB_ID, TRANSACTIONS_COL_ID, query);

    return {
      status: 'ok',
      total: res.total,
      transactions: res.documents,
    };
  } catch (error) {
    console.log('failed to fetch transactions', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to get transactions',
    });
  }
});
