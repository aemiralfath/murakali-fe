import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

import Head from 'next/head'
import { useRouter } from 'next/router'

import { useGetOrderByID } from '@/api/order'
import { useGetSellerInfoByUserID } from '@/api/seller'
import {
  useCreateRefundThreadSeller,
  useGetRefundThreadSeller,
  useRefundAccept,
  useRefundReject,
} from '@/api/seller/refund'
import { useGetUserProfile } from '@/api/user/profile'
import { Avatar, Button, Divider, H1, H4, P, TextArea } from '@/components'
import { useLoadingModal, useModal } from '@/hooks'
import MainLayout from '@/layout/MainLayout'
import ConfirmationModal from '@/layout/template/confirmation/confirmationModal'
import RefundOrderDetail from '@/sections/refund/RefundOrderDetail'
import RefundThreadSaction from '@/sections/refund/RefundThreadSaction'
import type { CreateRefundThreadRequest } from '@/types/api/refund'
import type { APIResponse } from '@/types/api/response'

import type { AxiosError } from 'axios'

function RefundThread() {
  const router = useRouter()

  const userProfile = useGetUserProfile()
  const sellerInfo = useGetSellerInfoByUserID(userProfile.data?.data?.id)

  const modal = useModal()
  const setLoadingModal = useLoadingModal()

  const { id } = router.query
  const [orderID, setOrderID] = useState('')
  const [text, setText] = useState('')
  useEffect(() => {
    if (typeof id === 'string') {
      setOrderID(id)
    }
  }, [id])

  const order = useGetOrderByID(orderID)
  const refundThreadData = useGetRefundThreadSeller(orderID)
  const createRefundThreadSeller = useCreateRefundThreadSeller()
  const refundAccept = useRefundAccept()
  const refundReject = useRefundReject()

  useEffect(() => {
    if (createRefundThreadSeller.isSuccess) {
      refundThreadData.refetch()
      setText('')
    }
  }, [createRefundThreadSeller.isSuccess])

  useEffect(() => {
    if (createRefundThreadSeller.isError) {
      const errmsg = createRefundThreadSeller.failureReason as AxiosError<
        APIResponse<null>
      >
      toast.error(errmsg.response?.data.message as string)
    }
  }, [createRefundThreadSeller.isError])

  useEffect(() => {
    setLoadingModal(refundAccept.isLoading)
  }, [refundAccept.isLoading])

  useEffect(() => {
    if (refundAccept.isSuccess) {
      refundThreadData.refetch()
      toast.success('Order Refund Accepted!')
    }
  }, [refundAccept.isSuccess])

  useEffect(() => {
    if (refundAccept.isError) {
      const errmsg = refundAccept.failureReason as AxiosError<APIResponse<null>>
      toast.error(errmsg.response?.data.message as string)
    }
  }, [refundAccept.isError])

  useEffect(() => {
    setLoadingModal(refundReject.isLoading)
  }, [refundReject.isLoading])

  useEffect(() => {
    if (refundReject.isSuccess) {
      refundThreadData.refetch()
      toast.success('Order Refund Rejected!')
    }
  }, [refundReject.isSuccess])

  useEffect(() => {
    if (refundReject.isError) {
      const errmsg = refundReject.failureReason as AxiosError<APIResponse<null>>
      toast.error(errmsg.response?.data.message as string)
    }
  }, [refundAccept.isError])

  const handleSubmit = () => {
    if (refundThreadData.data?.data) {
      const req: CreateRefundThreadRequest = {
        refund_id: refundThreadData.data.data.refund_data.id,
        text: text,
      }
      createRefundThreadSeller.mutate(req)
    }
  }

  const handleActionAccept = () => {
    modal.info({
      title: 'Confirmation',
      closeButton: false,
      content: (
        <ConfirmationModal
          msg={'Are you sure Want to Accept this Order to Refund?'}
          onConfirm={() => {
            if (refundThreadData.data?.data) {
              refundAccept.mutate(refundThreadData.data.data.refund_data.id)
            }
          }}
        />
      ),
    })
  }

  const handleActionRejected = () => {
    modal.info({
      title: 'Confirmation',
      closeButton: false,
      content: (
        <ConfirmationModal
          msg={'Are you sure Want to Reject this Order to Refund?'}
          onConfirm={() => {
            if (refundThreadData.data?.data) {
              refundReject.mutate(refundThreadData.data.data.refund_data.id)
            }
          }}
        />
      ),
    })
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
          ) : order.data?.data ? (
            <>
              <RefundOrderDetail
                order={order.data.data}
                refundThreadData={refundThreadData?.data?.data}
                handleActionAccept={handleActionAccept}
                handleActionRejected={handleActionRejected}
                isSeller={true}
              />
            </>
          ) : (
            <div>{'Error'}</div>
          )}
          {refundThreadData.isLoading ? (
            <div>loading</div>
          ) : refundThreadData.data?.data ? (
            <>
              <RefundThreadSaction
                refundThreadData={refundThreadData.data.data}
              />
            </>
          ) : (
            <></>
          )}
          <Divider />

          <div className="mt-5 flex flex-col gap-3 rounded border bg-white p-4">
            <div className="flex justify-between gap-3">
              <div className="w-[20%] min-w-[20%] border-r-4 border-green-500">
                <div className="flex h-full gap-3 align-top">
                  <div>
                    <Avatar url={userProfile.data?.data?.photo_url} size="lg" />
                  </div>
                  <div className="whitespace-pre-line">
                    <H4>{sellerInfo.data?.data?.name}</H4>
                  </div>
                </div>
              </div>
              <div className="flex w-full flex-col">
                <div className="-z-0 flex-1">
                  <TextArea
                    rows={2}
                    full
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={`Example: I received an inappropriate item (product, size, variant)`}
                  />
                </div>
                <div className="flex justify-between py-2">
                  <div>
                    <Button buttonType="secondary" onClick={handleSubmit}>
                      send
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  )
}

export default RefundThread
