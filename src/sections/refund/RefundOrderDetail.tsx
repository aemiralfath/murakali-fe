import { Divider, H3, P } from '@/components'
import formatMoney from '@/helper/formatMoney'
import type { AddressDetail } from '@/types/api/address'
import type { BuyerOrder } from '@/types/api/order'
import { Menu, Transition } from '@headlessui/react'
import Image from 'next/image'
import React from 'react'
import { HiInformationCircle } from 'react-icons/hi'

const OrderDetailCard: React.FC<
  LoadingDataWrapper<BuyerOrder> & {
    isReview?: boolean
  }
> = ({ isLoading, data }) => {
  const order = data

  return (
    <>
      <Menu as="div" className="relative text-left">
        <div className="origin-top-right py-4">
          <div className="flex max-w-full items-end justify-end">
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
              {isLoading ? (
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
                          <Image
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
  phone: number
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
}> = ({ order }) => {
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
          <AddressDetailCard
            name={order.shop_name}
            address={order.seller_address}
            phone={order.shop_phone_number}
            isSeller
          />
        </div>
      </div>
      <OrderDetailCard data={order} isLoading={false} />
    </div>
  )
}

export default RefundOrderDetail
