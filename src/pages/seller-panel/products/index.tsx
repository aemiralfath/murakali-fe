import type { ProductPaginationParams } from '@/api/product'
import { useGetAllProduct } from '@/api/product'
import { useGetSellerInfoByUserID } from '@/api/seller'
import { useGetUserProfile } from '@/api/user/profile'
import { Button, Chip, H2, H4, P, PaginationNav } from '@/components'
import Table from '@/components/table'
import cx from '@/helper/cx'
import formatMoney from '@/helper/formatMoney'
import SellerPanelLayout from '@/layout/SellerPanelLayout'
import type { BriefProduct } from '@/types/api/product'
import type { PaginationData } from '@/types/api/response'
import type { SortBy } from '@/types/helper/sort'
import moment from 'moment'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import {
  HiArrowDown,
  HiArrowUp,
  HiDuplicate,
  HiOutlineEye,
  HiPencil,
  HiPlus,
  HiTrash,
} from 'react-icons/hi'

const Products = () => {
  const ButtonSortData = [
    { name: 'date', sort_by: 'created_at' },
    { name: 'price', sort_by: 'min_price' },
    { name: 'sold', sort_by: 'unit_sold' },
    { name: 'view', sort_by: 'view_count' },
  ]

  const router = useRouter()
  const userProfile = useGetUserProfile()
  const sellerInfo = useGetSellerInfoByUserID(userProfile.data?.data?.id)

  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState<SortBy>({ sort_by: '', direction: '' })
  const [params, setParams] = useState<ProductPaginationParams>()
  const [enabled, setEnabled] = useState(false)
  const allProduct = useGetAllProduct(params, enabled)
  useEffect(() => {
    if (sellerInfo.isSuccess) {
      setParams({
        ...params,
        shop_id: sellerInfo.data.data.id,
        listed_status: 0,
        page: page,
      })
      setEnabled(Boolean(sellerInfo.data.data.id))
    }
  }, [sellerInfo.isSuccess])

  useEffect(() => {
    setParams({
      ...params,
      page: page,
    })
  }, [page])

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
            <Button size="sm" buttonType="primary" outlined>
              <HiPencil /> Edit
            </Button>
            <div className="dropdown-end dropdown">
              <label
                tabIndex={0}
                className="btn-ghost btn-sm btn w-full text-primary"
              >
                More
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content menu rounded-box w-52 bg-base-100 p-2 shadow"
              >
                <li>
                  <P>
                    <HiDuplicate /> Copy
                  </P>
                </li>
                <li>
                  <P className="text-error  ">
                    <HiTrash /> Delete
                  </P>
                </li>
              </ul>
            </div>
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
              router.push('/seller-panel/products/manage')
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
                            sortBy.direction === 'ASC'
                            ? 'bg-primary text-xs text-white'
                            : ''
                        )}
                        onClick={() => {
                          if (
                            sortBy.sort_by === sorting.sort_by &&
                            sortBy.direction === 'ASC'
                          ) {
                            setSortBy({ ...sortBy, sort_by: '', direction: '' })
                          } else {
                            setSortBy({
                              ...sortBy,
                              sort_by: sorting.sort_by,
                              direction: 'ASC',
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
                            sortBy.direction === 'DESC'
                            ? 'bg-primary text-xs text-white'
                            : ''
                        )}
                        onClick={() => {
                          if (
                            sortBy.sort_by === sorting.sort_by &&
                            sortBy.direction === 'DESC'
                          ) {
                            setSortBy({ ...sortBy, sort_by: '', direction: '' })
                          } else {
                            setSortBy({
                              ...sortBy,
                              sort_by: sorting.sort_by,
                              direction: 'DESC',
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
          <Table
            empty={allProduct.isLoading || allProduct.isError}
            data={formatData(allProduct.data?.data)}
            isLoading={allProduct.isLoading}
          />
          <div className="h-[6rem]" />
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
