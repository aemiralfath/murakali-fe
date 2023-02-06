import React, { useEffect, useState } from 'react'
import {
  HiArrowNarrowRight,
  HiChevronDown,
  HiOutlineTruck,
} from 'react-icons/hi'

import { useGetDefaultAddress } from '@/api/user/address'
import { useLocationCost } from '@/api/user/location'
import { useGetUserProfile } from '@/api/user/profile'
import { Button, P, Spinner } from '@/components'
import formatMoney from '@/helper/formatMoney'
import { useMediaQuery, useModal } from '@/hooks'
import type { LocationCostRequest } from '@/types/api/location'

import { Menu } from '@headlessui/react'

import ChooseDestination from './ChooseDestination'

interface DeliveryInformationProps {
  weight: number
  shopID: string
  productID: string
}

const DeliveryInformation: React.FC<DeliveryInformationProps> = ({
  weight,
  shopID,
  productID,
}) => {
  const user = useGetUserProfile()
  const defaultAddress = useGetDefaultAddress(
    true,
    false,
    Boolean(user.data?.data?.id)
  )

  const locationCost = useLocationCost()
  const xl = useMediaQuery('xl')

  const [destination, setDestination] = useState({
    city: 'Jakarta Selatan',
    city_id: 153,
  })
  const [minMax, setMinMax] = useState({ min: 0, max: 0 })
  useEffect(() => {
    if (destination.city_id !== 0 && weight !== 0) {
      const temp: LocationCostRequest = {
        destination: destination.city_id,
        weight: weight,
        shop_id: shopID,
        product_ids: [productID],
      }
      locationCost.mutate(temp)
    }
  }, [destination, weight])

  useEffect(() => {
    if (
      locationCost.data?.data?.data &&
      locationCost.data.data.data.shipping_option !== null
    ) {
      const tempShippingOption = locationCost.data.data.data.shipping_option[0]

      if (tempShippingOption !== undefined) {
        let max = tempShippingOption.fee
        let min = tempShippingOption.fee

        locationCost.data?.data.data.shipping_option.forEach(function (
          location
        ) {
          if (location.fee > max) {
            max = location.fee
          }
          if (min > location.fee) {
            min = location.fee
          }
        })

        setMinMax({ min: min, max: max })
      }
    }
  }, [locationCost.isSuccess])

  useEffect(() => {
    if (defaultAddress.data?.data) {
      setDestination({
        city: defaultAddress.data?.data?.rows[0]?.city ?? '',
        city_id: defaultAddress.data?.data?.rows[0]?.city_id ?? 0,
      })
    }
  }, [defaultAddress.isSuccess])

  const modal = useModal()

  return (
    <div className="rounded border px-2 py-2">
      <P className="font-semibold">Delivery Estimation</P>
      <div>
        <div className="flex flex-row flex-wrap items-center ">
          <Button
            onClick={() => {
              if (weight !== 0) {
                modal.edit({
                  title: 'Choose Destination',
                  content: (
                    <ChooseDestination
                      setDestination={(cityId: number, city: string) => {
                        setDestination({ city: city, city_id: cityId })
                      }}
                    />
                  ),
                  closeButton: false,
                })
              }
            }}
            className="flex-start btn-ghost btn-sm btn flex w-fit py-0 font-normal hover:bg-white hover:text-primary"
          >
            <span className="flex items-center gap-3">
              <HiOutlineTruck /> To {destination.city}
            </span>
          </Button>
          {xl ? <HiArrowNarrowRight /> : <></>}
          <div className="block">
            <Menu>
              <Menu.Button className="btn-ghost btn-sm btn w-fit gap-2 bg-white py-0 text-start hover:bg-white hover:text-primary">
                Delivery Fee Rp.{' '}
                {minMax.max === 0 && minMax.min === 0 ? (
                  <>
                    -
                    {locationCost.isLoading ? (
                      <div className="w-[8rem] h-[1.25rem] rounded bg-base-300 animate-pulse" />
                    ) : (
                      <span className="text-start  italic text-gray-400">
                        {' '}
                        Choose variant first
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    {formatMoney(minMax.min)} - Rp. {formatMoney(minMax.max)}
                  </>
                )}
                <HiChevronDown />
              </Menu.Button>

              {!locationCost.isLoading ? (
                locationCost.data?.data?.data &&
                locationCost.data.data.data.shipping_option !== null ? (
                  locationCost.data?.data?.data?.shipping_option.length > 0 ? (
                    <div>
                      <Menu.Items className="customscroll absolute max-h-64 w-fit origin-top-left divide-y divide-gray-100 overflow-x-hidden  overflow-y-scroll rounded-md bg-white p-2 shadow-lg focus:outline-none ">
                        {locationCost.data.data.data.shipping_option.map(
                          (shipping, index) => (
                            <div key={index} className={'flex justify-center'}>
                              <Menu.Item>
                                {() => (
                                  <Button className="btn m-1 mx-auto h-fit w-44 justify-start gap-2 border-gray-300 bg-white text-base-content hover:border-white hover:bg-primary hover:text-white">
                                    <a className="flex w-full flex-col justify-start gap-1 py-2 text-start">
                                      <span className="text-lg font-semibold">
                                        {shipping.courier.name}
                                      </span>
                                      <span className="-mt-1 text-sm font-normal">
                                        Rp. {shipping.fee}
                                      </span>
                                      <span className="-mt-1 text-xs font-normal">
                                        {shipping.etd.replace(/\D/g, '')} Days
                                      </span>
                                    </a>
                                  </Button>
                                )}
                              </Menu.Item>
                            </div>
                          )
                        )}
                      </Menu.Items>
                    </div>
                  ) : (
                    <></>
                  )
                ) : (
                  <Menu.Items className="absolute w-56 origin-top-left divide-y divide-gray-100 rounded-md  bg-white text-center italic text-gray-400 shadow-lg focus:outline-none ">
                    Choose variant first
                  </Menu.Items>
                )
              ) : (
                <>
                  <Spinner />
                </>
              )}
            </Menu>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeliveryInformation
