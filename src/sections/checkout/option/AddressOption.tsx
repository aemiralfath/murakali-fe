import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'

import { useEditAddress, useGetAllAddress } from '@/api/user/address'
import { Button, Chip, H4, P } from '@/components'
import { closeModal } from '@/redux/reducer/modalReducer'
import type { AddressDetail } from '@/types/api/address'
import type { APIResponse } from '@/types/api/response'

import type { AxiosError } from 'axios'

interface AddressOptionProps {
  is_shop_address: boolean
}

const AddressOption: React.FC<AddressOptionProps> = ({ is_shop_address }) => {
  const [selected, setSelected] = useState<string>('')
  const [page, setPage] = useState<number>(1)
  const userAllAddress = useGetAllAddress(page)
  const dispatch = useDispatch()

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value
    setSelected(String(value))
  }
  const editAddress = useEditAddress(selected)

  useEffect(() => {
    if (editAddress.isSuccess) {
      toast.success('Successfully Change Default Shipping Address')
      dispatch(closeModal())
    }
  }, [editAddress.isSuccess])
  useEffect(() => {
    if (editAddress.isError) {
      const errmsg = editAddress.failureReason as AxiosError<APIResponse<null>>
      toast.error(errmsg.response?.data.message as string)
    }
  }, [editAddress.isError])

  function handleChangeAddressDefault() {
    let index = 0
    if (userAllAddress.data?.data?.rows.length) {
      for (let i = 0; i < userAllAddress.data?.data?.rows.length; i++) {
        if (userAllAddress.data?.data?.rows[i]?.id === selected) {
          index = i
        }
      }

      let isDefault = Boolean(
        userAllAddress.data?.data?.rows[index]?.is_default
      )
      let isShopDefault = Boolean(
        userAllAddress.data?.data?.rows[index]?.is_shop_default
      )

      is_shop_address ? (isShopDefault = true) : (isDefault = true)

      const tempAddress = userAllAddress.data?.data?.rows[index]
      if (tempAddress !== undefined) {
        const temp: AddressDetail = {
          id: selected,
          user_id: '',
          name: tempAddress.name,
          province_id: tempAddress.province_id,
          city_id: tempAddress.city_id,
          province: tempAddress.province,
          city: tempAddress.city,
          district: tempAddress.district,
          sub_district: tempAddress.sub_district,
          zip_code: tempAddress.zip_code,
          address_detail: tempAddress.address_detail,
          is_default: isDefault,
          is_shop_default: isShopDefault,
        }

        editAddress.mutate(temp)
      }
    }
  }

  return (
    <div>
      {!userAllAddress.isLoading ? (
        userAllAddress.data?.data?.total_rows !== 0 ? (
          <>
            {userAllAddress.data?.data?.rows.map((address, index) => (
              <label key={index}>
                <div
                  className={
                    selected === address.id
                      ? 'col-span-3  my-2 h-fit rounded-lg border-4 border-solid border-primary p-2 '
                      : 'col-span-3  my-2 h-fit rounded-lg border-2 border-solid border-slate-600 p-2 '
                  }
                >
                  <div
                    className="flex-start flex
                  "
                  >
                    <input
                      className="mx-3"
                      type="radio"
                      name={'Address' + String(address.id)}
                      value={address.id}
                      checked={selected === address.id}
                      onChange={handleChange}
                    />
                    <div className=" my-4 mx-2 grid grid-cols-1 gap-2 md:grid-cols-4">
                      <div className="col-span-3 flex flex-col gap-y-2 ">
                        <H4>{address.name}</H4>
                        <P>
                          {address.address_detail}, {address.sub_district},{' '}
                          {address.district}, {address.city}, {address.province}
                          , Indonesia ({address.zip_code})
                        </P>
                        <div className="flex flex-wrap gap-2">
                          {address.is_shop_default ? (
                            <>
                              <Chip>Shop Shipping Address</Chip>
                            </>
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </label>
            ))}
          </>
        ) : (
          <P className="italic text-gray-400">
            You dont have any address, please go to profile page and make
            shipping address
          </P>
        )
      ) : (
        <P>Loading</P>
      )}
      <div className="my-2 flex justify-end">
        <div className="btn-group">
          {userAllAddress.data?.data &&
          userAllAddress.data?.data?.total_rows > 2 ? (
            Array.from(Array(userAllAddress.data?.data?.total_pages)).map(
              (_, index) => {
                return (
                  <button
                    key={index}
                    defaultValue={1}
                    value={index + 1}
                    onClick={() => {
                      setPage(index + 1)
                    }}
                    className={
                      index + 1 === page
                        ? 'btn btn-active'
                        : 'btn-outline btn btn-primary'
                    }
                  >
                    {index + 1}
                  </button>
                )
              }
            )
          ) : (
            <></>
          )}
        </div>
      </div>
      <hr></hr>
      <div className="my-2 flex justify-end gap-2">
        <Button
          type="button"
          buttonType="primary"
          outlined
          onClick={() => {
            dispatch(closeModal())
          }}
        >
          Cancel
        </Button>
        <Button
          type="button"
          buttonType="primary"
          onClick={handleChangeAddressDefault}
        >
          Save
        </Button>
      </div>
    </div>
  )
}

export default AddressOption
