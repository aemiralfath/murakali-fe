import {
  useSendEmailChangePassword,
  useVerifyOTPChangePassword,
} from '@/api/auth/changepassword'
import { useModal } from '@/hooks'
import type { APIResponse } from '@/types/api/response'
import FormChangePassword from '@/layout/template/profile/FormChangePassword'
import type { AxiosError } from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Button from '../button'
import TextInput from '../textinput'
import PinInput from 'react-pin-input'

interface FormOTPProps extends React.InputHTMLAttributes<HTMLSelectElement> {
  OTPType: string
}

const FormOTP: React.FC<FormOTPProps> = ({ OTPType }) => {
  const modal = useModal()
  let pinInputRef: PinInput | null
  const userVerivyOTPChangePassword = useVerifyOTPChangePassword()
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
    if (userVerivyOTPChangePassword.isSuccess) {
      toast.success('Verify OTP Success')
      modal.edit({
        title: 'Change Password',
        content: <FormChangePassword />,
        closeButton: false,
      })
    }
  }, [userVerivyOTPChangePassword.isSuccess])

  useEffect(() => {
    if (userSendEmailChangePassword.isSuccess) {
      toast.success('OTP has been sended to your email')
      setMinute(2)
      setSecond(59)
    }
  }, [userSendEmailChangePassword.isSuccess])

  useEffect(() => {
    if (userVerivyOTPChangePassword.isError) {
      pinInputRef.clear()
      const errmsg = userVerivyOTPChangePassword.failureReason as AxiosError<
        APIResponse<null>
      >
      toast.error(errmsg.response?.data.message as string)
    }
  }, [userVerivyOTPChangePassword.isError])

  useEffect(() => {
    if (userSendEmailChangePassword.isError) {
      const errmsg = userSendEmailChangePassword.failureReason as AxiosError<
        APIResponse<null>
      >
      toast.error(errmsg.response?.data.message as string)
    }
  }, [userSendEmailChangePassword.isError])

  const handleOTP = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (OTPType === 'change-password') {
      userVerivyOTPChangePassword.mutate(input.otp)
    }
  }

  return (
    <div>
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
          inputMode=""
          onComplete={(value) => {
            if (value.length === 6) {
              setInput({
                otp: value,
              })
            }
          }}
          type="custom"
          style={{
            padding: '10px',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
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

        <Button buttonType="primary" type="submit" className="w-full">
          Confirm
        </Button>
      </form>
    </div>
  )
}

export default FormOTP
