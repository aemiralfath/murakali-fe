import { createSlice } from '@reduxjs/toolkit'

export interface LoadingModalState {
  isOpen: boolean
}

const initialState: LoadingModalState = {
  isOpen: false,
}

export const loadingModalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state) => {
      state.isOpen = true
    },
    closeModal: (state) => {
      state.isOpen = false
    },
  },
})

export const { openModal, closeModal } = loadingModalSlice.actions
export default loadingModalSlice.reducer
