import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

function getSafeRedirectPath(next: string | null) {
  if (!next || !next.startsWith('/') || next.startsWith('//')) {
    return '/decide';
  }

  return next;
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = getSafeRedirectPath(requestUrl.searchParams.get('next'));
  const errorDescription = requestUrl.searchParams.get('error_description');
  const errorCode = requestUrl.searchParams.get('error_code');

  if (errorDescription || errorCode) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('error', errorDescription ?? errorCode ?? 'Authentication failed');
    return NextResponse.redirect(loginUrl);
  }

  if (!code) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('error', 'Missing authentication code');
    return NextResponse.redirect(loginUrl);
  }

  const supabase = createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('error', error.message);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.redirect(new URL(next, request.url));
}
