import { useEffect, useState } from 'react'
import type { MouseEvent } from 'react'
import { toast } from 'react-hot-toast'
import { HiArrowDown, HiArrowUp, HiInformationCircle } from 'react-icons/hi'

import Head from 'next/head'
import { useRouter } from 'next/router'

import { useSellerOrders, useWithdrawOrderBalance } from '@/api/seller/order'
import { useGetRefundThreadSeller } from '@/api/seller/refund'
import { Button, H2, P, PaginationNav } from '@/components'
import Table from '@/components/table'
import orderStatusData from '@/dummy/orderStatusData'
import cx from '@/helper/cx'
import formatMoney from '@/helper/formatMoney'
import { useModal } from '@/hooks'
import SellerPanelLayout from '@/layout/SellerPanelLayout'
import CancelDelivery from '@/sections/seller-panel/delivery-servise/CancelDelivery'
import ProcessDelivery from '@/sections/seller-panel/delivery-servise/ProcessDelivery'
import type { OrderData } from '@/types/api/order'
import type { APIResponse, PaginationData } from '@/types/api/response'

import type { AxiosError } from 'axios'
import moment from 'moment'

const CheckOrderRefund: React.FC<{ data?: OrderData }> = ({ data }) => {
  const router = useRouter()
  const getRefundThread = useGetRefundThreadSeller(data?.order_id)
  return (
    <>
      <Button
        size="sm"
        buttonType="ghost"
        outlined
        className="min-w-full text-gray-500"
        onClick={() => {
          router.push('/seller-panel/order/refund-thread?id=' + data?.order_id)
        }}
      >
        Refund Thread
      </Button>
      {data?.is_refund ? (
        <>
          {getRefundThread.data?.data?.refund_data.accepted_at.Valid ? (
            <div className="whitespace-pre-line">
              <P className="text-xs opacity-50">
                This File Complaint has been accepted at{' '}
                {moment(
                  getRefundThread.data?.data?.refund_data.accepted_at.Time
                )
                  .utcOffset(420)
                  .format('DD MMMM YYYY HH:mm:ss')
                  .toString()}
                {'.'}
                <P>please wait the system to process refund order.</P>
              </P>
            </div>
          ) : (
            <></>
          )}
        </>
      ) : (
        <>
          {getRefundThread.data?.data?.refund_data.rejected_at.Valid ? (
            <div className="whitespace-pre-line">
              <P className="text-xs opacity-50">
                File Complaint has been rejected at{' '}
                {moment(
                  getRefundThread.data?.data?.refund_data.rejected_at.Time
                )
                  .utcOffset(420)
                  .format('DD MMMM YYYY HH:mm:ss')
                  .toString()}
                {'.'}
                <P>please wait the system to process refund order.</P>
              </P>
            </div>
          ) : (
            <></>
          )}
        </>
      )}
    </>
  )
}

