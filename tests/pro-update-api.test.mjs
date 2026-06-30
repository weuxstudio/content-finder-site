import assert from 'node:assert/strict';
import test from 'node:test';

import { onRequestGet as downloadRequest } from '../functions/api/weux-content-finder/pro/download.js';
import { signDownloadToken } from '../src/server/pro-update.js';
import { onRequestPost as updateRequest } from '../functions/api/weux-content-finder/pro/update.js';

const env = {
  LEMONSQUEEZY_API_KEY: 'test-api-key',
  LEMONSQUEEZY_PRODUCT_ID: '999',
  PRO_DOWNLOAD_TOKEN_SECRET: 'test-token-secret',
};

const validLicenseBody = {
  valid: true,
  license_key: { id: 12345 },
  meta: {
    product_id: 999,
    variant_id: 777,
  },
};

const filesBody = {
  data: [
    {
      id: 'file-old',
      attributes: {
        name: 'weux-content-finder-pro-1.0.1.zip',
        version: '1.0.1',
        status: 'published',
        extension: 'zip',
        download_url: 'https://app.lemonsqueezy.com/download-old',
      },
    },
    {
      id: 'file-latest',
      attributes: {
        name: 'weux-content-finder-pro-1.0.2.zip',
        version: '1.0.2',
        status: 'published',
        extension: 'zip',
        download_url: 'https://app.lemonsqueezy.com/download-latest',
      },
    },
    {
      id: 'file-draft',
      attributes: {
        name: 'weux-content-finder-pro-2.0.0.zip',
        version: '2.0.0',
        status: 'draft',
        extension: 'zip',
        download_url: 'https://app.lemonsqueezy.com/download-draft',
      },
    },
  ],
};

test('update returns 400 for malformed JSON', async () => {
  const response = await updateRequest({
    request: new Request('https://contentfinderwp.com/api/weux-content-finder/pro/update', {
      method: 'POST',
      body: '{bad json',
    }),
    env,
  });
  const body = await response.json();

  assert.equal(response.status, 400);
  assert.equal(body.success, false);
});

test('update returns null for invalid license', async () => {
  const restoreFetch = mockFetch([
    [({ url }) => url.endsWith('/licenses/validate'), { valid: false }],
  ]);
  try {
    const response = await postUpdate({ license_key: 'invalid-license', version: '1.0.1' });
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(body, { success: true, update: null });
  } finally {
    restoreFetch();
  }
});

test('update returns null for wrong product id', async () => {
  const restoreFetch = mockFetch([
    [({ url }) => url.endsWith('/licenses/validate'), {
      valid: true,
      license_key: { id: 12345 },
      meta: { product_id: 111, variant_id: 777 },
    }],
  ]);
  try {
    const response = await postUpdate({ license_key: 'wrong-product-license', version: '1.0.1' });
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(body, { success: true, update: null });
  } finally {
    restoreFetch();
  }
});

test('update returns null when no newer file version exists', async () => {
  const restoreFetch = mockFetch([
    [({ url }) => url.endsWith('/licenses/validate'), validLicenseBody],
    [({ url }) => url.includes('/files?'), filesBody],
  ]);
  try {
    const response = await postUpdate({ license_key: 'valid-license', version: '1.0.2' });
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(body, { success: true, update: null });
  } finally {
    restoreFetch();
  }
});

test('update returns payload with short-lived download token for newer file version', async () => {
  const restoreFetch = mockFetch([
    [({ url }) => url.endsWith('/licenses/validate'), validLicenseBody],
    [({ url }) => url.includes('/files?'), filesBody],
  ]);
  try {
    const response = await postUpdate({
      license_key: 'valid-license-secret',
      version: '1.0.1',
      site_url: 'https://example.com',
      instance_id: 'example.com',
    });
    const body = await response.json();
    const packageUrl = new URL(body.update.package);
    const token = packageUrl.searchParams.get('token');

    assert.equal(response.status, 200);
    assert.equal(body.success, true);
    assert.equal(body.update.version, '1.0.2');
    assert.equal(body.update.name, 'WEUX Content Finder Pro');
    assert.equal(packageUrl.pathname, '/api/weux-content-finder/pro/download');
    assert.ok(token);
    assert.equal(token.includes('valid-license-secret'), false);
  } finally {
    restoreFetch();
  }
});

test('download rejects expired token', async () => {
  const token = await signDownloadToken(
    {
      license_key_id: '12345',
      variant_id: '777',
      version: '1.0.2',
      site_url_hash: 'hash',
      instance_id: 'example.com',
      exp: Math.floor(Date.now() / 1000) - 10,
    },
    env.PRO_DOWNLOAD_TOKEN_SECRET,
  );

  const response = await downloadRequest({
    request: new Request(`https://contentfinderwp.com/api/weux-content-finder/pro/download?token=${encodeURIComponent(token)}`),
    env,
  });
  const body = await response.json();

  assert.equal(response.status, 403);
  assert.equal(body.success, false);
});

test('download redirects to Lemon Squeezy signed download URL for valid token', async () => {
  const restoreFetch = mockFetch([
    [({ url }) => url.includes('/files?'), filesBody],
  ]);
  try {
    const token = await signDownloadToken(
      {
        license_key_id: '12345',
        variant_id: '777',
        version: '1.0.2',
        site_url_hash: 'hash',
        instance_id: 'example.com',
        exp: Math.floor(Date.now() / 1000) + 600,
      },
      env.PRO_DOWNLOAD_TOKEN_SECRET,
    );

    const response = await downloadRequest({
      request: new Request(`https://contentfinderwp.com/api/weux-content-finder/pro/download?token=${encodeURIComponent(token)}`),
      env,
    });

    assert.equal(response.status, 302);
    assert.equal(response.headers.get('location'), 'https://app.lemonsqueezy.com/download-latest');
  } finally {
    restoreFetch();
  }
});

const postUpdate = (payload) =>
  updateRequest({
    request: new Request('https://contentfinderwp.com/api/weux-content-finder/pro/update', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    }),
    env,
  });

const mockFetch = (routes) => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input, init = {}) => {
    const url = typeof input === 'string' ? input : input.url;

    for (const [matches, body] of routes) {
      if (matches({ url, init })) {
        return new Response(JSON.stringify(body), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        });
      }
    }

    throw new Error(`Unexpected fetch: ${url}`);
  };

  return () => {
    globalThis.fetch = originalFetch;
  };
};
