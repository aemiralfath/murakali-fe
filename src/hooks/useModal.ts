import type React from 'react'

import {
  openModal,
  setContent,
  setModalStatus,
  setTitle,
  setCloseButton,
} from '@/redux/reducer/modalReducer'

import { useDispatch } from '.'

function useModal() {
  const dispatch = useDispatch()

  const handleOpen = (
    title: string,
    content: React.ReactNode,
    closeButton?: boolean
  ) => {
    dispatch(setTitle(title))
    dispatch(setContent(content))
    dispatch(setCloseButton(Boolean(closeButton)))
    dispatch(openModal())
  }

  const success = ({
    title,
    content,
    closeButton = true,
  }: {
    title: string
    content: React.ReactNode
    closeButton?: boolean
  }) => {
    dispatch(setModalStatus('success'))
    handleOpen(title, content, closeButton)
  }

  const error = ({
    title,
    content,
    closeButton = true,
  }: {
    title: string
    content: React.ReactNode
    closeButton?: boolean
  }) => {
    dispatch(setModalStatus('error'))
    handleOpen(title, content, closeButton)
  }

  const edit = ({
    title,
    content,
    closeButton = true,
  }: {
    title: string
    content: React.ReactNode
    closeButton?: boolean
  }) => {
    dispatch(setModalStatus('edit'))
    handleOpen(title, content, closeButton)
  }

  const info = ({
    title,
    content,
    closeButton = true,
  }: {
    title: string
    content: React.ReactNode
    closeButton?: boolean
  }) => {
    dispatch(setModalStatus('info'))
    handleOpen(title, content, closeButton)
  }

  return { success, error, edit, info }
}

export default useModal