function ListOrderDeliveryService() {
  const router = useRouter()
  const [page, setPage] = useState<number>(1)
  const [orderStatusID, setOrderStatusID] = useState('')

  const [sortBy, setSortBy] = useState('created_at')
  const [sorts, setSorts] = useState('DESC')
  const sellerOrders = useSellerOrders(orderStatusID, '', page, sortBy, sorts)
  const withdrawOrderBalance = useWithdrawOrderBalance()
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

  useEffect(() => {
    if (withdrawOrderBalance.isSuccess) {
      toast.success('Withdraw balance success!')
    }
  }, [withdrawOrderBalance.isSuccess])

  useEffect(() => {
    if (withdrawOrderBalance.isError) {
      const errMsg = withdrawOrderBalance.failureReason as AxiosError<
        APIResponse<null>
      >
      toast.error(errMsg.response?.data.message as string)
    }
  }, [withdrawOrderBalance.isError])

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
            Status:
              orderStatusData.find((s) => s.id === `${data.order_status}`)
                ?.name ?? '',
            'Transaction Date': (
              <div>{moment(data.created_at).format('DD MMMM YYYY')}</div>
            ),
            Action: (
              <div className="flex w-fit flex-col gap-1">
                <Button
                  buttonType="primary"
                  outlined
                  size="sm"
                  className="rounded"
                  onClick={() => {
                    router.push({
                      pathname: '/seller-panel/order/' + data.order_id,
                    })
                  }}
                >
                  <HiInformationCircle /> Detail
                </Button>
                {data.order_status === 7 ? (
                  <>
                    <Button
                      onClick={() => {
                        withdrawOrderBalance.mutate(data.order_id)
                      }}
                      buttonType="primary"
                      size="sm"
                      className="rounded"
                      disabled={data.is_withdraw}
                    >
                      Withdraw Balance
                    </Button>
                  </>
                ) : data.order_status === 6 ? (
                  <div className="">
                    <CheckOrderRefund data={data} />
                  </div>
                ) : (
                  <></>
                )}
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
        <div className="flex items-baseline justify-between px-3 py-5 sm:px-0">
          <H2>Orders</H2>
        </div>

        <div className="mt-3 flex h-full flex-col rounded border bg-white p-6 ">
          <div className="flex flex-row gap-x-2">
            <div className="flex items-center gap-x-2 px-5">
              <P className="my-3  font-bold">Date</P>
              <button
                className={cx(
                  'flex aspect-square h-[1.5rem] items-center justify-center rounded-full border text-xs',
                  sorts === 'ASC' && sortBy === 'created_at'
                    ? 'bg-primary text-xs text-white'
                    : ''
                )}
                onClick={() => {
                  setSortBy('created_at')
                  setSorts('ASC')
                }}
              >
                <HiArrowUp />
              </button>
              <button
                className={cx(
                  'flex aspect-square h-[1.5rem] items-center justify-center rounded-full border text-xs',
                  sorts === 'DESC' && sortBy === 'created_at'
                    ? 'bg-primary text-xs text-white'
                    : ''
                )}
                onClick={() => {
                  setSortBy('created_at')
                  setSorts('DESC')
                }}
              >
                <HiArrowDown />
              </button>
            </div>
            <div className="flex items-center gap-x-2 px-5">
              <P className="my-3  font-bold">Withdraw</P>
              <button
                className={cx(
                  'flex aspect-square h-[1.5rem] items-center justify-center rounded-full border text-xs',
                  sorts === 'ASC' && sortBy === 'is_withdraw'
                    ? 'bg-primary text-xs text-white'
                    : ''
                )}
                onClick={() => {
                  setSortBy('is_withdraw')
                  setSorts('ASC')
                }}
              >
                <HiArrowUp />
              </button>
              <button
                className={cx(
                  'flex aspect-square h-[1.5rem] items-center justify-center rounded-full border text-xs',
                  sorts === 'DESC' && sortBy === 'is_withdraw'
                    ? 'bg-primary text-xs text-white'
                    : ''
                )}
                onClick={() => {
                  setSortBy('is_withdraw')
                  setSorts('DESC')
                }}
              >
                <HiArrowDown />
              </button>
            </div>
          </div>
          <div className="my-4 flex h-fit w-fit max-w-full space-x-10 overflow-x-auto overflow-y-hidden whitespace-nowrap border-b-[2px]">
            <button
              onClick={(e) => ChangeOrderStatusPage(e)}
              className={cx(
                'h-full border-b-[3px] transition-all',
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
                    'h-full whitespace-nowrap border-b-[3px] transition-all',
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
            ) : sellerOrders.data?.data ? (
              <Table
                data={formatSub(sellerOrders.data.data)}
                isLoading={false}
                empty={sellerOrders.data.data.rows?.length === 0}
              />
            ) : (
              <div>{'Error'}</div>
            )}
          </div>
          <div>
            {sellerOrders.data?.data ? (
              <div className="mt-4 flex h-[8rem] w-full justify-center">
                <PaginationNav
                  page={page}
                  total={sellerOrders.data?.data?.total_pages}
                  onChange={(p) => setPage(p)}
                />
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </SellerPanelLayout>
    </div>
  )
}

export default ListOrderDeliveryService
