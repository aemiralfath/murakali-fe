import { unauthorizedClient } from '@/api/apiClient'
import type { AccessTokenData } from '@/types/api/auth'
import type { APIResponse } from '@/types/api/response'

import { useMutation } from '@tanstack/react-query'

export const useRegistrationCheckEmail = () => {
  return useMutation(async ({ email }: { email: string }) => {
    return await unauthorizedClient.post<APIResponse<AccessTokenData>>(
      '/auth/register',
      {
        email,
      }
    )
  })
}

export const useRegistrationVerifOtp = () => {
  return useMutation(async ({ email, otp }: { email: string; otp: string }) => {
    return await unauthorizedClient.post<APIResponse<AccessTokenData>>(
      '/auth/verify',
      {
        email,
        otp,
      }
    )
  })
}

export const useRegistrationFull = () => {
  return useMutation(
    async ({
      username,
      fullname,
      password,
      phoneNo,
    }: {
      username: string
      fullname: string
      password: string
      phoneNo: string
    }) => {
      const data = {
        fullname,
        password,
        phone_no: phoneNo,
        username,
      }
      return await unauthorizedClient.put<APIResponse<AccessTokenData>>(
        '/auth/register',
        data
      )
    }
  )
}
