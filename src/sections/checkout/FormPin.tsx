import { useCreateTransaction, useWalletPayment } from '@/api/user/transaction'
import { useVerifyPIN } from '@/api/user/wallet'
import { Button } from '@/components'
import { closeModal } from '@/redux/reducer/modalReducer'
import type { PostCheckout } from '@/types/api/checkout'
import type { APIResponse } from '@/types/api/response'
import type { AxiosError } from 'axios'
import router from 'next/router'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import PinInput from 'react-pin-input'
import { useDispatch } from 'react-redux'

interface FormPINProps extends React.InputHTMLAttributes<HTMLSelectElement> {
  postCheckout: PostCheckout
  amount: number
}

const FormPIN: React.FC<FormPINProps> = ({ postCheckout, amount }) => {
  let pinInputRef: PinInput | null
  const dispatch = useDispatch()
  const verifyPIN = useVerifyPIN()
  const [pin, setPin] = useState('')
  const walletPayment = useWalletPayment()
  const createTransaction = useCreateTransaction()

  useEffect(() => {
    if (verifyPIN.isSuccess) {
      setPin('')
      pinInputRef.clear()
      createTransaction.mutate(postCheckout)
    }
  }, [verifyPIN.isSuccess])

  useEffect(() => {
    if (createTransaction.isSuccess) {
      toast.success('Checkout Success')
      walletPayment.mutate(createTransaction.data.data.transaction_id)
    }
  }, [createTransaction.isSuccess])

  useEffect(() => {
    if (walletPayment.isSuccess) {
      dispatch(closeModal())
      toast.success('Wallet payment success!')
      router.push('/profile/transaction-history')
    }
  }, [walletPayment.isSuccess])

  useEffect(() => {
    if (verifyPIN.isError) {
      setPin('')
      pinInputRef.clear()
      const errMsg = verifyPIN.failureReason as AxiosError<APIResponse<null>>
      toast.error(errMsg.response.data.message as string)
    }
  }, [verifyPIN.isError])

  useEffect(() => {
    if (createTransaction.isError) {
      dispatch(closeModal())
      const errMsg = createTransaction.error as AxiosError<APIResponse<null>>
      toast.error(
        errMsg.response ? errMsg.response.data.message : errMsg.message
      )
    }
  }, [createTransaction.isError])

  useEffect(() => {
    if (walletPayment.isError) {
      dispatch(closeModal())
      const errMsg = walletPayment.error as AxiosError<APIResponse<null>>
      toast.error(
        errMsg.response ? errMsg.response.data.message : errMsg.message
      )
    }
  }, [walletPayment.isError])

  const handlePIN = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    verifyPIN.mutate({ pin, amount })
  }

  return (
    <form
      className="mt-3 space-y-6"
      onSubmit={(e) => {
        void handlePIN(e)
        return false
      }}
    >
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

export default FormPIN
