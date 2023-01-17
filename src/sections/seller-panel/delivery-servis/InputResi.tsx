import {
  useUpdateOrderStatus,
  useUpdateResiSellerOrder,
} from '@/api/seller/order'
import { Button, TextInput } from '@/components'
import { closeModal } from '@/redux/reducer/modalReducer'
import type { APIResponse } from '@/types/api/response'
import type { AxiosError } from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
interface InputResiProps {
  orderID: string
  orderStatus: number
}

const InputResi: React.FC<InputResiProps> = ({ orderID, orderStatus }) => {
  const updateResiNumber = useUpdateResiSellerOrder()
  const updateOrderStatus = useUpdateOrderStatus()
  const dispatch = useDispatch()

  const [input, setInput] = useState({
    resi_no: '',
  })

  const handleUpdateResiNumber = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()
    updateResiNumber.mutate({ order_id: orderID, resi_no: input.resi_no })
  }
  useEffect(() => {
    if (updateResiNumber.isSuccess) {
      updateOrderStatus.mutate({
        order_id: orderID,
        order_status_id: orderStatus,
      })
    }
  }, [updateResiNumber.isSuccess])
  useEffect(() => {
    if (updateResiNumber.isError) {
      const errmsg = updateResiNumber.failureReason as AxiosError<
        APIResponse<null>
      >
      toast.error(errmsg.response?.data.message as string)
    }
  }, [updateResiNumber.isError])

  useEffect(() => {
    if (updateOrderStatus.isSuccess) {
      toast.success('Input Resi Number and Change Status is Success')
      dispatch(closeModal())
    }
  }, [updateOrderStatus.isSuccess])

  useEffect(() => {
    if (updateOrderStatus.isError) {
      const errmsg = updateOrderStatus.failureReason as AxiosError<
        APIResponse<null>
      >
      toast.error(errmsg.response?.data.message as string)
    }
  }, [updateOrderStatus.isError])

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    const inputName = event.currentTarget.name
    const value = event.currentTarget.value

    setInput((prev) => ({ ...prev, [inputName]: value }))
  }

  return (
    <div>
      <form
        className="space-y-6 "
        onSubmit={(e) => {
          void handleUpdateResiNumber(e)
          return false
        }}
      >
        <TextInput
          className="input-bordered input w-full border-white bg-transparent text-center text-black "
          type="number"
          name="resi_no"
          min={0}
          placeholder="Resi Number"
          onChange={handleChange}
          value={input.resi_no}
          required
          full
        />
        <div className="flex justify-end gap-x-2">
          <Button
            outlined
            buttonType="primary"
            size="md"
            onClick={() => dispatch(closeModal())}
          >
            Cancel
          </Button>
          <Button buttonType="primary" type="submit">
            Save
          </Button>
        </div>
      </form>
    </div>
  )
}

export default InputResi
