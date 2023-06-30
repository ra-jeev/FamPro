export default defineNuxtRouteMiddleware(async (to, from) => {
  const { checkAuth } = usePassageUser();

  const signedIn = await checkAuth();

  if (['/sign-up', '/sign-in'].includes(to.path)) {
    if (signedIn) {
      return navigateTo('/dashboard');
    }
  } else if (to.path !== '/' && !signedIn) {
    return navigateTo('/sign-in');
  }
});
