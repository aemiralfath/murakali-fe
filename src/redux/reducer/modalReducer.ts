import type React from 'react'

import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface ModalState {
  isOpen: boolean
  status: 'success' | 'error' | 'info' | 'edit'
  title: string
  content: React.ReactNode
  closeButton: boolean
}

const initialState: ModalState = {
  isOpen: false,
  status: 'info',
  title: '',
  content: '',
  closeButton: true,
}

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state) => {
      state.isOpen = true
    },
    closeModal: (state) => {
      state.isOpen = false
    },
    setModalStatus: (
      state,
      action: PayloadAction<'success' | 'error' | 'info' | 'edit'>
    ) => {
      state.status = action.payload
    },
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload
    },
    setContent: (state, action: PayloadAction<React.ReactNode>) => {
      state.content = action.payload
    },
    setCloseButton: (state, action: PayloadAction<boolean>) => {
      state.closeButton = action.payload
    },
  },
})

export const {
  openModal,
  closeModal,
  setModalStatus,
  setTitle,
  setContent,
  setCloseButton,
} = modalSlice.actions

export default modalSlice.reducer
