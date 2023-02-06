import React, { useEffect, useState } from 'react'

import Head from 'next/head'
import { useRouter } from 'next/router'

import { useRefreshToken } from '@/api/auth/refreshtoken'
import { P, Spinner } from '@/components'

const Redirect = () => {
  const refreshToken = useRefreshToken()

  const router = useRouter()
  const { from } = router.query

  const [showRefresh, setShowRefresh] = useState(false)

  useEffect(() => {
    refreshToken.mutate()
    const timer = setTimeout(() => {
      setShowRefresh(true)
    }, 3000)
    return () => {
      clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    if (refreshToken.isError) {
      router.push('/login')
    }

    if (refreshToken.isSuccess) {
      if (typeof from === 'string') {
        const timer = setTimeout(() => {
          router.push(from)
        }, 300)
        return () => {
          clearTimeout(timer)
        }
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
        {showRefresh ? (
          <div className="mt-2">
            <p className="opacity-70 text-sm">
              If nothing happens,{' '}
              <a
                className="font-semibold underline hover:text-primary cursor-pointer"
                href={'#'}
                onClick={() => {
                  if (typeof window !== undefined) {
                    window.location.reload()
                  }
                }}
              >
                click here to refresh
              </a>
            </p>
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  )
}

export default Redirect
