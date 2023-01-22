import { useGetOrders } from '@/api/order'
import { useGetTransactions } from '@/api/transaction'
import { A, Button, Chip, Divider, H1, P } from '@/components'
import { orderStatus } from '@/constants/status'
import cx from '@/helper/cx'
import formatMoney from '@/helper/formatMoney'
import ProfileLayout from '@/layout/ProfileLayout'
import type { BuyerOrder } from '@/types/api/order'
import moment from 'moment'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'

import React, { useEffect, useState } from 'react'
import { FaStore } from 'react-icons/fa'
import {
  HiArrowRight,
  HiInformationCircle,
  HiShoppingCart,
} from 'react-icons/hi'

const EmptyLayout = () => {
  return (
    <div className="flex flex-col items-center justify-center py-6">
      <div className="relative aspect-video w-full sm:w-96 md:w-[28rem]">
        <Image
          src={'/asset/tour.png'}
          fill
          className="object-cover"
          alt="Buy your first product"
        />
      </div>
      <P className="mt-6 text-center opacity-70">It&apos;s empty in here!</P>
      <Button className="mt-6" buttonType="primary" outlined>
        <HiShoppingCart /> Checkout Now!
      </Button>
    </div>
  )
}

const OrderCard: React.FC<
  LoadingDataWrapper<BuyerOrder> & { insideTransaction?: boolean }
