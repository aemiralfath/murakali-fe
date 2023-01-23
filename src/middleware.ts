import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { APIResponse } from '@/types/api/response'
import type { AccessTokenData } from '@/types/api/auth'
import { env } from './env/client.mjs'
import jwt_decode from 'jwt-decode'
import type { Jwt } from './types/api/user.js'

export async function middleware(req: NextRequest) {
  const response = NextResponse.next()
  if (req.cookies.has('access_token')) {
    const jwt = jwt_decode(req.cookies.get('access_token').value) as Jwt
    if (req.nextUrl.pathname.startsWith('/seller-panel')) {
      if (jwt.role_id !== 2) {
        const url = req.nextUrl.clone()
        url.pathname = '/profile/register-merchant'
        return NextResponse.rewrite(url)
      }
      return response
    }
    return response
  }

  const res = await fetch(env.NEXT_PUBLIC_BE_URL + '/auth/refresh')
  if (res.ok) {
    const data = (await res.json()) as APIResponse<AccessTokenData>
    if (data?.data) {
      response.cookies.set('access_token', data.data.access_token, {
        expires: new Date(data.data.expired_at),
      })
    }
  }

  if (req.cookies.has('access_token')) {
    const jwt = jwt_decode(req.cookies.get('access_token').value) as Jwt
    if (req.nextUrl.pathname.startsWith('/seller-panel')) {
      if (jwt.role_id !== 2) {
        const url = req.nextUrl.clone()
        url.pathname = '/profile/register-merchant'
        return NextResponse.rewrite(url)
      }
      return response
    }
    return response
  } else {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.rewrite(url)
  }
}

// TODO: Add pages => https://nextjs.org/docs/advanced-features/middleware#matcher
export const config = {
  matcher: ['/profile/:path*', '/seller-panel/:path*'],
}
