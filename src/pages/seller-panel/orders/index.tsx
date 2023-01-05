import { useSellerOrders } from '@/api/seller/order'
import { Button, Divider } from '@/components'
import Table from '@/components/table'
import orderStatusData from '@/dummy/orderStatusData'
import SectionOneSideBar from '@/layout/template/sidebar/sectionOne'
import SectionTwoSideBar from '@/layout/template/sidebar/sectionTwo'
import type { OrderData } from '@/types/api/order'
import type { PaginationData } from '@/types/api/response'
import moment from 'moment'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import type { MouseEvent } from 'react'

function ListOrderDeliveryService() {
  const router = useRouter()
  const [orderStatusID, setOrderStatusID] = useState('')
  const sellerOrders = useSellerOrders(orderStatusID)
  // setSellerOrders(useSellerOrders(orderStatusID))
  const orderStatuses = orderStatusData

  const formatSub = (pagination?: PaginationData<OrderData>) => {
    if (pagination) {
      if (pagination.rows.length) {
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
                {data.total_price}
              </div>
            ),
            Status: data.order_status,
            'Transaction Date': (
              <div>{moment(data.created_at).format('DD MMMM YYYY')}</div>
            ),
            Action: (
              <div className="flex flex-col">
                <Button buttonType="primary" size="sm">
                  Look Detail
                </Button>
                {data.order_status === 2 ? (
                  <>
                    <Button buttonType="primary" size="sm">
                      Confirm
                    </Button>
                    <Button buttonType="primary" size="sm">
                      Cancel
                    </Button>
                  </>
                ) : data.order_status === 3 ? (
                  <Button buttonType="primary" size="sm">
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
    router.push({
      pathname: '/seller-panel/orders',
      query: {
        order_status: orderStatusID,
      },
    })
    // setSellerOrders(useSellerOrders(orderStatusID))
    // return () => {
    //   second
    // }
  }, [orderStatusID])

  return (
    <div>
      <Head>
        <title>Murakali | Seller Panel</title>
      </Head>
      <SectionOneSideBar />
      <div className="flex">
        <SectionTwoSideBar selectedPage="order" />
        <div
          className="border-grey-200 z-10 m-5 flex h-full w-full max-w-full flex-col 
        items-center overflow-auto rounded-lg border-[1px] border-solid py-7 px-8"
        >
          <div className="my-4 flex w-full space-x-10">
            <button
              onClick={(e) => ChangeOrderStatusPage(e)}
              value=""
              className={
                orderStatusID === ''
                  ? 'h-full flex-none border-b-4 border-indigo-600'
                  : 'flex-none'
              }
            >
              All Order
            </button>
            {orderStatuses.map((status, index) => {
              return (
                <button
                  key={index}
                  onClick={(e) => ChangeOrderStatusPage(e)}
                  value={status.id}
                  className={
                    orderStatusID === status.id
                      ? 'h-full flex-none border-b-4 border-indigo-600'
                      : 'flex-none'
                  }
                >
                  {status.name}
                </button>
              )
            })}
          </div>
          <div className="my-4">
            <Divider />
          </div>
          <div className="item-left w-full max-w-full overflow-auto">
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
      </div>
    </div>
  )
}

export default ListOrderDeliveryService
