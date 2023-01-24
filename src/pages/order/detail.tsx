import { useCompleteOrder, useGetOrderByID } from '@/api/order'
import { A, Button, Chip, Divider, H1, H3, P } from '@/components'
import { orderStatus } from '@/constants/status'
import formatMoney from '@/helper/formatMoney'
import { useLoadingModal, useModal } from '@/hooks'
import MainLayout from '@/layout/MainLayout'
import ConfirmationModal from '@/layout/template/confirmation/confirmationModal'
import type { AddressDetail } from '@/types/api/address'
import type { BuyerOrder } from '@/types/api/order'
import type { APIResponse } from '@/types/api/response'
import type { AxiosError } from 'axios'
import moment from 'moment'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { HiInformationCircle } from 'react-icons/hi'

const OrderDetailCard: React.FC<LoadingDataWrapper<BuyerOrder>> = ({
  isLoading,
  data,
}) => {
  const order = data

  return (
    <div className={'flex w-full flex-col gap-2.5 bg-white'}>
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
    </div>
  )
}

const AddressDetailCard: React.FC<{
  name: string
  title: string
  address: AddressDetail
  phone: number
  isSeller?: boolean
}> = ({ name, title, address, phone, isSeller }) => {
  return (
    <div>
      <P className="text-sm">{title}</P>
      <H3>{name}</H3>
      <P className="mt-1">
        {!isSeller ? (
          <>
            <span>{`${address.address_detail}, ${address.sub_district}, ${address.district}`}</span>
            <br />
          </>
        ) : (
          <></>
        )}
        {address.city}, {address.province}
        {!isSeller ? (
          <>
            <br />
            <span>{address.zip_code}</span>
          </>
        ) : (
          <></>
        )}
      </P>
      {phone ? <P className="text-sm">(+62) {phone}</P> : <></>}
    </div>
  )
}

