import { useGetUserVerify } from '@/api/auth/resetpassword'
import { Button, H1, Icon, P } from '@/components'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'

import type { APIResponse } from '@/types/api/response'
import type { AxiosError } from 'axios'
import Head from 'next/head'

function VerifyPage() {
  const router = useRouter()

  const { code, email } = router.query

  const getUserVerify = useGetUserVerify(code as string, email as string)
  useEffect(() => {
    if (getUserVerify.isSuccess) {
      toast.success('Verify Success')
      router.push('/change-password')
    }
  }, [getUserVerify.isSuccess])

  useEffect(() => {
    if (getUserVerify.isError) {
      const errmsg = getUserVerify.error as AxiosError<APIResponse<null>>
      toast.error(
        errmsg.response ? errmsg.response.data.message : errmsg.message
      )
    }
  }, [getUserVerify.isError])

  function Verify() {
    getUserVerify.mutate()
  }
  return (
    <>
      <Head>
        <title>Murakali | Email Verification</title>
      </Head>
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-primary p-4">
        <div className="max-w-[24rem]">
          <div className="flex flex-col gap-6 rounded-lg bg-white px-8 py-12 text-center shadow-lg">
            <div className="mx-auto mb-8 max-w-[8rem]">
              <Icon color="primary" />
            </div>
            <H1>Verify Your Email</H1>
            <P>Please click the button below to verify your email.</P>
            <div className="mt-12">
              <Button
                buttonType="primary"
                outlined
                type="button"
                className="w-full"
                onClick={Verify}
              >
                Verify
              </Button>
            </div>
          </div>
          <div className="mt-2 text-center text-sm text-white">
            Copyright © 2023 Murakali Team
          </div>
        </div>
      </div>
    </>
  )
}

export default VerifyPage
