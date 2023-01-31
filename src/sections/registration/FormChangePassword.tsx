import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'

import { useRouter } from 'next/router'

import { useUpdatePasswordAfterLogin } from '@/api/auth/changepassword'
import { useLogout } from '@/api/auth/logout'
import { Button, TextInput } from '@/components'
import { closeModal } from '@/redux/reducer/modalReducer'
import type { APIResponse } from '@/types/api/response'

import type { AxiosError } from 'axios'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import YupPassword from 'yup-password'

YupPassword(Yup)

function FormChangePassword() {
  const dispatch = useDispatch()
  const userUpdatePasswordAfterLogin = useUpdatePasswordAfterLogin()
  const userLogout = useLogout()
  const router = useRouter()
  useEffect(() => {
    if (userUpdatePasswordAfterLogin.isSuccess) {
      toast.success('Update Password Success')
      dispatch(closeModal())
      userLogout.mutate()

      router.push('/login')
    }
  }, [userUpdatePasswordAfterLogin.isSuccess])

  useEffect(() => {
    if (userUpdatePasswordAfterLogin.isError) {
      const errmsg = userUpdatePasswordAfterLogin.error as AxiosError<
        APIResponse<null>
      >
      toast.error(
        errmsg.response ? errmsg.response.data.message : errmsg.message
      )
    }
  }, [userUpdatePasswordAfterLogin.isError])

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
      userUpdatePasswordAfterLogin.mutate(values.password)
    },
  })
  return (
    <div>
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

        <div className="flex justify-center gap-2 py-3">
          <Button
            buttonType="accent"
            type="button"
            onClick={() => {
              dispatch(closeModal())
            }}
          >
            Cancel
          </Button>
          <Button buttonType="primary" type="submit">
            Change Password
          </Button>
        </div>
      </form>
    </div>
  )
}

export default FormChangePassword
