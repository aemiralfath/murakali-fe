import React from 'react'
import type { OrderProductDetail } from '@/types/api/order'
import { H4, P } from '@/components'
import { ConvertShowMoney } from '@/helper/convertshowmoney'

interface OrderDetailProductProps {
  detail: OrderProductDetail[]
}

const OrderDetailProduct: React.FC<OrderDetailProductProps> = ({ detail }) => {
  return (
    <div className="w-full max-w-full border-b-2 border-r-0 p-2 md:border-r-2 md:border-b-0">
      {detail.map((productDetail, index) => {
        return (
          <label key={index}>
            <div className="z-40 mb-5 border-b-2 py-5 transition-all">
              <div className="flex flex-wrap justify-around gap-3 px-3">
                <div className="align-center flex-start justify-between gap-x-4">
                  {productDetail.product_detail_url !== null ? (
                    <img
                      width={96}
                      height={96}
                      src={productDetail.product_detail_url}
                      alt={productDetail.product_title}
                      className={'aspect-square h-24 w-24'}
                    />
                  ) : (
                    <img
                      width={96}
                      height={96}
                      src={'/asset/image-empty.jpg'}
                      alt={productDetail.product_title}
                      className={'aspect-square h-24 w-24'}
                    />
                  )}
                </div>
                <div className={'w-fit'}>
                  <H4>{productDetail.product_title}</H4>

                  <P className="mt-3">Variant:</P>
                  <P className="text-gray-400">
                    {Object.keys(productDetail.variant).map((key) => {
                      return `${key}: ${productDetail.variant[key]} `
                    })}
                  </P>
                </div>
                <div className="flex flex-wrap gap-10">
                  <div className="flex-auto">
                    <P className="">Unit Price :</P>{' '}
                    <P>
                      Rp. {ConvertShowMoney(productDetail.order_item_price)}
                    </P>
                    <P className="items-center text-slate-400 ">
                      <span className="text-[0.8rem]">Qty: </span>
                      <span className="text-[0.8rem]">
                        {productDetail.order_quantity}
                      </span>
                    </P>
                  </div>
                  <div className="flex-auto">
                    <P className="font-bold text-primary"> Sub Total :</P>
                    <P className="font-bold text-primary">
                      Rp. {ConvertShowMoney(productDetail.order_total_price)}
                    </P>
                  </div>
                </div>
              </div>
            </div>
          </label>
        )
      })}
    </div>
  )
}

export default OrderDetailProduct
