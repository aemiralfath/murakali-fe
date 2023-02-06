import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import jwt_decode from 'jwt-decode'

import type { Jwt } from './types/api/user.js'

export async function middleware(req: NextRequest) {
  const response = NextResponse.next()

  if (!req.cookies.has('access_token')) {
    const url = req.nextUrl.clone()
    return NextResponse.redirect(url.origin + '/redirect?from=' + url.pathname)
  }

  const newToken = req.cookies.get('access_token')
  if (newToken !== undefined) {
    const jwt = jwt_decode<Jwt>(newToken.value)

    if (req.nextUrl.pathname.startsWith('/seller-panel')) {
      if (jwt.role_id !== 2) {
        const url = req.nextUrl.clone()
        url.pathname = '/profile/register-merchant'
        return NextResponse.redirect(url)
      }
      return response
    }

    if (req.nextUrl.pathname.startsWith('/admin')) {
      if (jwt.role_id !== 3) {
        const url = req.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
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

export const config = {
  matcher: [
    '/profile/:path*',
    '/checkout/:path*',
    '/favorites',
    '/order/:path*',
    '/slp-payment/:path*',
    '/slp-top-up/:path*',
    '/wallet/:path*',
    '/seller-panel/:path*',
    '/admin/:path*',
  ],
}
