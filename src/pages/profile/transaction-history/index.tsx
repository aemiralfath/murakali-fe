import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { FaStore } from 'react-icons/fa'
import {
  HiArrowRight,
  HiCheck,
  HiInboxIn,
  HiInformationCircle,
  HiOutlineShieldCheck,
  HiShoppingCart,
} from 'react-icons/hi'
import { HiArrowDown, HiArrowUp } from 'react-icons/hi'

import Head from 'next/head'
import { useRouter } from 'next/router'

import { useCompleteOrder, useGetOrders, useReceiveOrder } from '@/api/order'
import { useGetTransactions } from '@/api/transaction'
import { useGetRefundThread } from '@/api/user/refund'
import { useGetUserSLP } from '@/api/user/slp'
import { useGetUserWallet } from '@/api/user/wallet'
import { A, Button, Chip, Divider, H1, P, PaginationNav } from '@/components'
import { orderStatus } from '@/constants/status'
import cx from '@/helper/cx'
import formatMoney from '@/helper/formatMoney'
import { useModal } from '@/hooks'
import ProfileLayout from '@/layout/ProfileLayout'
import ConfirmationModal from '@/layout/template/confirmation/confirmationModal'
import PaymentOption from '@/sections/checkout/option/PaymentOption'
import type { BuyerOrder } from '@/types/api/order'
import type { APIResponse } from '@/types/api/response'
import type { Transaction } from '@/types/api/transaction'

import type { AxiosError } from 'axios'
import moment from 'moment'

