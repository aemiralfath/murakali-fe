import { useSLPPayment } from '@/api/user/transaction'
import { Navbar } from '@/layout/template'
import TitlePageExtend from '@/layout/template/navbar/TitlePageExtend'
import type { APIResponse } from '@/types/api/response'
import type { AxiosError } from 'axios'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

const SLPPayment = () => {
  const router = useRouter()
  const transactionID = router.query.id as string
  const paymentURL = useSLPPayment()
  const [paymentReason, setPaymentReason] = useState('')

  useEffect(() => {
    if (transactionID) {
      paymentURL.mutate(transactionID)
    }
  }, [transactionID])

  const [redirectCount, setRedirectCount] = useState(0)

  const onLoad = () => {
    setRedirectCount(redirectCount + 1)
  }

  useEffect(() => {
    if (redirectCount == 2) {
      router.push('/profile/transaction-history')
    }
  }, [redirectCount])

  useEffect(() => {
    if (paymentURL.isError) {
      const reason = paymentURL.failureReason as AxiosError<APIResponse<null>>
      setPaymentReason(
        reason.response ? reason.response.data.message : reason.message
      )
    }
  }, [paymentURL.isError])

  useEffect(() => {
    if (paymentReason === 'invalid input on card_number, ') {
      toast.error('Invalid SeaLabs Pay account, please change payment method!')
      router.push('/profile/transaction-history')
    }

    if (paymentReason === 'insufficient fund to create transaction') {
      toast.error('Insufficient balance, please top up first!')
      router.push('/profile/transaction-history')
    }
  }, [paymentReason])

  return (
    <>
      <Navbar />
      <TitlePageExtend title="Sea Labs Payment" />
      <div className="container my-8 mx-auto mb-10 w-full px-2">
        <div className="flex h-fit flex-wrap items-center justify-center">
          {paymentURL.isSuccess ? (
            <>
              <iframe
                className="min-h-screen w-full"
                src={paymentURL.data.data.redirect_url}
                title="payment"
                onLoad={onLoad}
              ></iframe>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  )
}

export default SLPPayment
