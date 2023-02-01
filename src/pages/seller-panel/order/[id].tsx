import React from 'react'
import { HiArrowLeft } from 'react-icons/hi'

import Head from 'next/head'
import { useRouter } from 'next/router'

import { useSellerOrderDetail } from '@/api/seller/order'
import { Button, H2, P } from '@/components'
import orderStatusData, { sellerOrderStatusData } from '@/dummy/orderStatusData'
import cx from '@/helper/cx'
import SellerPanelLayout from '@/layout/SellerPanelLayout'
import OrderAddressDetail from '@/sections/seller/order/orderAddressDetail'
import OrderDetailProduct from '@/sections/seller/order/orderDetailProduct'
import SummaryOrderDetailProduct from '@/sections/seller/order/summaryOrderDetailProduct'

import moment from 'moment'

function OrderDetailPage() {
  const router = useRouter()
  const { id } = router.query

  const sellerOrderStatus = sellerOrderStatusData
  const getSellerOrderDetail = useSellerOrderDetail(String(id))

  return (
    <div>
      <Head>
        <title>Murakali | Seller Panel</title>
      </Head>
      <SellerPanelLayout selectedPage="order">
        <div className="flex items-baseline justify-between px-3 py-5 sm:px-0">
          <H2>Order Detail</H2>
          <Button
            size="sm"
            buttonType="primary"
            outlined
            onClick={() => {
              router.back()
            }}
          >
            <HiArrowLeft /> Back
          </Button>
        </div>
        <div className="mt-3 flex h-full w-[90rem] max-w-full flex-col rounded border bg-white p-6">
          {getSellerOrderDetail.isLoading ? (
            <P className="flex w-full justify-center">Loading</P>
          ) : getSellerOrderDetail.data?.data ? (
            <>
              <div className=" mt-3 flex h-full flex-col justify-center gap-4 rounded border p-6 md:flex-row">
                <div className="flex flex-auto flex-col gap-6">
                  <div className="flex-auto">
                    <P className="text-sm">Order Date</P>
                    <P className="font-bold">
                      {moment(getSellerOrderDetail.data.data.created_at).format(
                        'DD MMM YYYY'
                      )}
                    </P>
                  </div>
                  <div className="flex-auto">
                    <P className="text-sm">Supplier Name</P>
                    <P className="font-bold text-primary">
                      {getSellerOrderDetail.data.data.shop_name}
                    </P>
                  </div>
                </div>
                <div className="flex flex-auto flex-col gap-6">
                  <div className="flex-auto">
                    <P className="text-sm">Resi Number</P>
                    <P className="font-bold">
                      {getSellerOrderDetail.data.data.resi_no}
                    </P>
                  </div>
                  <div className="flex-auto">
                    <P className="text-sm">Invoice</P>
                    <P className="font-bold">
                      {getSellerOrderDetail.data.data.invoice}
                    </P>
                  </div>
                </div>
                <div className="flex flex-auto flex-col gap-6">
                  <div className="flex-auto">
                    <P className="text-sm">Delivery Service</P>
                    <P className="font-bold">
                      {getSellerOrderDetail.data.data.courier_name}
                    </P>
                    <P className="text-xs font-bold">
                      {getSellerOrderDetail.data.data.courier_description}
                    </P>
                    <P className="text-sm font-bold">
                      {getSellerOrderDetail.data.data.courier_etd.replace(
                        /\D/g,
                        ''
                      )}{' '}
                      Days
                    </P>
                  </div>
                </div>
                <div className="flex flex-auto flex-col gap-6">
                  <div className="flex-auto">
                    <P className="text-sm">Status</P>
                    <P className="font-bold">
                      {
                        orderStatusData.find(
                          (s) =>
                            s.id ===
                            `${getSellerOrderDetail.data?.data?.order_status}`
                        )?.name
                      }
                    </P>
                  </div>
                </div>
              </div>

              <div className=" mt-5 h-full w-full max-w-full rounded border bg-white p-6">
                <div className="flex justify-center ">
                  <ul className="steps steps-vertical w-fit min-w-fit py-5 lg:steps-horizontal ">
                    {sellerOrderStatus.map((status, index) => {
                      if (getSellerOrderDetail.data?.data) {
                        return (
                          <li
                            key={index}
                            data-content={
                              getSellerOrderDetail.data.data.order_status >= 8
                                ? '✕'
                                : status.id <=
                                  getSellerOrderDetail.data.data.order_status
                                ? '✓'
                                : '●'
                            }
                            className={cx(
                              'min-w-[12rem]',
                              getSellerOrderDetail.data.data.order_status >= 8
                                ? 'step-error step'
                                : status.id <=
                                  getSellerOrderDetail.data.data.order_status
                                ? 'step-primary step'
                                : 'step'
                            )}
                          >
                            <span className="mx-1 text-sm line-clamp-2">
                              {status.name}
                            </span>
                          </li>
                        )
                      }

                      return <li key={index} />
                    })}
                  </ul>
                </div>

                <div className="mt-9 flex h-full w-full flex-col overflow-auto rounded border bg-white py-3 md:flex-row">
                  <OrderDetailProduct
                    detail={getSellerOrderDetail.data.data.detail}
                  />

                  <SummaryOrderDetailProduct
                    total_price={getSellerOrderDetail.data.data.total_price}
                    delivery_fee={getSellerOrderDetail.data.data.delivery_fee}
                    order_status={getSellerOrderDetail.data.data.order_status}
                    order_id={getSellerOrderDetail.data.data.order_id}
                    allData={getSellerOrderDetail.data.data}
                    is_withdraw={getSellerOrderDetail.data.data.is_withdraw}
                  />
                </div>
                <div className="mt-3 grid h-full grid-cols-1 gap-6 rounded border bg-white p-6 md:grid-cols-2 md:gap-6">
                  <div className="border-b-2 border-r-0 p-5 md:border-r-2 md:border-b-0">
                    <OrderAddressDetail
                      title={'From'}
                      username={getSellerOrderDetail.data.data.shop_name}
                      phone_number={
                        getSellerOrderDetail.data.data.shop_phone_number
                      }
                      address={getSellerOrderDetail.data.data.seller_address}
                    />
                  </div>
                  <div className="p-5">
                    <OrderAddressDetail
                      title={'Destination'}
                      username={getSellerOrderDetail.data.data.buyer_username}
                      phone_number={
                        getSellerOrderDetail.data.data.buyer_phone_number
                      }
                      address={getSellerOrderDetail.data.data.buyer_address}
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div>{'Error'}</div>
          )}
        </div>
      </SellerPanelLayout>
    </div>
  )
}

export default OrderDetailPage
