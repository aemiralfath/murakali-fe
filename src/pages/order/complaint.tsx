import { useGetOrderByID } from '@/api/order'
import { useCreateRefund } from '@/api/user/refund'
import { Button, Chip, Divider, H1, H3, H4, P, TextArea } from '@/components'
import Uploader from '@/components/uploader'
import formatMoney from '@/helper/formatMoney'
import { useLoadingModal } from '@/hooks'
import MainLayout from '@/layout/MainLayout'
import type { AddressDetail } from '@/types/api/address'
import type { BuyerOrder } from '@/types/api/order'
import type { CreateRefundUserRequest } from '@/types/api/refund'
import type { APIResponse } from '@/types/api/response'
import type { AxiosError } from 'axios'
import moment from 'moment'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { HiInformationCircle } from 'react-icons/hi'

const OrderDetailCard: React.FC<
  LoadingDataWrapper<BuyerOrder> & {
    isReview?: boolean
  }
> = ({ isLoading, data }) => {
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
            <>
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
                  <P className="font-semibold">{detail.product_title}</P>
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
            </>
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

const OrderComplaint = () => {
  const router = useRouter()

  const setIsLoadingModal = useLoadingModal()
  const { id } = router.query
  const [orderID, setOrderID] = useState('')
  const [reasonPhoto, setReasonPhoto] = useState('')
  const [reasonText, setReasonText] = useState('')
  useEffect(() => {
    if (typeof id === 'string') {
      setOrderID(id)
    }
  }, [id])

  const order = useGetOrderByID(orderID)
  const createRefund = useCreateRefund()

  useEffect(() => {
    setIsLoadingModal(createRefund.isLoading)
  }, [createRefund.isLoading])
  useEffect(() => {
    if (createRefund.isSuccess) {
      order.refetch()
      if (order.data?.data) {
        toast.success('Submit Complaint order success')
        router.push('/profile/transaction-history')
      }
    }
  }, [createRefund.isSuccess])
  useEffect(() => {
    if (createRefund.isError) {
      const errmsg = createRefund.failureReason as AxiosError<APIResponse<null>>
      toast.error(errmsg.response?.data.message as string)
    }
  }, [createRefund.isError])

  const handleSubmit = () => {
    const req: CreateRefundUserRequest = {
      image: reasonPhoto,
      order_id: orderID,
      reason: reasonText,
    }
    createRefund.mutate(req)
  }

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
            <H1 className="text-primary">Order Refund</H1>
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
        <div className="mt-3 flex h-full w-full flex-col bg-white">
          {order.isLoading ? (
            <P className="flex w-full justify-center">Loading</P>
          ) : order.isSuccess ? (
            <>
              <div className="grid grid-cols-2 justify-center gap-4 rounded border p-4">
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
                  <AddressDetailCard
                    title="Sender"
                    name={order.data.data.shop_name}
                    address={order.data.data.seller_address}
                    phone={order.data.data.shop_phone_number}
                    isSeller
                  />
                </div>
                <div className="flex-auto"></div>
              </div>
              <div className="mt-5 flex flex-col gap-3 rounded border bg-white p-4">
                <OrderDetailCard
                  data={order.data.data}
                  isLoading={false}
                  isReview={order.data.data.order_status >= 7}
                />
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

              <div className="mt-3 flex h-full flex-col rounded border bg-white px-6 pt-6 pb-12 ">
                <div className="mt-6 flex gap-3">
                  <div className="w-[30%]">
                    <div className="flex items-center gap-3">
                      <H3>Photo</H3>

                      <Chip type={'gray'}>Required</Chip>
                    </div>
                    <P className="mt-2 max-w-[20rem] text-sm">
                      Use image formats .jpg, .jpeg, or .png,
                    </P>
                  </div>
                  <div className="flex gap-3">
                    <Uploader
                      id={'thumbnail'}
                      title={'Thumbnail Photo'}
                      size="lg"
                      onChange={(s) => setReasonPhoto(s)}
                      defaultImage={reasonPhoto}
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-between gap-3">
                  <div className="w-[30%]">
                    <div className="flex items-center gap-3">
                      <H4>Reason</H4>
                      <Chip type={'gray'}>Required</Chip>
                    </div>
                    <P className="mt-2 max-w-[20rem] text-sm">
                      descript reason for refund
                    </P>
                  </div>
                  <div className="-z-0 flex-1">
                    <TextArea
                      rows={4}
                      full
                      value={reasonText}
                      onChange={(e) => setReasonText(e.target.value)}
                      placeholder={`I received an inappropriate item (product, size, variant)`}
                    />
                  </div>
                </div>
              </div>
              <Divider />

              <div className="mt-6 flex justify-end gap-3">
                <Button onClick={handleSubmit} buttonType="primary">
                  Submit
                </Button>
                <Button
                  onClick={() => router.back()}
                  buttonType="primary"
                  outlined
                >
                  Cancel
                </Button>
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

export default OrderComplaint
