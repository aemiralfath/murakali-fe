import { Button } from '@/components'
import {
  useSendEmailChangePassword,
  useVerifyOTPChangePassword,
} from '@/api/auth/changepassword'
import { useRegistrationVerifOtp } from '@/api/auth/registration'
import { useDispatch, useModal } from '@/hooks'
import FormChangePassword from './FormChangePassword'
import { closeModal } from '@/redux/reducer/modalReducer'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import type { APIResponse } from '@/types/api/response'
import type { AxiosError } from 'axios'
import PinInput from 'react-pin-input'

interface FormOTPProps extends React.InputHTMLAttributes<HTMLSelectElement> {
  OTPType: string
  email?: string
  setState?: React.Dispatch<React.SetStateAction<boolean>>
}

const FormOTP: React.FC<FormOTPProps> = ({ OTPType, email, setState }) => {
  const modal = useModal()
  let pinInputRef: PinInput | null
  const userVerifyOTPChangePassword = useVerifyOTPChangePassword()
  const userSendEmailChangePassword = useSendEmailChangePassword()

  const [second, setSecond] = React.useState(59)
  const [minute, setMinute] = React.useState(2)

  React.useEffect(() => {
    second > 0 && setTimeout(() => setSecond(second - 1), 1000)
    if (second === 0) {
      minute > 0 && setMinute(minute - 1)
      minute > 0 && setSecond(59)
    }
  }, [second])

  const [input, setInput] = useState({
    otp: '',
  })

  useEffect(() => {
    if (userVerifyOTPChangePassword.isSuccess) {
      toast.success('Verify OTP Success')
      modal.edit({
        title: 'Change Password',
        content: <FormChangePassword />,
        closeButton: false,
      })
    }
  }, [userVerifyOTPChangePassword.isSuccess])

  useEffect(() => {
    if (userSendEmailChangePassword.isSuccess) {
      toast.success('OTP has been sended to your email')
    }
  }, [userSendEmailChangePassword.isSuccess])

  useEffect(() => {
    if (userVerifyOTPChangePassword.isError) {
      const errmsg = userVerifyOTPChangePassword.failureReason as AxiosError<
        APIResponse<null>
      >
      toast.error(errmsg.response?.data.message as string)
    }
  }, [userVerifyOTPChangePassword.isError])

  useEffect(() => {
    if (userSendEmailChangePassword.isError) {
      const errmsg = userSendEmailChangePassword.failureReason as AxiosError<
        APIResponse<null>
      >
      toast.error(errmsg.response?.data.message as string)
    }
  }, [userSendEmailChangePassword.isError])

  const registrationOtp = useRegistrationVerifOtp()
  useEffect(() => {
    if (registrationOtp.isSuccess) {
      toast.success('OTP is valid')
      pinInputRef.clear()
      setState?.(true)
      handleClose()
    }
  }, [registrationOtp.isSuccess])
  useEffect(() => {
    if (registrationOtp.isError) {
      pinInputRef.clear()
      const reason = registrationOtp.failureReason as AxiosError<
        APIResponse<null>
      >
      toast.error(
        reason.response ? reason.response.data.message : reason.message
      )
    }
  }, [registrationOtp.isError])

  const handleOTP = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (OTPType === 'change-password') {
      userVerifyOTPChangePassword.mutate(input.otp)
    } else if (OTPType === 'registration') {
      registrationOtp.mutate({
        otp: input.otp,
        email: email as string,
      })
    }
  }

  const dispatch = useDispatch()

  function handleClose() {
    dispatch(closeModal())
  }

  return (
    <form
      className="mt-3 space-y-6 "
      onSubmit={(e) => {
        void handleOTP(e)
        return false
      }}
    >
      <PinInput
        length={6}
        onChange={() => {
          setInput({
            otp: '',
          })
        }}
        onComplete={(value) => {
          if (value.length === 6) {
            setInput({
              otp: value,
            })
          }
        }}
        type="numeric"
        inputMode="number"
        style={{
          padding: '10px',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
        inputStyle={{ borderColor: 'grey' }}
        inputFocusStyle={{ borderColor: 'blue' }}
        autoSelect={true}
        ref={(n) => (pinInputRef = n)}
      />

      <div className="mt-2">
        <span className="mx-2 mt-2">
          if you havent got OTP code ( 0{minute} :{' '}
          {second < 10 ? <>0</> : <></>}
          {second} )
          {minute === 0 && second === 0 ? (
            <a
              onClick={() => {
                if (OTPType === 'change-password') {
                  userSendEmailChangePassword.mutate()
                }
              }}
              className="text-blue-700"
            >
              {' '}
              Click Here
            </a>
          ) : (
            <a className="text-gray-400"> Click Here</a>
          )}
        </span>
      </div>

      <Button
        buttonType="primary"
        type="submit"
        className="w-full"
        disabled={input.otp.length !== 6}
      >
        Confirm
      </Button>
    </form>
  )
}

export default FormOTP
