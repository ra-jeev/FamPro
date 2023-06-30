import { UserObject } from '@passageidentity/passage-node';
import { useAppwrite } from '../useAppwrite';
import { protectRoute, updateUser } from '../usePassage';

export default defineEventHandler(async (event) => {
  console.log('incoming post event for api/jars/');
  await protectRoute(event);

  const body = await readBody(event);
  console.log('body', body);

  const user = event.context.auth.user as UserObject;
  const roles = user.user_metadata?.roles as string;
  if (!roles.includes('member')) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }

  if (!body.jars || !body.jars.length) {
    throw createError({
      statusCode: 400,
      message: 'No jars to create',
    });
  }

  const { $id, $db, DB_ID, JARS_COL_ID } = useAppwrite();
  try {
    const promises = [];
    for (const jar of body.jars) {
      promises.push(
        $db.createDocument(DB_ID, JARS_COL_ID, $id(), {
          ...jar,
          currencyCode: body.currencyCode,
          currencySymbol: body.currencySymbol,
        })
      );
    }

    const res = await Promise.all(promises);
    let updatedUser;
    if (user.user_metadata?.onboard_step === 'jar') {
      console.log('updating the user for onboarding');
      updatedUser = await updateUser(user.id, {
        onboard_step: 'done',
      });
    }

    return {
      status: 'ok',
      jars: res,
      user: updatedUser,
    };
  } catch (error) {
    console.log('failed to create jars', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to create jars',
    });
  }
});
