/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { HiLockOpen, HiPlus } from 'react-icons/hi'
import { useDispatch } from 'react-redux'

import { useRouter } from 'next/router'

import { useChangeTransactionPaymentMethod } from '@/api/transaction'
import { useGetUserSLP } from '@/api/user/slp'
import { useCreateTransaction } from '@/api/user/transaction'
import { Button, P } from '@/components'
import { ConvertShowMoney } from '@/helper/convertshowmoney'
import cx from '@/helper/cx'
import { validateUUID } from '@/helper/uuid'
import { useModal } from '@/hooks'
import { closeModal } from '@/redux/reducer/modalReducer'
import type { PostCheckout } from '@/types/api/checkout'
import type { APIResponse } from '@/types/api/response'
import type { SLPUser } from '@/types/api/slp'
import type { Transaction } from '@/types/api/transaction'
import type { WalletUser } from '@/types/api/wallet'

import type { AxiosError } from 'axios'
import moment from 'moment'

import sealabsImage from '../../../../public/asset/sealabs.png'
import walletImage from '../../../../public/asset/wallet.png'
import FormPin from '../FormPin'
import FormRegisterSealabsPay from '../FormRegisterSealabsPay'

interface CheckoutSummaryProps {
  userSLP: SLPUser[]
  userWallet?: WalletUser
  postCheckout?: PostCheckout
  totalOrder?: number
  transaction?: Transaction
}

