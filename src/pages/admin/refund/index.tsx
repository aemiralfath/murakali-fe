import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { HiArrowDown, HiArrowUp } from 'react-icons/hi'

import Head from 'next/head'

import { useAdminRefund, useConfirmRefundAdmin } from '@/api/admin/refund'
import { Button, Chip, H2, P, PaginationNav } from '@/components'
import Table from '@/components/table'
import cx from '@/helper/cx'
import formatMoney from '@/helper/formatMoney'
import AdminPanelLayout from '@/layout/AdminPanelLayout'
import type { RefundOrderData } from '@/types/api/refund'
import type { APIResponse, PaginationData } from '@/types/api/response'

import type { AxiosError } from 'axios'
import moment from 'moment'

function RefundAdmin() {
  const [sort, setSort] = useState('DESC')
  const [page, setPage] = useState<number>(1)
  const adminRefund = useAdminRefund(page, sort)
  const confirmRefund = useConfirmRefundAdmin()

  useEffect(() => {
    if (confirmRefund.isSuccess) {
      toast.success('Successfully confirm refund')
    }
  }, [confirmRefund.isSuccess])

  useEffect(() => {
    if (confirmRefund.isError) {
      const errMsg = confirmRefund.failureReason as AxiosError<
        APIResponse<null>
      >
      toast.error(errMsg.response?.data.message as string)
    }
  }, [confirmRefund.isError])

  const formatSub = (pagination?: PaginationData<RefundOrderData>) => {
    if (pagination) {
      if (pagination.rows?.length) {
        return pagination.rows.map((data) => {
          return {
            Date: (
              <div>
                {moment(data.accepted_at.Time).format(
                  'dddd, DD MMM YYYY  HH:mm'
                )}
              </div>
            ),
            Order: <div>{data.order_id}</div>,
            Reason: <div>{data.reason}</div>,
            Refund: <div>Rp. {formatMoney(data.order.total_price)}</div>,
            Status: (
              <div>
                {data.is_seller_refund ? (
                  <Chip type="gray"> Seller Refund</Chip>
                ) : (
                  <Chip type="gray"> Buyer Refund</Chip>
                )}
              </div>
            ),
            Action: (
              <div className="flex w-fit flex-col gap-1">
                <Button
                  buttonType="primary"
                  outlined
                  onClick={() => {
                    confirmRefund.mutate(data.id)
                  }}
                >
                  Confirm
                </Button>
              </div>
            ),
          }
        })
      }
    }
    return [
      {
        Date: '',
        Order: '',
        Reason: '',
        Refund: '',
        Status: '',
      },
    ]
  }

  return (
    <div>
      <Head>
        <title>Admin | Murakali</title>
        <meta name="admin" content="Admin | Murakali E-Commerce Application" />
      </Head>
      <AdminPanelLayout selectedPage="refund">
        <div className="flex w-full items-center justify-between">
          <H2>Refund List</H2>
        </div>
        <div className="mt-3 flex h-full w-full flex-col rounded border bg-white p-6 ">
          <div className="flex items-center gap-x-2 px-5">
            <P className="my-3  font-bold">Sort</P>
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

          <div className="max-w-full overflow-auto">
            {adminRefund.isLoading ? (
              <Table data={formatSub()} isLoading />
            ) : adminRefund.isSuccess ? (
              <Table
                data={formatSub(adminRefund.data?.data)}
                isLoading={false}
                empty={adminRefund.data?.data?.rows?.length === 0}
              />
            ) : (
              <div>{'Error'}</div>
            )}
          </div>
          <div>
            {adminRefund.data?.data ? (
              <div className="mt-4 flex h-[8rem] w-full justify-center">
                <PaginationNav
                  page={page}
                  total={adminRefund.data.data.total_pages}
                  onChange={(p) => setPage(p)}
                />
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </AdminPanelLayout>
    </div>
  )
}

export default RefundAdmin
