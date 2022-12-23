import { env } from '@/env/client.mjs'
import axios from 'axios'

import type { APIResponse } from '@/types/api/response'
import type { AccessTokenData } from '@/types/api/auth'
import { getCookie, setCookie } from 'cookies-next'

const baseURL = env.NEXT_PUBLIC_BE_URL

const unauthorizedClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

const authorizedClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

authorizedClient.interceptors.request.use(async (req) => {
  const token = getCookie('access_token')
  if (token) {
    if (req.headers) {
      req.headers.Authorization = `Bearer ${token}`
      return req
    }
  }

  unauthorizedClient
    .get<APIResponse<AccessTokenData>>('/auth/refresh')
    .then((res) => {
      if (res.data.data) {
        setCookie('access_token', res.data.data.access_token, {
          expires: new Date(res.data.data.expired_at),
        })
      }
      req.headers.Authorization = `Bearer ${res.data.message}`
    })

  return req
})

export { unauthorizedClient, authorizedClient }
