import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import {
  HiCheck,
  HiInboxIn,
  HiInformationCircle,
  HiMinus,
  HiPlus,
  HiTrash,
} from 'react-icons/hi'

import Head from 'next/head'
import { useRouter } from 'next/router'

import { useCompleteOrder, useGetOrderByID, useReceiveOrder } from '@/api/order'
import {
  useCreateProductReview,
  useDeleteProductReview,
  useGetReviewByUserID,
} from '@/api/product/review'
import { useGetUserProfile } from '@/api/user/profile'
import { useGetRefundThread } from '@/api/user/refund'
import { useGetUserWallet } from '@/api/user/wallet'
import {
  A,
  Button,
  Chip,
  Divider,
  H1,
  H3,
  NumberInput,
  P,
  RatingStars,
  TextArea,
} from '@/components'
import Uploader from '@/components/uploader'
import { orderStatus } from '@/constants/status'
import cx from '@/helper/cx'
import formatMoney from '@/helper/formatMoney'
import { useLoadingModal, useModal } from '@/hooks'
import MainLayout from '@/layout/MainLayout'
import ConfirmationModal from '@/layout/template/confirmation/confirmationModal'
import { ReviewCard } from '@/sections/productdetail/ProductReview'
import type { AddressDetail } from '@/types/api/address'
import type { BuyerOrder, BuyerOrderDetail } from '@/types/api/order'
import type { APIResponse } from '@/types/api/response'
import type { ProductReview } from '@/types/api/review'

import type { AxiosError } from 'axios'
import moment from 'moment'

