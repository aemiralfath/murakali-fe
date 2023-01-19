import type { ProductPaginationParams } from '@/api/product'
import { useGetAllProduct } from '@/api/product'
import { useBulkEditStatus, useEditStatus } from '@/api/product/manage'
import { useGetSellerInfoByUserID } from '@/api/seller'
import { useGetUserProfile } from '@/api/user/profile'
import { Button, Chip, H2, H4, P, PaginationNav, TextInput } from '@/components'
import Table from '@/components/table'
import cx from '@/helper/cx'
import formatMoney from '@/helper/formatMoney'
import { useDebounce, useDispatch, useModal } from '@/hooks'
import SellerPanelLayout from '@/layout/SellerPanelLayout'
import { closeModal } from '@/redux/reducer/modalReducer'
import type { BriefProduct } from '@/types/api/product'
import type { PaginationData } from '@/types/api/response'
import type { SortBy } from '@/types/helper/sort'
import moment from 'moment'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import {
  HiArrowDown,
  HiArrowUp,
  HiChevronDown,
  HiDuplicate,
  HiFilter,
  HiOutlineEye,
  HiPencil,
  HiPlus,
} from 'react-icons/hi'

const Products = () => {
  const ButtonSortData = [
    { name: 'date', sort_by: 'created_at' },
    { name: 'price', sort_by: 'min_price' },
    { name: 'sold', sort_by: 'unit_sold' },
    { name: 'view', sort_by: 'view_count' },
  ]

  const modal = useModal()
  const dispatch = useDispatch()
  const router = useRouter()
  const userProfile = useGetUserProfile()
  const sellerInfo = useGetSellerInfoByUserID(userProfile.data?.data?.id)

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const debouncedLimit = useDebounce(limit, 300)
  const [sortBy, setSortBy] = useState<SortBy>({ sort_by: '', sort: '' })
  const [params, setParams] = useState<ProductPaginationParams>()
  const [enabled, setEnabled] = useState(false)
  const allProduct = useGetAllProduct(params, enabled)

  const editStatus = useEditStatus()

  const [selectedId, setSelectedId] = useState<string[]>([])
  const bulkEditStatus = useBulkEditStatus()
  useEffect(() => {
    if (bulkEditStatus.isSuccess) {
      toast.success('Status edit success')
    }
  }, [bulkEditStatus.isSuccess])

  const handleBulkEditStatus = (param: { status: boolean }) => {
    if (selectedId.length > 0) {
      modal.info({
        title: 'Confirmation',
        content: (
          <div className="flex flex-col gap-2">
            <P>
              Do you want to set{' '}
              <span className="font-semibold">
                {selectedId.length} product(s)
              </span>{' '}
              to{' '}
              <span className="font-semibold">
                {param.status ? 'Listed' : 'Unlisted'}
              </span>{' '}
              ?
            </P>
            <div className="mt-8 flex items-center justify-center gap-2">
              <Button
                buttonType="primary"
                onClick={() => {
                  bulkEditStatus.mutate({
                    listed_status: param.status,
                    products_ids: selectedId,
                  })
                  setSelectedId([])
                  dispatch(closeModal())
                }}
              >
                Yes
              </Button>
              <Button
                buttonType="primary"
                outlined
                onClick={() => {
                  dispatch(closeModal())
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ),
        closeButton: false,
      })
    }
  }

  const toggleSelect = (id: string) => {
    if (selectedId.includes(id)) {
      setSelectedId(selectedId.filter((sId) => sId !== id))
    } else {
      setSelectedId([...selectedId, id])
    }
  }

  useEffect(() => {
    if (sellerInfo.isSuccess) {
      setParams({
        ...params,
        shop_id: sellerInfo.data.data.id,
        listed_status: 0,
        page: page,
      })
    }
  }, [sellerInfo.isSuccess])

  useEffect(() => {
    if (Boolean(params?.shop_id)) {
      setEnabled(true)
    } else if (sellerInfo.data?.data.id) {
      setEnabled(false)
      setParams({
        ...params,
        shop_id: sellerInfo.data.data.id,
        listed_status: 0,
        page: page,
        limit: limit,
      })
    }
  }, [params])

  useEffect(() => {
    setParams({
      ...params,
      page: page,
    })
  }, [page])

  useEffect(() => {
    setParams({
      ...params,
      limit: debouncedLimit,
    })
  }, [debouncedLimit])

  useEffect(() => {
    if (sortBy.sort_by === '') {
      setParams({
        ...params,
        sort: undefined,
        sort_by: undefined,
      })
    } else {
      setParams({
        ...params,
        ...sortBy,
      })
    }
  }, [sortBy])

  const formatData = (data?: PaginationData<BriefProduct>) => {
    if (data?.rows.length > 0) {
      return data.rows.map((row) => ({
        Select: (
          <input
            type={'checkbox'}
            className={'checkbox'}
            readOnly
            checked={selectedId.includes(row.id)}
            onClick={() => toggleSelect(row.id)}
          />
        ),
        'Created At': (
          <div>
            <P className="text-sm">
              {moment(row.created_at).format('dddd, DD MMM YYYY')}
            </P>
            <P className="text-xs text-gray-500">
              Updated:{' '}
              {row.updated_at.Valid
                ? moment(row.updated_at.Time).format('DD MMM YYYY')
                : '-'}
            </P>
          </div>
        ),
        Info: (
          <div className="flex gap-3">
            <div className="w-[65px] flex-1">
              <Image
                src={row.thumbnail_url}
                className={'rounded-lg'}
                width={65}
                height={65}
                alt={row.title}
              />
            </div>
            <div className="flex flex-1 flex-col gap-2 p-1">
              <P className="w-[16rem] font-semibold line-clamp-2">
                {row.title}
              </P>
              <P className="flex items-center gap-1 text-xs text-gray-500">
                <HiOutlineEye />
                <span>{row.view_count}</span>
              </P>
            </div>
          </div>
        ),
        Stats: (
          <div>
            <div className="flex gap-2">
              <P className="font-semibold">Sold:</P>
              <P className="">{row.unit_sold}</P>
            </div>
            <div className="flex gap-2">
              <P className="font-semibold">Rating (avg.):</P>
              <P className="">{row.rating_avg}</P>
            </div>
          </div>
        ),
        Category: <Chip type="gray">{row.category_name}</Chip>,
        Price: (
          <div>
            <span className="font-gray-500 text-xs">Rp.</span>
            {row.min_price === row.max_price
              ? formatMoney(row.min_price)
              : `${formatMoney(row.min_price)} - ${formatMoney(row.max_price)}`}
          </div>
        ),
        Status: (
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="toggle-primary toggle"
              checked={row.listed_status}
              readOnly
              onClick={() => {
                editStatus.mutate(row.id)
              }}
            />
            {row.listed_status ? (
              <P>Listed</P>
            ) : (
              <P className="italic">Unlisted</P>
            )}
          </label>
        ),
        Action: (
          <div className="flex flex-col gap-2">
            <Button
              size="sm"
              buttonType="ghost"
              outlined
              onClick={() => {
                router.push(
                  '/seller-panel/products/manage?intent=edit&product_id=' +
                    row.id
                )
              }}
            >
              <HiPencil /> Edit
            </Button>
            <Button
              size="sm"
              buttonType="ghost"
              onClick={() => {
                router.push(
                  '/seller-panel/products/manage?intent=add&product_id=' +
                    row.id
                )
              }}
            >
              <HiDuplicate /> Duplicate
            </Button>
          </div>
        ),
      }))
    }

    return [
      {
        'Created At': '',
        Info: '',
        Stats: '',
        Category: '',
        Price: '',
        Status: '',
        Action: '',
      },
    ]
  }

  return (
    <div>
      <Head>
        <title>Murakali | Seller Panel</title>
      </Head>
      <SellerPanelLayout selectedPage="product">
        <div className="flex w-full items-center justify-between">
          <H2>Product List</H2>
          <Button
            size={'sm'}
            buttonType="primary"
            outlined
            onClick={() => {
              router.push('/seller-panel/products/manage?intent=add')
            }}
          >
            <HiPlus /> Add Product
          </Button>
        </div>
        <div className="mt-3 flex max-w-full flex-col overflow-auto rounded border bg-white px-6 pt-6">
          <div className="mb-3 flex w-fit items-center justify-between rounded border py-2 px-3">
            <div className="flex items-center gap-2">
              <H4>Sort</H4>
              <div className="ml-2 h-[1px] w-8 bg-base-300" />
              <div className="flex flex-wrap items-center gap-2">
                {ButtonSortData.map((sorting, index) => {
                  return (
                    <div
                      key={index}
                      className={cx(
                        ' flex items-center gap-1 rounded-full py-1 pl-2 pr-1 font-medium',
                        sortBy.sort_by === sorting.sort_by
                          ? 'bg-primary bg-opacity-10 text-primary-focus'
                          : ''
                      )}
                    >
                      {sorting.name}
                      <button
                        className={cx(
                          'flex aspect-square h-[1.5rem] items-center justify-center rounded-full border text-xs',
                          sortBy.sort_by === sorting.sort_by &&
                            sortBy.sort === 'ASC'
                            ? 'bg-primary text-xs text-white'
                            : ''
                        )}
                        onClick={() => {
                          if (
                            sortBy.sort_by === sorting.sort_by &&
                            sortBy.sort === 'ASC'
                          ) {
                            setSortBy({ ...sortBy, sort_by: '', sort: '' })
                          } else {
                            setSortBy({
                              ...sortBy,
                              sort_by: sorting.sort_by,
                              sort: 'ASC',
                            })
                          }
                        }}
                      >
                        <HiArrowUp />
                      </button>
                      <button
                        className={cx(
                          'flex aspect-square h-[1.5rem] items-center justify-center rounded-full border text-xs',
                          sortBy.sort_by === sorting.sort_by &&
                            sortBy.sort === 'DESC'
                            ? 'bg-primary text-xs text-white'
                            : ''
                        )}
                        onClick={() => {
                          if (
                            sortBy.sort_by === sorting.sort_by &&
                            sortBy.sort === 'DESC'
                          ) {
                            setSortBy({ ...sortBy, sort_by: '', sort: '' })
                          } else {
                            setSortBy({
                              ...sortBy,
                              sort_by: sorting.sort_by,
                              sort: 'DESC',
                            })
                          }
                        }}
                      >
                        <HiArrowDown />
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          {selectedId.length > 0 ? (
            <div className="mb-3 flex items-center gap-2">
              <span>Selected {selectedId.length} products</span>
              <div className="dropdown-bottom dropdown">
                <label
                  tabIndex={0}
                  className="btn-outline btn-ghost btn-xs btn flex cursor-pointer items-center gap-1"
                >
                  <span>Manage Bulk</span>
                  <HiChevronDown />
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu rounded-box w-52 bg-base-100 p-2 font-medium shadow"
                >
                  <li onClick={() => handleBulkEditStatus({ status: true })}>
                    <a>Set as Listed</a>
                  </li>
                  <li onClick={() => handleBulkEditStatus({ status: false })}>
                    <a>Set as Unlisted</a>
                  </li>
                </ul>
              </div>
              <Button
                size="xs"
                buttonType="ghost"
                onClick={() => setSelectedId([])}
              >
                Clear
              </Button>
            </div>
          ) : (
            <></>
          )}
          <Table
            empty={allProduct.isLoading || allProduct.isError}
            data={formatData(allProduct.data?.data)}
            clickableColumn={
              allProduct.data?.data
                ? [
                    {
                      colName: 'Status',
                      component: <HiFilter />,
                    },
                    {
                      colName: 'Select',
                      component: (
                        <div className="dropdown-bottom dropdown">
                          <label tabIndex={0} className="cursor-pointer">
                            <HiChevronDown />
                          </label>
                          <ul
                            tabIndex={0}
                            className="dropdown-content menu rounded-box w-52 bg-base-100 p-2 font-medium shadow"
                            onClick={() => {
                              if (
                                selectedId.length <
                                allProduct.data.data.rows.length
                              ) {
                                const tempSelect =
                                  allProduct.data.data.rows.map((p) => p.id)
                                setSelectedId(tempSelect)
                              } else {
                                setSelectedId([])
                              }
                            }}
                          >
                            <li>
                              <a>
                                {selectedId.length <
                                allProduct.data.data.rows.length
                                  ? 'Select All'
                                  : 'Clear Selection'}
                              </a>
                            </li>
                          </ul>
                        </div>
                      ),
                    },
                  ]
                : []
            }
            isLoading={allProduct.isLoading}
          />
          <div className="mt-3 flex min-h-[6rem] items-center gap-2">
            <P>Showing</P>
            <TextInput
              inputSize="sm"
              className="w-[4rem]"
              full
              value={limit}
              type={'number'}
              min={1}
              max={100}
              onChange={(e) => {
                const parsed = parseInt(e.target.value)
                setLimit(
                  Number.isNaN(parsed)
                    ? 0
                    : parsed < 0
                    ? 0
                    : parsed >= 100
                    ? 100
                    : parsed
                )
              }}
            />
            <P>of {allProduct.data?.data?.total_rows} entries</P>
          </div>
        </div>
        {allProduct.data?.data ? (
          <div className="mt-4 flex h-[8rem] w-full justify-center">
            <PaginationNav
              page={page}
              total={allProduct.data.data.total_pages}
              onChange={(p) => setPage(p)}
            />
          </div>
        ) : (
          <></>
        )}
      </SellerPanelLayout>
    </div>
  )
}

export default Products
