import { useGetCart } from '@/api/user/cart'
import { Button, H3 } from '@/components'
import { ConvertShowMoney } from '@/helper/convertshowmoney'
import { useRouter } from 'next/router'

import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import { encrypt } from 'n-krypta'

interface SummaryCartProps {
  idProducts: string[]
  idShops: string[]
}

const SummaryCart: React.FC<SummaryCartProps> = ({ idProducts, idShops }) => {
  const cartList = useGetCart()
  const router = useRouter()

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
      shop.product_details.forEach(function (productDetail) {
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
    <div className=" border-grey-200 h-fit rounded-lg border-[1px] border-solid   py-10">
      <H3 className="text-center"> Summary Cart</H3>

      <div className="flex flex-col gap-y-5 px-5 py-5">
        <div className=" grid grid-cols-1 gap-1 lg:grid-cols-2 ">
          <div>Total Price ({product.quantity} item)</div>
          <div className="flex justify-start lg:justify-end">
            Rp. {ConvertShowMoney(product.price)}
          </div>
        </div>
        <div className=" grid grid-cols-1 gap-1 lg:grid-cols-2 ">
          <div>Promo Product</div>
          <div className="flex justify-start lg:justify-end">
            - Rp. {ConvertShowMoney(product.result_discount)}
          </div>
        </div>

        <hr></hr>
        <div className="grid grid-cols-1 gap-1 font-bold lg:grid-cols-2 ">
          <div>All Total</div>
          <div className="flex justify-start lg:justify-end">
            Rp. {ConvertShowMoney(product.subPrice)}
          </div>
        </div>

        <Button
          buttonType="primary"
          onClick={() => {
            if (idProducts.length === 0) {
              toast.error('You must choose one of the products')
            } else {
              const secret = 'test'
              router.push({
                pathname: '/checkout',
                query: {
                  idProduct: idProducts,
                  idShop: idShops,
                  price: encrypt(product.price, secret),
                  subPrice: encrypt(product.subPrice, secret),
                  quantity: encrypt(product.quantity, secret),
                  resultDiscount: encrypt(product.result_discount, secret),
                },
              })
            }
          }}
        >
          Checkout Page
        </Button>
      </div>
    </div>
  )
}

export default SummaryCart
