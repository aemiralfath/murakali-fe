import React, { useEffect } from 'react'

import Head from 'next/head'
import { useRouter } from 'next/router'

import { useRefreshToken } from '@/api/auth/refreshtoken'
import { P, Spinner } from '@/components'

const Redirect = () => {
  const refreshToken = useRefreshToken()

  const router = useRouter()
  const { from } = router.query

  useEffect(() => {
    refreshToken.mutate()
  }, [])

  useEffect(() => {
    if (refreshToken.isError) {
      router.push('/login')
    }

    if (refreshToken.isSuccess) {
      if (typeof from === 'string') {
        router.push(from)
      }
    }
  }, [refreshToken.isSuccess, refreshToken.isError, from])

  return (
    <>
      <Head>
        <title>Murakali</title>
        <meta name="description" content="Murakali E-Commerce Application" />
      </Head>
      <div className="flex min-h-screen w-full flex-col items-center justify-center">
        <Spinner color="gray" />
        <P className="opacity-70 mt-2">Redirecting ...</P>
      </div>
    </>
  )
}

export default Redirect
