import { useSLPPayment } from '@/api/user/transaction'
import { Navbar } from '@/layout/template'
import TitlePageExtend from '@/layout/template/navbar/TitlePageExtend'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useEffect } from 'react'

const SLPPayment = () => {
  const router = useRouter()
  const transactionID = router.query.id as string
  const paymentURL = useSLPPayment()

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
