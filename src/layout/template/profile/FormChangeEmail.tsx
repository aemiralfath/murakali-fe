import { Button, P, TextInput } from '@/components'
import type { APIResponse } from '@/types/api/response'
import type { AxiosError } from 'axios'
import { useFormik } from 'formik'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'

import * as Yup from 'yup'
import { useDispatch } from 'react-redux'
import { closeModal } from '@/redux/reducer/modalReducer'

import { useSendVerrificationEmail } from '@/api/auth/changeemail'
import { useModal } from '@/hooks'

function FormChangeEmail() {
  const dispatch = useDispatch()
  const modal = useModal()
  const userSendVerificationEmail = useSendVerrificationEmail()
  useEffect(() => {
    if (userSendVerificationEmail.isSuccess) {
      toast.success('Verification Email has been send to your Email')
      modal.info({
        title: 'Info',
        content: (
          <P>
            Please check your email for a change email link. If you don&apos;t
            see the email in your inbox, be sure to check your spam or junk
            folder.
          </P>
        ),
        closeButton: true,
      })
      // dispatch(closeModal())
    }
  }, [userSendVerificationEmail.isSuccess])

  useEffect(() => {
    if (userSendVerificationEmail.isError) {
      const errmsg = userSendVerificationEmail.error as AxiosError<
        APIResponse<null>
      >
      toast.error(
        errmsg.response ? errmsg.response.data.message : errmsg.message
      )
    }
  }, [userSendVerificationEmail.isError])

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().required('This field is required'),
    }),
    onSubmit: (values) => {
      userSendVerificationEmail.mutate(values.email)
    },
  })
  return (
    <div>
      <form className=" space-y-6" onSubmit={formik.handleSubmit}>
        <TextInput
          label="New Email"
          type="email"
          name="email"
          placeholder="murakali@gmail.com"
          onChange={formik.handleChange}
          value={formik.values.email}
          required
          full
          errorMsg={
            formik.values.email !== '' && formik.errors.email
              ? formik.errors.email
              : ''
          }
        />
        <P className="text-center text-sm">
          Please make sure that you have entered a valid email.
        </P>
        <div className="flex justify-center gap-2 py-3">
          <Button
            buttonType="primary"
            outlined
            type="button"
            onClick={() => {
              dispatch(closeModal())
            }}
          >
            Cancel
          </Button>
          <Button buttonType="primary" type="submit">
            Send OTP
          </Button>
        </div>
      </form>
    </div>
  )
}

export default FormChangeEmail
