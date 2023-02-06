import React, { useRef, useState } from 'react'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

import Head from 'next/head'
import { useRouter } from 'next/router'

import { useSLPPayment } from '@/api/user/transaction'
import { P } from '@/components'
import { useLoadingModal } from '@/hooks'
import { Navbar } from '@/layout/template'
import TitlePageExtend from '@/layout/template/navbar/TitlePageExtend'
import type { APIResponse } from '@/types/api/response'

import type { AxiosError } from 'axios'

const SLPPayment = () => {
  const router = useRouter()
  const setModalIsLoading = useLoadingModal()
  const transactionID = router.query.id as string
  const paymentURL = useSLPPayment()
  const [paymentReason, setPaymentReason] = useState('')
  const slpIframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (transactionID) {
      paymentURL.mutate(transactionID)
    }
  }, [transactionID])

  const [redirectCount, setRedirectCount] = useState(0)

  const onLoad: React.ReactEventHandler<HTMLIFrameElement> = () => {
    setRedirectCount(redirectCount + 1)
  }

  const handleError = () => {
    toast.error('SeaLabs Pay Service is unavailable.')
    router.push(
      '/profile/transaction-history?status=1#transaction-' + transactionID ?? ''
    )
  }

  useEffect(() => {
    setModalIsLoading(redirectCount < 1)

    if (redirectCount == 2) {
      router.push('/profile/transaction-history?status=2')
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
    if (
      paymentReason === 'invalid input on card_number, ' ||
      paymentReason === 'user not found'
    ) {
      toast.error('Invalid SeaLabs Pay account, please change payment method!')
      router.push(
        '/profile/transaction-history?status=1#transaction-' + transactionID ??
          ''
      )
    }

    if (paymentReason === 'insufficient fund to create transaction') {
      toast.error('Insufficient balance, please top up first!')
      router.push(
        '/profile/transaction-history?status=1#transaction-' + transactionID ??
          ''
      )
    }
  }, [paymentReason])

  return (
    <>
      <Head>
        <title>SeaLabs Pay Payment</title>
      </Head>
      <Navbar />
      <TitlePageExtend title="SeaLabs Pay - Payment" />
      <div className="container my-8 mx-auto mb-10 w-full px-2">
        <div className="flex h-fit flex-wrap items-center justify-center">
          {paymentURL.data?.data ? (
            <>
              <div className="mb-2 flex w-full flex-wrap items-baseline gap-2">
                <P className="">Please insert your SeaLabs Pay OTP</P>
                <P className=" text-xs italic opacity-70">
                  Make sure your VPN is active
                </P>
              </div>
              <iframe
                ref={slpIframeRef}
                className="min-h-screen w-full"
                src={paymentURL.data.data.redirect_url}
                title="payment"
                onLoad={onLoad}
                onError={handleError}
              />
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
