
export function mockFetchForExtensionManifest() {
  return Promise.resolve({
    ok: true,
    json: () => ({
      extensions: [{
        version: 1,
        id: 'clientid',
        views: {},
      }],
    }),
  });
}

export function mockFetchForUserInfo() {
  return Promise.resolve({
    ok: true,
    json: () => ({
      data: [{
        login: 'test',
        profile_image_url: 'test.png',
      }],
    }),
  });
}

export function mockEmptyResponse() {
  return Promise.resolve({ json: () => '' });
}

export function mockFetch400() {
  return Promise.resolve({
    status: 400,
    json: () => Promise.resolve({ message: '400 error' }),
  });
}

export function mockFetch500() {
  return Promise.resolve({
    status: 500,
    json: () => Promise.resolve({ message: '500 error' }),
  });
}

export function mockFetchError() {
  return Promise.reject('Fake error');
}

export function mockFetchProducts() {
  return Promise.resolve({
    json: () => ({
      products: [{
        domain: 'twitch.ext.mock',
        sku: 'test1',
        displayName: 'Test 1',
        cost: { amount: 1, type: 'bits' },
        inDevelopment: true,
        broadcast: false,
      },
      {
        domain: 'twitch.ext.mock',
        sku: 'test2',
        displayName: 'Test 2',
        cost: { amount: 100, type: 'bits' },
        inDevelopment: false,
        broadcast: false,
      }],
    }),
  });
}

export function mockSaveProduct() {
  return Promise.resolve({
    status: 204,
    json: () => Promise.resolve({}),
  });
}

export function mockFetchNewRelease(includeTagName: boolean) {
  return Promise.resolve({
    ok: true,
    json: () => ({
      tag_name: includeTagName && '0.0.0',
      assets: [{
        browser_download_url: 'test.zip',
      }],
    }),
  });
}
