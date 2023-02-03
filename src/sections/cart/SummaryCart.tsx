import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { HiChevronDown, HiChevronUp, HiPlus } from 'react-icons/hi'

import { useRouter } from 'next/router'

import { useGetCart } from '@/api/user/cart'
import { Button, Divider, H3 } from '@/components'
import { env } from '@/env/client.mjs'
import { ConvertShowMoney } from '@/helper/convertshowmoney'
import { useMediaQuery } from '@/hooks'
import type { CheckoutValues } from '@/pages/checkout'

import CryptoJS from 'crypto-js'

const secret = env.NEXT_PUBLIC_SECRET_KEY

interface SummaryCartProps {
  idProducts: string[]
  idShops: string[]
}

const SummaryCart: React.FC<SummaryCartProps> = ({ idProducts, idShops }) => {
  const cartList = useGetCart()
  const router = useRouter()
  const lg = useMediaQuery('lg')
  const [show, setShow] = useState(false)

  const mapPriceQuantitys = new Map<string, typeof price2>()
  let totalProduct = 0
  let totalSubPrice = 0
  let quantityTemp = 0
  let resultDiscount = 0
  interface LabeledValue {
    price: number
    subPrice: number
    result_discount: number
    quantity: number
  }

  const [product, setProductPrice] = useState<LabeledValue>({
    price: 0,
    subPrice: 0,
    quantity: 0,
    result_discount: 0,
  })

  let price2: LabeledValue | undefined = {
    price: 0,
    subPrice: 0,
    quantity: 0,
    result_discount: 0,
  }

  if (cartList.data?.data?.rows) {
    cartList.data.data.rows.forEach(function (shop) {
      shop.product_details?.forEach(function (productDetail) {
        const id = productDetail.id
        const productPrice = productDetail.product_price
        const productSubPrice = productDetail.promo.sub_price
        const productQuantity = productDetail.quantity
        const productResultDiscount = productDetail.promo.result_discount
        mapPriceQuantitys.set(id, {
          price: productPrice,
          subPrice: productSubPrice,
          quantity: productQuantity,
          result_discount: productResultDiscount,
        })
      })
    })
  }

  useEffect(() => {
    idProducts.forEach(function (d) {
      const dataId = d

      price2 = mapPriceQuantitys.get(dataId)
      if (price2 !== undefined) {
        totalProduct = totalProduct + price2.price * price2.quantity
        totalSubPrice =
          totalSubPrice +
          (price2.price - price2.result_discount) * price2.quantity
        quantityTemp = quantityTemp + price2.quantity
        resultDiscount =
          resultDiscount + price2.result_discount * price2.quantity
      }
      setProductPrice({
        price: totalProduct,
        subPrice: totalSubPrice,
        quantity: quantityTemp,
        result_discount: resultDiscount,
      })
    })
    if (idProducts.length === 0) {
      setProductPrice({
        price: 0,
        subPrice: 0,
        quantity: 0,
        result_discount: 0,
      })
    }
  }, [idProducts.length, cartList.dataUpdatedAt])

  return (
    <div className="fixed bottom-0 transition-all right-0 min-w-full rounded-t-lg bg-white xl:relative xl:m-0 h-fit xl:rounded shadow-lg border-[1px] p-6">
      <H3 className="font-bold flex items-center gap-2">
        Summary{' '}
        {lg ? (
          <></>
        ) : show ? (
          <HiChevronDown onClick={() => setShow(!show)} />
        ) : (
          <HiChevronUp onClick={() => setShow(!show)} />
        )}
      </H3>
      <div className="flex flex-col gap-y-5 mt-5">
        {lg || show ? (
          <>
            <div className=" grid gap-1 grid-cols-2 ">
              <div>Subtotal ({product.quantity})</div>
              <div className="flex justify-end">
                Rp. {ConvertShowMoney(product.price)}
              </div>
            </div>
            {product.result_discount !== 0 ? (
              <div className=" grid gap-1 grid-cols-2 ">
                <div>Discount</div>
                <div className="flex justify-end">
                  - Rp. {ConvertShowMoney(product.result_discount)}
                </div>
              </div>
            ) : (
              <></>
            )}
          </>
        ) : (
          <></>
        )}
        <div className="flex gap-2">
          <Divider />
          <HiPlus className="flex-0 text-sm text-gray-300" />
        </div>
        <div className="grid gap-1 font-bold grid-cols-2 ">
          <div>Total</div>
          <div className="flex justify-end">
            Rp. {ConvertShowMoney(product.subPrice)}
          </div>
        </div>
        <Button
          buttonType="primary"
          disabled={idProducts.length === 0}
          onClick={() => {
            if (idProducts.length === 0) {
              toast.error('You must choose one of the products')
            } else {
              const tempValues: CheckoutValues = {
                idProducts: idProducts,
                idShops: idShops,
                price: product.price,
                subPrice: product.subPrice,
                quantity: product.quantity,
                result_discount: product.result_discount,
              }

              router.push({
                pathname: '/checkout',
                query: {
                  values: CryptoJS.AES.encrypt(
                    JSON.stringify(tempValues),
                    secret
                  ).toString(),
                },
              })
            }
          }}
        >
          Buy
        </Button>
      </div>
    </div>
  )
}

export default SummaryCart
