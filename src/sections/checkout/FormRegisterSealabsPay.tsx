import { useRegisterSealabsPay } from '@/api/user/slp'
import { Button, TextInput } from '@/components'
import { useModal } from '@/hooks'
import { closeModal } from '@/redux/reducer/modalReducer'
import type { PostCheckout } from '@/types/api/checkout'
import type { APIResponse } from '@/types/api/response'
import type { SLPUser } from '@/types/api/slp'
import type { Transaction } from '@/types/api/transaction'
import type { WalletUser } from '@/types/api/wallet'
import type { AxiosError } from 'axios'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import PaymentOption from './PaymentOption'

interface FormRegisterSealabsPayProps {
  postCheckout?: PostCheckout
  userWallet?: WalletUser
  userSLP?: SLPUser[]
  totalOrder?: number
  isCheckout: boolean
  transaction?: Transaction
}

const FormRegisterSealabsPay: React.FC<FormRegisterSealabsPayProps> = ({
  postCheckout = undefined,
  userWallet = undefined,
  userSLP = undefined,
  totalOrder = undefined,
  isCheckout,
  transaction,
}) => {
  const modal = useModal()
  const dispatch = useDispatch()

  const registerSealabsPay = useRegisterSealabsPay()
  const [input, setInput] = useState<SLPUser>({
    card_number: '',
    name: '',
    is_default: true,
    active_date: '',
  })

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    const inputName = event.currentTarget.name
    const value = event.currentTarget.value

    setInput((prev) => ({ ...prev, [inputName]: value }))
  }

  useEffect(() => {
    if (registerSealabsPay.isError) {
      const errMsg = registerSealabsPay.failureReason as AxiosError<
        APIResponse<null>
      >
      toast.error(errMsg.response.data.message as string)
    }
  }, [registerSealabsPay.isError])

  useEffect(() => {
    if (registerSealabsPay.isSuccess) {
      toast.success('Add sealabs pay card success.')
      dispatch(closeModal())
    }
  }, [registerSealabsPay.isSuccess])

  const handleRegisterSealabsPay = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()
    registerSealabsPay.mutate(input)

    setInput({
      card_number: '',
      name: '',
      is_default: true,
      active_date: '',
    })
  }
  return (
    <div className="px-6 py-6 lg:px-8">
      <form
        className="mt-1 flex flex-col gap-y-3"
        onSubmit={(e) => {
          void handleRegisterSealabsPay(e)
          return false
        }}
      >
        <div>
          <TextInput
            label={'Name'}
            inputSize="md"
            type="text"
            name="name"
            placeholder="name"
            onChange={handleChange}
            value={input.name}
            full
            required
          />
        </div>

        <div>
          <TextInput
            label="Card Number"
            type="text"
            name="card_number"
            placeholder="card number"
            minLength={16}
            maxLength={16}
            onChange={handleChange}
            value={input.card_number}
            full
            required
          />
        </div>

        <div>
          <TextInput
            label="Active Date"
            type="date"
            name="active_date"
            onChange={handleChange}
            min={moment(Date.now()).format('YYYY-MM-DD')}
            placeholder={String(Date.now())}
            value={moment(input.active_date).format('YYYY-MM-DD')}
            full
            required
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            buttonType="gray"
            onClick={() => {
              if (!isCheckout) {
                dispatch(closeModal())
              } else {
                modal.edit({
                  title: 'Choose Payment Option',
                  content: (
                    <PaymentOption
                      transaction={transaction}
                      postCheckout={postCheckout}
                      userWallet={userWallet}
                      userSLP={userSLP}
                      totalOrder={totalOrder}
                    />
                  ),
                  closeButton: false,
                })
              }
            }}
          >
            cancel
          </Button>
          <Button
            type="submit"
            buttonType="primary"
            isLoading={registerSealabsPay.isLoading}
          >
            Save
          </Button>
        </div>
      </form>
    </div>
  )
}

export default FormRegisterSealabsPay
