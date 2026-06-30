import {
  getConfig,
  getPublishedZipForVariantVersion,
  json,
  methodNotAllowed,
  verifyDownloadToken,
} from '../../../../src/server/pro-update.js';

export const onRequestGet = async ({ request, env }) => {
  const config = getConfig(env);
  if (!config.ok) {
    return json({ success: false, message: config.error }, 500);
  }

  const url = new URL(request.url);
  const token = url.searchParams.get('token');
  const verified = await verifyDownloadToken(token, config.tokenSecret);
  if (!verified.valid) {
    return json({ success: false, message: 'Invalid or expired download token.' }, 403);
  }

  const file = await getPublishedZipForVariantVersion(
    verified.payload.variant_id,
    verified.payload.version,
    config,
  );

  if (!file) {
    return json({ success: false, message: 'Download file not found.' }, 404);
  }

  return new Response(null, {
    status: 302,
    headers: {
      location: file.downloadUrl,
      'cache-control': 'no-store',
    },
  });
};

export const onRequest = (context) => {
  if (context.request.method !== 'GET') {
    return methodNotAllowed('GET');
  }

  return onRequestGet(context);
};
