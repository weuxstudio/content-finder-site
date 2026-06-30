const LEMON_API_BASE = 'https://api.lemonsqueezy.com/v1';
const UPDATE_NAME = 'WEUX Content Finder Pro';
const UPDATE_HOMEPAGE = 'https://contentfinderwp.com';
const UPDATE_DESCRIPTION = 'Pro package for WEUX Content Finder.';
const TOKEN_TTL_SECONDS = 10 * 60;

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export const json = (body, status = 200, headers = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...headers,
    },
  });

export const methodNotAllowed = (allow) => json({ success: false, message: 'Method not allowed.' }, 405, {
  allow,
});

export const noUpdate = () => ({ success: true, update: null });

export const getConfig = (env = {}) => {
  const apiKey = String(env.LEMONSQUEEZY_API_KEY || '').trim();
  const productId = String(env.LEMONSQUEEZY_PRODUCT_ID || '').trim();
  const tokenSecret = String(env.PRO_DOWNLOAD_TOKEN_SECRET || '').trim();

  if (!apiKey || !productId || !tokenSecret) {
    return {
      ok: false,
      error: 'Pro update API is not configured.',
    };
  }

  return {
    ok: true,
    apiKey,
    productId,
    tokenSecret,
    minWpVersion: String(env.PRO_MIN_WP_VERSION || '7.0'),
    testedWpVersion: String(env.PRO_TESTED_WP_VERSION || '7.0'),
    minPhpVersion: String(env.PRO_MIN_PHP_VERSION || '8.0'),
    changelogHtml: String(env.PRO_CHANGELOG_HTML || '').trim(),
  };
};

export const parseJsonBody = async (request) => {
  try {
    return await request.json();
  } catch {
    return null;
  }
};

export const validateUpdateRequest = (payload) => {
  if (!payload || typeof payload !== 'object') {
    return 'Please send a valid JSON object.';
  }

  if (typeof payload.license_key !== 'string' || payload.license_key.trim() === '') {
    return 'Missing license_key.';
  }

  if (typeof payload.version !== 'string' || payload.version.trim() === '') {
    return 'Missing version.';
  }

  return '';
};

export const validateLicense = async (licenseKey, config, fetchImpl = fetch) => {
  const response = await fetchImpl(`${LEMON_API_BASE}/licenses/validate`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: JSON.stringify({ license_key: licenseKey }),
  });

  if (!response.ok) {
    return { valid: false };
  }

  const body = await readJson(response);
  if (!body || body.valid !== true) {
    return { valid: false };
  }

  const meta = body.meta || {};
  const productId = normalizeId(meta.product_id);
  const variantId = normalizeId(meta.variant_id);
  const licenseKeyData = body.license_key || {};
  const licenseKeyId = normalizeId(licenseKeyData.id);

  if (productId !== normalizeId(config.productId) || !variantId || !licenseKeyId) {
    return { valid: false };
  }

  return {
    valid: true,
    licenseKeyId,
    variantId,
  };
};

export const getLatestPublishedZipForVariant = async (variantId, config, fetchImpl = fetch) => {
  const files = await listPublishedZipFilesForVariant(variantId, config, fetchImpl);

  return files.sort((a, b) => compareVersions(b.version, a.version))[0] || null;
};

export const getPublishedZipForVariantVersion = async (variantId, version, config, fetchImpl = fetch) => {
  const files = await listPublishedZipFilesForVariant(variantId, config, fetchImpl);

  return files.find((file) => file.version === version) || null;
};

export const compareVersions = (left, right) => {
  const leftParts = versionParts(left);
  const rightParts = versionParts(right);
  const length = Math.max(leftParts.length, rightParts.length);

  for (let index = 0; index < length; index += 1) {
    const a = leftParts[index] || 0;
    const b = rightParts[index] || 0;
    if (a > b) return 1;
    if (a < b) return -1;
  }

  return 0;
};

export const buildUpdatePayload = async ({ request, updateRequest, license, latestFile, config }) => {
  const token = await signDownloadToken(
    {
      license_key_id: license.licenseKeyId,
      variant_id: license.variantId,
      version: latestFile.version,
      site_url_hash: await sha256Base64Url(String(updateRequest.site_url || '')),
      instance_id: String(updateRequest.instance_id || ''),
      exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS,
    },
    config.tokenSecret,
  );
  const origin = new URL(request.url).origin;
  const changelog = config.changelogHtml || `<h4>${escapeHtml(latestFile.version)}</h4><ul><li>WEUX Content Finder Pro update.</li></ul>`;

  return {
    success: true,
    update: {
      name: UPDATE_NAME,
      version: latestFile.version,
      homepage: UPDATE_HOMEPAGE,
      requires: config.minWpVersion,
      tested: config.testedWpVersion,
      requires_php: config.minPhpVersion,
      package: `${origin}/api/weux-content-finder/pro/download?token=${encodeURIComponent(token)}`,
      description: UPDATE_DESCRIPTION,
      changelog,
      icons: {},
      banners: {},
    },
  };
};

