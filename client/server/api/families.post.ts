import { protectRoute, createUser, updateUser } from '../usePassage';
import { useAppwrite } from '../useAppwrite';

const createFamily = async (userId: string, urlOrigin: string, data: any) => {
  console.log('incoming data', data);
  if (!data.email || !data.name) {
    throw createError({
      statusCode: 400,
      message: 'Missing name or email address',
    });
  }

  const { $id, $teams } = useAppwrite();

  let resp;
  let updatedUser;
  try {
    resp = await $teams.create($id(), data.name);
    console.log('team created res', resp);

    const roles = ['owner', 'member'];
    const addRes = await $teams.createMembership(
      resp.$id,
      roles,
      `${urlOrigin}/join-team`,
      data.email,
      userId
    );

    console.log('add team member response', addRes);

    updatedUser = await updateUser(userId, {
      onboard_step: 'family',
      family_id: resp.$id,
      roles: roles.join(),
    });

    return {
      family: resp,
      user: updatedUser,
    };
  } catch (error) {
    console.log('failed to create team', error);
    if (resp) {
      await $teams.delete(resp.$id);
    }

    throw createError({
      statusCode: 500,
      message: 'Failed to create family group',
    });
  }
};

const addFamilyMembers = async (
  userId: string,
  urlOrigin: string,
  data: any
) => {
  if (!data.familyId || !data.members || !data.members.length) {
    throw createError({
      statusCode: 400,
      message: 'Missing familyId or members to add',
    });
  }

  const { $users, $teams } = useAppwrite();
  try {
    const userPromises = [];
    for (const member of data.members) {
      userPromises.push(
        createUser(member.email, {
          name: member.name,
          family_id: data.familyId,
          roles: member.role,
          onboard_step: 'done',
        })
      );
    }

    const users = await Promise.all(userPromises);
    console.log('created new users in passage: ', users);

    const appwriteUserPromises = [];
    for (const user of users) {
      appwriteUserPromises.push(
        $users.create(
          user.id,
          user.email,
          undefined,
          undefined,
          user.user_metadata?.name as string
        )
      );
    }

    const appwriteUsers = await Promise.all(appwriteUserPromises);

    console.log('created new users in appwrite: ', appwriteUsers);

    const memberPromises = [];
    for (const user of users) {
      memberPromises.push(
        $teams.createMembership(
          data.familyId,
          [user.user_metadata?.roles as string],
          `${urlOrigin}/join-team`,
          user.email,
          user.id,
          user.phone,
          user.user_metadata?.name as string
        )
      );
    }

    const memberships = await Promise.all(memberPromises);

    console.log('created memberships in appwrite', memberships);

    let updatedUser;
    if (data.onboardStep === 'family') {
      updatedUser = await updateUser(userId, {
        onboard_step: 'jar',
      });
    }

    return {
      user: updatedUser,
    };
  } catch (error) {
    console.log('failed to add members', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to add family members',
    });
  }
};

export default defineEventHandler(async (event) => {
  console.log('incoming post event for api/families/');

  await protectRoute(event);

  const body = await readBody(event);
  console.log('body', body);

  if (!body.type || !['CREATE', 'ADD_MEMBERS'].includes(body.type)) {
    throw createError({
      statusCode: 400,
      message: 'Missing or unsupported event type',
    });
  }

  const userId = event.context.auth.userId;
  console.log(`got some auth user: ${userId}`);

  const origin = getHeader(event, 'origin');
  const host = getHeader(event, 'host');

  console.log(`origin is: ${origin}, host: ${host}`);

  let data;
  if (body.type === 'CREATE') {
    data = await createFamily(userId, origin || '', body);
  } else {
    data = await addFamilyMembers(userId, origin || '', body);
  }

  return {
    status: 'ok',
    ...data,
  };
});
