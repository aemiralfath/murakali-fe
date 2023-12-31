import React, { useEffect } from 'react'
import { HiPaperAirplane } from 'react-icons/hi'

import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { useResetPassword } from '@/api/auth/resetpassword'
import { A, Button, H1, Icon, P, TextInput } from '@/components'
import { useModal } from '@/hooks'

import { useFormik } from 'formik'
import * as Yup from 'yup'

function ForgotPassword() {
  const modal = useModal()
  const router = useRouter()

  const userResetPassword = useResetPassword()
  useEffect(() => {
    if (userResetPassword.isError) {
      modal.info({
        title: 'Info',
        content: (
          <P>
            An OTP has been sent to your registered email address. Please use
            the code to verify your account.
          </P>
        ),
        closeButton: true,
      })
    }
  }, [userResetPassword.isError])
  useEffect(() => {
    if (userResetPassword.isSuccess) {
      modal.info({
        title: 'Info',
        content: (
          <P>
            An OTP has been sent to your registered email address. Please use
            the code to verify your account.
          </P>
        ),
        closeButton: true,
      })
    }
  }, [userResetPassword.isSuccess])

  const forgotPasswordForm = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('This field is required'),
    }),
    onSubmit: (values) => {
      userResetPassword.mutate(values.email)
    },
  })

  return (
    <>
      <Head>
        <title>Murakali | Forgot Password</title>
      </Head>
      <div className="flex min-h-screen">
        <div className="sm:flex-0 z-10 w-screen flex-1 px-6 shadow-2xl sm:max-w-md">
          <div className="max-w-[8rem] py-6">
            <Link href={'/'}>
              <Icon color="primary" />
            </Link>
          </div>
          <H1 className="my-12">Forgot Password</H1>
          <div className="">
            <div className="text-sm text-gray-500">
              Please Input Email <br /> Reset password link will be sent to your
              email
            </div>
            <form
              className="mt-3 flex flex-col gap-4"
              onSubmit={forgotPasswordForm.handleSubmit}
            >
              <TextInput
                type="email"
                name="email"
                placeholder="name@gmail.com"
                required
                full
                label="Email"
                onChange={forgotPasswordForm.handleChange}
                value={forgotPasswordForm.values.email}
                errorMsg={
                  forgotPasswordForm.values.email !== '' &&
                  forgotPasswordForm.errors.email
                    ? forgotPasswordForm.errors.email
                    : ''
                }
              />
              <div className="mt-8 flex flex-col gap-4">
                <Button
                  type="submit"
                  buttonType="primary"
                  isLoading={userResetPassword.isLoading}
                >
                  <span>Send Email</span>
                  <HiPaperAirplane className="rotate-90" />
                </Button>
              </div>
              <div className="mt-8 text-center">
                Back to{' '}
                <A
                  className="text-primary"
                  onClick={() => router.push('/login')}
                >
                  Login
                </A>
              </div>
            </form>
          </div>
        </div>

        <div
          className="hidden items-center justify-center bg-primary bg-cover bg-center bg-no-repeat sm:flex sm:flex-1"
          style={{
            backgroundImage: 'url(/asset/abstract-bg-2.png)',
          }}
        />
      </div>
    </>
  )
}

export default ForgotPassword
