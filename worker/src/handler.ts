/* eslint-disable no-undef */
interface Endpoint {
  method: string
  status: number
  body: Record<string, unknown> | string
  contentType: string
  headers: Record<string, string>
}

const craftResponse = (etag: string, data: Endpoint) => {
  const { status, body, contentType, headers } = data;
  return new Response(body as BodyInitializer, {
    status: status,
    headers: {
      ...headers,
      'Content-Type': contentType,
      'Cache-Control': 's-maxage=3600'
    }
  });
};

export async function handleRequest (event: FetchEvent): Promise<Response> {
  const url = new URL(event.request.url);
  const { pathname } = url;
  const key = pathname.slice(1);
  if (!key) {
    return new Response(null, {
      status: 404
    });
  }
  const cacheKey = 'https://my-cache.com/cache/' + key;
  const cache = await caches.default;
  const result = await cache.match(cacheKey);

  // Browser caching first to save on network requests
  if (event.request.headers.get('If-None-Match') === key) {
    console.log('browser-cache-hit');
    return new Response(null, {
      status: 304,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'max-age=31536000',
        ETag: key
      }
    });
  }
  if (result) {
    console.log('cache-hit');
    return result;
  }
  console.log('cache-miss');
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  /** @ts-ignore */
  const data = await MOCKA_STORE.get(key);
  if (!data) {
    return new Response(null, {
      status: 404,
      statusText: 'Not Found'
    });
  }

  const parsed = JSON.parse(data) as Endpoint;
  if (parsed.method !== event.request.method) {
    return new Response(null, {
      status: 405,
      statusText: 'Method Not Allowed'
    });
  }
  const response = craftResponse(key, parsed);
  event.waitUntil(cache.put(cacheKey, response.clone()));

  return response;
}
