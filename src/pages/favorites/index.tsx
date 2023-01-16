import React, { useEffect, useState } from 'react'
import TitlePageExtend from '@/layout/template/navbar/TitlePageExtend'
import { Navbar } from '@/layout/template'
import Footer from '@/layout/template/footer'
import ProductFavoriteLayout, {
  useFavoriteProductListing,
} from '@/sections/favorites/ProductFavoriteLayout'
import { useFavoriteQueryProduct } from '@/api/product/favorite'
import type { ProductQuery } from '@/types/api/product'
import { Breadcrumbs, H4 } from '@/components'

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

    if (sortBy.direction !== '') {
      queryParam.set('sort', sortBy.direction)
    } else if (sortBy.direction === '') {
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
    sort: sortBy.direction,
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
      <Navbar />
      <TitlePageExtend title="Favorite Product" />

      <div className="  container mx-auto my-5  h-screen md:mx-20 lg:mx-40">
        <div className="my-4">
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
          <div className="flex h-96 items-center justify-center rounded-lg border-[1px] border-solid border-gray-300">
            <H4>You dont have favorite product</H4>
          </div>
        )}
      </div>

      <Footer />
    </>
  )
}

export default Favorite
