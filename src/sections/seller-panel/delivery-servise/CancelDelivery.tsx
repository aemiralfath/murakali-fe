import { useUpdateOrderStatus } from '@/api/seller/order'
import { Button, P } from '@/components'
import { closeModal } from '@/redux/reducer/modalReducer'
import type { APIResponse } from '@/types/api/response'
import type { SellerOrderStatus } from '@/types/api/seller'
import type { AxiosError } from 'axios'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'

interface CancleDeliveryProps {
  orderID: string
}

const CancelDelivery: React.FC<CancleDeliveryProps> = ({ orderID }) => {
  const updateSellerOrderStatus = useUpdateOrderStatus()
  const dispatch = useDispatch()

  useEffect(() => {
    if (updateSellerOrderStatus.isSuccess) {
      toast.success('Cancel Order Success')
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
      <P className="mb-3"> Did you want to Cancel this order?</P>
      <div className="flex justify-end gap-x-2">
        <Button
          buttonType="primary"
          outlined
          onClick={() => {
            const status: SellerOrderStatus = {
              order_id: orderID,
              order_status_id: 7,
            }
            updateSellerOrderStatus.mutate(status)
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
