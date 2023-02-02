import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useDispatch } from 'react-redux'

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
import { useFormik } from 'formik'
import moment from 'moment'
import * as Yup from 'yup'

import PaymentOption from './option/PaymentOption'

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

  const handleRegisterSealabsPay = async (input: SLPUser) => {
    registerSealabsPay.mutate(input)

    setInput({
      card_number: '',
      name: '',
      is_default: true,
      active_date: '',
    })
  }

  const slpForm = useFormik({
    initialValues: input,
    enableReinitialize: true,
    validationSchema: Yup.object({
      card_number: Yup.string()
        .matches(/^[0-9]+$/, 'Invalid account number')
        .min(16, 'Invalid account number')
        .max(16, 'Invalid account number')
        .required('This field is required'),
      name: Yup.string()
        .min(2, 'Must have minimum 2 characters')
        .required('This field is required'),
      active_date: Yup.string().required('This field is required'),
    }),
    onSubmit: (input) => {
      handleRegisterSealabsPay(input)
    },
  })

  useEffect(() => {
    if (registerSealabsPay.isError) {
      const errMsg = registerSealabsPay.failureReason as AxiosError<
        APIResponse<null>
      >
      toast.error(errMsg.response?.data.message as string)
    }
  }, [registerSealabsPay.isError])

  useEffect(() => {
    if (registerSealabsPay.isSuccess) {
      toast.success('Add sealabs pay card success.')
      dispatch(closeModal())
    }
  }, [registerSealabsPay.isSuccess])

  return (
    <div className="px-6 lg:px-8">
      <form className="flex flex-col gap-y-3" onSubmit={slpForm.handleSubmit}>
        <div>
          <TextInput
            label={'Name'}
            inputSize="md"
            type="text"
            name="name"
            placeholder="name"
            onChange={slpForm.handleChange}
            value={slpForm.values.name}
            full
            required
            errorMsg={
              slpForm.values.name !== '' && slpForm.errors.name
                ? slpForm.errors.name
                : ''
            }
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
            onChange={slpForm.handleChange}
            value={slpForm.values.card_number}
            full
            required
            errorMsg={
              slpForm.values.card_number !== '' && slpForm.errors.card_number
                ? slpForm.errors.card_number
                : ''
            }
          />
        </div>

        <div>
          <TextInput
            label="Active Date"
            type="date"
            name="active_date"
            onChange={slpForm.handleChange}
            min={moment(Date.now()).format('YYYY-MM-DD')}
            placeholder={String(Date.now())}
            value={moment(slpForm.values.active_date).format('YYYY-MM-DD')}
            full
            required
            errorMsg={
              slpForm.values.active_date !== '' && slpForm.errors.active_date
                ? slpForm.errors.active_date
                : ''
            }
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            buttonType="gray"
            onClick={() => {
              if (!isCheckout) {
                dispatch(closeModal())
              } else if (userWallet && userSLP) {
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
