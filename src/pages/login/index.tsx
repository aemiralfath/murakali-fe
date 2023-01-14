import { TextInput, Button, Icon, H1, Divider, A } from '@/components'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import YupPassword from 'yup-password'
import React, { useEffect } from 'react'
import { FaGoogle } from 'react-icons/fa'
import { useLogin } from '@/api/auth/login'
import toast from 'react-hot-toast'
import type { AxiosError } from 'axios'
import type { APIResponse } from '@/types/api/response'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { getGoogleUrl } from '@/helper/googleoauth'
import Link from 'next/link'

YupPassword(Yup)

const Login = () => {
  const router = useRouter()

  const login = useLogin()
  useEffect(() => {
    if (login.isSuccess) {
      toast.success('Login Success')
      router.push('/')
    }
  }, [login.isSuccess])
  useEffect(() => {
    if (login.isError) {
      const reason = login.failureReason as AxiosError<APIResponse<null>>
      toast.error(
        reason.response ? reason.response.data.message : reason.message
      )
    }
  }, [login.isError])

  const loginForm = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('This field is required'),
      password: Yup.string()
        .min(8, 'Must have minimum 8 characters')
        .minUppercase(1, 'Must have minimum 1 uppercase character')
        .minNumbers(1, 'Must have minimum 1 number')
        .minSymbols(1, 'Must have minimum 1 special character')
        .required('This field is required'),
    }),
    onSubmit: (values) => {
      login.mutate(values)
    },
  })

  return (
    <>
      <Head>
        <title>Murakali | Login</title>
      </Head>
      <div className="flex min-h-screen">
        <div className="sm:flex-0 z-10 w-screen flex-1 px-6 shadow-2xl sm:max-w-md">
          <div className="max-w-[8rem] py-6">
            <Link href={'/'}>
              <Icon color="primary" />
            </Link>
          </div>
          <H1 className="my-12">Welcome Back!</H1>
          <div className="">
            <div className="text-sm text-gray-500">
              Please Login to continue
            </div>
            <form
              className="mt-3 flex flex-col gap-4"
              onSubmit={loginForm.handleSubmit}
            >
              <TextInput
                type="email"
                name="email"
                placeholder="name@gmail.com"
                required
                full
                label="Email"
                onChange={loginForm.handleChange}
                value={loginForm.values.email}
                errorMsg={
                  loginForm.values.email !== '' && loginForm.errors.email
                    ? loginForm.errors.email
                    : ''
                }
              />
              <TextInput
                type="password"
                name="password"
                placeholder="••••••••"
                required
                full
                label="Password"
                onChange={loginForm.handleChange}
                value={loginForm.values.password}
                errorMsg={
                  loginForm.values.password !== '' && loginForm.errors.password
                    ? loginForm.errors.password
                    : ''
                }
              />
              <div className="text-right text-sm text-primary">
                <A
                  onClick={() => {
                    router.push('/forgot-password')
                  }}
                >
                  Forgot Password?
                </A>
              </div>
              <div className="mt-8 flex flex-col gap-4">
                <Button
                  type="submit"
                  buttonType="primary"
                  isLoading={login.isLoading}
                >
                  Login with Email
                </Button>
                <Divider>OR</Divider>
                <Button
                  type="button"
                  buttonType="ghost"
                  outlined
                  onClick={() => {
                    router.push(getGoogleUrl(router.pathname))
                  }}
                >
                  <FaGoogle /> Login with Google
                </Button>
              </div>
              <div className="mt-8 text-center">
                Don&apos;t have account?{' '}
                <A
                  className="text-primary"
                  onClick={() => {
                    router.push('/register')
                  }}
                >
                  Register
                </A>
              </div>
            </form>
          </div>
        </div>

        <div
          className="hidden items-center justify-center bg-primary bg-cover bg-center bg-no-repeat sm:flex sm:flex-1"
          style={{
            backgroundImage: 'url(/asset/abstract-bg.png)',
          }}
        />
      </div>
    </>
  )
}

export default Login
