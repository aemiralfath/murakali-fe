import { Button, H2, P } from '@/components'
import ProfileMenu from '@/layout/template/profile/ProfileMenu'
import { useModal } from '@/hooks'
import React from 'react'
import Head from 'next/head'
import MainLayout from '@/layout/MainLayout'
import FormChangeEmail from '@/layout/template/profile/FormChangeEmail'

function ChangeLoginCredential() {
  const modal = useModal()
  //   const userSendEmailChangePassword = useSendEmailChangePassword()

  //   useEffect(() => {
  //     if (userSendEmailChangePassword.isSuccess) {
  //       toast.success('OTP has been sended to your email')
  //       modal.info({
  //         title: 'Input OTP',
  //         content: <FormOTP OTPType="change-password" />,
  //         closeButton: false,
  //       })
  //     }
  //   }, [userSendEmailChangePassword.isSuccess])

  //   useEffect(() => {
  //     if (userSendEmailChangePassword.isError) {
  //       const errmsg = userSendEmailChangePassword.failureReason as AxiosError<
  //         APIResponse<null>
  //       >
  //       toast.error(errmsg.response?.data.message as string)
  //     }
  //   }, [userSendEmailChangePassword.isError])

  function handleSendOTP() {
    // userSendEmailChangePassword.mutate()
  }

  return (
    <>
      <Head>
        <title>Change Login Credential | Murakali</title>
        <meta
          name="description"
          content="Change Login Credential | Murakali E-Commerce Application"
        />
      </Head>
      <MainLayout>
        <div className="grid grid-cols-1 gap-x-0 gap-y-2 md:grid-cols-4 md:gap-x-2">
          <ProfileMenu selectedPage="change-login-credential" />
          <div className="border-1 col-span-3 h-full rounded-lg border-solid border-slate-600 p-8 shadow-2xl">
            <H2>Change Login Credential</H2>
            <div className="my-4 mx-2 grid grid-cols-1 gap-2 md:grid-cols-2">
              <div className="flex flex-col">
                <P>
                  Click button bellow to change Email, you will get OTP Code
                </P>
              </div>
              <div className="flex flex-col">
                <Button
                  buttonType="primary"
                  onClick={() => {
                    modal.edit({
                      title: 'Change Email',
                      content: <FormChangeEmail />,
                      closeButton: false,
                    })
                  }}
                >
                  Change Email
                </Button>
              </div>
            </div>
            <div className=" my-4 mx-2 grid grid-cols-1 gap-2 md:grid-cols-2">
              <div className="flex flex-col">
                <P>
                  Click button bellow to change Password, you will get OTP Code
                </P>
              </div>
              <div className="flex flex-col">
                <Button buttonType="primary" onClick={handleSendOTP}>
                  Edit Passwords
                </Button>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  )
}

export default ChangeLoginCredential