const EmptyLayout = () => {
  return (
    <div className="flex flex-col items-center justify-center py-6">
      <div className="relative aspect-video w-full sm:w-96 md:w-[28rem]">
        <img
          src={'/asset/tour.png'}
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

const TransactionDetailModal: React.FC<{ tx: Transaction }> = ({ tx }) => {
  return (
    <div className="flex flex-col">
      <div>
        <P className="font-semibold">Orders:</P>
        {tx.orders.map((order) => {
          return (
            <div key={`order-detail-${order.order_id}`} className={'mt-2'}>
              <P className="text-sm">{order.shop_name}</P>
              <ul className="mt-1 flex flex-col gap-1">
                {order.detail.map((detail) => {
                  return (
                    <li
                      key={`order-detail-tx-${detail.product_id}}`}
                      className="text-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <p className="ml-4">{`${detail.product_title} (${detail.order_quantity} pcs)`}</p>
                        </div>
                        <p>Rp{formatMoney(detail.order_total_price)}</p>
                      </div>
                    </li>
                  )
                })}
                <li key={`order-detail-tx-ongkir`} className="text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <p className="ml-4">Delivery Fee</p>
                    </div>
                    <p>Rp{formatMoney(order.delivery_fee)}</p>
                  </div>
                </li>
              </ul>
            </div>
          )
        })}
      </div>
      <div className="my-4">
        <Divider />
      </div>
      <div className="flex justify-between text-lg font-semibold">
        <P>Total:</P>
        <P>Rp{formatMoney(tx.total_price)}</P>
      </div>
      {tx.expired_at.Valid ? (
        <P className="flex items-center justify-between text-sm">
          <span className="">Pay before</span>{' '}
          <span className="font-semibold">
            {moment(tx.expired_at.Time).format('DD MMMM YYYY, h:mm A')}
          </span>
        </P>
      ) : (
        <></>
      )}
    </div>
  )
}

const OrderCard: React.FC<
  LoadingDataWrapper<BuyerOrder> & { insideTransaction?: boolean }
> = ({ isLoading, data, insideTransaction }) => {
  const modal = useModal()
  const router = useRouter()
  const { pathname } = router

  const userWallet = useGetUserWallet()
  const order = data
  const getRefundThread = useGetRefundThread(data?.order_id)
  const receiveOrder = useReceiveOrder()
  const completeOrder = useCompleteOrder()

  useEffect(() => {
    if (receiveOrder.isSuccess) {
      toast.success('Confirmation received!')
      router.push({
        pathname,
        query: {
          status: 6,
        },
      })
    }
  }, [receiveOrder.isSuccess])
  useEffect(() => {
    if (receiveOrder.isError) {
      const errmsg = receiveOrder.failureReason as AxiosError<APIResponse<null>>
      toast.error(errmsg.response?.data.message as string)
    }
  }, [receiveOrder.isError])

  useEffect(() => {
    if (completeOrder.isSuccess) {
      toast.success('Confirmation received!')
      if (order) {
        router.push('/order/detail?id=' + order.order_id + '#review')
      }
    }
  }, [completeOrder.isSuccess])
  useEffect(() => {
    if (completeOrder.isError) {
      const errmsg = completeOrder.failureReason as AxiosError<
        APIResponse<null>
      >
      toast.error(errmsg.response?.data.message as string)
    }
  }, [completeOrder.isError])

  return (
    <div
      className={'flex flex-col gap-2.5 rounded border bg-white p-3'}
      id={'order-' + data?.order_id}
    >
      {isLoading ? (
        <div className="h-[1.5rem] w-[6rem] animate-pulse rounded bg-base-300" />
      ) : (
        <div className="flex items-center justify-between">
          {order ? (
            <>
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
              <div className="flex flex-wrap items-center gap-1">
                <P className="text-xs opacity-60">
                  {moment(order.created_at).format('DD MMMM YYYY')}
                </P>
                <P className="text-xs opacity-60">•</P>
                <Chip type="gray">{orderStatus[order.order_status]}</Chip>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      )}
      <Divider />
      {!order ? (
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
              className="flex flex-wrap gap-2.5"
              key={`${detail.product_detail_id}-${order.order_id}`}
            >
              <img
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
                  Rp
                  {formatMoney(
                    detail.order_total_price / detail.order_quantity
                  )}{' '}
                  / pcs
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
        {!order ? (
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
      ) : order ? (
        <div className="grid grid-cols-1  items-center gap-x-4 lg:grid-cols-2">
          {order.order_status === 5 ? (
            <Button
              buttonType="primary"
              outlined
              isLoading={receiveOrder.isLoading}
              onClick={() => {
                modal.info({
                  title: 'Confirmation',
                  closeButton: false,
                  content: (
                    <ConfirmationModal
                      msg={'Have you receive these product(s)?'}
                      onConfirm={() => {
                        receiveOrder.mutate({
                          order_id: order.order_id,
                        })
                      }}
                    />
                  ),
                })
              }}
            >
              <HiInboxIn /> Confirm Order Received
            </Button>
          ) : (
            <></>
          )}
          {order.order_status === 6 ? (
            <>
              {order.is_refund === false ? (
                <Button
                  buttonType="primary"
                  outlined
                  isLoading={receiveOrder.isLoading}
                  onClick={() => {
                    modal.info({
                      title: 'Confirmation',
                      closeButton: false,
                      content: (
                        <ConfirmationModal
                          msg={`Complete Order & Release Rp${formatMoney(
                            order.total_price
                          )} to the Seller?`}
                          onConfirm={() => {
                            completeOrder.mutate({
                              order_id: order.order_id,
                            })
                          }}
                        />
                      ),
                    })
                  }}
                >
                  <HiCheck /> Complete Order
                </Button>
              ) : (
                <Button
                  buttonType="gray"
                  outlined
                  isLoading={receiveOrder.isLoading}
                  className="text-white"
                  onClick={() => {
                    router.push('/order/refund-thread?id=' + order.order_id)
                  }}
                >
                  Refund Thread
                </Button>
              )}
            </>
          ) : (
            <></>
          )}
          <Button
            className={cx(
              order.order_status === 5 ||
                order.order_status === 6 ||
                order.order_status === 7
                ? ''
                : 'col-span-2'
            )}
            buttonType={order.order_status === 1 ? 'primary' : 'ghost'}
            outlined={order.order_status === 1}
            onClick={() => {
              if (order.order_status === 1) {
                router.push(
                  '/profile/transaction-history?status=1#order-' +
                    order.order_id
                )
              } else {
                router.push('/order/detail?id=' + order.order_id)
              }
            }}
          >
            {order.order_status === 1 ? 'Pay Now' : 'Order Detail'}{' '}
            <HiArrowRight />
          </Button>
          {order.order_status === 6 ? (
            <div className="mt-2 flex items-baseline justify-center gap-1 text-center">
              {order.is_refund === false ? (
                <>
                  {getRefundThread.data?.data?.refund_data?.rejected_at
                    .Valid ? (
                    <>
                      <P className="text-xs opacity-50">
                        your previous{' '}
                        <A
                          className="text-xs hover:opacity-100"
                          underline
                          onClick={() => {
                            router.push(
                              '/order/refund-thread?id=' + order.order_id
                            )
                          }}
                        >
                          File Complaint
                        </A>{' '}
                        has been rejected at{' '}
                        {moment(
                          getRefundThread.data?.data?.refund_data?.rejected_at
                            .Time
                        )
                          .utcOffset(420)
                          .format('DD MMMM YYYY HH:mm:ss')
                          .toString()}
                        {'.'}
                        <P>
                          you can create new File Complaint to refund before 24
                          hours rejected.
                        </P>
                        <P>
                          <A
                            className="text-xs hover:opacity-100"
                            underline
                            onClick={() => {
                              modal.info({
                                title: 'Confirmation',
                                closeButton: false,
                                content: (
                                  <ConfirmationModal
                                    msg={
                                      'Are you sure Want to Complaint the Order and Refund?'
                                    }
                                    onConfirm={() => {
                                      if (
                                        userWallet?.data?.data?.active_date
                                          .Valid === true &&
                                        new Date(
                                          Date.parse(
                                            userWallet.data.data.active_date
                                              .Time
                                          )
                                        ) < new Date()
                                      ) {
                                        router.push(
                                          '/order/complaint?id=' +
                                            order.order_id
                                        )
                                        return
                                      }
                                      toast.error('wallet is not active')
                                    }}
                                  />
                                ),
                              })
                            }}
                          >
                            File a Complaint
                          </A>
                        </P>
                      </P>
                    </>
                  ) : (
                    <>
                      <P className="text-xs opacity-50">Or</P>
                      <A
                        className="text-xs opacity-50 hover:opacity-100"
                        underline
                        onClick={() => {
                          modal.info({
                            title: 'Confirmation',
                            closeButton: false,
                            content: (
                              <ConfirmationModal
                                msg={
                                  'Are you sure Want to Complaint the Order and Refund?'
                                }
                                onConfirm={() => {
                                  if (
                                    userWallet?.data?.data?.active_date
                                      .Valid === true &&
                                    new Date(
                                      Date.parse(
                                        userWallet.data.data.active_date.Time
                                      )
                                    ) < new Date()
                                  ) {
                                    router.push(
                                      '/order/complaint?id=' + order.order_id
                                    )
                                    return
                                  }
                                  toast.error('wallet is not active')
                                }}
                              />
                            ),
                          })
                        }}
                      >
                        File a Complaint
                      </A>
                    </>
                  )}
                  <></>
                </>
              ) : (
                <>
                  {getRefundThread.data?.data?.refund_data?.accepted_at
                    .Valid ? (
                    <>
                      <P className="text-xs opacity-50">
                        your File Complaint has been accepted at{' '}
                        {moment(
                          getRefundThread.data?.data?.refund_data.accepted_at
                            .Time
                        )
                          .utcOffset(420)
                          .format('DD MMMM YYYY HH:mm:ss')
                          .toString()}
                        {'.'}
                        <P>please wait the system to process refund order.</P>
                      </P>
                    </>
                  ) : (
                    <></>
                  )}
                </>
              )}
            </div>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}

function TransactionHistory() {
  const router = useRouter()
  const modal = useModal()
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

  const [sort, setSort] = useState('DESC')
  const [page, setPage] = useState<number>(1)

  const orders = useGetOrders({
    order_status: qryStatus === 0 ? undefined : qryStatus,
    sort: sort,
    page: page,
  })
  const transactions = useGetTransactions(sort, page)
  const userWallet = useGetUserWallet()
  const userSLP = useGetUserSLP()

  useEffect(() => {
    setPage(1)
  }, [qryStatus])
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
          <div className="my-2">
            <Divider />
          </div>
          <div className="flex-start flex">
            <div className="flex items-center gap-x-2 px-5">
              <P className="my-3  font-bold">Date</P>
              <button
                className={cx(
                  'flex aspect-square h-[1.5rem] items-center justify-center rounded-full border text-xs',
                  sort === 'ASC' ? 'bg-primary text-xs text-white' : ''
                )}
                onClick={() => {
                  setSort('ASC')
                }}
              >
                <HiArrowUp />
              </button>
              <button
                className={cx(
                  'flex aspect-square h-[1.5rem] items-center justify-center rounded-full border text-xs',
                  sort === 'DESC' ? 'bg-primary text-xs text-white' : ''
                )}
                onClick={() => {
                  setSort('DESC')
                }}
              >
                <HiArrowDown />
              </button>
            </div>
          </div>

          <div className="customscroll mb-3 max-w-full overflow-auto">
            <div className="tabs mb-1 flex-nowrap">
              {['All', ...orderStatus.slice(1)].map((status, idx) => (
                <a
                  key={status}
                  className={cx(
                    'tab tab-lifted indicator whitespace-nowrap',
                    idx === qryStatus ? 'tab-active' : ''
                  )}
                  onClick={() => {
                    router.push({
                      pathname,
                      query: {
                        status: idx,
                      },
                    })
                  }}
                >
                  {idx === 1 &&
                  transactions.data?.data?.rows &&
                  transactions.data.data.rows.length > 0 ? (
                    <span className="indicator-item border-none bg-transparent">
                      <div className=" relative mt-2 mr-9">
                        <div
                          className={cx(
                            'absolute z-20 h-[8px] w-[8px] rounded-full',
                            qryStatus === 1 ? 'bg-error' : 'bg-red-400'
                          )}
                        ></div>
                        <div className="absolute z-10 h-[8px] w-[8px] animate-ping rounded-full bg-error"></div>
                      </div>
                    </span>
                  ) : (
                    <></>
                  )}
                  {status}
                </a>
              ))}
            </div>
          </div>
          <div>
            <div className="flex flex-col gap-3">
              {qryStatus === 1 ? (
                transactions.data?.data?.rows &&
                transactions.data?.data.rows.length > 0 ? (
                  <>
                    {transactions.data.data.rows.map((row) => {
                      return (
                        <div
                          key={row.id}
                          id={'transaction-' + row.id}
                          className={
                            'flex flex-col gap-2.5 rounded border bg-gray-50 p-3'
                          }
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
                          <div className="flex justify-between">
                            <P className="flex items-center gap-1">
                              <HiOutlineShieldCheck /> Payment Method:
                            </P>
                            <div className="flex items-center gap-1">
                              <P className="">
                                {row.wallet_id
                                  ? 'Wallet'
                                  : row.card_number
                                  ? 'SeaLabs Pay'
                                  : ''}
                              </P>
                              <Chip type="white" className="border">
                                {row.card_number ?? row.wallet_id}
                              </Chip>
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-2.5">
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
                            <div className="flex items-center gap-2.5">
                              <Button
                                size="sm"
                                buttonType="primary"
                                onClick={() => {
                                  if (
                                    userWallet.data?.data &&
                                    userSLP.data?.data
                                  ) {
                                    modal.edit({
                                      title: 'Choose Payment Option',
                                      content: (
                                        <PaymentOption
                                          transaction={row}
                                          userWallet={userWallet.data?.data}
                                          userSLP={userSLP.data.data}
                                        />
                                      ),
                                      closeButton: false,
                                    })
                                  }
                                }}
                              >
                                Pay Now
                              </Button>
                              <Button
                                size="sm"
                                buttonType="primary"
                                outlined
                                onClick={() => {
                                  modal.info({
                                    title: 'Payment Detail',
                                    content: (
                                      <TransactionDetailModal tx={row} />
                                    ),
                                  })
                                }}
                              >
                                Detail
                              </Button>
                            </div>
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
              ) : orders.data?.data?.rows &&
                orders.data?.data.rows.length > 0 ? (
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
            {orders.data?.data?.rows && transactions.data?.data?.rows ? (
              <div className="mt-4 flex h-[8rem] w-full justify-center">
                <PaginationNav
                  page={page}
                  total={
                    qryStatus !== 1
                      ? orders.data?.data?.total_pages
                      : transactions.data?.data?.total_pages
                  }
                  onChange={(p) => setPage(p)}
                />
              </div>
            ) : (
              <></>
            )}
          </div>
        </>
      </ProfileLayout>
    </>
  )
}

export default TransactionHistory
