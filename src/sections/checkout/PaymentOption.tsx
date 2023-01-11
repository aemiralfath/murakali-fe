/* eslint-disable @next/next/no-img-element */
import { useCreateTransaction } from '@/api/user/transaction'
import { Button, H4, P } from '@/components'

import { closeModal } from '@/redux/reducer/modalReducer'
import type { PostCheckout } from '@/types/api/checkout'
import type { APIResponse } from '@/types/api/response'
import type { AxiosError } from 'axios'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import walletImage from '../../../public/asset/wallet.png'
import sealabsImage from '../../../public/asset/sealabs.png'
import type { WalletUser } from '@/types/api/wallet'
import type { SLPUser } from '@/types/api/slp'
import { validateUUID } from '@/helper/uuid'
import { ConvertShowMoney } from '@/helper/convertshowmoney'
import { useModal } from '@/hooks'
import FormPin from './FormPin'

interface CheckoutSummaryProps {
  postCheckout: PostCheckout
  userWallet: WalletUser
  userSLP: SLPUser[]
  totalOrder: number
}

const PaymentOption: React.FC<CheckoutSummaryProps> = ({
  postCheckout,
  userWallet,
  userSLP,
  totalOrder,
}) => {
  const [selected, setSelected] = useState('')
  const dispatch = useDispatch()
  const modalPIN = useModal()
  const router = useRouter()

  const paymentOption = []
  paymentOption.push({
    id: userWallet.id,
    name: 'Wallet',
    balance: userWallet.balance,
    image: walletImage.src,
  })

  userSLP.forEach((slp) => {
    paymentOption.push({
      id: slp.card_number,
      name: slp.name,
      image: sealabsImage.src,
    })
  })

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value
    setSelected(value)
  }

  const createTransaction = useCreateTransaction()

  function handleTransaction() {
    if (validateUUID(selected)) {
      postCheckout.card_number = ''
      postCheckout.wallet_id = selected
      modalPIN.info({
        title: 'Input PIN',
        content: <FormPin amount={totalOrder} postCheckout={postCheckout} />,
        closeButton: false,
      })
    } else {
      postCheckout.wallet_id = ''
      postCheckout.card_number = selected
      createTransaction.mutate(postCheckout)
    }
  }

  useEffect(() => {
    if (userWallet.balance - totalOrder >= 0) {
      setSelected(userWallet.id)
    }
  }, [totalOrder])

  useEffect(() => {
    if (createTransaction.isSuccess) {
      toast.success('Checkout Success')
      dispatch(closeModal())
      if (!validateUUID(selected)) {
        router.push({
          pathname: '/slp-payment',
          query: { id: createTransaction.data.data.transaction_id },
        })
      }
    }
  }, [createTransaction.isSuccess])

  useEffect(() => {
    if (createTransaction.isError) {
      const errMsg = createTransaction.error as AxiosError<APIResponse<null>>
      toast.error(
        errMsg.response ? errMsg.response.data.message : errMsg.message
      )
    }
  }, [createTransaction.isError])

  return (
    <div>
      <div>
        {paymentOption.length != 0 &&
          paymentOption.map((paymentOption, index) => (
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
                    alt={'payment option'}
                  />
                  <div className=" my-4 mx-2 grid grid-cols-1 gap-2 md:grid-cols-4">
                    <div className="col-span-3 flex flex-col gap-y-2 ">
                      <H4>{paymentOption.name}</H4>
                      {paymentOption.balance ? (
                        <P>Rp. {ConvertShowMoney(paymentOption.balance)}</P>
                      ) : (
                        <P>{paymentOption.id}</P>
                      )}
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
            Checkout
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PaymentOption
