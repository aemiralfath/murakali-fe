import { A, Button, Divider, H1, H2, P } from '@/components'
import { useModal } from '@/hooks'
import React, { useEffect } from 'react'
import Head from 'next/head'
import FormChangeEmail from '@/layout/template/profile/FormChangeEmail'
import { useSendEmailChangePassword } from '@/api/auth/changepassword'
import toast from 'react-hot-toast'
import FormOTP from '@/components/form/FormOTP'
import type { AxiosError } from 'axios'
import type { APIResponse } from '@/types/api/response'
import ProfileLayout from '@/layout/ProfileLayout'
import { HiLockClosed } from 'react-icons/hi'

function ChangeLoginCredential() {
  const modal = useModal()
  const userSendEmailChangePassword = useSendEmailChangePassword()

  useEffect(() => {
    if (userSendEmailChangePassword.isSuccess) {
      toast.success('OTP has been sended to your email')
      modal.info({
        title: 'Input OTP',
        content: <FormOTP OTPType="change-password" />,
        closeButton: false,
      })
    }
  }, [userSendEmailChangePassword.isSuccess])

  useEffect(() => {
    if (userSendEmailChangePassword.isError) {
      const errmsg = userSendEmailChangePassword.failureReason as AxiosError<
        APIResponse<null>
      >
      toast.error(errmsg.response?.data.message as string)
    }
  }, [userSendEmailChangePassword.isError])

  function handleSendOTP() {
    userSendEmailChangePassword.mutate()
  }

  return (
    <>
      <Head>
        <title>Edit Login Credentials | Murakali</title>
        <meta
          name="description"
          content="Edit Login Credentials | Murakali E-Commerce Application"
        />
      </Head>
      <ProfileLayout selectedPage="edit-login-credential">
        <>
          {' '}
          <H1 className="text-primary">Edit Credentials</H1>
          <div className="my-4">
            <Divider />
          </div>
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-y-2">
              <H2>Edit Email</H2>
              <P> Click button below to start the Edit Email process.</P>
              <div>
                <Button
                  buttonType="primary"
                  outlined
                  size="sm"
                  onClick={() => {
                    modal.edit({
                      title: 'Change Email',
                      content: <FormChangeEmail />,
                      closeButton: false,
                    })
                  }}
                >
                  <HiLockClosed /> Change Email
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-y-2">
              <H2>Edit Password</H2>
              <P>Click button below to start the Edit Password process.</P>
              <div>
                <Button
                  buttonType="primary"
                  outlined
                  size="sm"
                  onClick={() => {
                    modal.edit({
                      title: 'Change Password',
                      content: (
                        <div className="flex flex-col items-center gap-2">
                          <P>Click button below to get OTP</P>
                          <Button
                            buttonType="primary"
                            onClick={() => {
                              handleSendOTP()
                            }}
                          >
                            Send OTP
                          </Button>
                          <div className="mt-4 text-sm">
                            Already got OTP?{' '}
                            <A
                              className="text-primary"
                              onClick={() => {
                                modal.info({
                                  title: 'Input OTP',
                                  content: (
                                    <FormOTP OTPType="change-password" />
                                  ),
                                  closeButton: false,
                                })
                              }}
                            >
                              Insert OTP
                            </A>
                          </div>
                        </div>
                      ),
                    })
                  }}
                >
                  <HiLockClosed /> Change Password
                </Button>
              </div>
            </div>
          </div>
        </>
      </ProfileLayout>
    </>
  )
}

export default ChangeLoginCredential
