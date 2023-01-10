import React, { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import MainLayout from '@/layout/MainLayout'
import ProductListingLayout, {
  useProductListing,
} from '@/layout/ProductListingLayout'
import { useSearchQueryProduct } from '@/api/product/search'
import type { ProductQuery } from '@/types/api/product'

const SearchPage: NextPage = () => {
  const router = useRouter()
  const INF = 1000000000

  const { searchparam } = router.query
  const [queryParam, setQueryParam] = useState<Map<string, string>>(
    // Object.entries({'search':String(searchparam)})
    new Map<string, string>()
  )
  const [flag, setFlag] = useState(true)
  const controller = useProductListing()
  const {
    sortBy,
    filterPrice,
    filterRating,
    filterLocation,
    filterCategory,
    page,
  } = controller

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
    setFlag(true)
  }, [sortBy])

  useEffect(() => {
    if (filterPrice === undefined) {
      queryParam.delete('min_price')
      queryParam.delete('max_price')
    } else {
      queryParam.set('min_price', String(filterPrice.min))
      queryParam.set('max_price', String(filterPrice.max))
    }

    setFlag(true)
  }, [filterPrice])

  useEffect(() => {
    if (filterRating === -1) {
      queryParam.delete('rating')
    } else {
      queryParam.set('rating', String(filterRating))
    }
    setFlag(true)
  }, [filterRating])

  let location = ''
  filterLocation.map((provinceDetail) => {
    if (location === '') {
      location = provinceDetail.province_id
    } else {
      location = location + ',' + provinceDetail.province_id
    }
  })

  let queryCategory = ''
  filterCategory.map((category) => {
    if (queryCategory === '') {
      queryCategory = category
    } else {
      queryCategory = queryCategory + ',' + category
    }
  })

  const productQuery: ProductQuery = {
    search: String(searchparam),
    category: queryCategory,
    limit: 30,
    page: page,
    sort_by: sortBy.sort_by,
    sort: sortBy.direction,
    min_price: filterPrice !== undefined ? filterPrice.min : 0,
    max_price: filterPrice !== undefined ? filterPrice.max : INF,
    min_rating: filterRating,
    max_rating: 5,
    shop_id: '',
    province_ids: location,
  }

  useEffect(() => {
    if (flag === true) {
      setFlag(false)
      console.log('asdasd', queryParam)
      let stringQuery = ''
      let fr = false
      queryParam.forEach((value, key) => {
        if (fr === true) {
          stringQuery = stringQuery + '&'
        }
        stringQuery = stringQuery + key + '=' + value
        fr = true
      })
      console.log(stringQuery)
      router.push({
        pathname: `/search/${searchparam}`,
        query: stringQuery,
      })
    }
  }, [flag])

  const SearchProductList = useSearchQueryProduct(productQuery)
  // Get the state like this :

  return (
    <>
      <Head>
        <title>Search - Murakali</title>
        <meta name="description" content="Murakali E-Commerce Application" />
      </Head>
      <MainLayout>
        asd
        {SearchProductList.isLoading ? (
          <ProductListingLayout controller={controller} isLoading={true} />
        ) : SearchProductList.data.data.rows ? (
          <ProductListingLayout
            controller={controller}
            isLoading={false}
            data={SearchProductList.data.data.rows}
            totalPage={SearchProductList.data.data.total_pages}
          />
        ) : (
          <div>handle error</div>
        )}
      </MainLayout>
    </>
  )
}

export default SearchPage
