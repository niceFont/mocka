interface Endpoint {
  method: string
  status: number
  body: Record<string, unknown>
  contentType: string
  headers: Record<string, string>
}



const craftResponse = (etag: string, data: Endpoint) => {
  const { status, body, contentType, headers } = data
  return new Response(JSON.stringify(body), {
    status: status,
    headers: {
      'Content-Type': contentType,
      ...headers,
      'Cache-Control': 'max-age=31536000',
      'ETag': etag,
    }
  })
}

export async function handleRequest(request: Request): Promise<Response> {
  const url = new URL(request.url)
  const { pathname } = url
  const key = pathname.slice(1)
  if (request.headers.get('If-None-Match') === key) {
    return new Response(null, {
      status: 304,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'max-age=31536000',
        'ETag': key,
      }
    })
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  /** @ts-ignore */
  const data = await MOCKA_STORE.get(key)
  if (!data) {
    return new Response(null, {
      status: 404,
      statusText: 'Not Found'
    })
  }
  const parsed = JSON.parse(data) as Endpoint
  if (parsed.method !== request.method) {
    return new Response(null, {
      status: 405,
      statusText: 'Method Not Allowed'
    })
  }
  return craftResponse(key, parsed)
}
