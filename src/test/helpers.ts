import { NextResponse } from 'next/server';

export async function testRouteHandler(
  handler: (req: Request) => Promise<Response>,
  url: string,
  options: {
    method?: string;
    headers?: HeadersInit;
    body?: any;
  } = {}
) {
  const request = new Request(url, {
    method: options.method || 'GET',
    headers: options.headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  // @ts-ignore - Adding validated data to request
  request.validatedData = {
    query: Object.fromEntries(new URL(url).searchParams),
    params: {},
    body: options.body,
  };

  return handler(request);
} 