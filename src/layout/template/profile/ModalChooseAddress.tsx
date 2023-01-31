import React from 'react'
import { useDispatch } from 'react-redux'

import { Button, H4, P } from '@/components'
import { closeModal } from '@/redux/reducer/modalReducer'

const ModalChooseAddress: React.FC<{
  address: Array<{
    id: string
    user_id: string
    name: string
    province_id: number
    city_id: number
    province: string
    city: string
    district: string
    sub_district: string
    address_detail: string
    zip_code: string
    is_default: boolean
    is_shop_default: boolean
  }>
}> = ({ address }) => {
  const dispatch = useDispatch()

  return (
    <>
      <div className="">
        <form className="mt-1 flex flex-col gap-y-3">
          {address.map((address) => {
            return (
              <div
                className="col-span-3 my-2 h-fit rounded-lg border-2 border-solid border-slate-600 p-2 drop-shadow-2xl"
                key={address.id}
              >
                <div className=" my-4 mx-2 grid grid-cols-1 gap-2 md:grid-cols-10">
                  <div className="col-span-1 flex items-center">
                    {address.is_default ? (
                      <input
                        type="radio"
                        name="address"
                        id="address"
                        value={address.id}
                        checked
                      />
                    ) : (
                      <input
                        type="radio"
                        name="address"
                        id="address"
                        value={address.id}
                      />
                    )}
                  </div>
                  <div className="col-span-9 flex flex-col gap-y-2">
                    <H4 className="border-b-2">{address.name}</H4>
                    <P>
                      {address.address_detail}
                      <br />
                      {address.sub_district}
                      <br />
                      {address.city}
                      <br />
                      {address.zip_code}
                    </P>
                  </div>
                </div>
              </div>
            )
          })}
          <div className="flex justify-end gap-2">
            <Button
              className="border-2 border-solid border-slate-600"
              type="button"
              buttonType="ghost"
              size="sm"
              onClick={() => {
                dispatch(closeModal())
              }}
            >
              Cancel
            </Button>
            <Button type="submit" buttonType="primary" size="sm">
              Choose Address
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}

export default ModalChooseAddress
