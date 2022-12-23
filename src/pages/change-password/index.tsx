import { useUpdatePassword } from '@/api/auth/resetpassword'
import { Button, H1, Icon, P, TextInput } from '@/components'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import YupPassword from 'yup-password'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'

import type { AxiosError } from 'axios'
import type { APIResponse } from '@/types/api/response'
import { useRouter } from 'next/router'
import Head from 'next/head'

YupPassword(Yup)

function ChangePassword() {
  const router = useRouter()

  const userUpdatePassword = useUpdatePassword()

  useEffect(() => {
    if (userUpdatePassword.isSuccess) {
      toast.success('Update Password Success')
      router.push('/login')
    }
  }, [userUpdatePassword.isSuccess])

  useEffect(() => {
    if (userUpdatePassword.isError) {
      const errmsg = userUpdatePassword.error as AxiosError<APIResponse<null>>
      toast.error(
        errmsg.response ? errmsg.response.data.message : errmsg.message
      )
    }
  }, [userUpdatePassword.isError])

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(8, 'Must have minimum 8 characters')
        .minUppercase(1, 'Must have minimum 1 uppercase character')
        .minNumbers(1, 'Must have minimum 1 number')
        .minSymbols(1, 'Must have minimum 1 special character')
        .required('This field is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Password must match')
        .required('This field is required'),
    }),
    onSubmit: (values) => {
      userUpdatePassword.mutate(values.password)
    },
  })
  return (
    <>
      <Head>
        <title>Murakali | Change Password</title>
      </Head>
      <div className="flex min-h-screen">
        <div className="sm:flex-0 z-10 w-screen flex-1 px-6 shadow-2xl sm:max-w-md">
          <div className=" my-1 w-full px-6">
            <div>
              <div className="max-w-[8rem] py-6 ">
                <Icon color="primary" />
              </div>
            </div>

            <H1 className="mt-10">Change Password</H1>
            <P className="my-2">Please Input New Password</P>
            <form className="mt-3 space-y-6" onSubmit={formik.handleSubmit}>
              <TextInput
                label="Password"
                type="password"
                name="password"
                placeholder="••••••••"
                onChange={formik.handleChange}
                value={formik.values.password}
                required
                full
                errorMsg={
                  formik.values.password !== '' && formik.errors.password
                    ? formik.errors.password
                    : ''
                }
              />

              <div className="mt-8"></div>
              <TextInput
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                onChange={formik.handleChange}
                value={formik.values.confirmPassword}
                required
                full
                errorMsg={
                  formik.values.confirmPassword !== '' &&
                  formik.errors.confirmPassword
                    ? formik.errors.confirmPassword
                    : ''
                }
              />

              <div className="py-3">
                <Button buttonType="primary" type="submit" className="w-full">
                  Change Password
                </Button>
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

export default ChangePassword
