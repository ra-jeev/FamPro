import {
  PassageUser,
  PassageUserInfo,
} from '@passageidentity/passage-elements/passage-user';

export const usePassageUser = () => {
  const user = useState<PassageUserInfo | null>('passage_user', () => null);
  const token = useCookie<string>('psg_auth_token');

  const checkAuth = async () => {
    let isAuthenticated = false;

    try {
      isAuthenticated = await new PassageUser(token.value).authGuard();
    } catch (error) {
      console.log('checkAuth: failed', error);
    }

    return isAuthenticated;
  };

  const getUser = async (authToken: string) => {
    try {
      const userInfo = await new PassageUser(authToken).userInfo();

      if (userInfo) {
        user.value = userInfo;
        return userInfo;
      }
    } catch (error) {
      console.log('failed to fetch userInfo', error);
    }

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
