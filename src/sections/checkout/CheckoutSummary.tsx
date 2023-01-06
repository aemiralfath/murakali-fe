import { Button, H3 } from '@/components'
import { ConvertShowMoney } from '@/helper/convertshowmoney'
import { useModal } from '@/hooks'
import type { PostCheckout } from '@/types/api/checkout'

import React, { useEffect, useState } from 'react'
import PaymentOption from './PaymentOption'

interface CheckoutSummaryProps {
  mapPriceQuantity: {
    price: number
    subPrice: number
    quantity: number
    result_discount: number
  }
  postCheckout: PostCheckout
}

const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({
  mapPriceQuantity,
  postCheckout,
}) => {
  const modal = useModal()

  const [deliveryFee, setDeliveryFee] = useState(0)
  function handleCheckout() {
    modal.edit({
      title: 'Choose Payment Option',
      content: <PaymentOption postCheckout={postCheckout} />,
      closeButton: false,
    })
  }

  useEffect(() => {
    if (postCheckout) {
      const tempDeliveryFee: number = postCheckout.cart_items.reduce(
        (accumulator, currentValue) => accumulator + currentValue.courier_fee,
        0
      )
      setDeliveryFee(tempDeliveryFee)
    }
  }, [postCheckout])
  return (
    <div className=" h-fit rounded-lg border-[1px] border-solid border-gray-300   py-10">
      <H3 className="text-center">Checkout Summary</H3>

      <div className="flex flex-col gap-y-5 px-5 py-5">
        <div className=" grid grid-cols-1 gap-1 lg:grid-cols-2 ">
          <div>Total Price ({mapPriceQuantity.quantity} item)</div>
          <div className="flex justify-start lg:justify-end">
            Rp. {ConvertShowMoney(mapPriceQuantity.price)}
          </div>
        </div>
        <div className=" grid grid-cols-1 gap-1 lg:grid-cols-2 ">
          <div>Promo Product</div>
          <div className="flex justify-start lg:justify-end">
            - Rp. {ConvertShowMoney(mapPriceQuantity.result_discount)}
          </div>
        </div>
        <div className=" grid grid-cols-1 gap-1 lg:grid-cols-2 ">
          <div>Delivery Fee</div>
          <div className="flex justify-start lg:justify-end">
            - Rp. {ConvertShowMoney(deliveryFee)}
          </div>
        </div>
        <div className=" grid grid-cols-1 gap-1 lg:grid-cols-2 ">
          <div>Vocher Shop</div>
          <div className="flex justify-start lg:justify-end"> Rp. 0</div>
        </div>
        <div className=" grid grid-cols-1 gap-1 lg:grid-cols-2 ">
          <div>Voucher Murakali</div>
          <div className="flex justify-start lg:justify-end"> Rp. 0</div>
        </div>
        <hr></hr>
        <div className="grid grid-cols-1 gap-1 font-bold lg:grid-cols-2 ">
          <div>All Total</div>
          <div className="flex justify-start lg:justify-end">
            Rp. {ConvertShowMoney(mapPriceQuantity.subPrice + deliveryFee)}
          </div>
        </div>

        <Button buttonType="primary" onClick={handleCheckout}>
          Choose Payment Option
        </Button>
      </div>
    </div>
  )
}

export default CheckoutSummary
