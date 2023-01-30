import { env } from '@/env/client.mjs'
import axios from 'axios'
import { getCookie, setCookie } from 'cookies-next'

import type { APIResponse } from '@/types/api/response'
import type { AccessTokenData } from '@/types/api/auth'

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

  return req
})

authorizedClient.interceptors.response.use(
  (res) => {
    return res
  },
  async (err) => {
    if (axios.isAxiosError(err)) {
      const originalConfig = err.config

      if (err.response) {
        if (err.response.status === 403) {
          try {
            const res = await axios.get<APIResponse<AccessTokenData>>(
              baseURL + '/auth/refresh',
              {
                headers: {
                  'Content-Type': 'application/json',
                },
                withCredentials: true,
              }
            )
            setCookie('access_token', res.data.data.access_token, {
              expires: new Date(res.data.data.expired_at),
            })

            originalConfig.headers.Authorization = `Bearer ${res.data.data.access_token}`
            return authorizedClient(originalConfig)
          } catch (_error) {
            if (_error.response && _error.response.data) {
              return Promise.reject(_error.response.data)
            }

            return Promise.reject(_error)
          }
        }
      }
    } else {
      // Just a stock error
      // eslint-disable-next-line no-console
      console.error(err)
    }
    return Promise.reject(err)
  }
)

export { unauthorizedClient, authorizedClient }
