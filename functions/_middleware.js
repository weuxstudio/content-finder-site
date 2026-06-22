const isEnabled = (value) => ['1', 'true', 'yes', 'on'].includes(String(value || '').toLowerCase());

export const onRequest = async ({ request, env, next }) => {
  const url = new URL(request.url);
  const shouldShowComingSoon = isEnabled(env.COMING_SOON);
  const isHome = url.pathname === '/' || url.pathname === '/index.html';

  if (shouldShowComingSoon && isHome) {
    url.pathname = '/coming-soon';
    return Response.redirect(url.toString(), 302);
  }

  return next();
};
