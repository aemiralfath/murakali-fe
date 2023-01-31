import { useSellerOrders } from '@/api/seller/order'
import { useSellerVoucherDetail } from '@/api/seller/voucher'
import { Chip, H2, H4, P } from '@/components'
import Table from '@/components/table'
import orderStatusData from '@/dummy/orderStatusData'
import formatMoney from '@/helper/formatMoney'
import SellerPanelLayout from '@/layout/SellerPanelLayout'
import type { OrderData } from '@/types/api/order'
import type { PaginationData } from '@/types/api/response'
import moment from 'moment'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

function VoucherDetail() {
  const router = useRouter()
  const { id } = router.query
  const sellerVoucher = useSellerVoucherDetail(String(id))
  const sellerOrders = useSellerOrders('', String(id))

  const formatSub = (pagination?: PaginationData<OrderData>) => {
    if (pagination) {
      if (pagination.rows?.length) {
        return pagination.rows.map((data) => {
          return {
            Product: (
              <div className="item-start group flex w-full items-center gap-1 text-start font-semibold">
                <div>
                  {data.detail.map((productDetail, index) => {
                    return (
                      <div key={index} className="flex justify-between">
                        <div className="mr-5 flex-none">
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
                        <div className="w-[30rem] flex-auto whitespace-pre-wrap line-clamp-3">
                          {productDetail.product_title}
                        </div>
                        <div className="ml-6 flex-none">
                          x{productDetail.order_quantity}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ),
            Price: (
              <div className="inline-block align-text-top">
                Rp{formatMoney(data.total_price)}
              </div>
            ),
            Status: orderStatusData.find((s) => s.id === `${data.order_status}`)
              .name,
            'Transaction Date': (
              <div>{moment(data.created_at).format('DD MMMM YYYY')}</div>
            ),
          }
        })
      }
    }
    return [
      {
        Product: '',
        Price: '',
        Status: '',
        'Transaction Date': '',
      },
    ]
  }

  return (
    <div>
      <Head>
        <title>Murakali | Seller Panel</title>
      </Head>
      <SellerPanelLayout selectedPage="voucher">
        <H2>Voucher Detail</H2>
        <div className="mt-3 flex h-full w-[90rem] max-w-full flex-col rounded border bg-white p-6">
          {sellerVoucher.isSuccess ? (
            <div className=" mt-3 flex h-full flex-col justify-center gap-4 rounded border p-6 md:flex-row">
              <div className="flex flex-auto flex-col gap-6">
                <div className="flex-auto">
                  <P>Voucher Code</P>
                  <P className="font-bold">{sellerVoucher.data?.data?.code}</P>
                </div>
                <div className="flex-auto">
                  <P>Status Code</P>
                  <P className="font-bold text-primary">
                    {Date.now() >=
                      Date.parse(sellerVoucher.data?.data?.actived_date) &&
                    Date.now() <=
                      Date.parse(sellerVoucher.data?.data?.expired_date) ? (
                      <Chip type="success"> On Going</Chip>
                    ) : (
                      <></>
                    )}
                    {Date.now() <
                    Date.parse(sellerVoucher.data?.data?.actived_date) ? (
                      <Chip type="secondary">Will Come</Chip>
                    ) : (
                      <></>
                    )}
                    {Date.now() >
                    Date.parse(sellerVoucher.data?.data?.expired_date) ? (
                      <Chip type="error">Has Ended</Chip>
                    ) : (
                      <></>
                    )}
                  </P>
                </div>
              </div>
              <div className="flex flex-auto flex-col gap-6">
                <div className="flex-auto">
                  <P>Active Date</P>
                  <P className="font-bold">
                    {moment(sellerVoucher.data?.data?.actived_date)
                      .utc()
                      .format('DD MMMM YYYY HH:mm')}
                  </P>
                </div>
                <div className="flex-auto">
                  <P>Expired Date</P>
                  <P className="font-bold">
                    {moment(sellerVoucher.data?.data?.expired_date)
                      .utc()
                      .format('DD MMMM YYYY  HH:mm')}
                  </P>
                </div>
              </div>
              <div className="flex flex-auto flex-col gap-6">
                <div className="flex-auto">
                  <P>Discount Detail</P>
                  <P className="font-bold">
                    {sellerVoucher.data?.data?.discount_percentage > 0 &&
                    sellerVoucher.data?.data?.discount_fix_price <= 0 ? (
                      <>{sellerVoucher.data?.data?.discount_percentage}%</>
                    ) : (
                      <></>
                    )}
                    {sellerVoucher.data?.data?.discount_percentage <= 0 &&
                    sellerVoucher.data?.data?.discount_fix_price > 0 ? (
                      <>
                        Rp
                        {formatMoney(
                          sellerVoucher.data?.data?.discount_fix_price
                        )}
                      </>
                    ) : (
                      <></>
                    )}
                  </P>
                </div>
                <div className="flex-auto">
                  <P>Quantity </P>
                  <P className="text-sm font-bold">
                    {sellerVoucher.data?.data?.quota}
                  </P>
                </div>
              </div>
              <div className="flex flex-auto flex-col gap-6">
                <div className="flex-auto">
                  <P>Min Product price </P>
                  <P className="text-sm font-bold">
                    {formatMoney(sellerVoucher.data?.data?.min_product_price)}
                  </P>
                </div>
                <div className="flex-auto">
                  <P>Max Discount Price</P>
                  <P className="text-sm font-bold">
                    {formatMoney(sellerVoucher.data?.data?.min_product_price)}
                  </P>
                </div>
              </div>
              <div className="flex flex-auto flex-col gap-6"></div>
            </div>
          ) : (
            <></>
          )}

          <div className="mt-10 flex max-w-full flex-col gap-3 overflow-auto">
            <H4>
              Order Using Voucher {sellerVoucher.data?.data?.code} History
            </H4>
            <div>
              {sellerOrders.isLoading ? (
                <Table data={formatSub()} isLoading />
              ) : sellerOrders.isSuccess ? (
                <Table
                  data={formatSub(sellerOrders.data.data)}
                  isLoading={false}
                  empty={sellerOrders.data.data.rows.length === 0}
                />
              ) : (
                <div>{'Error'}</div>
              )}
            </div>
          </div>
        </div>
      </SellerPanelLayout>
    </div>
  )
}

export default VoucherDetail
