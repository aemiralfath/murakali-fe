import { useLocationCost } from '@/api/user/location'
import { H2, H4 } from '@/components'
import ProductCart from '@/components/card/ProductCart'
import { ConvertShowMoney } from '@/helper/convertshowmoney'
import type { CartDetail } from '@/types/api/cart'
import type { LocationCostRequest } from '@/types/api/location'
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
      <div className="flex flex-wrap items-center justify-end">
        <div className="dropdown">
          <label
            tabIndex={0}
            className="btn-outline btn-primary  btn m-1 gap-4"
          >
            <FaShippingFast /> Shipping Option
          </label>

          <ul
            tabIndex={0}
            className="dropdown-content menu rounded-box z-50 w-52 bg-base-100 p-2 shadow"
          >
            {locationCost.isSuccess ? (
              locationCost.data.data.data.shipping_option.map((shipping) => (
                <li
                  key={shipping.courier.id}
                  onClick={() => {
                    courierID(shipping.courier.id, shipping.fee)
                    setDelivery({
                      name: shipping.courier.name,
                      delivery_fee: shipping.fee,
                    })
                  }}
                  className="flex flex-col"
                >
                  <a className="m-2 flex flex-col items-start border-2 border-gray-200">
                    <span className="text-start font-bold">
                      {shipping.courier.name}
                    </span>
                    <span className="">Rp. {shipping.fee}</span>
                    <span>{shipping.etd}</span>
                  </a>
                </li>
              ))
            ) : (
              <a></a>
            )}
          </ul>
        </div>
        <div className="dropdown">
          <label
            tabIndex={0}
            className="btn-outline btn-primary  btn m-1 gap-2"
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
        <div className="mx-2 flex flex-col border-l-2 border-l-primary px-2 text-primary">
          <h6>
            Delivery ({delivery.name}): Rp.{' '}
            {ConvertShowMoney(delivery.delivery_fee)}
          </h6>
          <h6>
            Total Order : Rp.{' '}
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
  )
}

export default ShopCard
