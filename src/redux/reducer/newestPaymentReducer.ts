import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

export interface NewestPayment {
  card_number?: string
}

const initialState: NewestPayment = {
  card_number: undefined,
}

export const NewestPaymentSlice = createSlice({
  name: 'newestPayment',
  initialState,
  reducers: {
    addNewestPayment: (state, action: PayloadAction<string>) => {
      state.card_number = action.payload
    },
    clearNewestPayment: (state) => {
      state.card_number = undefined
    },
  },
})

export const { addNewestPayment, clearNewestPayment } =
  NewestPaymentSlice.actions
export default NewestPaymentSlice.reducer
