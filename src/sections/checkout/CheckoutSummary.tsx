import { Button, H3 } from '@/components'
import { ConvertShowMoney } from '@/helper/convertshowmoney'

import React from 'react'

interface CheckoutSummaryProps {
  mapPriceQuantity: {
    price: number
    subPrice: number
    quantity: number
  }
}

const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({
  mapPriceQuantity,
}) => {
  return (
    <div className=" border-grey-200 h-fit rounded-lg border-[1px] border-solid   py-10">
      <H3 className="text-center">Checkout Summary</H3>

      <div className="flex flex-col gap-y-5 px-5 py-5">
        <div className=" grid grid-cols-1 gap-1 lg:grid-cols-2 ">
          <div>Total Price ({mapPriceQuantity.quantity} item)</div>
          <div className="flex justify-start lg:justify-end">
            : Rp. {ConvertShowMoney(mapPriceQuantity.price)}
          </div>
        </div>
        <div className=" grid grid-cols-1 gap-1 lg:grid-cols-2 ">
          <div>Promo Product</div>
          <div className="flex justify-start lg:justify-end">
            : Rp. {ConvertShowMoney(mapPriceQuantity.subPrice)}
          </div>
        </div>
        <div className=" grid grid-cols-1 gap-1 lg:grid-cols-2 ">
          <div>Vocher Shop</div>
          <div className="flex justify-start lg:justify-end">: Rp. 0</div>
        </div>
        <div className=" grid grid-cols-1 gap-1 lg:grid-cols-2 ">
          <div>Voucher Murakali</div>
          <div className="flex justify-start lg:justify-end">: Rp. 0</div>
        </div>
        <hr></hr>
        <div className="grid grid-cols-1 gap-1 font-bold lg:grid-cols-2 ">
          <div>All Total</div>
          <div className="flex justify-start lg:justify-end">
            : Rp.{' '}
            {ConvertShowMoney(
              mapPriceQuantity.price - mapPriceQuantity.subPrice
            )}
          </div>
        </div>

        <Button buttonType="primary">CHECKOUT</Button>
      </div>
    </div>
  )
}

export default CheckoutSummary
