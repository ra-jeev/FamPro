import { H3Event } from 'h3';
import Passage, { Metadata } from '@passageidentity/passage-node';

let _passage: Passage | null = null;

const getPassage = () => {
  if (!_passage) {
    const {
      passageApiKey,
      public: { passageAppId },
    } = useRuntimeConfig();

    const passageConfig = {
      appID: passageAppId,
      apiKey: passageApiKey,
    };

    _passage = new Passage(passageConfig);
  }

  return _passage;
};

export const protectRoute = async (event: H3Event) => {
  const passage = getPassage();
  const t = Date.now();
  try {
    const userId = await passage.authenticateRequest(event.node.req);

    if (userId) {
      console.log('request authenticated', userId);

      const user = await passage.user.get(userId);
      event.context.auth = { user };
      console.log(`total backend auth time: ${Date.now() - t}ms`);
      return;
    }
  } catch (error) {
    console.log('failed to authenticate request', error);
  }

  throw createError({
    statusCode: 401,
    message: 'Unauthorized',
  });
};

export const createUser = async (email: string, metadata: Metadata) => {
  const passage = getPassage();

  let userData = await passage.user.create({ email, user_metadata: metadata });
  console.log(userData);

  return userData;
};

export const fetchUser = async (userId: string) => {
  const passage = getPassage();

  let userData = await passage.user.get(userId);
  console.log(userData);

  return userData;
};

export const updateUser = async (userId: string, data: Metadata) => {
  const passage = getPassage();

  let userData = await passage.user.update(userId, { user_metadata: data });
  console.log(userData);

  return userData;
};
