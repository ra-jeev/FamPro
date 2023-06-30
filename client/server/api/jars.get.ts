import { UserObject } from '@passageidentity/passage-node';
import { useAppwrite } from '../useAppwrite';
import { protectRoute, updateUser } from '../usePassage';
import { Query } from 'node-appwrite';

export default defineEventHandler(async (event) => {
  console.log('incoming get event for api/jars/');

  await protectRoute(event);

  const user = event.context.auth.user as UserObject;

  const { $db, DB_ID, JARS_COL_ID } = useAppwrite();
  const query = [
    Query.equal('familyId', user.user_metadata?.family_id as string),
  ];
  const userRoles = user.user_metadata?.roles as string;
  if (userRoles?.includes('child')) {
    query.push(Query.equal('ownerId', user.id));
  }

  console.log('final query', query);
  try {
    const res = await $db.listDocuments(DB_ID, JARS_COL_ID, query);
    console.log('res', res);

    return {
      status: 'ok',
      total: res.total,
      jars: res.documents,
    };
  } catch (error) {
    console.log('failed to get jars', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch jars',
    });
  }
});
