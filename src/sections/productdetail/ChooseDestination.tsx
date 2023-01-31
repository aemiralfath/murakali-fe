import { useGetAllCity, useGetAllProvince } from '@/api/user/address/extra'
import { Button } from '@/components'
import SelectComboBox from '@/components/selectinput/SelectCombobox'
import { closeModal } from '@/redux/reducer/modalReducer'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

interface ChooseDestinationProps {
  setDestination: (city_id: number, city: string) => void
}

const ChooseDestination: React.FC<ChooseDestinationProps> = ({
  setDestination,
}) => {
  const dispatch = useDispatch()
  const allProvince = useGetAllProvince()
  const allCity = useGetAllCity()

  function removeFirstWord(str: string) {
    const indexOfSpace = str.indexOf(' ')

    if (indexOfSpace === -1) {
      return ''
    }
    return str.substring(indexOfSpace + 1)
  }

  function getAllCity(province: string) {
    let id = ''
    if (allProvince.data?.data?.rows) {
      for (let i = 0; i < allProvince.data?.data?.rows.length; i++) {
        const tempProvince = allProvince.data.data.rows[i]
        if (tempProvince !== undefined && tempProvince.province === province) {
          id = tempProvince.province_id
        }
      }
    }
    allCity.mutate(id)
  }

  const [input, setInput] = useState({
    city: '',
    province: '',
    city_id: 0,
  })
  return (
    <div className="h-80 ">
      {' '}
      <div className="mt-4">
        <label className="text-sm font-medium text-gray-900">Province</label>

        <SelectComboBox
          isLoading={allProvince.isLoading ? true : undefined}
          required
          isEdit={false}
          selectedEdit={''}
          data={allProvince.data?.data?.rows.map(
            (dataDetail) => dataDetail.province
          )}
          placeholder={input.province}
          selectedData={(data) => {
            setInput({
              ...input,
              province: data,
              city: '',
            })
            getAllCity(data)
          }}
        />
      </div>
      <div className="mt-8">
        <label className="text-sm font-medium text-gray-900">City</label>
        <SelectComboBox
          isLoading={allCity.isLoading ? true : undefined}
          isEdit={false}
          selectedEdit={''}
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
            })
          }}
        />
      </div>
      <div className="mt-16 flex justify-end gap-2">
        <Button
          type="button"
          buttonType="primary"
          outlined
          onClick={() => {
            setInput({
              city: '',
              province: '',
              city_id: 0,
            })
            dispatch(closeModal())
          }}
        >
          Cancel
        </Button>
        <Button
          type="button"
          buttonType="primary"
          onClick={() => {
            if (allCity.data?.data?.data?.rows) {
              let cityId = 0
              for (let i = 0; i < allCity.data.data.data.rows.length; i++) {
                const tempCity = allCity.data.data.data.rows[i]
                if (
                  tempCity !== undefined &&
                  removeFirstWord(tempCity.city) === input.city
                ) {
                  cityId = Number(tempCity.city_id)
                }
              }
              setDestination(cityId, input.city)
              dispatch(closeModal())
            }
          }}
        >
          Save
        </Button>
      </div>
    </div>
  )
}

export default ChooseDestination
