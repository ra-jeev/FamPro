import { UserObject } from '@passageidentity/passage-node';
import { useAppwrite } from '../useAppwrite';
import { protectRoute } from '../usePassage';

const handlePatch = async (roles: string, id: string, body: object) => {
  if (roles.includes('child')) {
    throw createError({
      statusCode: 403,
      message: 'Insufficient permissions',
    });
  }

  const { $db, DB_ID, TRANSACTIONS_COL_ID } = useAppwrite();
  try {
    const res = await $db.updateDocument(DB_ID, TRANSACTIONS_COL_ID, id, body);

    console.log('update transaction response', res);
    return {
      status: 'ok',
      transactions: [res],
    };
  } catch (error) {
    console.log('failed to update transaction', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to update transaction',
    });
  }
};

export default defineEventHandler(async (event) => {
  console.log('incoming post event for api/transactions/');
  await protectRoute(event);

  const body = await readBody(event);
  console.log('body', body);

  const user = event.context.auth.user as UserObject;
  const roles = user.user_metadata?.roles as string;

  if (!body.transaction) {
    throw createError({
      statusCode: 400,
      message: 'No transaction to create/update',
    });
  }

  if (body.type && body.type === 'PATCH') {
    const id = body.transaction.id;
    delete body.transaction.id;
    return await handlePatch(roles, id, body.transaction);
  }

  const transaction = {
    ...body.transaction,
    pending: roles.includes('child'),
  };

  const { $id, $db, DB_ID, TRANSACTIONS_COL_ID } = useAppwrite();
  try {
    const res = await $db.createDocument(
      DB_ID,
      TRANSACTIONS_COL_ID,
      $id(),
      transaction
    );

    return {
      status: 'ok',
      transactions: [res],
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Failed to create transaction',
    });
  }
});