export const signDownloadToken = async (payload, secret) => {
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = await signString(encodedPayload, secret);

  return `${encodedPayload}.${signature}`;
};

export const verifyDownloadToken = async (token, secret) => {
  const [encodedPayload, signature, extra] = String(token || '').split('.');
  if (!encodedPayload || !signature || extra !== undefined) {
    return { valid: false, reason: 'invalid' };
  }

  const expected = await signString(encodedPayload, secret);
  if (!constantTimeEqual(signature, expected)) {
    return { valid: false, reason: 'invalid' };
  }

  let payload;
  try {
    payload = JSON.parse(base64UrlDecode(encodedPayload));
  } catch {
    return { valid: false, reason: 'invalid' };
  }

  const now = Math.floor(Date.now() / 1000);
  if (!payload || typeof payload.exp !== 'number' || payload.exp < now) {
    return { valid: false, reason: 'expired' };
  }

  if (!payload.variant_id || !payload.version || !payload.license_key_id) {
    return { valid: false, reason: 'invalid' };
  }

  return { valid: true, payload };
};

const listPublishedZipFilesForVariant = async (variantId, config, fetchImpl) => {
  const url = new URL(`${LEMON_API_BASE}/files`);
  url.searchParams.set('filter[variant_id]', variantId);
  url.searchParams.set('page[size]', '100');

  const response = await fetchImpl(url.toString(), {
    method: 'GET',
    headers: {
      accept: 'application/vnd.api+json',
      authorization: `Bearer ${config.apiKey}`,
    },
  });

  if (!response.ok) {
    return [];
  }

  const body = await readJson(response);
  const files = Array.isArray(body?.data) ? body.data : [];

  return files
    .map(normalizeFile)
    .filter((file) => file.status === 'published' && file.version && file.downloadUrl && isZipFile(file));
};

const normalizeFile = (file) => {
  const attrs = file?.attributes || {};

  return {
    id: normalizeId(file?.id),
    name: String(attrs.name || attrs.file_name || attrs.filename || ''),
    version: String(attrs.version || '').trim(),
    status: String(attrs.status || '').trim(),
    extension: String(attrs.extension || attrs.file_extension || '').trim().toLowerCase(),
    downloadUrl: String(attrs.download_url || attrs.downloadUrl || '').trim(),
  };
};

const isZipFile = (file) => {
  if (file.extension) {
    return file.extension === 'zip';
  }

  if (file.name) {
    return file.name.toLowerCase().endsWith('.zip');
  }

  return true;
};

const normalizeId = (value) => String(value || '').trim();

const readJson = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

const versionParts = (version) =>
  String(version || '')
    .split(/[.-]/)
    .map((part) => Number.parseInt(part, 10))
    .map((part) => (Number.isFinite(part) ? part : 0));

const signString = async (value, secret) => {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(value));

  return arrayBufferToBase64Url(signature);
};

const sha256Base64Url = async (value) => {
  const hash = await crypto.subtle.digest('SHA-256', encoder.encode(value));

  return arrayBufferToBase64Url(hash);
};

const arrayBufferToBase64Url = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return toBase64Url(btoa(binary));
};

const base64UrlEncode = (value) => {
  const bytes = encoder.encode(value);
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return toBase64Url(btoa(binary));
};

const base64UrlDecode = (value) => {
  const binary = atob(fromBase64Url(value));
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));

  return decoder.decode(bytes);
};

const toBase64Url = (value) => value.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');

const fromBase64Url = (value) => {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padding = base64.length % 4 === 0 ? '' : '='.repeat(4 - (base64.length % 4));

  return `${base64}${padding}`;
};

const constantTimeEqual = (left, right) => {
  const a = encoder.encode(left);
  const b = encoder.encode(right);
  let diff = a.length ^ b.length;
  const length = Math.max(a.length, b.length);

  for (let index = 0; index < length; index += 1) {
    diff |= (a[index] || 0) ^ (b[index] || 0);
  }

  return diff === 0;
};

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
