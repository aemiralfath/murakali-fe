import type { ProductPaginationParams } from '@/api/product'
import { useGetAllProduct } from '@/api/product'
import { useGetSellerInfoByUserID } from '@/api/seller'
import { useGetUserProfile } from '@/api/user/profile'
import { Button, Chip, H2, P } from '@/components'
import Table from '@/components/table'
import formatMoney from '@/helper/formatMoney'
import SellerPanelLayout from '@/layout/SellerPanelLayout'
import type { BriefProduct } from '@/types/api/product'
import type { PaginationData } from '@/types/api/response'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import {
  HiDuplicate,
  HiOutlineEye,
  HiPencil,
  HiPlus,
  HiTrash,
} from 'react-icons/hi'

const Products = () => {
  const router = useRouter()
  const userProfile = useGetUserProfile()
  const sellerInfo = useGetSellerInfoByUserID(userProfile.data?.data?.id)

  const [params, setParams] = useState<ProductPaginationParams>()
  const [enabled, setEnabled] = useState(false)
  const allProduct = useGetAllProduct(params, enabled)
  useEffect(() => {
    if (sellerInfo.isSuccess) {
      setParams({
        ...params,
        shop_id: sellerInfo.data.data.id,
        listed_status: 0,
      })
      setEnabled(true)
    }
  }, [sellerInfo.isSuccess])

  const formatData = (data?: PaginationData<BriefProduct>) => {
    if (data?.rows.length > 0) {
      return data.rows.map((row) => ({
        'Created At': <div>{row.created_at}</div>,
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

    return [{ Info: '', Stats: '', Category: '', Price: '', Action: '' }]
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
              router.push('/seller-panel/add-product')
            }}
          >
            <HiPlus /> Add Product
          </Button>
        </div>
        <div className="mt-3 flex h-full flex-col rounded border bg-white p-6 ">
          <Table
            empty={allProduct.isLoading || allProduct.isError}
            data={formatData(allProduct.data?.data)}
            isLoading={allProduct.isLoading}
          />
        </div>
      </SellerPanelLayout>
    </div>
  )
}

export default Products