const PaymentOption: React.FC<CheckoutSummaryProps> = ({
  postCheckout,
  userWallet,
  userSLP,
  totalOrder = 0,
  transaction,
}) => {
  const modal = useModal()
  const getUserSLP = useGetUserSLP()
  const [userSLPs, seUserSLPs] = useState<SLPUser[]>([])

  const [selected, setSelected] = useState('')
  const dispatch = useDispatch()
  const modalPIN = useModal()
  const router = useRouter()

  const [second, setSecond] = useState(0)
  const [minute, setMinute] = useState(0)
  const [blocked, setBlocked] = useState(false)
  const [paymentOption, setPaymentOption] = useState<
    Array<{
      id: string
      name: string
      balance?: number
      image: string
      active: boolean
    }>
  >([])

  useEffect(() => {
    if (getUserSLP.data?.data) {
      seUserSLPs(getUserSLP.data.data)
    }
  }, [getUserSLP.isSuccess])

  useEffect(() => {
    if (userWallet?.unlocked_at.Valid) {
      const unlockTime = moment(userWallet.unlocked_at.Time)
      const unlockTimeSecond = Math.abs(moment().diff(unlockTime, 'seconds'))
      const unlockTimeMinute = Math.floor(unlockTimeSecond / 60)
      setMinute(unlockTimeMinute)
      setSecond(unlockTimeSecond - unlockTimeMinute * 60)
    }
  }, [userWallet?.unlocked_at.Valid])

  useEffect(() => {
    second > 0 && setTimeout(() => setSecond(second - 1), 1000)
    if (userWallet && second === 0) {
      if (minute <= 0) {
        setBlocked(false)
        setSelected(userWallet.id)
      } else {
        setMinute(minute - 1)
        setSecond(59)
      }
    }

    if (
      second > 0 &&
      minute > 0 &&
      moment().isBefore(moment(userWallet?.unlocked_at.Time))
    ) {
      setBlocked(true)
    }
  }, [second])

  useEffect(() => {
    setPaymentOption([])

    const tempPaymentOption = transaction
      ? []
      : userWallet
      ? [
          {
            id: userWallet.id,
            name: 'Wallet',
            balance: userWallet.balance,
            image: walletImage.src,
            active: true,
          },
        ]
      : [
          {
            id: 'inactive',
            name: 'Wallet',
            active: false,
            image: walletImage.src,
          },
        ]

    const slps = userSLPs.map((slp) => {
      return {
        id: slp.card_number,
        name: slp.name,
        image: sealabsImage.src,
        active: true,
      }
    })
    setPaymentOption([...tempPaymentOption, ...slps])
  }, [userSLPs])

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value
    if (userWallet && value !== userWallet.id) {
      setSelected(value)
    } else {
      if (Number(userWallet?.balance) - totalOrder >= 0 && !blocked) {
        setSelected(value)
      }
    }
  }

  const createTransaction = useCreateTransaction()
  const changeTransactionPaymentMethod = useChangeTransactionPaymentMethod()

  function handleTransaction() {
    if (postCheckout) {
      if (validateUUID(selected)) {
        modalPIN.info({
          title: 'Input PIN',
          content: (
            <FormPin
              amount={totalOrder}
              postCheckout={{
                ...postCheckout,
                card_number: '',
                wallet_id: selected,
              }}
            />
          ),
          closeButton: false,
        })
      } else {
        createTransaction.mutate({
          ...postCheckout,
          wallet_id: '',
          card_number: selected,
        })
      }
    } else if (transaction) {
      if (transaction.card_number === parseInt(selected)) {
        router.push({
          pathname: '/slp-payment',
          query: { id: transaction.id },
        })
      } else {
        changeTransactionPaymentMethod.mutate({
          transaction_id: transaction.id,
          card_number: selected,
        })
      }
    }
  }

  useEffect(() => {
    if (changeTransactionPaymentMethod.isSuccess) {
      router.push({
        pathname: '/slp-payment',
        query: { id: transaction?.id },
      })
      dispatch(closeModal())
    }
  }, [changeTransactionPaymentMethod.isSuccess])

  useEffect(() => {
    if (transaction) {
      setSelected(`${transaction.card_number}`)
    }
  }, [transaction])

  useEffect(() => {
    if (userWallet && userWallet.balance - totalOrder >= 0 && !blocked) {
      setSelected(userWallet.id)
    } else {
      setSelected('')
    }
  }, [totalOrder, blocked])

  useEffect(() => {
    if (createTransaction.isSuccess && createTransaction.data?.data) {
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
      if (
        (errMsg.response ? errMsg.response.data.message : errMsg.message) ===
        'Product quantity not available.'
      ) {
        router.push('/cart')
      }
      dispatch(closeModal())
    }
  }, [createTransaction.isError])

  return (
    <div className="grid grid-cols-1 gap-2">
      <div className="cursor-pointer">
        {paymentOption.map((paymentOption, index) => (
          <label key={index}>
            <div
              className={cx(
                'col-span-3 my-2 h-fit rounded-lg border p-4',
                selected === paymentOption.id
                  ? 'border-primary ring-1 ring-primary'
                  : ''
              )}
            >
              <div
                className={cx(
                  'flex-start flex items-center justify-between gap-2',
                  paymentOption.balance &&
                    (paymentOption.balance - totalOrder < 0 || blocked)
                    ? 'bg-slate-200'
                    : ''
                )}
              >
                <div className="flex aspect-[4/3] h-14 items-center justify-center rounded-lg bg-base-200">
                  <img
                    className="h-6 w-6 rounded-t-lg"
                    src={paymentOption.image}
                    alt={'payment option'}
                  />
                </div>

                <div className="flex-1 overflow-hidden">
                  <div className="col-span-3 flex flex-col ">
                    <P className="font-semibold">{paymentOption.name}</P>
                    {paymentOption.name === 'Wallet' ? (
                      <P className="text-sm">
                        {paymentOption.balance ? (
                          `Rp${ConvertShowMoney(paymentOption.balance)}`
                        ) : paymentOption.active ? (
                          'Rp0'
                        ) : (
                          <div>
                            <Button
                              size="xs"
                              buttonType="gray"
                              onClick={() => {
                                router.push('/wallet')
                                dispatch(closeModal())
                              }}
                            >
                              <HiLockOpen /> Activate Wallet
                            </Button>
                          </div>
                        )}
                      </P>
                    ) : (
                      <P className="text-sm">{paymentOption.id}</P>
                    )}
                  </div>
                </div>
                {blocked ? (
                  <div className="mt-2">
                    <span className="mx-2 mt-2">
                      {minute} : {second < 10 ? <>0</> : <></>}
                      {second}
                    </span>
                  </div>
                ) : (
                  ''
                )}
                {paymentOption.active && !blocked ? (
                  paymentOption.name === 'Wallet' &&
                  (paymentOption.balance ?? 0) - totalOrder < 0 ? (
                    <Button
                      size="xs"
                      buttonType="gray"
                      onClick={() => {
                        router.push('/wallet')
                        dispatch(closeModal())
                      }}
                    >
                      Top Up
                    </Button>
                  ) : (
                    <input
                      className="radio-primary radio mx-3 border-base-300"
                      type="radio"
                      name={'PaymentOption-' + String(paymentOption.id)}
                      readOnly
                      value={paymentOption.id}
                      checked={selected === paymentOption.id}
                      onChange={handleChange}
                    />
                  )
                ) : (
                  <></>
                )}
              </div>
            </div>
          </label>
        ))}

        <div className="mb-4 mt-4 flex justify-center">
          <Button
            type="button"
            buttonType="ghost"
            className="w-full"
            onClick={() => {
              modal.edit({
                title: 'Add Sealabs Pay Account',
                content: (
                  <>
                    <FormRegisterSealabsPay
                      postCheckout={postCheckout}
                      userWallet={userWallet}
                      userSLP={userSLP}
                      totalOrder={totalOrder}
                      isCheckout={true}
                      transaction={transaction}
                    />
                  </>
                ),
                closeButton: false,
              })
            }}
          >
            <HiPlus />
            Add Sealabs Pay Account
          </Button>
        </div>
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
            disabled={!selected}
            isLoading={changeTransactionPaymentMethod.isLoading}
          >
            Create Order
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PaymentOption