const OrderDetailCardSection: React.FC<{
  detail: BuyerOrderDetail
  userId?: string
  isReview?: boolean
}> = ({ detail, userId, isReview }) => {
  const gotReview = useGetReviewByUserID(
    detail.product_id,
    userId,
    Boolean(userId) && isReview
  )
  const createReview = useCreateProductReview()
  const deleteReview = useDeleteProductReview()

  const modal = useModal()
  const setLoadingModal = useLoadingModal()

  const [review, setReview] = useState<ProductReview>()
  const [open, setOpen] = useState(false)

  const [star, setStar] = useState(5)
  const [reviewImage, setReviewImage] = useState<string>()
  const [comment, setComment] = useState<string>()

  useEffect(() => {
    if (gotReview.data?.data) {
      if (gotReview.data.data.rows.length > 0) {
        setReview(gotReview.data.data.rows[0])
      }
    }
  }, [gotReview.isSuccess])

  useEffect(() => {
    if (createReview.isSuccess) {
      gotReview.refetch()
      toast.success('Review created!')
    }
  }, [createReview.isSuccess])

  useEffect(() => {
    if (createReview.isError) {
      const errmsg = createReview.failureReason as AxiosError<APIResponse<null>>
      toast.error(errmsg.response?.data.message as string)
    }
  }, [createReview.isError])

  useEffect(() => {
    setLoadingModal(deleteReview.isLoading)
  }, [deleteReview.isLoading])

  useEffect(() => {
    if (deleteReview.isSuccess) {
      gotReview.refetch()
      toast.success('Review deleted!')
      setReview(undefined)
    }
  }, [deleteReview.isSuccess])

  useEffect(() => {
    if (deleteReview.isError) {
      const errmsg = deleteReview.failureReason as AxiosError<APIResponse<null>>
      toast.error(errmsg.response?.data.message as string)
    }
  }, [deleteReview.isError])

  const handleDeleteReview = () => {
    modal.error({
      title: 'Confirmation',
      closeButton: false,
      content: (
        <ConfirmationModal
          msg="Do you want to delete this product review?"
          onConfirm={() => {
            if (review) {
              deleteReview.mutate(review.id)
            }
          }}
        />
      ),
    })
  }

  return (
    <div className="flex flex-wrap gap-2.5">
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
        <P className="text-sm opacity-60">Quantity: {detail.order_quantity}</P>
        {isReview ? (
          <div className="mt-2" id="review">
            {review ? (
              <Button
                buttonType="gray"
                className="text-white"
                size="xs"
                onClick={() => {
                  modal.info({
                    title: 'Product Review',
                    content: (
                      <div className="flex flex-col gap-2">
                        <ReviewCard item={review} />
                        <A
                          className="flex items-center gap-2 text-sm opacity-60"
                          onClick={handleDeleteReview}
                        >
                          <HiTrash /> Delete review
                        </A>
                      </div>
                    ),
                  })
                }}
              >
                See Review
              </Button>
            ) : (
              <div
                className={cx(
                  open ? 'rounded bg-gray-50 p-2 transition-all' : ''
                )}
              >
                <Button
                  buttonType="gray"
                  className="text-white"
                  outlined
                  size="xs"
                  onClick={() => {
                    setOpen(!open)
                  }}
                >
                  {open ? <HiMinus /> : <HiPlus />} Add Review
                </Button>
                {open ? (
                  <div className="flex gap-2">
                    <div className="mt-2 flex flex-1 flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <RatingStars rating={star} size={'lg'} />
                        <NumberInput
                          setValue={setStar}
                          maxValue={5}
                          min={1}
                          value={star}
                        />
                      </div>
                      <div className="flex justify-start gap-3 p-2">
                        <div>
                          <Uploader
                            id={'review-photo'}
                            title={'Photo'}
                            size="md"
                            onChange={(s) => setReviewImage(s)}
                          />
                        </div>
                        <div className="flex-1">
                          <TextArea
                            label="Comment"
                            placeholder="Your tought about the product ..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            errorMsg={
                              typeof comment === 'string' &&
                              comment.length > 150
                                ? `${comment.length}/160`
                                : undefined
                            }
                          />
                          <div className="mt-2 flex justify-end gap-2">
                            <Button
                              size="sm"
                              buttonType="primary"
                              outlined
                              onClick={() => {
                                setOpen(false)
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              buttonType="primary"
                              isLoading={createReview.isLoading}
                              onClick={() => {
                                if (
                                  typeof comment === 'string'
                                    ? comment?.length <= 160
                                    : true
                                ) {
                                  createReview.mutate({
                                    product_id: detail.product_id,
                                    rating: star,
                                    comment: comment,
                                    photo_url: reviewImage,
                                  })
                                } else {
                                  toast.error(
                                    'Comment must be 160 character or less'
                                  )
                                }
                              }}
                            >
                              Add Review
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            )}
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className="px-2 text-right">
        <P className="text-xs opacity-60">
          Rp
          {formatMoney(detail.order_item_price / detail.order_quantity)} / pcs
        </P>
        <P className="font-semibold">
          Rp{formatMoney(detail.order_total_price)}
        </P>
      </div>
    </div>
  )
}

const OrderDetailCard: React.FC<
  LoadingDataWrapper<BuyerOrder> & {
    isReview?: boolean
  }
> = ({ isLoading, data, isReview }) => {
  const order = data
  const userProfile = useGetUserProfile()

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
      ) : order ? (
        order.detail.map((detail) => {
          return (
            <OrderDetailCardSection
              detail={detail}
              key={`${detail.product_detail_id}-${order?.order_id}`}
              userId={userProfile.data?.data?.id}
              isReview={isReview}
            />
          )
        })
      ) : (
        <></>
      )}
    </div>
  )
}

const AddressDetailCard: React.FC<{
  name: string
  title: string
  address: AddressDetail | null
  phone: number | null
  isSeller?: boolean
}> = ({ name, title, address, phone, isSeller }) => {
  return (
    <div>
      <P className="text-sm">{title}</P>
      <H3>{name}</H3>
      <P className="mt-1">
        {!isSeller && address ? (
          <>
            <span>{`${address.address_detail}, ${address.sub_district}, ${address.district}`}</span>
            <br />
          </>
        ) : (
          <></>
        )}
        {address ? `${address.city}, ${address.province}` : ''}
        {!isSeller && address ? (
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
  const getRefundThread = useGetRefundThread(order.data?.data?.order_id)
  const receiveOrder = useReceiveOrder()
  const completeOrder = useCompleteOrder()

  const userWallet = useGetUserWallet()
  useEffect(() => {
    setIsLoadingModal(receiveOrder.isLoading)
  }, [receiveOrder.isLoading])
  useEffect(() => {
    if (receiveOrder.isSuccess) {
      order.refetch()
      toast.success('Confirmation received!')
    }
  }, [receiveOrder.isSuccess])
  useEffect(() => {
    if (receiveOrder.isError) {
      const errmsg = receiveOrder.failureReason as AxiosError<APIResponse<null>>
      toast.error(errmsg.response?.data.message as string)
    }
  }, [receiveOrder.isError])

  useEffect(() => {
    setIsLoadingModal(completeOrder.isLoading)
  }, [completeOrder.isLoading])
  useEffect(() => {
    if (completeOrder.isSuccess) {
      order.refetch()
      if (order.data?.data) {
        toast.success(
          `Rp${formatMoney(
            order.data.data.total_price
          )} has been sent to Seller!`
        )
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
          <div className="flex flex-wrap items-baseline justify-between gap-2">
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
        <div className="flex justify-center ">
          <ul className="steps steps-vertical w-fit min-w-fit py-5 lg:steps-horizontal ">
            {order.data?.data ? (
              orderStatus
                .slice(1, orderStatus.length - 2)
                .map((status, index) => {
                  const idx = index + 1
                  if (order.data?.data) {
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
                        <span className="mx-1 text-sm line-clamp-2">
                          {status}
                        </span>
                      </li>
                    )
                  }

                  return <li key={idx}></li>
                })
            ) : (
              <></>
            )}
          </ul>
        </div>
        <div className="mt-3 flex h-full w-full flex-col bg-white">
          {order.isLoading ? (
            <P className="flex w-full justify-center">Loading</P>
          ) : order.data?.data ? (
            <>
              <div className="grid grid-cols-1 justify-center gap-4 rounded border p-4 lg:grid-cols-4">
                <div className="flex-auto">
                  <P className="text-sm">Shop Name</P>
                  <A
                    className="font-semibold"
                    onClick={() => {
                      if (order.data?.data) {
                        router.push('/seller/' + order.data.data.shop_id)
                      }
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
                  <Chip type="gray" className="mb-2">
                    {orderStatus[order.data.data.order_status]}
                  </Chip>
                  {order.data.data.order_status === 5 ? (
                    <>
                      <Button
                        buttonType="primary"
                        onClick={() => {
                          modal.info({
                            title: 'Confirmation',
                            closeButton: false,
                            content: (
                              <ConfirmationModal
                                msg={'Have you receive these product(s)?'}
                                onConfirm={() => {
                                  if (order.data?.data) {
                                    receiveOrder.mutate({
                                      order_id: order.data.data.order_id,
                                    })
                                  }
                                }}
                              />
                            ),
                          })
                        }}
                      >
                        <HiInboxIn /> Confirm Received
                      </Button>
                    </>
                  ) : (
                    <></>
                  )}
                  {order.data.data.order_status === 6 ? (
                    <>
                      {order.data.data.is_refund ? (
                        <>
                          <Button
                            buttonType="gray"
                            outlined
                            isLoading={receiveOrder.isLoading}
                            className="text-white"
                            onClick={() => {
                              router.push(
                                '/order/refund-thread?id=' +
                                  order?.data?.data?.order_id
                              )
                            }}
                          >
                            Refund Thread
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            buttonType="primary"
                            onClick={() => {
                              modal.info({
                                title: 'Confirmation',
                                closeButton: false,
                                content: (
                                  <ConfirmationModal
                                    msg={`Complete Order & Release Rp${formatMoney(
                                      order.data?.data?.total_price ?? 0
                                    )} to the Seller?`}
                                    onConfirm={() => {
                                      if (order.data?.data) {
                                        completeOrder.mutate({
                                          order_id: order.data.data.order_id,
                                        })
                                      }
                                    }}
                                  />
                                ),
                              })
                            }}
                          >
                            <HiCheck /> Complete Order
                          </Button>
                        </>
                      )}
                      <div className="mt-2 flex items-baseline gap-1">
                        {getRefundThread.data?.data?.refund_data.rejected_at
                          .Valid ? (
                          <>
                            <P className="text-xs opacity-50">
                              your previous File Complaint Form has been
                              rejected at{' '}
                              {moment(
                                getRefundThread.data?.data?.refund_data
                                  .rejected_at.Time
                              )
                                .utcOffset(420)
                                .format('DD MMMM YYYY HH:mm:ss')
                                .toString()}
                              {'.'}
                              <P>
                                you can create new File Complaint to refund
                                before 24 hours rejected.
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
                                              userWallet?.data?.data
                                                ?.active_date.Valid === true &&
                                              new Date(
                                                Date.parse(
                                                  userWallet.data.data
                                                    .active_date.Time
                                                )
                                              ) < new Date()
                                            ) {
                                              router.push(
                                                '/order/complaint?id=' +
                                                  order?.data?.data?.order_id
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
                            {getRefundThread.data?.data?.refund_data.accepted_at
                              .Valid ? (
                              <>
                                <P className="text-xs opacity-50">
                                  your File Complaint has been accepted at{' '}
                                  {moment(
                                    getRefundThread.data?.data?.refund_data
                                      .accepted_at.Time
                                  )
                                    .utcOffset(420)
                                    .format('DD MMMM YYYY HH:mm:ss')
                                    .toString()}
                                  {'.'}
                                  <P>
                                    please wait the system to process refund
                                    order.
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
                                              userWallet?.data?.data
                                                ?.active_date.Valid === true &&
                                              new Date(
                                                Date.parse(
                                                  userWallet.data.data
                                                    .active_date.Time
                                                )
                                              ) < new Date()
                                            ) {
                                              router.push(
                                                '/order/complaint?id=' +
                                                  order?.data?.data?.order_id
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
                          </>
                        )}
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </div>

              <div className=" mt-5 grid h-full w-full max-w-full grid-cols-1 gap-y-5 rounded border bg-white p-6 md:grid-cols-2">
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
                <OrderDetailCard
                  data={order.data.data}
                  isLoading={false}
                  isReview={order.data.data.order_status >= 7}
                />
                <Divider />
                <div className={'flex flex-wrap items-center justify-between'}>
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
