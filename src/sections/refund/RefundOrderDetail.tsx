import React from 'react'
import { toast } from 'react-hot-toast'
import { HiInformationCircle } from 'react-icons/hi'

import { useRouter } from 'next/router'

import { useGetUserWallet } from '@/api/user/wallet'
import { A, Button, Divider, H3, P } from '@/components'
import formatMoney from '@/helper/formatMoney'
import { useModal } from '@/hooks'
import ConfirmationModal from '@/layout/template/confirmation/confirmationModal'
import type { AddressDetail } from '@/types/api/address'
import type { BuyerOrder } from '@/types/api/order'
import type { ConversationRefundThread } from '@/types/api/refund'

import { Menu, Transition } from '@headlessui/react'

const OrderDetailCard: React.FC<
  LoadingDataWrapper<BuyerOrder> & {
    isReview?: boolean
    refundThreadData?: ConversationRefundThread
    handleActionAccept?: () => void
    handleActionRejected?: () => void
    isSeller?: boolean
  }
> = ({
  data,
  handleActionAccept,
  handleActionRejected,
  refundThreadData,
  isSeller,
}) => {
  const order = data
  const DAY = 24 * 60 * 60 * 1000

  const modal = useModal()
  const router = useRouter()
  const userWallet = useGetUserWallet()

  return (
    <>
      <Menu as="div" className="relative text-left">
        <div className="origin-top-right py-4">
          <div className="flex justify-between">
            {isSeller ? (
              <div className="flex gap-3 ">
                <Button
                  buttonType="success"
                  className="text-white"
                  onClick={handleActionAccept}
                  disabled={
                    refundThreadData?.refund_data.accepted_at.Valid ||
                    refundThreadData?.refund_data.rejected_at.Valid
                  }
                >
                  Accepted
                </Button>
                <Button
                  buttonType="error"
                  className="text-white"
                  onClick={handleActionRejected}
                  disabled={
                    refundThreadData?.refund_data.accepted_at.Valid ||
                    refundThreadData?.refund_data.rejected_at.Valid
                  }
                >
                  Rejected
                </Button>
              </div>
            ) : (
              <div>
                {refundThreadData?.refund_data.rejected_at.Valid &&
                Date.now() -
                  Date.parse(refundThreadData?.refund_data.rejected_at.Time) >=
                  DAY ? (
                  <>
                    <P className="text-xs opacity-50">
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
                                          userWallet.data.data.active_date.Time
                                        )
                                      ) < new Date()
                                    ) {
                                      router.push(
                                        '/order/complaint?id=' + order?.order_id
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
                  <></>
                )}
              </div>
            )}
            <div className="flex max-w-full items-end justify-end">
              <div className="flex items-start bg-red-300"></div>
              <Menu.Button className="inline-flex max-w-full justify-center rounded-md px-4 py-2 text-sm font-medium text-gray-700  hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100">
                <div className="mr-2 text-center align-middle">Order Items</div>
                <svg
                  className="-mr-1 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clip-rule="evenodd"
                  />
                </svg>
              </Menu.Button>
            </div>
          </div>
          <Transition
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items
              className={
                'mt-5 flex w-full origin-top-right flex-col gap-3 rounded border bg-white p-4  ring-1 ring-black ring-opacity-5 focus:outline-none'
              }
            >
              {!order ? (
                <div className="flex gap-2.5">
                  <div className="h-[100px] w-[100px] animate-pulse rounded bg-base-300" />
                  <div className="flex-1 px-2">
                    <div className="h-[1.5rem] w-[80%] animate-pulse rounded bg-base-300" />
                    <div className="h-[1.5rem] w-[70%] animate-pulse rounded bg-base-300" />
                  </div>
                </div>
              ) : (
                order.detail.map((detail, index) => {
                  return (
                    <Menu.Item key={index}>
                      <div className="flex gap-2.5">
                        <div>
                          <img
                            alt={detail.product_title}
                            src={detail.product_detail_url}
                            width={100}
                            height={100}
                          />
                        </div>
                        <div className="flex-1 px-2">
                          <P className="font-semibold">
                            {detail.product_title}
                          </P>
                          <P className="text-sm opacity-60">
                            Quantity: {detail.order_quantity}
                          </P>
                        </div>
                        <div className="px-2 text-right">
                          <P className="text-xs opacity-60">
                            Rp
                            {formatMoney(
                              detail.order_item_price / detail.order_quantity
                            )}{' '}
                            / pcs
                          </P>
                          <P className="font-semibold">
                            Rp{formatMoney(detail.order_total_price)}
                          </P>
                        </div>
                      </div>
                    </Menu.Item>
                  )
                })
              )}

              <Divider />
              <div className={'flex items-center justify-between'}>
                {order ? (
                  <>
                    <P className="opacity-60">Total:</P>
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
                                {formatMoney(
                                  order.delivery_fee + order.total_price
                                )}
                              </P>
                            </div>
                          </div>
                        </ul>
                      </div>
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </div>
            </Menu.Items>
          </Transition>
        </div>
      </Menu>
    </>
  )
}

const AddressDetailCard: React.FC<{
  name: string
  address: AddressDetail
  phone: number | null
  isSeller?: boolean
}> = ({ name, address, phone, isSeller }) => {
  return (
    <div>
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

const RefundOrderDetail: React.FC<{
  order: BuyerOrder
  refundThreadData?: ConversationRefundThread
  handleActionAccept?: () => void
  handleActionRejected?: () => void
  isSeller?: boolean
}> = ({
  order,
  handleActionAccept,
  handleActionRejected,
  refundThreadData,
  isSeller,
}) => {
  return (
    <div>
      <div className="grid grid-cols-2 justify-center gap-4 rounded border p-4">
        <div className="flex flex-auto flex-col gap-6">
          <div className="flex-auto">
            <P className="text-sm">Resi Number</P>
            <P className="font-semibold">{order.resi_no ?? '-'}</P>
          </div>
          <div className="flex-auto">
            <P className="text-sm">Invoice</P>
            <P className="font-semibold">{order.invoice ?? '-'}</P>
          </div>
        </div>
        <div className="flex-auto">
          {order.seller_address ? (
            <AddressDetailCard
              name={order.shop_name}
              address={order.seller_address}
              phone={order.shop_phone_number}
              isSeller
            />
          ) : (
            <></>
          )}
        </div>
      </div>
      <OrderDetailCard
        data={order}
        isLoading={false}
        refundThreadData={refundThreadData}
        handleActionAccept={handleActionAccept}
        handleActionRejected={handleActionRejected}
        isSeller={isSeller}
      />
    </div>
  )
}

export default RefundOrderDetail
