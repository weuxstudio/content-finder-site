const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });

export const onRequestPost = async ({ request, env }) => {
  if (!env.WAITLIST) {
    return json({ message: 'Waitlist storage is not configured yet.' }, 500);
  }

  let payload;

  try {
    payload = await request.json();
  } catch {
    return json({ message: 'Please send a valid email address.' }, 400);
  }

  const email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : '';

  if (!emailPattern.test(email)) {
    return json({ message: 'Please enter a valid email address.' }, 400);
  }

  const key = `email:${email}`;
  const existing = await env.WAITLIST.get(key);

  if (existing) {
    return json({ message: 'You are already on the list. We will keep you posted.' });
  }

  await env.WAITLIST.put(
    key,
    JSON.stringify({
      email,
      createdAt: new Date().toISOString(),
      userAgent: request.headers.get('user-agent') || null,
      source: 'coming-soon-page',
    }),
  );

  return json({ message: 'You are on the list. We will let you know when Content Finder launches.' }, 201);
};

export const onRequest = () => json({ message: 'Method not allowed.' }, 405);
