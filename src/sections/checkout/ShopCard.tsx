import { useLocationCost } from '@/api/user/location'
import { Button, H2, H4, P } from '@/components'
import ProductCart from '@/components/card/ProductCart'
import { ConvertShowMoney } from '@/helper/convertshowmoney'
import type { CartDetail } from '@/types/api/cart'
import type { LocationCostRequest } from '@/types/api/location'
import { Menu } from '@headlessui/react'
import React, { useEffect, useState } from 'react'
import { FaTicketAlt } from 'react-icons/fa'
import { FaShippingFast } from 'react-icons/fa'
interface ShopCardProps {
  cart: CartDetail
  index: number
  idProducts: string[] | string
  destination: number
  courierID: (courierID: string, delivery_fee: number) => void
}

const ShopCard: React.FC<ShopCardProps> = ({
  cart,
  index,
  idProducts,
  destination,
  courierID,
}) => {
  const [delivery, setDelivery] = useState({
    name: '',
    delivery_fee: 0,
    etd: '',
  })
  const locationCost = useLocationCost()
  useEffect(() => {
    if (cart && destination) {
      const tempProductIds: string[] = cart.product_details
        .filter((item) => idProducts.includes(item.id))
        .map((product) => product.id)
      const temp: LocationCostRequest = {
        destination: destination,
        weight: cart.weight,
        shop_id: cart.shop.id,
        product_ids: tempProductIds,
      }
      locationCost.mutate(temp)
    }
  }, [cart, destination])

  return (
    <div className="z-10 h-full rounded-lg border-[1px] border-solid border-gray-300 py-5 px-8">
      <H2 className="mb-8">
        {index + 1}. {cart.shop.name}
      </H2>
      {cart.product_details
        .filter((item) => idProducts.includes(item.id))
        .map((product) => (
          <div className="flex flex-col gap-5" key={product.id}>
            <ProductCart forCart={false} listProduct={product} />
          </div>
        ))}

      <div className="flex flex-wrap items-center justify-center gap-y-2 md:justify-end">
        <div className="block">
          <Menu>
            <Menu.Button className="btn-outline btn-primary btn  m-1 w-44 gap-4">
              {delivery.name ? (
                <div className="flex-start flex items-center gap-2">
                  <FaShippingFast />
                  <div className="flex flex-col">
                    <P>{delivery.name}</P>
                    <P>{delivery.etd}</P>
                  </div>
                </div>
              ) : (
                <>
                  <FaShippingFast /> Shipping Option
                </>
              )}
            </Menu.Button>
            <Menu.Items className="absolute w-44 origin-top-left  divide-y divide-gray-100 rounded-md bg-white shadow-lg focus:outline-none ">
              <div className="p-1">
                {locationCost.isSuccess ? (
                  locationCost.data.data.data.shipping_option.length > 0 ? (
                    locationCost.data.data.data.shipping_option.map(
                      (shipping, index) => (
                        <Menu.Item key={index}>
                          {() => (
                            <Button
                              onClick={() => {
                                courierID(shipping.courier.id, shipping.fee)
                                setDelivery({
                                  name: shipping.courier.name,
                                  delivery_fee: shipping.fee,
                                  etd: shipping.etd,
                                })
                              }}
                              className="btn m-1 h-24  w-40  gap-4 border-gray-300 bg-white text-primary outline hover:border-white hover:bg-primary hover:text-white"
                            >
                              <a className="flex flex-col gap-3">
                                <span className="text-start font-bold">
                                  {shipping.courier.name}
                                </span>
                                <span className="">Rp. {shipping.fee}</span>
                                <span>{shipping.etd}</span>
                              </a>
                            </Button>
                          )}
                        </Menu.Item>
                      )
                    )
                  ) : (
                    <Menu.Item key={-1}>
                      {() => (
                        <Button className="btn m-1 h-24  w-40  gap-4 border-gray-300 bg-white text-primary outline hover:border-white hover:bg-primary hover:text-white">
                          <a className="flex flex-col gap-3">
                            <span className="text-start font-bold">
                              No Shipping option
                            </span>
                          </a>
                        </Button>
                      )}
                    </Menu.Item>
                  )
                ) : (
                  <a></a>
                )}
              </div>
            </Menu.Items>
          </Menu>
        </div>

        <div className="dropdown">
          <label
            tabIndex={0}
            className="btn-outline btn-primary btn  w-40 gap-2"
          >
            <FaTicketAlt /> Voucher Shop
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu rounded-box z-50 w-52 bg-base-100 p-2 shadow"
          >
            <li>
              <a>Item 1</a>
            </li>
            <li>
              <a>Item 2</a>
            </li>
          </ul>
        </div>
        <div className="border-1 mx-2 flex flex-col gap-2 gap-y-2 border-l-primary px-2 text-primary md:border-l-2">
          <div className="flex justify-between gap-5">
            <h6>Delivery </h6>

            <h6> Rp.{ConvertShowMoney(delivery.delivery_fee)}</h6>
          </div>
          <div className="flex justify-between gap-5">
            <h6>Total Order </h6>
            <h6>
              Rp.
              {ConvertShowMoney(
                cart.product_details
                  .filter((item) => idProducts.includes(item.id))
                  .reduce(
                    (prev, p) =>
                      prev +
                      (p.product_price * p.quantity -
                        p.promo.result_discount * p.quantity),
                    0
                  ) + delivery.delivery_fee
              )}
            </h6>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShopCard
