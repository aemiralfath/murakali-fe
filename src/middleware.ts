import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { APIResponse } from '@/types/api/response'
import type { AccessTokenData } from '@/types/api/auth'
import { env } from './env/client.mjs'

export async function middleware(req: NextRequest) {
  const response = NextResponse.next()
  if (req.cookies.has('access_token')) {
    return response
  }

  const data = (await (
    await fetch(env.NEXT_PUBLIC_BE_URL + '/auth/refresh')
  ).json()) as APIResponse<AccessTokenData>
  if (data?.data) {
    response.cookies.set('access_token', data.data.access_token, {
      expires: new Date(data.data.expired_at),
    })
  }

  if (req.cookies.has('access_token')) {
    return response
  } else {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.rewrite(url)
  }
}

// TODO: Add pages => https://nextjs.org/docs/advanced-features/middleware#matcher
export const config = {
  matcher: ['/profile/:path*'],
}
