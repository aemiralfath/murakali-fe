import { useUpdateResiSellerOrder } from '@/api/seller/order'
import { Button, P, TextInput } from '@/components'
import { closeModal } from '@/redux/reducer/modalReducer'
import type { APIResponse } from '@/types/api/response'
import type { AxiosError } from 'axios'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
interface InputResiProps {
  orderID: string
  courierETD: string
}

const InputResi: React.FC<InputResiProps> = ({ orderID, courierETD }) => {
  const updateResiNumber = useUpdateResiSellerOrder()

  const dispatch = useDispatch()

  const [input, setInput] = useState({
    resi_no: '',
    courier_etd: '',
  })

  const handleUpdateResiNumber = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()
    updateResiNumber.mutate({
      order_id: orderID,
      resi_no: input.resi_no,
      courier_etd: input.courier_etd,
    })
  }
  useEffect(() => {
    if (updateResiNumber.isSuccess) {
      toast.success('Input Resi Number is Success')
      dispatch(closeModal())
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
          label="Resi Number"
          type="number"
          name="resi_no"
          min={0}
          placeholder="Resi Number"
          onChange={handleChange}
          value={input.resi_no}
          required
          full
        />

        <TextInput
          label="Estimated Arrival Date"
          type="date"
          name="courier_etd"
          onChange={handleChange}
          min={moment(Date.now()).format('YYYY-MM-DD')}
          placeholder={String(Date.now())}
          value={moment(input.courier_etd).format('YYYY-MM-DD')}
          full
          required
        />

        <P className="text-xs text-gray-600">
          Estimate Delivery Time : {courierETD} Days
        </P>

        <div className="flex justify-end gap-x-2">
          <Button
            outlined
            buttonType="primary"
            size="md"
            type="button"
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
