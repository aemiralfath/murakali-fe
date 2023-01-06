import { createSlice } from '@reduxjs/toolkit'

export interface LoadingModalState {
  isLoadingOpen: boolean
}

const initialState: LoadingModalState = {
  isLoadingOpen: false,
}

export const loadingModalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openLoadingModal: (state) => {
      state.isLoadingOpen = true
    },
    closeLoadingModal: (state) => {
      state.isLoadingOpen = false
    },
  },
})

export const { openLoadingModal, closeLoadingModal } = loadingModalSlice.actions
export default loadingModalSlice.reducer
