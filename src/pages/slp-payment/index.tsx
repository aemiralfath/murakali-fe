import { useSLPPayment } from '@/api/user/transaction'
import { Navbar } from '@/layout/template'
import TitlePageExtend from '@/layout/template/navbar/TitlePageExtend'
import type { APIResponse } from '@/types/api/response'
import type { AxiosError } from 'axios'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useEffect } from 'react'

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
          ) : paymentURL.isError ? (
            paymentReason === 'insufficient fund to create transaction' ? (
              <>
                <div className="flex flex-col items-center justify-center bg-warning">
                  <h1>Insufficient balance</h1>
                  <p>please top up first, and refresh this page!</p>
                </div>
              </>
            ) : paymentReason === 'invalid input on card_number, ' ? (
              <>
                <div className="flex flex-col items-center justify-center bg-warning">
                  <h1>Invalid SeaLabs Pay account</h1>
                  <p>make sure your card number is correct!</p>
                </div>
              </>
            ) : (
              <></>
            )
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  )
}

export default SLPPayment
