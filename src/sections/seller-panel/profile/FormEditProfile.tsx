import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'

import {
  useEditSellerDetailInformation,
  useGetSellerDetailInformation,
} from '@/api/seller'
import { Button, TextInput } from '@/components'
import { closeModal } from '@/redux/reducer/modalReducer'
import type { APIResponse } from '@/types/api/response'

import type { AxiosError } from 'axios'

const FormEditSellerInformation: React.FC = () => {
  const useSellerDetailInformation = useGetSellerDetailInformation()

  const editSellerDetailInformation = useEditSellerDetailInformation()
  useEffect(() => {
    if (editSellerDetailInformation.isSuccess) {
      toast.success('Successfully edit')

      void dispatch(closeModal())
      setInput('')
    }
  }, [editSellerDetailInformation.isSuccess])

  useEffect(() => {
    if (editSellerDetailInformation.isError) {
      const errmsg = editSellerDetailInformation.failureReason as AxiosError<
        APIResponse<null>
      >
      toast.error(errmsg.response?.data.message as string)
    }
  }, [editSellerDetailInformation.isError])

  const dispatch = useDispatch()

  const [input, setInput] = useState('')

  useEffect(() => {
    if (useSellerDetailInformation.data?.data) {
      setInput(useSellerDetailInformation.data.data.name)
    }
  }, [useSellerDetailInformation.isLoading])

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value

    setInput(value)
  }
  const handleEditSellerDetailInformation = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()
    editSellerDetailInformation.mutate(input)

    void dispatch(closeModal())
    setInput('')
  }

  //TODO: Still buggy, fix later
  return (
    <>
      <div className="px-6 pb-6 lg:px-8">
        <form
          className="flex flex-col gap-y-3"
          onSubmit={(e) => {
            void handleEditSellerDetailInformation(e)
            return false
          }}
        >
          <div>
            <TextInput
              label={'Shop Name'}
              inputSize="md"
              type="text"
              name="shop_name"
              placeholder="Shop Name"
              onChange={handleChange}
              value={input}
              full
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              outlined
              buttonType="primary"
              onClick={() => {
                setInput('')
                dispatch(closeModal())
              }}
            >
              Cancel
            </Button>
            <Button type="submit" buttonType="primary">
              Save
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}

export default FormEditSellerInformation
