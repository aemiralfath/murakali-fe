import { useActivatePin } from '@/api/user/wallet'
import { Button } from '@/components'
import { closeModal } from '@/redux/reducer/modalReducer'
import type { APIResponse } from '@/types/api/response'
import type { AxiosError } from 'axios'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import PinInput from 'react-pin-input'
import { useDispatch } from 'react-redux'

const FormPINWallet: React.FC = () => {
  let pinInputRef: PinInput | null
  const dispatch = useDispatch()
  const [pin, setPin] = useState('')
  const activePin = useActivatePin()

  useEffect(() => {
    if (activePin.isSuccess) {
      setPin('')
      pinInputRef.clear()
      dispatch(closeModal())
    }
  }, [activePin.isSuccess])

  useEffect(() => {
    if (activePin.isError) {
      setPin('')
      pinInputRef.clear()
      const errMsg = activePin.failureReason as AxiosError<APIResponse<null>>
      toast.error(errMsg.response.data.message as string)

      if (
        errMsg.response.data.message ===
        'Wallet is temporarily blocked, please wait.'
      ) {
        dispatch(closeModal())
      }
    }
  }, [activePin.isError])

  const handlePIN = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    activePin.mutate(pin)
  }

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        void handlePIN(e)
        return false
      }}
    >
      <label>Please input your pin wallet</label>
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
        }}
        inputStyle={{ borderColor: 'grey' }}
        inputFocusStyle={{ borderColor: 'blue' }}
        autoSelect={true}
        ref={(n) => (pinInputRef = n)}
      />

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
