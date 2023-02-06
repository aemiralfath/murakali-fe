import React, { useEffect, useState } from 'react'

import Head from 'next/head'

import { useFavoriteQueryProduct } from '@/api/product/favorite'
import { Breadcrumbs } from '@/components'
import MainLayout from '@/layout/MainLayout'
import ProductFavoriteLayout, {
  useFavoriteProductListing,
} from '@/sections/favorites/ProductFavoriteLayout'
import type { ProductQuery } from '@/types/api/product'

const dummyBreadcrumbs = [
  { name: 'Home', link: '/' },
  { name: 'Favorites', link: '/favorites' },
]

function Favorite() {
  const INF = 1000000000
  const [queryParam] = useState<Map<string, string>>(new Map<string, string>())
  const [categoryState, setCategoryState] = useState('')
  const controller = useFavoriteProductListing()
  const { sortBy, filterCategory, page } = controller

  useEffect(() => {
    if (sortBy.sort_by !== '') {
      queryParam.set('sort_by', sortBy.sort_by)
    } else if (sortBy.sort_by === '') {
      queryParam.delete('sort_by')
    }

    if (sortBy.sort !== '') {
      queryParam.set('sort', sortBy.sort)
    } else if (sortBy.sort === '') {
      queryParam.delete('sort')
    }
  }, [sortBy])

  useEffect(() => {
    const queryCategory = filterCategory

    if (queryCategory === '') {
      setCategoryState('')
      queryParam.delete('category')
    } else {
      setCategoryState(queryCategory)
      queryParam.set('category', queryCategory)
    }
  }, [filterCategory])

  useEffect(() => {
    queryParam.set('page', String(page))
  }, [page])

  const productQuery: ProductQuery = {
    search: '',
    category: categoryState,
    limit: 30,
    page: page,
    sort_by: sortBy.sort_by,
    sort: sortBy.sort,
    min_price: 0,
    max_price: INF,
    min_rating: 0,
    max_rating: 5,
    shop_id: '',
    province_ids: '',
  }

  const FavoriteProductList = useFavoriteQueryProduct(productQuery)

  return (
    <>
      <Head>
        <title>Favorites - Murakali</title>
        <meta name="description" content="Murakali E-Commerce Application" />
      </Head>
      <MainLayout>
        <div className="my-1">
          <Breadcrumbs data={dummyBreadcrumbs} />
        </div>

        {FavoriteProductList.isLoading ? (
          <ProductFavoriteLayout controller={controller} isLoading={true} />
        ) : FavoriteProductList.data?.data?.rows ? (
          <ProductFavoriteLayout
            controller={controller}
            isLoading={false}
            data={FavoriteProductList.data.data.rows}
            totalPage={FavoriteProductList.data.data.total_pages}
          />
        ) : (
          <div className="flex h-96 items-center justify-center rounded-lg border-[1px] border-solid border-gray-300"></div>
        )}
      </MainLayout>
    </>
  )
}

export default Favorite
