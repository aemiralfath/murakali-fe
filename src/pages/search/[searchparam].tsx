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
  const [queryParam] = useState<Map<string, string>>(new Map<string, string>())

  const [flag, setFlag] = useState(true)
  const [locationState, setLocationState] = useState('')
  const [categoryState, setCategoryState] = useState('')
  const [resultFor, setResultFor] = useState('')
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

  useEffect(() => {
    let locationQuery = ''
    filterLocation.map((provinceDetail) => {
      if (locationQuery === '') {
        locationQuery = provinceDetail.province_id
      } else {
        locationQuery = locationQuery + ',' + provinceDetail.province_id
      }
    })
    if (locationQuery === '') {
      setLocationState('')
      queryParam.delete('location')
    } else {
      setLocationState(locationQuery)
      queryParam.set('location', locationQuery)
    }
    setFlag(true)
  }, [filterLocation])

  useEffect(() => {
    let queryCategory = ''
    filterCategory.map((category) => {
      if (queryCategory === '') {
        queryCategory = category
      } else {
        queryCategory = queryCategory + ',' + category
      }
    })
    if (queryCategory === '') {
      setCategoryState('')
      queryParam.delete('category')
    } else {
      setCategoryState(queryCategory)
      queryParam.set('category', queryCategory)
    }
    setFlag(true)
  }, [filterCategory])

  useEffect(() => {
    queryParam.set('page', String(page))
    setFlag(true)
  }, [page])

  useEffect(() => {
    setFlag(true)
    router.push({
      pathname: `/search/${searchparam}`,
    })
  }, [searchparam])

  const productQuery: ProductQuery = {
    search: String(searchparam),
    category: categoryState,
    limit: 30,
    page: page,
    sort_by: sortBy.sort_by,
    sort: sortBy.direction,
    min_price: filterPrice !== undefined ? filterPrice.min : 0,
    max_price: filterPrice !== undefined ? filterPrice.max : INF,
    min_rating: filterRating,
    max_rating: 5,
    shop_id: '',
    province_ids: locationState,
  }

  const SearchProductList = useSearchQueryProduct(productQuery)

  useEffect(() => {
    setFlag(false)
    if (flag === true) {
      let stringQuery = ''
      let fr = false
      queryParam.forEach((value, key) => {
        if (fr === true) {
          stringQuery = stringQuery + '&'
        }
        stringQuery = stringQuery + key + '=' + value
        fr = true
      })
      let num1 = 0
      let num2 = 0
      if (SearchProductList.isSuccess) {
        num1 =
          (SearchProductList.data.data.page - 1) *
            SearchProductList.data.data.limit +
          1
        num2 = num1 + SearchProductList.data.data.limit - 1
        if (num2 > SearchProductList.data.data.total_rows) {
          num2 = SearchProductList.data.data.total_rows
        }
        setResultFor(
          num1 +
            ' - ' +
            num2 +
            ' of ' +
            SearchProductList.data.data.total_rows +
            ' results for "' +
            searchparam +
            '"'
        )
      } else {
        setResultFor('no results for "' + searchparam + '"')
      }
      router.push({
        pathname: `/search/${searchparam}`,
        query: stringQuery,
      })
    }
  }, [flag])

  return (
    <>
      <Head>
        <title>Search - Murakali</title>
        <meta name="description" content="Murakali E-Commerce Application" />
      </Head>
      <MainLayout>
        {resultFor}
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

export async function getServerSideProps() {
  return {
    props: {},
  }
}