const OrderDetail = () => {
  const modal = useModal()
  const router = useRouter()
  const setIsLoadingModal = useLoadingModal()
  const { id } = router.query
  const [orderID, setOrderID] = useState('')
  useEffect(() => {
    if (typeof id === 'string') {
      setOrderID(id)
    }
  }, [id])

  const order = useGetOrderByID(orderID)
  const completeOrder = useCompleteOrder()
  useEffect(() => {
    setIsLoadingModal(completeOrder.isLoading)
  }, [completeOrder.isLoading])
  useEffect(() => {
    if (completeOrder.isSuccess) {
      order.refetch()
      toast.success('Order completed!')
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
    <>
      <Head>
        <title>Order | Murakali</title>
        <meta
          name="description"
          content="Order | Murakali E-Commerce Application"
        />
      </Head>
      <MainLayout>
        {order.data?.data ? (
          <div className="flex items-baseline justify-between gap-2">
            <H1 className="text-primary">Order Detail</H1>
            <P className="opacity-60">
              Created at{' '}
              {moment(order.data.data.created_at).format('DD MMMM YYYY')}
            </P>
          </div>
        ) : order.isLoading ? (
          <div className="h-[1rem] w-[8rem] animate-pulse rounded bg-base-300" />
        ) : (
          <></>
        )}
        <Divider />
        <ul className="steps w-full min-w-full py-5">
          {order.data?.data ? (
            orderStatus
              .slice(1, orderStatus.length - 2)
              .map((status, index) => {
                const idx = index + 1
                // TODO: handle on cancel
                return (
                  <li
                    key={idx}
                    data-content={
                      idx <= order.data.data.order_status ? '✓' : '●'
                    }
                    className={
                      idx <= order.data.data.order_status
                        ? 'step-primary step'
                        : 'step'
                    }
                  >
                    {status}
                  </li>
                )
              })
          ) : (
            <></>
          )}
        </ul>
        <div className="mt-3 flex h-full w-full flex-col bg-white">
          {order.isLoading ? (
            <P className="flex w-full justify-center">Loading</P>
          ) : order.isSuccess ? (
            <>
              <div className="grid grid-cols-4 justify-center gap-4 rounded border p-4">
                <div className="flex-auto">
                  <P className="text-sm">Shop Name</P>
                  <A
                    className="font-semibold"
                    onClick={() => {
                      router.push('/seller/' + order.data.data.shop_id)
                    }}
                  >
                    {order.data.data.shop_name}
                  </A>
                </div>
                <div className="flex flex-auto flex-col gap-6">
                  <div className="flex-auto">
                    <P className="text-sm">Resi Number</P>
                    <P className="font-semibold">
                      {order.data.data.resi_no ?? '-'}
                    </P>
                  </div>
                  <div className="flex-auto">
                    <P className="text-sm">Invoice</P>
                    <P className="font-semibold">
                      {order.data.data.invoice ?? '-'}
                    </P>
                  </div>
                </div>
                <div className="flex-auto">
                  <P className="text-sm">Delivery</P>
                  <P className="font-semibold">
                    {order.data.data.courier_name}
                  </P>
                  <P className="">{order.data.data.courier_description}</P>
                  <P className="mt-1 text-sm opacity-60">
                    ETD {order.data.data.courier_etd.replace(/\D/g, '')} Days
                  </P>
                </div>
                <div className="flex-auto">
                  <P className="mb-1 text-sm">Status</P>
                  <Chip type="gray">
                    {orderStatus[order.data.data.order_status]}
                  </Chip>
                  {order.data.data.order_status === 5 ? (
                    <>
                      <div className="indicator mt-4">
                        <span className="badge-error badge indicator-item"></span>
                        <Button
                          buttonType="primary"
                          onClick={() => {
                            modal.info({
                              title: 'Confirmation',
                              closeButton: false,
                              content: (
                                <ConfirmationModal
                                  msg={
                                    'Do you really want to complete this order?'
                                  }
                                  onConfirm={() => {
                                    completeOrder.mutate({
                                      order_id: order.data.data.order_id,
                                    })
                                  }}
                                />
                              ),
                            })
                          }}
                        >
                          Complete Order
                        </Button>
                      </div>
                      <div className="mt-2 flex items-baseline gap-1">
                        <P className="text-xs opacity-50">Or</P>
                        <A
                          className="text-xs opacity-50 hover:opacity-100"
                          underline
                        >
                          File a Complaint
                        </A>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </div>

              <div className=" mt-5 grid h-full w-full max-w-full grid-cols-2 rounded border bg-white p-6">
                <AddressDetailCard
                  title="Sender"
                  name={order.data.data.shop_name}
                  address={order.data.data.seller_address}
                  phone={order.data.data.shop_phone_number}
                  isSeller
                />
                <AddressDetailCard
                  title="Receiver"
                  name={order.data.data.buyer_username}
                  address={order.data.data.buyer_address}
                  phone={order.data.data.buyer_phone_number}
                />
              </div>
              <div className="mt-5 flex flex-col gap-3 rounded border bg-white p-4">
                <OrderDetailCard data={order.data.data} isLoading={false} />
                <Divider />
                <div className={'flex items-center justify-between'}>
                  <>
                    <P className="opacity-60">Total:</P>
                    <div className="flex items-center gap-2">
                      <P className="font-semibold">
                        Rp
                        {formatMoney(
                          order.data.data.total_price +
                            order.data.data.delivery_fee
                        )}
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
                                {formatMoney(order.data.data.total_price)}
                              </P>
                            </div>
                            <div className="flex items-center justify-between">
                              <P className="text-sm">Delivery Fee</P>
                              <P className="text-sm">
                                Rp
                                {formatMoney(order.data.data.delivery_fee)}
                              </P>
                            </div>
                            <Divider />
                            <div className="flex items-center justify-between">
                              <P className="text-sm">Total</P>
                              <P className="text-sm font-medium">
                                Rp
                                {formatMoney(
                                  order.data.data.delivery_fee +
                                    order.data.data.total_price
                                )}
                              </P>
                            </div>
                          </div>
                        </ul>
                      </div>
                    </div>
                  </>
                </div>
              </div>
            </>
          ) : (
            <div>{'Error'}</div>
          )}
        </div>
      </MainLayout>
    </>
  )
}

export default OrderDetail
