import { useEditAddress, useGetAllAddress } from '@/api/user/address'
import { Button, Chip, H4, P } from '@/components'

import { closeModal } from '@/redux/reducer/modalReducer'
import type { AddressDetail } from '@/types/api/address'
import type { APIResponse } from '@/types/api/response'
import type { AxiosError } from 'axios'

import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'

function AddressOption() {
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
        if (userAllAddress.data?.data?.rows[i].id === selected) {
          index = i
        }
      }

      const temp: AddressDetail = {
        id: selected,
        user_id: '',
        name: userAllAddress.data?.data?.rows[index].name,
        province_id: userAllAddress.data?.data?.rows[index].province_id,
        city_id: userAllAddress.data?.data?.rows[index].city_id,
        province: userAllAddress.data?.data?.rows[index].province,
        city: userAllAddress.data?.data?.rows[index].city,
        district: userAllAddress.data?.data?.rows[index].district,
        sub_district: userAllAddress.data?.data?.rows[index].sub_district,
        zip_code: userAllAddress.data?.data?.rows[index].zip_code,
        address_detail: userAllAddress.data?.data?.rows[index].address_detail,
        is_default: true,
        is_shop_default: userAllAddress.data?.data?.rows[index].is_shop_default,
      }

      editAddress.mutate(temp)
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
                          {address.is_default ? (
                            <>
                              <Chip>Shipping Address</Chip>
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
          <P></P>
        )
      ) : (
        <P>Loading</P>
      )}
      <div className="my-2 flex justify-end">
        <div className="btn-group">
          {Array.from(Array(userAllAddress.data?.data?.total_pages)).map(
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
                      : 'btn btn-outline btn-primary'
                  }
                >
                  {index + 1}
                </button>
              )
            }
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
