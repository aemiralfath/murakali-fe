import NextNProgress from 'nextjs-progressbar'
import { CustomToaster } from '@/components'
import Modal from '@/components/modal'
import { store } from '@/redux/store'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type AppType } from 'next/dist/shared/lib/utils'
import React from 'react'
import { Provider } from 'react-redux'

import '../styles/globals.css'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient()

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <NextNProgress color="#2545CA" />
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <Provider store={store}>
          <Modal />
          <CustomToaster />
          <Component {...pageProps} />
        </Provider>
      </QueryClientProvider>
    </>
  )
}

export default MyApp
