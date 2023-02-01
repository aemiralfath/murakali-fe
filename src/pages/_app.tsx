import React from 'react'
import { Provider } from 'react-redux'

import { type AppType } from 'next/dist/shared/lib/utils'

import { CustomToaster, LoadingModal } from '@/components'
import Modal from '@/components/modal'
import { store } from '@/redux/store'

import type { DehydratedState } from '@tanstack/react-query'
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import NextNProgress from 'nextjs-progressbar'

import '../styles/globals.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

const MyApp: AppType<{ dehydratedState: DehydratedState }> = ({
  Component,
  pageProps,
}) => {
  return (
    <>
      <NextNProgress color="#2545CA" />
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <ReactQueryDevtools initialIsOpen={false} />
          <Provider store={store}>
            <LoadingModal />
            <Modal />
            <CustomToaster />
            <Component {...pageProps} />
          </Provider>
        </Hydrate>
      </QueryClientProvider>
    </>
  )
}

export default MyApp
