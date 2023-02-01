import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'

import { usePasswordConfirmToUpdateWallet } from '@/api/user/wallet'
import { Button, TextInput } from '@/components'
import { useModal } from '@/hooks'
import { closeModal } from '@/redux/reducer/modalReducer'
import type { APIResponse } from '@/types/api/response'

import type { AxiosError } from 'axios'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import YupPassword from 'yup-password'

import FormPINWallet from './FormPinWallet'

YupPassword(Yup)

function FormPasswordVerification() {
  const dispatch = useDispatch()
  const userPasswordVerification = usePasswordConfirmToUpdateWallet()
  const modal = useModal()
  useEffect(() => {
    if (userPasswordVerification.isSuccess) {
      toast.success('Password Verification Success')
      modal.edit({
        title: 'Update Wallet',
        content: <FormPINWallet createPin={false} />,
        closeButton: false,
      })
    }
  }, [userPasswordVerification.isSuccess])

  useEffect(() => {
    if (userPasswordVerification.isError) {
      const errmsg = userPasswordVerification.error as AxiosError<
        APIResponse<null>
      >
      toast.error(
        errmsg.response ? errmsg.response.data.message : errmsg.message
      )
    }
  }, [userPasswordVerification.isError])

  const formik = useFormik({
    initialValues: {
      password: '',
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(8, 'Must have minimum 8 characters')
        .minUppercase(1, 'Must have minimum 1 uppercase character')
        .minNumbers(1, 'Must have minimum 1 number')
        .minSymbols(1, 'Must have minimum 1 special character')
        .required('This field is required'),
    }),
    onSubmit: (values) => {
      userPasswordVerification.mutate(values.password)
    },
  })
  return (
    <div>
      <label>Please verify your password to change wallet pin</label>
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

        <div className="flex justify-end gap-2 py-3">
          <Button
            buttonType="gray"
            type="button"
            onClick={() => {
              dispatch(closeModal())
            }}
          >
            Cancel
          </Button>
          <Button buttonType="primary" type="submit">
            Submit
          </Button>
        </div>
      </form>
    </div>
  )
}

export default FormPasswordVerification
