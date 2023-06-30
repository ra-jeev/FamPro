import { UserObject } from '@passageidentity/passage-node';
import { useAppwrite } from '../useAppwrite';
import { protectRoute } from '../usePassage';

export default defineEventHandler(async (event) => {
  console.log('incoming get event for api/families/');

  await protectRoute(event);

  const user = event.context.auth.user as UserObject;
  const familyId = user.user_metadata?.family_id as string;

  if (!familyId) {
    throw createError({
      statusCode: 400,
      message: 'Not part of any family',
    });
  }

  const { $teams } = useAppwrite();
  const familyRes = await $teams.get(familyId);
  const membershipRes = await $teams.listMemberships(familyId);

  return {
    status: 'ok',
    family: { ...familyRes, members: membershipRes.memberships },
  };
});
