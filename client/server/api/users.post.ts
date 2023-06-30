import { UserObject } from '@passageidentity/passage-node';
import { protectRoute } from '../usePassage';
import { useAppwrite } from '../useAppwrite';

export default defineEventHandler(async (event) => {
  console.log('incoming post event for api/users/', event);

  await protectRoute(event);

  const user = event.context.auth.user as UserObject;
  console.log(`got some auth user:`, user);

  const { $users } = useAppwrite();

  const res = await $users.create(
    user.id,
    user.email,
    undefined,
    undefined,
    user.user_metadata?.name as string
  );

  console.log('res of user create', res);

  return {
    status: 'ok',
  };
});
