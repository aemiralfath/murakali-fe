import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'

import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/dist/query'

import loadingModalReducer from './reducer/loadingModalReducer'
import modalReducer from './reducer/modalReducer'
import searchKeywordReducer from './reducer/searchKeywordReducer'

export const store = configureStore({
  reducer: {
    modal: modalReducer,
    loadingModal: loadingModalReducer,
    searchKeyword: searchKeywordReducer,
  },
  middleware: (middleware) =>
    middleware({
      serializableCheck: false,
    }),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
