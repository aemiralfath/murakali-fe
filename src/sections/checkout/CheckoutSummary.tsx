import React, { useEffect, useState } from 'react'
import { HiChevronDown, HiChevronUp } from 'react-icons/hi'

import { Button, H3, P } from '@/components'
import { ConvertShowMoney } from '@/helper/convertshowmoney'
import { useMediaQuery, useModal } from '@/hooks'
import type { PostCheckout } from '@/types/api/checkout'
import type { SLPUser } from '@/types/api/slp'
import type { WalletUser } from '@/types/api/wallet'

import PaymentOption from './option/PaymentOption'

interface CheckoutSummaryProps {
  mapPriceQuantity: {
    price: number
    subPrice: number
    quantity: number
    result_discount: number
  }
  postCheckout: PostCheckout
  userWallet?: WalletUser
  userSLP: SLPUser[]
}

const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({
  mapPriceQuantity,
  postCheckout,
  userWallet,
  userSLP,
}) => {
  const modal = useModal()
  const [show, setShow] = useState(false)
  const lg = useMediaQuery('lg')

  const [deliveryFee, setDeliveryFee] = useState(0)
  const [voucherShopTotal, setVoucherShopTotal] = useState(0)
  const [shippingAddressEmptyOrNot, setShippingAddressEmptyOrNot] =
    useState<boolean>(true)
  const [productEmpty, setProductsEmpty] = useState<boolean>(false)
  function handleCheckout() {
    modal.edit({
      title: 'Choose Payment Option',
      content: (
        <PaymentOption
          postCheckout={postCheckout}
          userWallet={userWallet}
          userSLP={userSLP}
          totalOrder={mapPriceQuantity.subPrice + deliveryFee}
        />
      ),
      closeButton: false,
    })
  }

  useEffect(() => {
    if (postCheckout) {
      const tempDeliveryFee: number = postCheckout.cart_items.reduce(
        (accumulator, currentValue) => accumulator + currentValue.courier_fee,
        0
      )
      const tempVoucherShopPrice: number = postCheckout.cart_items.reduce(
        (accumulator, currentValue) =>
          accumulator + currentValue.voucher_shop_total,
        0
      )

      setDeliveryFee(tempDeliveryFee)
      setVoucherShopTotal(tempVoucherShopPrice)
    }
  }, [postCheckout])

  useEffect(() => {
    if (postCheckout) {
      postCheckout.cart_items.forEach(function (shop) {
        if (!shop.courier_id) {
          setShippingAddressEmptyOrNot(true)
          return
        }
        if (shop.product_details.length <= 0) {
          setProductsEmpty(true)
          return
        }
        setShippingAddressEmptyOrNot(false)
        setProductsEmpty(false)
      })
    }
  }, [postCheckout])
  return (
    <div className="">
      <H3 className="font-bold flex items-center gap-2">
        Checkout Summary
        {lg ? (
          <></>
        ) : show ? (
          <HiChevronDown onClick={() => setShow(!show)} />
        ) : (
          <HiChevronUp onClick={() => setShow(!show)} />
        )}
      </H3>

      <div className="flex flex-col gap-y-2 text-sm mt-2">
        {lg || show ? (
          <>
            <div className=" grid gap-1 grid-cols-2 ">
              <div>Total Price ({mapPriceQuantity.quantity} item)</div>
              <div className="flex justify-end">
                Rp. {ConvertShowMoney(mapPriceQuantity.price)}
              </div>
            </div>
            <div className=" grid gap-1 grid-cols-2 ">
              <div>Promo Product</div>
              <div className="flex justify-end">
                - Rp. {ConvertShowMoney(mapPriceQuantity.result_discount)}
              </div>
            </div>
            <div className=" grid gap-1 grid-cols-2 ">
              <div>Delivery Fee</div>
              <div className="flex justify-end">
                + Rp. {ConvertShowMoney(deliveryFee)}
              </div>
            </div>
            <div className=" grid gap-1 grid-cols-2 ">
              <div>Vocher Shop</div>
              <div className="flex justify-end">
                - Rp.{ConvertShowMoney(voucherShopTotal)}
              </div>
            </div>
            <div className=" grid gap-1 grid-cols-2 ">
              <div>Voucher Murakali</div>
              <div className="flex justify-end">
                {' '}
                - Rp.{ConvertShowMoney(postCheckout.voucher_marketplace_total)}
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
        <hr></hr>
        <div className="grid gap-1 font-bold grid-cols-2 ">
          <div>Total</div>
          <div className="flex justify-end">
            Rp.{' '}
            {ConvertShowMoney(
              mapPriceQuantity.subPrice +
                deliveryFee -
                voucherShopTotal -
                postCheckout.voucher_marketplace_total <
                0
                ? 0
                : mapPriceQuantity.subPrice +
                    deliveryFee -
                    voucherShopTotal -
                    postCheckout.voucher_marketplace_total
            )}
          </div>
        </div>

        <Button
          buttonType="primary"
          onClick={handleCheckout}
          disabled={shippingAddressEmptyOrNot || productEmpty}
        >
          Choose Payment Option
        </Button>
        {shippingAddressEmptyOrNot ? (
          <P className="-mt-2 text-center text-sm text-error">
            Please Choose Shipping Option First
          </P>
        ) : (
          <></>
        )}
        {productEmpty ? (
          <P className="-mt-2 text-center text-sm text-error">Product Empty</P>
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}

export default CheckoutSummary
