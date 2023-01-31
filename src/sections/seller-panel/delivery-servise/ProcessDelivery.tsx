import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'

import { useUpdateOrderStatus } from '@/api/seller/order'
import { Button, P } from '@/components'
import { closeModal } from '@/redux/reducer/modalReducer'
import type { APIResponse } from '@/types/api/response'
import type { SellerOrderStatus } from '@/types/api/seller'

import type { AxiosError } from 'axios'

interface ProcessDeliveryProps {
  orderID: string
  orderStatus: number
}

const ProcessDelivery: React.FC<ProcessDeliveryProps> = ({
  orderID,
  orderStatus,
}) => {
  const updateSellerOrderStatus = useUpdateOrderStatus()
  const dispatch = useDispatch()

  useEffect(() => {
    if (updateSellerOrderStatus.isSuccess) {
      toast.success('Change Status is Success')
      dispatch(closeModal())
    }
  }, [updateSellerOrderStatus.isSuccess])

  useEffect(() => {
    if (updateSellerOrderStatus.isError) {
      const errmsg = updateSellerOrderStatus.failureReason as AxiosError<
        APIResponse<null>
      >
      toast.error(errmsg.response?.data.message as string)
    }
  }, [updateSellerOrderStatus.isError])
  return (
    <div>
      <P className="mb-3"> Did you want to change delivery status?</P>
      <div className="flex justify-end gap-x-2">
        <Button
          outlined
          buttonType="primary"
          size="md"
          onClick={() => dispatch(closeModal())}
        >
          No
        </Button>
        <Button
          buttonType="primary"
          onClick={() => {
            const status: SellerOrderStatus = {
              order_id: orderID,
              order_status_id: orderStatus,
            }
            updateSellerOrderStatus.mutate(status)
          }}
        >
          Yes
        </Button>
      </div>
    </div>
  )
}

export default ProcessDelivery
