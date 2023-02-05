/* eslint-disable no-console */

/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PropsWithChildren } from 'react'
import React from 'react'
import { Provider } from 'react-redux'

import loadingModalReducer from '@/redux/reducer/loadingModalReducer'
import modalReducer from '@/redux/reducer/modalReducer'
import newestPaymentReducer from '@/redux/reducer/newestPaymentReducer'
import searchKeywordReducer from '@/redux/reducer/searchKeywordReducer'
import type { RootState, store } from '@/redux/store'

import { configureStore } from '@reduxjs/toolkit'
import type { PreloadedState } from '@reduxjs/toolkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import type { RenderOptions } from '@testing-library/react'

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: PreloadedState<RootState>
  store?: typeof store
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {
      modal: {
        title: '',
        status: 'success',
        isOpen: false,
        content: '',
        closeButton: false,
      },
      loadingModal: {
        isLoadingOpen: false,
      },
      newestPayment: {
        card_number: undefined,
      },
      searchKeyword: {
        keyword: '',
      },
    },
    store = configureStore({
      reducer: {
        modal: modalReducer,
        loadingModal: loadingModalReducer,
        searchKeyword: searchKeywordReducer,
        newestPayment: newestPaymentReducer,
      },
      preloadedState,
    }),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren): JSX.Element {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          retry: 1,
        },
      },
      logger: {
        log: console.log,
        warn: console.warn,
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        error: () => {},
      },
    })

    return (
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>{children}</Provider>
      </QueryClientProvider>
    )
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}

export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'
