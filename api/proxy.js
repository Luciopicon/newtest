export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  const url = new URL(request.url);
  let targetUrl = 'https://newshioya.fun' + url.pathname + url.search;

  // Remove headers que a Vercel usa para bloquear
  const headers = new Headers(request.headers);
  headers.delete('x-vercel-ip-country');
  headers.delete('x-vercel-ip-country-region');
  headers.delete('x-vercel-ip-city');
  headers.delete('x-forwarded-for');
  headers.delete('x-real-ip');

  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: headers,
      body: request.body,
      redirect: 'follow',
    });

    // Copia headers de resposta
    const responseHeaders = new Headers(response.headers);
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, XHTTP');

    return new Response(response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    return new Response('Proxy Error: ' + error.message, { status: 502 });
  }
}
