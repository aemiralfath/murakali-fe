import React, { useEffect, useState } from 'react'
import type { MouseEvent } from 'react'
import toast from 'react-hot-toast'
import { HiTrash, HiArrowDown, HiArrowUp } from 'react-icons/hi'
import {
  HiPlus,
  HiPencilAlt,
  HiDocumentDuplicate,
  HiInformationCircle,
} from 'react-icons/hi'
import { useDispatch } from 'react-redux'

import Head from 'next/head'
import { useRouter } from 'next/router'

import {
  useDeleteSellerVouchers,
  useSellerVouchers,
} from '@/api/seller/voucher'
import { Button, Chip, H2, P, PaginationNav } from '@/components'
import Table from '@/components/table'
import voucherData from '@/dummy/voucherData'
import cx from '@/helper/cx'
import formatMoney from '@/helper/formatMoney'
import { useModal } from '@/hooks'
import SellerPanelLayout from '@/layout/SellerPanelLayout'
import { closeModal } from '@/redux/reducer/modalReducer'
import type { APIResponse, PaginationData } from '@/types/api/response'
import type { VoucherData } from '@/types/api/voucher'

import type { AxiosError } from 'axios'
import moment from 'moment'

function Vouchers() {
  const router = useRouter()
  const [voucherStatus, setVoucherStatus] = useState('')
  const [sorts, setSorts] = useState('DESC')
  const [page, setPage] = useState<number>(1)
  const sellerVoucher = useSellerVouchers(voucherStatus, page, sorts)

  const modal = useModal()
  const dispatch = useDispatch()
  const deleteSellerVoucher = useDeleteSellerVouchers()

  const ChangeVoucherStatusPage = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    setVoucherStatus(e.currentTarget.value)
  }

  function deleteVoucher(id: string) {
    deleteSellerVoucher.mutate(id)
  }

  useEffect(() => {
    if (deleteSellerVoucher.isSuccess) {
      toast.success('Successfully delete voucher')
      dispatch(closeModal())
    }
  }, [deleteSellerVoucher.isSuccess])

  useEffect(() => {
    if (deleteSellerVoucher.isError) {
      const errmsg = deleteSellerVoucher.failureReason as AxiosError<
        APIResponse<null>
      >
      toast.error(errmsg.response?.data.message as string)
    }
  }, [deleteSellerVoucher.isError])
  const formatSub = (pagination?: PaginationData<VoucherData>) => {
    if (pagination) {
      if (pagination.rows?.length) {
        return pagination.rows.map((data) => {
          return {
            'Created Date': (
              <div>
                {moment(data.created_at).format('dddd, DD MMM YYYY  HH:mm')}
              </div>
            ),
            Code: <div>{data.code}</div>,
            Qouta: <div>{data.quota}</div>,
            Status: (
              <div>
                {Date.now() >= Date.parse(data.actived_date) &&
                Date.now() <= Date.parse(data.expired_date) ? (
                  <Chip type="success"> On Going</Chip>
                ) : (
                  <></>
                )}
                {Date.now() < Date.parse(data.actived_date) ? (
                  <Chip type="secondary">Will Come</Chip>
                ) : (
                  <></>
                )}
                {Date.now() > Date.parse(data.expired_date) ? (
                  <Chip type="gray">Has Ended</Chip>
                ) : (
                  <></>
                )}
              </div>
            ),
            'Active Date': (
              <div>
                <P>{moment(data.actived_date).format('DD MMM YYYY HH:mm')}</P>
                <P className="font-bold">until</P>
                <P>{moment(data.expired_date).format('DD MMM YYYY  HH:mm')}</P>
              </div>
            ),
            Discount: (
              <div>
                {data.discount_percentage > 0 &&
                data.discount_fix_price <= 0 ? (
                  <>{data.discount_percentage}%</>
                ) : (
                  <></>
                )}
                {data.discount_percentage <= 0 &&
                data.discount_fix_price > 0 ? (
                  <>
                    Rp
                    {formatMoney(data.discount_fix_price)}
                  </>
                ) : (
                  <></>
                )}
              </div>
            ),
            'Min Product Price': (
              <div>
                Rp
                {formatMoney(data.min_product_price)}
              </div>
            ),
            'Max Discount Price': (
              <div>
                Rp
                {formatMoney(data.max_discount_price)}
              </div>
            ),
            Action: (
              <div className="flex w-fit flex-col gap-1">
                {Date.now() > Date.parse(data.expired_date) ? (
                  <Button
                    buttonType="primary"
                    size="sm"
                    onClick={() => {
                      router.push({
                        pathname: '/seller-panel/vouchers/' + data.id,
                      })
                    }}
                  >
                    <HiInformationCircle /> Detail
                  </Button>
                ) : (
                  <></>
                )}
                {Date.now() < Date.parse(data.expired_date) ? (
                  <Button
                    buttonType="primary"
                    size="sm"
                    outlined
                    onClick={() => {
                      router.push({
                        pathname: '/seller-panel/vouchers/manage',
                        query: {
                          voucher: data.id,
                          type: 'update',
                        },
                      })
                    }}
                  >
                    <HiPencilAlt /> Edit
                  </Button>
                ) : (
                  <></>
                )}
                <Button
                  buttonType="ghost"
                  className="btn-primary border-none"
                  outlined
                  size="sm"
                  onClick={() => {
                    router.push({
                      pathname: '/seller-panel/vouchers/manage',
                      query: {
                        voucher: data.id,
                        type: 'duplicate',
                      },
                    })
                  }}
                >
                  <HiDocumentDuplicate /> Duplicate
                </Button>
                {Date.now() < Date.parse(data.actived_date) ? (
                  <Button
                    buttonType="primary"
                    outlined
                    size="sm"
                    onClick={() => {
                      modal.edit({
                        title: 'Delete Voucher',
                        content: (
                          <>
                            <P>Do you really want to delete this voucher?</P>
                            <div className="mt-4 flex justify-end gap-2">
                              <Button
                                type="button"
                                outlined
                                buttonType="primary"
                                onClick={() => {
                                  dispatch(closeModal())
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                type="button"
                                buttonType="primary"
                                onClick={() => {
                                  deleteVoucher(data.id)
                                }}
                              >
                                Delete
                              </Button>
                            </div>
                          </>
                        ),
                        closeButton: false,
                      })
                    }}
                  >
                    <HiTrash /> Delete
                  </Button>
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
        'Created Date': '',
        Code: '',
        Status: '',
        Qouta: '',
        'Active Date': '',
        'Discount ': '',
        'Min Product Price': '',
        'Max Discount Price': '',
      },
    ]
  }

  return (
    <div>
      <Head>
        <title>Murakali | Voucher Panel</title>
      </Head>
      <SellerPanelLayout selectedPage="voucher">
        <div className="flex flex-col items-baseline justify-between gap-2 px-3 py-5 sm:flex-row sm:px-0">
          <H2>Voucher Shop List</H2>
          <Button
            size={'sm'}
            buttonType="primary"
            outlined
            onClick={() => {
              router.push({
                pathname: '/seller-panel/vouchers/manage',
                query: {
                  voucher: '',
                  type: '',
                },
              })
            }}
          >
            <HiPlus /> Add Vouchers
          </Button>
        </div>
        <div className="mt-3 flex h-full w-full flex-col rounded border bg-white p-6 ">
          <div className="flex items-center gap-x-2 px-5">
            <P className="my-3  font-bold">Sort</P>
            <button
              className={cx(
                'flex aspect-square h-[1.5rem] items-center justify-center rounded-full border text-xs',
                sorts === 'ASC' ? 'bg-primary text-xs text-white' : ''
              )}
              onClick={() => {
                setSorts('ASC')
              }}
            >
              <HiArrowUp />
            </button>
            <button
              className={cx(
                'flex aspect-square h-[1.5rem] items-center justify-center rounded-full border text-xs',
                sorts === 'DESC' ? 'bg-primary text-xs text-white' : ''
              )}
              onClick={() => {
                setSorts('DESC')
              }}
            >
              <HiArrowDown />
            </button>
          </div>
          <div className="my-4 flex h-fit w-fit max-w-full space-x-10 overflow-x-auto overflow-y-hidden whitespace-nowrap border-b-[2px]">
            <button
              onClick={() => setVoucherStatus('1')}
              className={cx(
                'h-full border-b-[3px] transition-all',
                voucherStatus === '' ? 'border-primary' : 'border-transparent'
              )}
            >
              All
            </button>
            {voucherData.map((status, index) => {
              return (
                <button
                  key={index}
                  onClick={(e) => ChangeVoucherStatusPage(e)}
                  value={status.id}
                  className={cx(
                    'h-full whitespace-nowrap border-b-[3px] transition-all',
                    voucherStatus === status.id
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
            {sellerVoucher.isLoading ? (
              <Table data={formatSub()} isLoading />
            ) : sellerVoucher.isSuccess ? (
              <Table
                data={formatSub(sellerVoucher.data?.data)}
                isLoading={false}
                empty={sellerVoucher.data?.data?.rows?.length === 0}
              />
            ) : (
              <div>{'Error'}</div>
            )}
          </div>
          <div>
            {sellerVoucher.data?.data ? (
              <div className="mt-4 flex h-[8rem] w-full justify-center">
                <PaginationNav
                  page={page}
                  total={sellerVoucher.data?.data?.total_pages}
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

export default Vouchers
