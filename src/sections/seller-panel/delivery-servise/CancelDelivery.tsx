import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'

import { useCancelOrderStatus } from '@/api/seller/order'
import { Button, TextInput } from '@/components'
import { closeModal } from '@/redux/reducer/modalReducer'
import type { APIResponse } from '@/types/api/response'
import type { CancelOrderStatus } from '@/types/api/seller'

import type { AxiosError } from 'axios'

interface CancleDeliveryProps {
  orderID: string
}

const CancelDelivery: React.FC<CancleDeliveryProps> = ({ orderID }) => {
  const cancelSellerOrderStatus = useCancelOrderStatus()
  const dispatch = useDispatch()

  const [note, setNote] = useState('')

  useEffect(() => {
    if (cancelSellerOrderStatus.isSuccess) {
      toast.success('Cancel Order Success')
      dispatch(closeModal())
    }
  }, [cancelSellerOrderStatus.isSuccess])

  useEffect(() => {
    if (cancelSellerOrderStatus.isError) {
      const errmsg = cancelSellerOrderStatus.failureReason as AxiosError<
        APIResponse<null>
      >
      toast.error(errmsg.response?.data.message as string)
    }
  }, [cancelSellerOrderStatus.isError])
  return (
    <div>
      <TextInput
        type="text"
        name="note"
        onChange={(event) => {
          setNote(event.target.value)
        }}
        placeholder="cancel notes"
        full
        required
      />
      <div className="m-3 flex justify-end gap-x-2">
        <Button
          buttonType="primary"
          outlined
          onClick={() => {
            const status: CancelOrderStatus = {
              order_id: orderID,
              cancel_notes: note,
            }
            cancelSellerOrderStatus.mutate(status)
          }}
        >
          Yes
        </Button>
        <Button
          buttonType="primary"
          size="md"
          onClick={() => dispatch(closeModal())}
        >
          No
        </Button>
      </div>
    </div>
  )
}

export default CancelDelivery
