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
  const { catName, keyword, sort_by, sort } = router.query

  const INF = 1000000000

  const [queryParam, setQueryParam] = useState<Map<string, string>>(
    new Map<string, string>()
  )
  const handleUpdateQuery = (k: string, v: string) => {
    queryParam.set(k, v)
    setQueryParam(queryParam)
  }
  const handleDeleteQuery = (k: string) => {
    queryParam.delete(k)
    setQueryParam(queryParam)
  }

  // bikin useeffect buat ganti parameter pake router

  const [flag, setFlag] = useState(true)
  const [locationState, setLocationState] = useState('')
  // const [resultFor, setResultFor] = useState('')
  const controller = useProductListing()
  const {
    filterKeyword,
    setFilterKeyword,
    sortBy,
    setSortBy,
    filterPrice,
    filterRating,
    filterLocation,
    filterCategory,
    setFilterCategory,
    page,
  } = controller

  useEffect(() => {
    if (sort !== undefined) {
      setSortBy({ sort_by: String(sort_by), sort: String(sort) })
    }
    setFlag(true)
  }, [sort])

  useEffect(() => {
    if (sortBy.sort_by !== '') {
      handleUpdateQuery('sort_by', sortBy.sort_by)
    } else if (sortBy.sort_by === '') {
      handleDeleteQuery('sort_by')
    }

    if (sortBy.sort !== '') {
      handleUpdateQuery('sort', sortBy.sort)
    } else if (sortBy.sort === '') {
      handleDeleteQuery('sort')
    }
    setFlag(true)
  }, [sortBy])

  useEffect(() => {
    if (filterPrice === undefined) {
      handleDeleteQuery('min_price')
      handleDeleteQuery('max_price')
    } else {
      handleUpdateQuery('min_price', String(filterPrice.min))
      handleUpdateQuery('max_price', String(filterPrice.max))
    }

    setFlag(true)
  }, [filterPrice])

  useEffect(() => {
    if (filterRating === -1) {
      handleDeleteQuery('rating')
    } else {
      handleUpdateQuery('rating', String(filterRating))
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
      handleDeleteQuery('location')
    } else {
      setLocationState(locationQuery)
      handleUpdateQuery('location', locationQuery)
    }
    setFlag(true)
  }, [filterLocation])

  useEffect(() => {
    handleUpdateQuery('page', String(page))
    setFlag(true)
  }, [page])

  useEffect(() => {
    if (catName === undefined) {
      setFilterCategory('')
      handleDeleteQuery('category')
    } else {
      setFilterCategory(String(catName))
      handleUpdateQuery('category', String(catName))
    }
    setFlag(true)
  }, [catName])

  useEffect(() => {
    if (keyword === undefined) {
      setFilterKeyword('')
      handleDeleteQuery('keyword')
    } else {
      setFilterKeyword(String(keyword))
      handleUpdateQuery('keyword', String(keyword))
    }
    setFlag(true)
  }, [keyword])

  // useEffect(() => {}, [filterKeyword])

  // Query params -> mengubah state filter
  // state berganti -> query params, reload

  // url?keyword='aldaksd'&page=2
  // 1. Ngecek query params -> kosong atau nggak. Query params, itu kalo di useRouter, itu akan kosong dulu.
  // const { keyword } = router.params
  // keyword -> undefined -> ada isinya
  /* useEffect(() => {
    if(keyword !== undefined) {
      setStateFilterKeyword(keyword)
    }
  }, [keyword])
  */

  const productQuery: ProductQuery = {
    search: filterKeyword,
    category: filterCategory,
    limit: 30,
    page: page,
    sort_by: sortBy.sort_by,
    sort: sortBy.sort,
    min_price: filterPrice !== undefined ? filterPrice.min : 0,
    max_price: filterPrice !== undefined ? filterPrice.max : INF,
    min_rating: filterRating,
    max_rating: 5,
    shop_id: '',
    province_ids: locationState,
  }

  const SearchProductList = useSearchQueryProduct(productQuery)

  useEffect(() => {
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
        // let message = ''
        // if (keyword === undefined) {
        //   message = 'Showing all products'
        // } else {
        //   message = 'Showing results for "' + filterKeyword + '"'
        // }
        // setResultFor(
        //   num1 +
        //     ' - ' +
        //     num2 +
        //     ' of ' +
        //     SearchProductList.data.data.total_rows +
        //     ' ' +
        //     message
        // )
      }
      // else {
      //   setResultFor('no results for "' + filterKeyword + '"')
      // }
      router.push({
        pathname: `/search`,
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
        {/* {resultFor} */}
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
