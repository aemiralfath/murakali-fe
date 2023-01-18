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
import { useModal } from '@/hooks'
import ProcessDelivery from '@/sections/seller-panel/delivery-servis/ProcessDelivery'
import CancelDelivery from '@/sections/seller-panel/delivery-servis/CancelDelivery'

function ListOrderDeliveryService() {
  const router = useRouter()

  const [orderStatusID, setOrderStatusID] = useState('')
  const sellerOrders = useSellerOrders(orderStatusID)
  const orderStatuses = orderStatusData
  const modal = useModal()

  function confirmationModal(orderID: string, orderStatus: number) {
    modal.info({
      title: 'Confirm Status Order Change',
      content: <ProcessDelivery orderID={orderID} orderStatus={orderStatus} />,
      closeButton: false,
    })
  }

  function cancelModal(orderID: string) {
    modal.error({
      title: 'Cancel Order',
      content: <CancelDelivery orderID={orderID} />,
      closeButton: false,
    })
  }

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
                            <Image
                              width={96}
                              height={96}
                              src={productDetail.product_detail_url}
                              alt={productDetail.product_title}
                              className={'aspect-square h-24 w-24'}
                            />
                          ) : (
                            <Image
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
            Action: (
              <div className="flex w-fit flex-col gap-1">
                <Button
                  buttonType="gray"
                  size="sm"
                  className="rounded"
                  onClick={() => {
                    router.push({
                      pathname: '/seller-panel/order/' + data.order_id,
                    })
                  }}
                >
                  Look Detail
                </Button>
                {data.order_status === 2 ? (
                  <>
                    <Button
                      onClick={() => {
                        confirmationModal(data.order_id, data.order_status + 1)
                      }}
                      buttonType="primary"
                      size="sm"
                      className="rounded"
                    >
                      Confirm
                    </Button>
                    <Button
                      onClick={() => {
                        cancelModal(data.order_id)
                      }}
                      buttonType="primary"
                      outlined
                      size="sm"
                      className="rounded"
                    >
                      Cancel
                    </Button>
                  </>
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
          <div className="my-4 flex h-fit w-fit max-w-full space-x-10 overflow-x-auto overflow-y-hidden whitespace-nowrap border-b-[2px]">
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
