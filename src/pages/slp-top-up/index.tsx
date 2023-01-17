import { Navbar } from '@/layout/template'
import TitlePageExtend from '@/layout/template/navbar/TitlePageExtend'

import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

function SLPTopUp() {
  const router = useRouter()
  const topUpUrl = router.query.id as string

  const [redirectCount, setRedirectCount] = useState(0)

  const onLoad = () => {
    setRedirectCount(redirectCount + 1)
  }

  useEffect(() => {
    if (redirectCount == 2) {
      router.push('/wallet')
    }
  }, [redirectCount])

  return (
    <>
      <Navbar />
      <TitlePageExtend title="Top Up Wallet" />
      <div className="container my-8 mx-auto mb-10 w-full px-2">
        <div className="flex h-fit flex-wrap items-center justify-center">
          <iframe
            className="min-h-screen w-full"
            src={topUpUrl}
            title="payment"
            onLoad={onLoad}
          ></iframe>
        </div>
      </div>
    </>
  )
}

export default SLPTopUp
