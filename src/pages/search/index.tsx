import React, { useEffect, useState } from 'react'

import Head from 'next/head'
import { useRouter } from 'next/router'

import { useSearchQueryProduct } from '@/api/product/search'
import { useGetAllSellers } from '@/api/seller'
import { P } from '@/components'
import cx from '@/helper/cx'
import MainLayout from '@/layout/MainLayout'
import ProductListingLayout, {
  useProductListing,
} from '@/layout/ProductListingLayout'
import SellerLayout from '@/sections/search/SellerLayout'
import type { ProductQuery } from '@/types/api/product'

import type { NextPage } from 'next'
import qs from 'qs'

const SearchPage: NextPage = () => {
  const router = useRouter()
  const { catName, keyword, sort_by, sort, rating } = router.query

  const INF = 1000000000

  const [productOrShop, setProductOrShop] = useState<number>(1)

  const [queryParam, setQueryParam] = useState<ProductQuery>({
    limit: 30,
    page: 1,
    min_price: 0,
    max_price: INF,
    max_rating: 5,
  })
  useEffect(() => {
    setQueryParam({
      ...queryParam,
      category: typeof catName === 'string' ? catName : undefined,
      search: typeof keyword === 'string' ? keyword : undefined,
      sort_by: typeof sort_by === 'string' ? sort_by : undefined,
      sort: typeof sort === 'string' ? sort : undefined,
      min_rating: typeof rating === 'string' ? parseInt(rating) : undefined,
    })
  }, [catName, keyword, sort_by, sort, rating])

  const controller = useProductListing()
  const {
    filterKeyword,
    setFilterKeyword,
    sortBy,
    setSortBy,
    filterRating,
    setFilterRating,
    filterCategory,
    setFilterCategory,
    filterPrice,
    filterLocation,
    page,
  } = controller

  useEffect(() => {
    if (router.isReady) {
      const query = qs.stringify(
        {
          catName: filterCategory === '' ? null : filterCategory,
          keyword: filterKeyword === '' ? null : filterKeyword,
          sort: sortBy.sort === '' ? null : sortBy.sort,
          sort_by: sortBy.sort_by === '' ? null : sortBy.sort_by,
          rating: filterRating === -1 ? null : filterRating,
        },
        { skipNulls: true }
      )
      router.push('/search?' + query)
    }
  }, [filterKeyword, sortBy, filterRating, filterCategory])

  useEffect(() => {
    if (keyword !== undefined) {
      setFilterKeyword(String(keyword))
    }
  }, [keyword])

  useEffect(() => {
    if (sort !== undefined) {
      setSortBy({ sort_by: String(sort_by), sort: String(sort) })
    }
  }, [sort, sort_by])

  useEffect(() => {
    if (catName === undefined) {
      setFilterCategory('')
    } else {
      setFilterCategory(String(catName))
    }
  }, [catName])

  useEffect(() => {
    if (typeof rating === 'string') {
      setFilterRating(parseInt(rating))
    }
  }, [rating])

  const SearchProductList = useSearchQueryProduct({
    ...queryParam,
    min_price: filterPrice?.min,
    max_price: filterPrice?.max,
    province_ids: filterLocation.reduce((prev, curr, idx) => {
      if (idx === 0) {
        return curr.province_id
      } else {
        return `${prev},${curr.province_id}`
      }
    }, ''),
    page: page,
    listed_status: 1,
  })

  const [pageShop, setPageShop] = useState<number>(1)
  const SearchShopList = useGetAllSellers(String(keyword), pageShop)

  return (
    <>
      <Head>
        <title>Search - Murakali</title>
        <meta name="description" content="Murakali E-Commerce Application" />
      </Head>
      <MainLayout>
        <div className="my-2 flex h-fit w-full max-w-full justify-center space-x-10 overflow-x-auto overflow-y-hidden whitespace-nowrap border-b-[1px]">
          <button
            onClick={() => setProductOrShop(1)}
            className={cx(
              'h-full border-b-[3px] transition-all',
              productOrShop === 1
                ? 'border-primary font-bold text-primary'
                : 'border-transparent'
            )}
          >
            Product
          </button>
          <button
            onClick={() => setProductOrShop(2)}
            className={cx(
              'h-full border-b-[3px] transition-all',
              productOrShop === 2
                ? 'border-primary font-bold text-primary'
                : 'border-transparent'
            )}
          >
            Shop
          </button>
        </div>
        {productOrShop == 1 ? (
          <>
            {' '}
            {SearchProductList.isLoading ? (
              <ProductListingLayout controller={controller} isLoading={true} />
            ) : SearchProductList.data?.data?.rows ? (
              <ProductListingLayout
                controller={controller}
                isLoading={false}
                data={SearchProductList.data.data.rows}
                totalPage={SearchProductList.data.data.total_pages}
              />
            ) : (
              <div>handle error</div>
            )}
          </>
        ) : (
          <>
            {SearchShopList.isLoading ? (
              <>
                <SellerLayout isLoading={true} />
              </>
            ) : SearchShopList.data?.data?.rows ? (
              <SellerLayout
                data={SearchShopList.data?.data?.rows}
                totalPage={SearchShopList.data.data.total_pages}
                setPageShop={(page: number) => setPageShop(page)}
                pageShop={pageShop}
                isLoading={false}
              />
            ) : (
              <>
                {' '}
                <div className="col-span-2 flex w-full flex-col items-center justify-center p-6 sm:col-span-3 md:col-span-4 xl:col-span-6">
                  <img
                    src={'/asset/sorry.svg'}
                    width={300}
                    height={300}
                    alt={'Sorry'}
                  />
                  <P className="text-sm italic text-gray-400">
                    Sorry, shop you requested is not found.
                  </P>
                </div>
              </>
            )}
          </>
        )}
      </MainLayout>
    </>
  )
}

export default SearchPage
