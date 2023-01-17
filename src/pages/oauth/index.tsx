import { useGoogleAuth } from '@/api/auth/oauth'
import type { OauthError } from '@/types/api/auth'
import type { APIResponse } from '@/types/api/response'
import type { AxiosError } from 'axios'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

function OauthPage() {
  const router = useRouter()
  const { code, state } = router.query

  const googleAuth = useGoogleAuth()

  useEffect(() => {
    if (code && state) {
      googleAuth.mutate({ code: code as string, state: state as string })
    }
  }, [router.query])

  useEffect(() => {
    if (googleAuth.isSuccess) {
      toast.success('Google Auth Success')
      if (googleAuth.data.data.data) {
        router.push('/')
      } else {
        router.push('/register?from=google')
      }
    }
  }, [googleAuth.isSuccess])

  useEffect(() => {
    if (googleAuth.isError) {
      const reason = googleAuth.failureReason as AxiosError<
        APIResponse<OauthError>
      >
      toast.error(
        reason.response ? reason.response.data.message : reason.message
      )

      router.push(
        reason.response.data.data ? reason.response.data.data.path_url : '/'
      )
    }
  }, [googleAuth.isError])
}

export default OauthPage
