import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'

import { useRouter } from 'next/router'

import { useGetUserSLP } from '@/api/user/slp'
import { useSLPPayment } from '@/api/user/transaction'
import { useTopUpWallet } from '@/api/user/wallet'
import { Button, H4, P, Spinner, TextInput } from '@/components'
import { closeModal } from '@/redux/reducer/modalReducer'
import type { APIResponse } from '@/types/api/response'
import type { TopUpWallet } from '@/types/api/wallet'

import type { AxiosError } from 'axios'

const FormTopUp: React.FC = () => {
  const useSlp = useGetUserSLP()
  const topUp = useTopUpWallet()
  const useSlpPayment = useSLPPayment()

  const router = useRouter()
  const dispatch = useDispatch()

  const [input, setInput] = useState({
    amount: 0,
  })

  const [selected, setSelected] = useState<string>('')

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    const inputName = event.currentTarget.name
    const value = event.currentTarget.value

    setInput((prev) => ({ ...prev, [inputName]: value }))
  }

  useEffect(() => {
    if (useSlpPayment.isSuccess) {
      toast.success('Please input OTP in Sea Labs Pay')
      dispatch(closeModal())
      router.push({
        pathname: '/slp-top-up',
        query: { id: useSlpPayment.data.data?.redirect_url },
      })
    }
  }, [useSlpPayment.isSuccess])

  useEffect(() => {
    if (useSlpPayment.isError) {
      const errmsg = useSlpPayment.error as AxiosError<APIResponse<null>>
      const paymentReason = errmsg.response
        ? errmsg.response.data.message
        : errmsg.message
      if (paymentReason === 'invalid input on card_number, ') {
        toast.error(
          'Invalid SeaLabs Pay account, please change payment method!'
        )
      }

      if (paymentReason === 'insufficient fund to create transaction') {
        toast.error('Insufficient balance, please top up first!')
      }
      if (paymentReason === 'user not found') {
        toast.error('User Not Found!')
      }
    }
  }, [useSlpPayment.isError])

  useEffect(() => {
    if (topUp.data?.data.data) {
      useSlpPayment.mutate(topUp.data.data.data.transaction_id)
    }
  }, [topUp.isSuccess])

  useEffect(() => {
    if (topUp.isError) {
      const errmsg = topUp.error as AxiosError<APIResponse<null>>
      toast.error(
        errmsg.response ? errmsg.response.data.message : errmsg.message
      )
    }
  }, [topUp.isError])

  const handleTopUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (selected === '') {
      toast.error('You must choose one Sea Labs Pay')
      return
    }
    if (input.amount < 10000) {
      toast.error('Minumum Top Up 10.000')
      return
    }

    const temp: TopUpWallet = {
      card_number: selected,
      amount: Number(input.amount),
    }

    topUp.mutate(temp)
  }

  return (
    <div>
      <div className="px-6  lg:px-8">
        <form
          className=" flex flex-col gap-y-3"
          onSubmit={(e) => {
            void handleTopUp(e)
            return false
          }}
        >
          <label className="label-text  block">
            Choose Sealabs Pay Account
          </label>
          <div className="mx-5 flex flex-col gap-2">
            {!useSlp.isLoading ? (
              useSlp.data?.data ? (
                useSlp.data.data.map((slpOption, index) => (
                  <label key={index}>
                    <div
                      className={
                        selected === slpOption.card_number
                          ? 'col-span-3   h-fit rounded-lg border-4 border-solid border-primary px-2 '
                          : 'col-span-3 h-fit rounded-lg border-2 border-solid border-slate-600 px-2 '
                      }
                    >
                      <div className={'flex-start flex items-center gap-2'}>
                        <input
                          className="mx-3"
                          type="radio"
                          name={'PaymentOption' + String(slpOption.card_number)}
                          value={slpOption.card_number}
                          checked={selected === slpOption.card_number}
                          onChange={() => {
                            setSelected(slpOption.card_number)
                          }}
                        />
                        <div className=" my-4 mx-2 grid grid-cols-1 gap-2 md:grid-cols-4">
                          <div className="col-span-3 flex flex-col gap-y-2 ">
                            <H4>{slpOption.name}</H4>
                            <P className="block truncate font-semibold">
                              {slpOption.card_number}
                            </P>
                          </div>
                        </div>
                      </div>
                    </div>
                  </label>
                ))
              ) : (
                <></>
              )
            ) : (
              <></>
            )}
            {useSlp.isLoading ? <Spinner /> : <></>}
            {(useSlp.data?.data?.length ?? 0) <= 0 && !useSlp.isLoading ? (
              <P className="text-center text-xs font-bold text-gray-500">
                You Dont Have Sealabs Pay
              </P>
            ) : (
              <></>
            )}
          </div>

          <div className="mt-2">
            <TextInput
              label="Amount"
              leftIcon={'Rp.'}
              type="number"
              name="amount"
              onChange={handleChange}
              placeholder="input amount"
              value={input.amount}
              full
              min={0}
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              outlined
              buttonType="primary"
              onClick={() => {
                dispatch(closeModal())
              }}
            >
              Cancel
            </Button>
            <Button type="submit" buttonType="primary">
              Top Up
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FormTopUp
