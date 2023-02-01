import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import type { AccessTokenData } from '@/types/api/auth'
import type { APIResponse } from '@/types/api/response'

import jwt_decode from 'jwt-decode'

import { env } from './env/client.mjs'
import type { Jwt } from './types/api/user.js'

export async function middleware(req: NextRequest) {
  const response = NextResponse.next()
  const gotToken = req.cookies.get('access_token')
  if (gotToken !== undefined) {
    const jwt = jwt_decode(gotToken.value) as Jwt
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

  const res = await fetch(env.NEXT_PUBLIC_BE_URL + '/auth/refresh', {
    credentials: 'include',
  })
  if (res.ok) {
    const data = (await res.json()) as APIResponse<AccessTokenData>
    if (data?.data) {
      response.cookies.set('access_token', data.data.access_token, {
        expires: new Date(data.data.expired_at),
      })
    }
  }

  const newToken = req.cookies.get('access_token')
  if (newToken !== undefined) {
    const jwt = jwt_decode(newToken.value) as Jwt
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
