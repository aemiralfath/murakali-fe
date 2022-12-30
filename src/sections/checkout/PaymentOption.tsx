import { useCreateTransaction } from '@/api/user/transaction'
import { Button, H4, P } from '@/components'
import paymentOptionData from '@/dummy/paymentOptionData'

import { closeModal } from '@/redux/reducer/modalReducer'
import type { PostCheckout } from '@/types/api/checkout'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
interface CheckoutSummaryProps {
  postCheckout: PostCheckout
}

const PaymentOption: React.FC<CheckoutSummaryProps> = ({ postCheckout }) => {
  const [selected, setSelected] = useState<number>(0)
  const dispatch = useDispatch()

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value
    setSelected(Number(value))
  }

  const createTransaction = useCreateTransaction()

  function handleTransaction() {
    createTransaction.mutate(postCheckout)
  }
  return (
    <div>
      <div>
        {paymentOptionData.map((paymentOption, index) => (
          <label key={index}>
            <div
              className={
                selected === paymentOption.id
                  ? 'col-span-3  my-2 h-fit rounded-lg border-4 border-solid border-primary p-2 '
                  : 'col-span-3  my-2 h-fit rounded-lg border-2 border-solid border-slate-600 p-2 '
              }
            >
              <div
                className="flex-start flex items-center gap-2
                  "
              >
                <input
                  className="mx-3"
                  type="radio"
                  name={'PaymentOption' + String(paymentOption.id)}
                  value={paymentOption.id}
                  checked={selected === paymentOption.id}
                  onChange={handleChange}
                />
                <img
                  className="h-20 w-20 rounded-t-lg object-contain "
                  src={paymentOption.image}
                />
                <div className=" my-4 mx-2 grid grid-cols-1 gap-2 md:grid-cols-4">
                  <div className="col-span-3 flex flex-col gap-y-2 ">
                    <H4>{paymentOption.name}</H4>
                    <P></P>
                  </div>
                </div>
              </div>
            </div>
          </label>
        ))}

        <hr></hr>
        <div className="my-2 flex justify-end gap-2">
          <Button
            type="button"
            buttonType="gray"
            onClick={() => {
              dispatch(closeModal())
            }}
          >
            Cancel
          </Button>
          <Button
            type="button"
            buttonType="primary"
            onClick={handleTransaction}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PaymentOption
