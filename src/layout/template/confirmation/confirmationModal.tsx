import React from 'react'

import { P, Button } from '@/components'
import { useDispatch } from '@/hooks'
import { closeModal } from '@/redux/reducer/modalReducer'

const ConfirmationModal: React.FC<{ msg: string; onConfirm: () => void }> = ({
  msg,
  onConfirm,
}) => {
  const dispatch = useDispatch()

  return (
    <div className="flex flex-col gap-4 text-center">
      <P className="text-lg">{msg}</P>
      <div className="mt-8 flex justify-center gap-2">
        <Button
          buttonType="primary"
          outlined
          onClick={() => {
            dispatch(closeModal())
          }}
        >
          Cancel
        </Button>
        <Button
          buttonType="primary"
          onClick={() => {
            onConfirm()
            dispatch(closeModal())
          }}
        >
          Confirm
        </Button>
      </div>
    </div>
  )
}

export default ConfirmationModal
