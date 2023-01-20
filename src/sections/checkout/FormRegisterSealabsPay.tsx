import { useRegisterSealabsPay } from '@/api/user/slp'
import { Button, TextInput } from '@/components'
import { useModal } from '@/hooks'
import { closeModal } from '@/redux/reducer/modalReducer'
import type { PostCheckout } from '@/types/api/checkout'
import type { SLPUser } from '@/types/api/slp'
import type { WalletUser } from '@/types/api/wallet'
import moment from 'moment'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import PaymentOption from './PaymentOption'

interface FormRegisterSealabsPayProps {
  postCheckout: PostCheckout | undefined
  userWallet: WalletUser | undefined
  userSLP: SLPUser[] | undefined
  totalOrder: number | undefined
  isCheckout: boolean
}

const FormRegisterSealabsPay: React.FC<FormRegisterSealabsPayProps> = ({
  postCheckout = undefined,
  userWallet = undefined,
  userSLP = undefined,
  totalOrder = undefined,
  isCheckout,
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

  const handleRegisterSealabsPay = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()
    registerSealabsPay.mutate(input)

    setInput({
      card_number: '',
      name: '',
      is_default: false,
      active_date: '',
    })
  }
  return (
    <div className="px-6 py-6 lg:px-8">
      <form
        className="mt-1 flex flex-col gap-y-3"
        onSubmit={(e) => {
          void handleRegisterSealabsPay(e)
          dispatch(closeModal())
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
          <Button type="submit" buttonType="primary">
            Save
          </Button>
        </div>
      </form>
    </div>
  )
}

export default FormRegisterSealabsPay