> = ({ isLoading, data, insideTransaction }) => {
  const router = useRouter()
  const order = data

  return (
    <div className={'flex flex-col gap-2.5 rounded border p-3'}>
      {isLoading ? (
        <div className="h-[1.5rem] w-[6rem] animate-pulse rounded bg-base-300" />
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaStore className="opacity-70" />
            <A
              className="line-clamp-1"
              onClick={() => {
                router.push('/seller/' + order.shop_id)
              }}
            >
              {order.shop_name}
            </A>
          </div>
          <div className="flex items-center gap-1">
            <P className="text-xs opacity-60">
              {moment(order.created_at).format('DD MMMM YYYY')}
            </P>
            <P className="text-xs opacity-60">•</P>
            <Chip type="gray">{orderStatus[order.order_status]}</Chip>
          </div>
        </div>
      )}
      <Divider />
      {isLoading ? (
        <div className="flex gap-2.5">
          <div className="h-[100px] w-[100px] animate-pulse rounded bg-base-300" />
          <div className="flex-1 px-2">
            <div className="h-[1.5rem] w-[80%] animate-pulse rounded bg-base-300" />
            <div className="h-[1.5rem] w-[70%] animate-pulse rounded bg-base-300" />
          </div>
        </div>
      ) : (
        order.detail.map((detail) => {
          return (
            <div
              className="flex gap-2.5"
              key={`${detail.product_detail_id}-${order.order_id}`}
            >
              <Image
                alt={detail.product_title}
                src={detail.product_detail_url}
                width={100}
                height={100}
              />
              <div className="flex-1 px-2">
                <P className="font-semibold">{detail.product_title}</P>
                <P className="text-sm opacity-60">
                  Quantity: {detail.order_quantity}
                </P>
              </div>
              <div className="px-2 text-right">
                <P className="text-xs opacity-60">
                  Rp{formatMoney(detail.order_item_price)} / pcs
                </P>
                <P className="font-semibold">
                  Rp{formatMoney(detail.order_total_price)}
                </P>
              </div>
            </div>
          )
        })
      )}
      <Divider />
      <div className={'flex items-center justify-between'}>
        {isLoading ? (
          <div className="h-[1.5rem] w-[80%] animate-pulse rounded bg-base-300" />
        ) : (
          <>
            <P className="opacity-60">
              {insideTransaction ? 'Order Subtotal:' : 'Total:'}
            </P>
            <div className="flex items-center gap-2">
              <P className="font-semibold">
                Rp
                {formatMoney(order.total_price + order.delivery_fee)}
              </P>
              <div className="dropdown-end dropdown">
                <label tabIndex={0}>
                  <HiInformationCircle className="cursor-pointer text-gray-400" />
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content w-56 bg-base-100 p-2 shadow-lg"
                >
                  <P className="font-semibold">Detail</P>
                  <div className="mt-2 flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <P className="text-sm">Subtotal</P>
                      <P className="text-sm">
                        Rp
                        {formatMoney(order.total_price)}
                      </P>
                    </div>
                    <div className="flex items-center justify-between">
                      <P className="text-sm">Delivery Fee</P>
                      <P className="text-sm">
                        Rp
                        {formatMoney(order.delivery_fee)}
                      </P>
                    </div>
                    <Divider />
                    <div className="flex items-center justify-between">
                      <P className="text-sm">Total</P>
                      <P className="text-sm font-medium">
                        Rp
                        {formatMoney(order.delivery_fee + order.total_price)}
                      </P>
                    </div>
                  </div>
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
      {insideTransaction ? (
        <></>
      ) : (
        <Button buttonType="ghost">
          Order Detail <HiArrowRight />
        </Button>
      )}
    </div>
  )
}

function TransactionHistory() {
  const router = useRouter()
  const { pathname, query } = router
  const { status } = query

  const [qryStatus, setQryStatus] = useState(0)
  useEffect(() => {
    if (typeof status === 'string') {
      const parsed = parseInt(status)
      if (parsed >= 0 && parsed <= 9) {
        setQryStatus(parsed)
      }
    }
  }, [status])

  const orders = useGetOrders({
    order_status: qryStatus === 0 ? undefined : qryStatus,
  })
  const transactions = useGetTransactions()

  return (
    <>
      <Head>
        <title>Transaction | Murakali</title>
        <meta
          name="description"
          content="Transaction | Murakali E-Commerce Application"
        />
      </Head>
      <ProfileLayout selectedPage="transaction-history">
        <>
          <H1 className="text-primary">Transactions</H1>
          <div className="my-4">
            <Divider />
          </div>
          <div className="customscroll mb-3 max-w-full overflow-auto">
            <div className="tabs mb-1 flex-nowrap">
              {['All', ...orderStatus.slice(1)].map((status, idx) => (
                <a
                  className={cx(
                    'tab tab-lifted whitespace-nowrap',
                    idx === qryStatus ? 'tab-active' : ''
                  )}
                  key={status}
                  onClick={() => {
                    router.push({
                      pathname,
                      query: {
                        status: idx,
                      },
                    })
                  }}
                >
                  {status}
                </a>
              ))}
            </div>
          </div>
          <div>
            <div className="flex flex-col gap-3">
              {qryStatus === 1 ? (
                transactions.data?.data.rows.length > 0 ? (
                  <>
                    {transactions.data.data.rows.map((row) => {
                      return (
                        <div
                          key={row.id}
                          className={'flex flex-col gap-2.5 rounded border p-3'}
                        >
                          {row.orders.map((order) => {
                            return (
                              <OrderCard
                                key={order.order_id}
                                data={order}
                                isLoading={false}
                                insideTransaction
                              />
                            )
                          })}
                          <div className={'flex items-center gap-2'}>
                            <div className="flex-1">
                              <Divider />
                            </div>
                            <div className="mb-[2px] text-2xl font-light text-gray-300">
                              +
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <P>Transaction Total:</P>
                            <P className="text-xl font-bold">
                              Rp{formatMoney(row.total_price)}
                            </P>
                          </div>
                          <div className="flex items-center justify-end gap-2.5">
                            {row.expired_at.Valid ? (
                              <P className="text-sm">
                                <span className="opacity-60">Pay before:</span>{' '}
                                <span className="font-semibold">
                                  {moment(row.expired_at.Time).format(
                                    'DD MMMM YYYY, h:mm A'
                                  )}
                                </span>
                              </P>
                            ) : (
                              <></>
                            )}
                            <Button size="sm" buttonType="primary">
                              Pay Now
                            </Button>
                            <Button size="sm" buttonType="primary" outlined>
                              Detail
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </>
                ) : transactions.isLoading ? (
                  <>
                    <OrderCard isLoading={true} />
                    <OrderCard isLoading={true} />
                    <OrderCard isLoading={true} />
                  </>
                ) : (
                  <EmptyLayout />
                )
              ) : orders.data?.data.rows.length > 0 ? (
                orders.data?.data.rows.map((order) => {
                  return (
                    <OrderCard
                      key={order.order_id}
                      data={order}
                      isLoading={false}
                    />
                  )
                })
              ) : orders.isLoading ? (
                <>
                  <OrderCard isLoading={true} />
                  <OrderCard isLoading={true} />
                  <OrderCard isLoading={true} />
                </>
              ) : (
                <EmptyLayout />
              )}
            </div>
          </div>
        </>
      </ProfileLayout>
    </>
  )
}

export default TransactionHistory
