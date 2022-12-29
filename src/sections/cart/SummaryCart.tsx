import { useGetCart } from '@/api/user/cart'
import { Button, H3 } from '@/components'
import { ConvertShowMoney } from '@/helper/convertshowmoney'
import { useRouter } from 'next/router'

import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface SummaryCartProps {
  idProducts: string[]
  idShops: string[]
}

const SummaryCart: React.FC<SummaryCartProps> = ({ idProducts, idShops }) => {
  const cartList = useGetCart()
  const router = useRouter()

  const mapPriceQuantitys = new Map<string, typeof price2>()

  let totalProduct = 0
  let totalPromo = 0
  let quantityTemp = 0
  interface LabeledValue {
    price: number
    subPrice: number
    quantity: number
  }

  const [product, setProductPrice] = useState<LabeledValue>({
    price: 0,
    subPrice: 0,
    quantity: 0,
  })

  let price2: LabeledValue | undefined = {
    price: 0,
    subPrice: 0,
    quantity: 0,
  }

  if (cartList.data?.data?.rows) {
    cartList.data.data.rows.forEach(function (shop) {
      shop.product_details.forEach(function (productDetail) {
        const id = productDetail.id
        const productPrice = productDetail.product_price
        const productSubPrice = productDetail.promo.sub_price
        const productQuantity = productDetail.quantity

        mapPriceQuantitys.set(id, {
          price: productPrice,
          subPrice: productSubPrice,
          quantity: productQuantity,
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
        totalPromo = totalPromo + price2.subPrice * price2.quantity
        quantityTemp = quantityTemp + price2.quantity
      }
      setProductPrice({
        price: totalProduct,
        subPrice: totalPromo,
        quantity: quantityTemp,
      })
    })
    if (idProducts.length === 0) {
      setProductPrice({
        price: 0,
        subPrice: 0,
        quantity: 0,
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
            : Rp. {ConvertShowMoney(product.price)}
          </div>
        </div>
        <div className=" grid grid-cols-1 gap-1 lg:grid-cols-2 ">
          <div>Promo Product</div>
          <div className="flex justify-start lg:justify-end">
            : - Rp. {ConvertShowMoney(product.subPrice)}
          </div>
        </div>

        <hr></hr>
        <div className="grid grid-cols-1 gap-1 font-bold lg:grid-cols-2 ">
          <div>All Total</div>
          <div className="flex justify-start lg:justify-end">
            : Rp. {ConvertShowMoney(product.price - product.subPrice)}
          </div>
        </div>

        <Button
          buttonType="primary"
          onClick={() => {
            if (idProducts.length === 0) {
              toast.error('You must choose one of the products')
            } else {
              router.push({
                pathname: '/checkout',
                query: {
                  idProduct: idProducts,
                  idShop: idShops,
                  price: product.price,
                  subPrice: product.subPrice,
                  quantity: product.quantity,
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
