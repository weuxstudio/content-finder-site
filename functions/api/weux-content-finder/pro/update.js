import {
  buildUpdatePayload,
  compareVersions,
  getConfig,
  getLatestPublishedZipForVariant,
  json,
  methodNotAllowed,
  noUpdate,
  parseJsonBody,
  validateLicense,
  validateUpdateRequest,
} from '../../../../src/server/pro-update.js';

export const onRequestPost = async ({ request, env }) => {
  const payload = await parseJsonBody(request);
  const validationError = validateUpdateRequest(payload);
  if (validationError) {
    return json({ success: false, message: validationError }, 400);
  }

  const config = getConfig(env);
  if (!config.ok) {
    return json({ success: false, message: config.error }, 500);
  }

  const license = await validateLicense(payload.license_key.trim(), config);
  if (!license.valid) {
    return json(noUpdate());
  }

  const latestFile = await getLatestPublishedZipForVariant(license.variantId, config);
  if (!latestFile || compareVersions(latestFile.version, payload.version.trim()) <= 0) {
    return json(noUpdate());
  }

  const update = await buildUpdatePayload({
    request,
    updateRequest: payload,
    license,
    latestFile,
    config,
  });

  return json(update);
};

export const onRequest = (context) => {
  if (context.request.method !== 'POST') {
    return methodNotAllowed('POST');
  }

  return onRequestPost(context);
};
