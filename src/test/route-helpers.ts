import { NextResponse, NextRequest } from 'next/server';

type RouteHandler = (req: NextRequest) => Promise<Response>;

export async function testRouteHandler(
  handler: RouteHandler,
  url: string,
  options: {
    method?: string;
    headers?: HeadersInit;
    body?: any;
    params?: Record<string, string>;
  } = {}
) {
  const request = new NextRequest(url, {
    method: options.method || 'GET',
    headers: options.headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  // @ts-ignore - Adding validated data to request
  request.validatedData = {
    params: options.params || {},
    query: Object.fromEntries(new URL(url).searchParams),
    body: options.body,
  };

  // @ts-ignore - Adding options to request for testing
  request._options = options;

  return handler(request);
}