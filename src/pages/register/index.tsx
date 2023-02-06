import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FaGoogle } from 'react-icons/fa'

import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

import {
  useRegistrationCheckEmail,
  useRegistrationFull,
} from '@/api/auth/registration'
import { TextInput, Button, Icon, H1, Divider } from '@/components'
import { getGoogleUrl } from '@/helper/googleoauth'
import { useModal } from '@/hooks'
import FormOTP from '@/sections/registration/FormOTP'
import type { APIResponse } from '@/types/api/response'

import type { AxiosError } from 'axios'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import YupPassword from 'yup-password'

YupPassword(Yup)

const RegistrationPage = () => {
  const router = useRouter()
  const modalOtp = useModal()
  const [email, setEmail] = useState('')
  const registration = useRegistrationCheckEmail()
  const [isOtpValid, setIsOtpValid] = React.useState(false)

  const { from } = router.query

  useEffect(() => {
    if (from && from === 'google') {
      setIsOtpValid(true)
    }
  }, [router.query])

  const registrationForm = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('This field is required'),
    }),
    onSubmit: (values) => {
      setEmail(values.email)
      registration.mutate(values)
    },
  })

  const registrationFullForm = useFormik({
    initialValues: {
      username: '',
      fullname: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, 'Must be 3 characters or more')
        .matches(/^[a-zA-Z0-9]*$/, 'Username is incorrect')
        .required('This field is required'),
      fullname: Yup.string()
        .min(3, 'Must be 3 characters or more')
        .required('This field is required'),
      password: Yup.string()
        .min(8, 'Must be 8 characters or more')
        .matches(
          /^(?=.*[A-Z])/,
          'Must Contain Mininimum One Uppercase Character'
        )
        .matches(
          /^(?=.*[a-z])/,
          'Must Contain Mininimum One Lowercase Character'
        )
        .matches(/^(?=.*[0-9])/, 'Must Contain Mininimum One Number')
        .matches(
          /^(?=.*[!@#$%^&*])/,
          'Must Contain Mininimum One Special Character'
        )
        .required('This field is required')
        .test(
          'username',
          'Password must not contain username',
          function (value) {
            return !value?.includes(this.parent.username)
          }
        ),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('This field is required'),
      phoneNumber: Yup.string()
        .matches(/^[0-9]+$/, 'Must be only digits')
        .matches(/^[8].*$/, 'Wrong phone number format')
        .min(10, 'Must be 10 characters or more')
        .required('This field is required'),
    }),
    onSubmit: (values) => {
      registrationFull.mutate({
        fullname: values.fullname,
        username: values.username,
        password: values.password,
        phoneNo: values.phoneNumber,
      })
    },
  })

  useEffect(() => {
    if (registration.isSuccess) {
      toast.success('Registration Success')

      modalOtp.info({
        title: 'Input OTP',
        content: (
          <FormOTP
            OTPType="registration"
            email={registrationForm.values.email}
            setState={setIsOtpValid}
          />
        ),
        closeButton: false,
      })
    }
  }, [registration.isSuccess])
  useEffect(() => {
    if (registration.isError) {
      const reason = registration.failureReason as AxiosError<APIResponse<null>>
      toast.error(
        reason.response ? reason.response.data.message : reason.message
      )

      if (
        (reason.response ? reason.response.data.message : reason.message) ===
        'User already registered.'
      ) {
        router.push('/login?email=' + email)
      }
    }
  }, [registration.isError])

  const registrationFull = useRegistrationFull()
  useEffect(() => {
    if (registrationFull.isSuccess) {
      toast.success('Registration Success')

      router.push(`/login`)
    }
  }, [registrationFull.isSuccess])
  useEffect(() => {
    if (registrationFull.isError) {
      const reason = registrationFull.failureReason as AxiosError<
        APIResponse<null>
      >
      toast.error(
        reason.response ? reason.response.data.message : reason.message
      )
    }
  }, [registrationFull.isError])

  return (
    <>
      <Head>
        <title>Register | Murakali</title>
      </Head>
      <div className="flex min-h-screen">
        <div className="sm:flex-0 z-10 w-screen flex-1 px-6 shadow-2xl sm:max-w-md">
          <div className="max-w-[8rem] py-6">
            <Link href={'/'}>
              <Icon color="primary" />
            </Link>
          </div>
          <H1 className="my-12">Register</H1>
          <div className="">
            <form
              className="mt-3 flex flex-col gap-4"
              onSubmit={
                !isOtpValid
                  ? registrationForm.handleSubmit
                  : registrationFullForm.handleSubmit
              }
            >
              {!isOtpValid ? (
                <div>
                  <TextInput
                    type="email"
                    name="email"
                    placeholder="name@gmail.com"
                    required
                    full
                    label="Email"
                    onChange={registrationForm.handleChange}
                    value={registrationForm.values.email}
                    errorMsg={
                      registrationForm.values.email !== '' &&
                      registrationForm.errors.email
                        ? registrationForm.errors.email
                        : ''
                    }
                  />
                </div>
              ) : (
                <div>
                  <TextInput
                    type="text"
                    name="username"
                    placeholder="johndoe"
                    required
                    full
                    label="Username"
                    onChange={registrationFullForm.handleChange}
                    value={registrationFullForm.values.username}
                    errorMsg={
                      registrationFullForm.values.username !== '' &&
                      registrationFullForm.errors.username
                        ? registrationFullForm.errors.username
                        : ''
                    }
                  />
                  <TextInput
                    type="text"
                    name="fullname"
                    placeholder="John Doe"
                    required
                    full
                    label="Full Name"
                    onChange={registrationFullForm.handleChange}
                    value={registrationFullForm.values.fullname}
                    errorMsg={
                      registrationFullForm.values.fullname !== '' &&
                      registrationFullForm.errors.fullname
                        ? registrationFullForm.errors.fullname
                        : ''
                    }
                  />
                  <TextInput
                    type="text"
                    name="phoneNumber"
                    leftIcon={
                      <span className="text-sm font-semibold">+62</span>
                    }
                    placeholder="81234567890"
                    required
                    full
                    label="Phone Number"
                    onChange={registrationFullForm.handleChange}
                    value={registrationFullForm.values.phoneNumber}
                    errorMsg={
                      registrationFullForm.values.phoneNumber !== '' &&
                      registrationFullForm.errors.phoneNumber
                        ? registrationFullForm.errors.phoneNumber
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
                    onChange={registrationFullForm.handleChange}
                    value={registrationFullForm.values.password}
                    errorMsg={
                      registrationFullForm.values.password !== '' &&
                      registrationFullForm.errors.password
                        ? registrationFullForm.errors.password
                        : ''
                    }
                  />

                  <TextInput
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    required
                    full
                    label="Confirm Password"
                    onChange={registrationFullForm.handleChange}
                    value={registrationFullForm.values.confirmPassword}
                    errorMsg={
                      registrationFullForm.values.confirmPassword !== '' &&
                      registrationFullForm.errors.confirmPassword
                        ? registrationFullForm.errors.confirmPassword
                        : ''
                    }
                  />
                </div>
              )}

              <div className="mt-8 flex flex-col gap-4">
                <Button
                  type="submit"
                  buttonType="primary"
                  isLoading={registration.isLoading}
                >
                  Next
                </Button>
                {!isOtpValid && (
                  <>
                    <Divider>OR</Divider>
                    <Button
                      type="button"
                      buttonType="ghost"
                      outlined
                      onClick={() => {
                        router.push(getGoogleUrl(router.pathname))
                      }}
                    >
                      <FaGoogle /> Register with Google
                    </Button>
                  </>
                )}
              </div>
              <div className="mt-8 text-center">
                Already Have Account?{' '}
                <Link href="/login" className="text-primary">
                  Login
                </Link>
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

export default RegistrationPage
