import { Button, Divider, H2, H4, P } from '@/components'
import SellerPanelLayout from '@/layout/SellerPanelLayout'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { useLoadingModal } from '@/hooks'
import { useRouter } from 'next/router'
import { HiArrowLeft, HiDuplicate, HiPencil } from 'react-icons/hi'
import type {
  CreatePromotionSellerRequest,
  ProductPromotion,
} from '@/types/api/promotion'
import moment from 'moment'
import { ConvertShowMoney } from '@/helper/convertshowmoney'
import { useSellerPromotionDetail } from '@/api/seller/promotion'
const PromotionDetailSeller = () => {
  const router = useRouter()
  const { id } = router.query

  const [input, setInput] = useState<CreatePromotionSellerRequest>({
    name: '',
    actived_date: '',
    expired_date: '',
    product_promotion: [],
  })

  const [promotionId, setPromotionId] = useState<string>(String(id))

  useEffect(() => {
    if (typeof id === 'string') {
      setPromotionId(id)
    }
  }, [id])

  const [selectedProduct, setSelectedProduct] = useState<ProductPromotion[]>([])
  const setLoadingModal = useLoadingModal()
  const promotionDetail = useSellerPromotionDetail(promotionId)

  useEffect(() => {
    if (typeof id === 'string') {
      setLoadingModal(promotionDetail.isLoading)
    }
  }, [promotionDetail.isLoading])

  useEffect(() => {
    if (promotionDetail.isSuccess) {
      setInput({
        ...input,
        name: promotionDetail.data?.data.promotion_name,
        actived_date: promotionDetail.data?.data.actived_date,
        expired_date: promotionDetail.data?.data.expired_date,
      })

      const pp: ProductPromotion = {
        product_id: promotionDetail.data?.data.product_id,
        product_thumbnail_url: promotionDetail.data?.data.product_thumbnail_url,
        product_name: promotionDetail.data?.data.product_name,
        price: promotionDetail.data?.data.min_price,
        category_name: '',
        unit_sold: 0,
        rating: 0,
        product_subprice: promotionDetail.data?.data.product_sub_min_price,
        discount_percentage: promotionDetail.data?.data.discount_percentage,
        discount_fix_price: promotionDetail.data?.data.discount_fix_price,
        min_product_price: promotionDetail.data?.data.min_product_price,
        max_discount_price: promotionDetail.data?.data.max_discount_price,
        quota: promotionDetail.data?.data.quota,
        max_quantity: promotionDetail.data?.data.max_quantity,
      }
      setSelectedProduct([pp])
    }
  }, [promotionDetail.isSuccess])

  return (
    <div>
      <Head>
        <title>Murakali | Seller Panel</title>
      </Head>
      <SellerPanelLayout selectedPage="promotion">
        <div className="flex flex-col items-baseline justify-between gap-2 px-3 py-5 sm:flex-row sm:px-0">
          <H2>Promotion Detail</H2>
          <Button
            size={'sm'}
            buttonType="primary"
            outlined
            onClick={() => {
              router.back()
            }}
          >
            <HiArrowLeft /> Back
          </Button>
        </div>

        <div className="mt-3  flex  h-full flex-col rounded border  bg-white p-6 px-5 ">
          <div className="flex flex-col justify-between md:flex-row md:gap-3">
            <div className="md:w-[30%]">
              <div className="flex items-center gap-3">
                <H4>Promotion Name</H4>
              </div>
            </div>
            <div className="flex-1">
              <P>{input.name}</P>
            </div>
          </div>

          <div className="mt-6 flex flex-col justify-between md:flex-row md:gap-3">
            <div className="md:w-[30%]">
              <div className="flex items-center gap-3">
                <H4>Active Date</H4>
              </div>
            </div>
            <div className="flex flex-1 items-center">
              <P>{moment(input.actived_date).format('YYYY-MM-DD, HH:mm')}</P>
            </div>
          </div>
          <div className="mt-6 flex flex-col justify-between md:flex-row md:gap-3">
            <div className="md:w-[30%]">
              <div className="flex items-center gap-3">
                <H4>Expired Date</H4>
              </div>
            </div>
            <div className="flex flex-1 items-center">
              <P>{moment(input.expired_date).format('YYYY-MM-DD, HH:mm')}</P>
            </div>
          </div>
        </div>

        <div className="mt-3 flex h-full flex-col rounded border bg-white p-6 ">
          <div className="flex items-center gap-3">
            <H2>Product</H2>
          </div>
          <div className="py-6">
            <Divider />
          </div>
          <div className="mt-3 max-w-full flex-col divide-y-[1px] overflow-auto">
            {selectedProduct.length > 0 ? (
              selectedProduct.map((sp, index) => {
                return (
                  <div key={index} className="flex-col">
                    <div className="flex items-center justify-start rounded bg-base-200 p-2">
                      <div className="flex w-fit p-1 align-middle">
                        <div className="flex flex-1 items-center gap-3">
                          <div className="flex-1">
                            <img
                              src={sp.product_thumbnail_url}
                              className={'min-w-[4rem] rounded-lg'}
                              width={80}
                              height={80}
                              alt={sp.product_name}
                            />
                          </div>
                          <div className="flex-col gap-2 p-1">
                            <P className="w-[15rem] font-semibold line-clamp-2">
                              {sp.product_name}
                            </P>
                          </div>

                          <div className="flex-auto">
                            <P className="text-sm">Price</P>
                            <P className="line-through">
                              Rp. {ConvertShowMoney(sp.price)}
                            </P>
                          </div>
                          <div className="flex-auto">
                            <P className="text-sm font-bold text-primary">
                              Price Sale
                            </P>
                            <P className="font-bold text-primary">
                              Rp. {ConvertShowMoney(sp.product_subprice)}
                            </P>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-2">
                      <div className="-mt-2 flex gap-2">
                        <div className="lg:w-[20%]">
                          {sp.discount_percentage > 0 &&
                          sp.discount_fix_price === 0 ? (
                            <div>
                              <H4 className="py-3">Discount Percentage</H4>
                              <P>{sp.discount_percentage} %</P>
                            </div>
                          ) : sp.discount_percentage > 0 &&
                            sp.discount_fix_price === 0 ? (
                            <div>
                              <H4 className="py-3">Discount Nominal</H4>
                              <P>
                                Rp. {ConvertShowMoney(sp.discount_fix_price)}
                              </P>
                            </div>
                          ) : (
                            <></>
                          )}
                        </div>
                        <div className="lg:w-[20%]">
                          <div>
                            <H4 className="py-3">Minimum Product Price</H4>
                            <P>Rp. {ConvertShowMoney(sp.min_product_price)}</P>
                          </div>
                          <div>
                            <H4 className="py-3">Maximum Discount Price</H4>
                            <P>Rp. {ConvertShowMoney(sp.max_discount_price)}</P>
                          </div>
                        </div>
                        <div className="lg:w-[20%]">
                          <div>
                            <H4 className="py-3">Quota</H4>
                            <P>{sp.quota} unit</P>
                          </div>
                          <div>
                            <H4 className="py-3">Maximum Quantity</H4>
                            <P>{sp.max_quantity} unit</P>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button
            buttonType="ghost"
            outlined
            onClick={() => {
              router.push('/seller-panel/promotion/manage?intent=edit&id=' + id)
            }}
          >
            <HiPencil /> Edit
          </Button>

          <Button
            buttonType="ghost"
            outlined
            onClick={() => {
              router.push('/seller-panel/promotion/manage?intent=add&id=' + id)
            }}
          >
            <HiDuplicate /> Duplicate
          </Button>
        </div>
      </SellerPanelLayout>
    </div>
  )
}

export default PromotionDetailSeller
