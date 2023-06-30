import {
  PassageUser,
  PassageUserInfo,
} from '@passageidentity/passage-elements/passage-user';

export const usePassageUser = () => {
  const user = useState<PassageUserInfo | null>('passage_user', () => null);
  const token = useCookie<string>('psg_auth_token');

  console.log(`token in usePassageUser: ${token.value}`);

  const checkAuth = async () => {
    let isAuthenticated = false;
    const t = Date.now();
    try {
      isAuthenticated = await new PassageUser(token.value).authGuard();
    } catch (error) {
      console.log('checkAuth: failed', error);
    }

    console.log(`checkAuth: ${Date.now() - t}ms`);
    return isAuthenticated;
  };

  const getUser = async (authToken: string) => {
    const t = Date.now();

    try {
      const userInfo = await new PassageUser(authToken).userInfo();

      if (userInfo) {
        user.value = userInfo;
        console.log(`getUser: ${Date.now() - t}ms`);
        return userInfo;
      }
    } catch (error) {
      console.log('failed to fetch userInfo', error);
    }

    console.log(`getUser: null case: ${Date.now() - t}ms`);
    user.value = null;
    return null;
  };

  const signOut = async () => {
    try {
      await new PassageUser().signOut();
    } catch (error) {
      console.log('failed to sign out', error);
    }

    user.value = null;
    navigateTo('/sign-in');
  };

  return {
    user,
    checkAuth,
    getUser,
    signOut,
  };
};
