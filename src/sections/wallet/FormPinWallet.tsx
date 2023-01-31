import { useActivatePin, useUpdatePinWallet } from '@/api/user/wallet'
import { Button } from '@/components'
import { closeModal } from '@/redux/reducer/modalReducer'
import type { APIResponse } from '@/types/api/response'
import type { AxiosError } from 'axios'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import PinInput from 'react-pin-input'
import { useDispatch } from 'react-redux'

interface FormPINWalletProps {
  createPin: boolean
}

const FormPINWallet: React.FC<FormPINWalletProps> = ({ createPin }) => {
  let pinInputRef: PinInput | null
  const dispatch = useDispatch()
  const [pin, setPin] = useState('')
  const activePin = useActivatePin()
  const updatePin = useUpdatePinWallet()

  const [confirmation, setConfirmation] = useState(false)
  const [tempPin, setTempPin] = useState('')

  useEffect(() => {
    if (updatePin.isSuccess) {
      setPin('')
      if (pinInputRef !== null) {
        pinInputRef.clear()
      }
      dispatch(closeModal())
      toast.success('Success Change Pin')
    }
  }, [updatePin.isSuccess])

  useEffect(() => {
    if (updatePin.isError) {
      setPin('')
      if (pinInputRef !== null) {
        pinInputRef.clear()
      }
      const errMsg = updatePin.failureReason as AxiosError<APIResponse<null>>
      toast.error(errMsg.response?.data.message as string)

      if (
        errMsg.response?.data.message ===
        'Wallet is temporarily blocked, please wait.'
      ) {
        dispatch(closeModal())
      }
    }
  }, [updatePin.isError])

  useEffect(() => {
    if (activePin.isSuccess) {
      setPin('')
      if (pinInputRef !== null) {
        pinInputRef.clear()
      }
      dispatch(closeModal())
    }
  }, [activePin.isSuccess])

  useEffect(() => {
    if (activePin.isError) {
      setPin('')
      if (pinInputRef !== null) {
        pinInputRef.clear()
      }
      const errMsg = activePin.failureReason as AxiosError<APIResponse<null>>
      toast.error(errMsg.response?.data.message as string)

      if (
        errMsg.response?.data.message ===
        'Wallet is temporarily blocked, please wait.'
      ) {
        dispatch(closeModal())
      }
    }
  }, [activePin.isError])

  const handlePIN = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!confirmation && tempPin === '') {
      setConfirmation(true)
      setTempPin(pin)
      setPin('')
      return
    }

    if (tempPin !== pin) {
      toast.error('Confirmation Pin is Not Same')
      return
    }

    if (createPin) {
      activePin.mutate(tempPin)
    } else {
      updatePin.mutate(tempPin)
    }
  }

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        void handlePIN(e)
        return false
      }}
    >
      {!confirmation ? (
        <>
          <label>Input New Pin</label>
          <PinInput
            length={6}
            secret
            onChange={() => {
              setPin('')
            }}
            onComplete={(value) => {
              if (value.length === 6) {
                setPin(value)
              }
            }}
            type="numeric"
            inputMode="number"
            style={{
              padding: '5px',
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
        </>
      ) : (
        <></>
      )}

      {confirmation ? (
        <>
          {' '}
          <label>Input Confirmation Pin</label>
          <PinInput
            length={6}
            secret
            onChange={() => {
              setPin('')
            }}
            onComplete={(value) => {
              if (value.length === 6) {
                setPin(value)
              }
            }}
            type="numeric"
            inputMode="number"
            style={{
              padding: '5px',
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
        </>
      ) : (
        <></>
      )}

      <Button
        buttonType="primary"
        type="submit"
        className="w-full"
        disabled={pin.length !== 6}
      >
        Confirm
      </Button>
    </form>
  )
}

export default FormPINWallet
