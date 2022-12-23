import { CustomToaster } from '@/components'
import Modal from '@/components/modal'
import { store } from '@/redux/store'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type AppType } from 'next/dist/shared/lib/utils'
import { Provider } from 'react-redux'

import '../styles/globals.css'

const queryClient = new QueryClient()

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
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
