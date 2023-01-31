import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

import Head from 'next/head'
import { useRouter } from 'next/router'

import { useGetOrderByID } from '@/api/order'
import { useGetUserProfile } from '@/api/user/profile'
import {
  useCreateRefundThreadUser,
  useGetRefundThread,
} from '@/api/user/refund'
import { Avatar, Button, Divider, H1, H4, P, TextArea } from '@/components'
import MainLayout from '@/layout/MainLayout'
import RefundOrderDetail from '@/sections/refund/RefundOrderDetail'
import RefundThreadSaction from '@/sections/refund/RefundThreadSaction'
import type { CreateRefundThreadRequest } from '@/types/api/refund'
import type { APIResponse } from '@/types/api/response'

import type { AxiosError } from 'axios'

function RefundThread() {
  const router = useRouter()

  const userProfile = useGetUserProfile()

  const { id } = router.query
  const [orderID, setOrderID] = useState('')
  const [text, setText] = useState('')
  useEffect(() => {
    if (typeof id === 'string') {
      setOrderID(id)
    }
  }, [id])

  const order = useGetOrderByID(orderID)
  const refundThreadData = useGetRefundThread(orderID)
  const createRefundThreadUser = useCreateRefundThreadUser()

  useEffect(() => {
    if (createRefundThreadUser.isSuccess) {
      refundThreadData.refetch()
      setText('')
    }
  }, [createRefundThreadUser.isSuccess])
  useEffect(() => {
    if (createRefundThreadUser.isError) {
      const errmsg = createRefundThreadUser.failureReason as AxiosError<
        APIResponse<null>
      >
      toast.error(errmsg.response?.data.message as string)
    }
  }, [createRefundThreadUser.isError])

  const handleSubmit = () => {
    if (refundThreadData.data?.data) {
      const req: CreateRefundThreadRequest = {
        refund_id: refundThreadData.data.data.refund_data.id,
        text: text,
      }
      createRefundThreadUser.mutate(req)
    }
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
              <RefundOrderDetail order={order.data.data} />
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
              <div className="w-[20%] min-w-[20%] border-r-4 border-blue-500">
                <div className="flex h-full gap-3 align-top">
                  <div>
                    <Avatar url={userProfile.data?.data?.photo_url} size="lg" />
                  </div>
                  <div>
                    <H4>{userProfile.data?.data?.user_name}</H4>
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
                <div className="py-2">
                  <Button buttonType="secondary" onClick={handleSubmit}>
                    send
                  </Button>
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
