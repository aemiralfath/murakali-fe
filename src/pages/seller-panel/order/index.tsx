import { useSellerOrders } from '@/api/seller/order'
import { Button, H2 } from '@/components'
import Table from '@/components/table'
import orderStatusData from '@/dummy/orderStatusData'
import type { OrderData } from '@/types/api/order'
import type { PaginationData } from '@/types/api/response'
import moment from 'moment'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import type { MouseEvent } from 'react'
import SellerPanelLayout from '@/layout/SellerPanelLayout'
import cx from '@/helper/cx'
import formatMoney from '@/helper/formatMoney'

function ListOrderDeliveryService() {
  const router = useRouter()
  const [orderStatusID, setOrderStatusID] = useState('')
  const sellerOrders = useSellerOrders(orderStatusID)
  const orderStatuses = orderStatusData

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
                          <Image
                            width={60}
                            height={60}
                            src={productDetail.product_detail_url}
                            alt={productDetail.product_title}
                            className={'aspect-square h-[4.5rem] w-[4.5rem]'}
                          />
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
            Action: (
              <div className="flex w-fit flex-col gap-1">
                <Button buttonType="ghost" size="sm" className="rounded">
                  Look Detail
                </Button>
                {data.order_status === 2 ? (
                  <>
                    <Button buttonType="primary" size="sm" className="rounded">
                      Confirm
                    </Button>
                    <Button
                      buttonType="primary"
                      outlined
                      size="sm"
                      className="rounded"
                    >
                      Cancel
                    </Button>
                  </>
                ) : data.order_status === 3 ? (
                  <Button buttonType="primary" size="sm" className="rounded">
                    Create Package
                  </Button>
                ) : (
                  <></>
                )}
              </div>
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
        Action: '',
      },
    ]
  }

  const ChangeOrderStatusPage = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    setOrderStatusID(e.currentTarget.value)
  }

  useEffect(() => {
    if (orderStatusID === '') {
      router.push({
        pathname: '/seller-panel/order',
      })
    } else {
      router.push({
        pathname: '/seller-panel/order',
        query: {
          order_status: orderStatusID,
        },
      })
    }
  }, [orderStatusID])

  return (
    <div>
      <Head>
        <title>Murakali | Seller Panel</title>
      </Head>
      <SellerPanelLayout selectedPage="order">
        <H2>Order</H2>
        <div className="mt-3 flex h-full flex-col rounded border bg-white p-6 ">
          <div className="my-4 flex h-fit w-fit max-w-full space-x-10 overflow-x-auto whitespace-nowrap border-b-[2px]">
            <button
              onClick={(e) => ChangeOrderStatusPage(e)}
              className={cx(
                '-mb-[2px] h-fit border-b-[3px] py-1 transition-all',
                orderStatusID === '' ? 'border-primary' : 'border-transparent'
              )}
            >
              All Order
            </button>
            {orderStatuses.map((status, index) => {
              return (
                <button
                  key={index}
                  onClick={(e) => ChangeOrderStatusPage(e)}
                  value={status.id}
                  className={cx(
                    '-mb-[2px] h-full whitespace-nowrap border-b-[3px] py-1 transition-all',
                    orderStatusID === status.id
                      ? 'border-primary'
                      : 'border-transparent'
                  )}
                >
                  {status.name}
                </button>
              )
            })}
          </div>
          <div className="max-w-full overflow-auto">
            {sellerOrders.isLoading ? (
              <Table data={formatSub()} isLoading />
            ) : sellerOrders.isSuccess ? (
              <Table
                data={formatSub(sellerOrders.data.data)}
                isLoading={false}
              />
            ) : (
              <div>{'Error'}</div>
            )}
          </div>
        </div>
      </SellerPanelLayout>
    </div>
  )
}

export default ListOrderDeliveryService
