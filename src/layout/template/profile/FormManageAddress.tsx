import { useCreateAddress, useEditAddress } from '@/api/user/address'
import {
  useGetAllCity,
  useGetAllProvince,
  useGetAllSubDistrict,
  useGetAllUrban,
} from '@/api/user/address/extra'
import { Button, TextArea, TextInput } from '@/components'
import SelectComboBox from '@/components/selectinput/SelectCombobox'
import { useDispatch } from '@/hooks'
import type { AddressDetail, FetchParamInfo } from '@/types/api/address'
import type { APIResponse } from '@/types/api/response'
import { closeModal } from '@/redux/reducer/modalReducer'
import type { AxiosError } from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { getCookie } from 'cookies-next'
import jwt_decode from 'jwt-decode'

interface FormManageAddressProps {
  isEdit: boolean
  editData?: AddressDetail
}

const FormManageAddress: React.FC<FormManageAddressProps> = ({
  isEdit,
  editData,
}) => {
  const token = getCookie('access_token')

  const decoded = jwt_decode(String(token))

  console.log(decoded)
  const addressInit: AddressDetail = {
    id: '',
    user_id: '',
    name: '',
    province_id: 0,
    city_id: 0,
    province: '',
    city: '',
    district: '',
    sub_district: '',
    zip_code: '',
    address_detail: '',
    is_default: false,
    is_shop_default: false,
  }
  const [input, setInput] = useState<AddressDetail>(addressInit)
  const [selected, setSelected] = useState([false, false])

  useEffect(() => {
    if (editData && isEdit) {
      setInput({
        id: editData.id,
        user_id: editData.user_id,
        name: editData.name,
        province_id: editData.province_id,
        city_id: editData.city_id,
        province: editData.province,
        city: editData.city,
        district: editData.district,
        sub_district: editData.sub_district,
        zip_code: editData.zip_code,
        address_detail: editData.address_detail,
        is_default: editData.is_default,
        is_shop_default: editData.is_shop_default,
      })
      setSelected([editData.is_default, editData.is_shop_default])
      allCity.mutate(String(editData.province_id))

      const temp: FetchParamInfo = {
        province: editData.province,
        city: editData.city,
        sub_district: '',
        urban: '',
      }
      allSubDistrict.mutate(temp)

      const temp2: FetchParamInfo = {
        province: editData.province,
        city: editData.city,
        sub_district: editData.district,
        urban: '',
      }
      allUrban.mutate(temp2)
    }
  }, [])

  const createAddress = useCreateAddress()
  const editAddress = useEditAddress(editData?.id || '')
  const allProvince = useGetAllProvince()
  const allCity = useGetAllCity()
  const allSubDistrict = useGetAllSubDistrict()
  const allUrban = useGetAllUrban()

  const handleChangeCheckbox = (event: React.FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value
    const updatedCheckedState = selected.map((item, index) =>
      index === Number(value) ? !item : item
    )
    setSelected(updatedCheckedState)
  }

  useEffect(() => {
    if (createAddress.isSuccess) {
      toast.success('Successfully Add Address')

      void dispatch(closeModal())
      setInput(addressInit)
    }
    if (editAddress.isSuccess) {
      toast.success('Successfully Edit Address')

      void dispatch(closeModal())
      setInput(addressInit)
    }
  }, [createAddress.isSuccess, editAddress.isSuccess])
  useEffect(() => {
    if (createAddress.isError) {
      const errmsg = createAddress.failureReason as AxiosError<
        APIResponse<null>
      >
      toast.error(errmsg.response?.data.message as string)
    }
    if (editAddress.isError) {
      const errmsg = editAddress.failureReason as AxiosError<APIResponse<null>>
      toast.error(errmsg.response?.data.message as string)
    }
  }, [createAddress.isError, editAddress.isError])

  const dispatch = useDispatch()

  function getAllCity(province: string) {
    let id = ''
    if (allProvince.data?.data?.rows) {
      for (let i = 0; i < allProvince.data?.data?.rows.length; i++) {
        if (allProvince.data.data.rows[i].province === province) {
          id = allProvince.data.data.rows[i].province_id
        }
      }
    }
    allCity.mutate(id)
  }

  function getAllSubDistrict(data: string) {
    const temp: FetchParamInfo = {
      province: input.province,
      city: data,
      sub_district: '',
      urban: '',
    }
    allSubDistrict.mutate(temp)
  }

  function getAllUrban(data: string) {
    const temp: FetchParamInfo = {
      province: input.province,
      city: input.city,
      sub_district: data,
      urban: '',
    }
    allUrban.mutate(temp)
  }

  const handleChange = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const inputName = event.currentTarget.name
    const value = event.currentTarget.value

    setInput((prev) => ({ ...prev, [inputName]: value }))
  }

  const handleCreateAddress = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    let provinceId = 0
    if (allProvince.data?.data?.rows) {
      for (let i = 0; i < allProvince.data?.data?.rows.length; i++) {
        if (allProvince.data.data.rows[i].province === input.province) {
          provinceId = Number(allProvince.data.data.rows[i].province_id)
        }
      }
    }

    let cityId = 0
    allCity.mutate(provinceId.toString())
    if (allCity.data?.data?.data?.rows) {
      for (let i = 0; i < allCity.data.data.data.rows.length; i++) {
        if (
          removeFirstWord(allCity.data.data.data.rows[i].city) === input.city
        ) {
          cityId = Number(allCity.data.data.data.rows[i].city_id)
        }
      }
    }

    const temp: AddressDetail = {
      id: '',
      user_id: '',
      name: input.name,
      province_id: provinceId,
      city_id: cityId,
      province: input.province,
      city: input.city,
      district: input.district,
      sub_district: input.sub_district,
      zip_code: input.zip_code,
      address_detail: input.address_detail,
      is_default: selected[0],
      is_shop_default: selected[1],
    }

    if (!isEdit) {
      createAddress.mutate(temp)
    } else {
      editAddress.mutate(temp)
    }
  }

  function removeFirstWord(str: string) {
    const indexOfSpace = str.indexOf(' ')

    if (indexOfSpace === -1) {
      return ''
    }
    return str.substring(indexOfSpace + 1)
  }

  return (
    <>
      <div className=" z-auto px-6 lg:px-8">
        <form
          className=" flex flex-col gap-y-2 "
          onSubmit={(e) => {
            void handleCreateAddress(e)
            return false
          }}
        >
          <div>
            <label className=" block text-sm font-medium text-gray-900 dark:text-white">
              Name
            </label>
            <TextInput
              inputSize="md"
              type="text"
              name="name"
              placeholder="name"
              onChange={handleChange}
              value={input.name}
              full
              required
            />
          </div>
          <div>
            <label className=" block text-sm font-medium text-gray-900 dark:text-white">
              Province
            </label>

            <SelectComboBox
              isLoading={allProvince.isLoading ? true : undefined}
              required
              isEdit={isEdit}
              selectedEdit={editData?.province}
              data={allProvince.data?.data?.rows.map(
                (dataDetail) => dataDetail.province
              )}
              placeholder={input.province}
              selectedData={(data) => {
                setInput({
                  ...input,
                  province: data,
                  city: '',
                  district: '',
                  sub_district: '',
                })
                getAllCity(data)
                if (allSubDistrict.data?.data?.data?.rows) {
                  allSubDistrict.data.data.data.rows = []
                }
                if (allUrban.data?.data?.data?.rows) {
                  allUrban.data.data.data.rows = []
                }
              }}
            />
          </div>

          <div>
            <label className=" block text-sm font-medium text-gray-900 dark:text-white">
              City
            </label>
            <SelectComboBox
              isLoading={allCity.isLoading ? true : undefined}
              isEdit={isEdit}
              selectedEdit={editData?.city}
              required
              placeholder={input.city}
              data={allCity.data?.data?.data?.rows.map(
                (dataDetail) => dataDetail.city
              )}
              selectedData={(data) => {
                const newData: string = removeFirstWord(data)
                setInput({
                  ...input,
                  city: newData,
                  district: '',
                  sub_district: '',
                })
                getAllSubDistrict(newData)
                if (allUrban.data?.data?.data?.rows) {
                  allUrban.data.data.data.rows = []
                }
              }}
            />
          </div>

          <div>
            <label className=" block text-sm font-medium text-gray-900 dark:text-white">
              District
            </label>

            <SelectComboBox
              isLoading={allSubDistrict.isLoading ? true : undefined}
              isEdit={isEdit}
              selectedEdit={editData?.district}
              required
              placeholder={input.district}
              data={
                allSubDistrict.data?.data?.data?.rows
                  ? allSubDistrict.data.data.data.rows.map(
                      (dataDetail) => dataDetail.sub_district
                    )
                  : undefined
              }
              selectedData={(data) => {
                setInput({
                  ...input,
                  district: data,
                  sub_district: '',
                })
                getAllUrban(data)
              }}
            />
          </div>
          <div>
            <label className=" block text-sm font-medium text-gray-900 dark:text-white">
              Sub District
            </label>

            <SelectComboBox
              isLoading={allUrban.isLoading ? true : undefined}
              isEdit={isEdit}
              selectedEdit={editData?.sub_district}
              placeholder={input.sub_district}
              data={
                allUrban.data?.data?.data?.rows
                  ? allUrban.data.data.data.rows.map(
                      (dataDetail) => dataDetail.urban
                    )
                  : undefined
              }
              selectedData={(data) => {
                let postalcode = ''
                if (allUrban.data?.data?.data?.rows) {
                  for (
                    let i = 0;
                    i < allUrban.data?.data?.data?.rows.length;
                    i++
                  ) {
                    if (allUrban.data.data.data.rows[i].urban === data) {
                      postalcode = allUrban.data.data.data.rows[i].postal_code
                    }
                  }
                }
                setInput({
                  id: input.id,
                  user_id: input.user_id,
                  name: input.name,
                  province_id: input.province_id,
                  city_id: input.city_id,
                  province: input.province,
                  city: input.city,
                  district: input.district,
                  sub_district: data,
                  zip_code: postalcode,
                  address_detail: input.address_detail,
                  is_default: input.is_default,
                  is_shop_default: input.is_shop_default,
                })
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white">
              Address Detail
            </label>
            <TextArea
              type="text"
              name="address_detail"
              placeholder="address_detail"
              onChange={handleChange}
              value={input.address_detail}
              full
              required
            />
          </div>
          <div>
            <label className=" block text-sm font-medium text-gray-900 dark:text-white">
              Zip Code
            </label>
            <TextInput
              inputSize="md"
              type="text"
              name="zip_code"
              placeholder="zip code"
              onChange={handleChange}
              value={input.zip_code}
              full
              required
            />
          </div>

          <div>
            <label className=" flex gap-2 text-sm font-medium text-gray-900 dark:text-white">
              <input
                type="checkbox"
                name={'shippingaddress'}
                value={0}
                checked={selected[0]}
                onChange={handleChangeCheckbox}
              />
              Choose as Shipping Address
            </label>
            <label className=" flex gap-2 text-sm font-medium text-gray-900 dark:text-white">
              <input
                type="checkbox"
                name={'shopaddress'}
                value={1}
                checked={selected[1]}
                onChange={handleChangeCheckbox}
              />
              Choose as Shop Address
            </label>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              buttonType="primary"
              outlined
              onClick={() => {
                setInput(addressInit)
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

export default FormManageAddress
