import React, { useEffect, useState } from 'react'

import Head from 'next/head'
import { useRouter } from 'next/router'

import { useGetAllCategory } from '@/api/category'
import { useSearchQueryProduct } from '@/api/product/search'
import { Breadcrumbs } from '@/components'
import ProductListingLayout, {
  useProductListing,
} from '@/layout/ProductListingLayout'
import { Navbar } from '@/layout/template'
import Footer from '@/layout/template/footer'
import TitlePageExtend from '@/layout/template/navbar/TitlePageExtend'
import type { CategoryData } from '@/types/api/category'
import type { ProductQuery } from '@/types/api/product'

import type { NextPage } from 'next'

const FilterCategoryName: NextPage = () => {
  const router = useRouter()
  const INF = 1000000000

  const { catName } = router.query
  const [queryParam] = useState<Map<string, string>>(new Map<string, string>())

  const [flag, setFlag] = useState(true)
  const [locationState, setLocationState] = useState('')
  const [categoryState, setCategoryState] = useState(String(catName))
  const [categoryTitle, setCategoryTitle] = useState<
    Array<{ name: string; link: string }>
  >([])
  const controller = useProductListing()
  const {
    sortBy,
    filterPrice,
    filterRating,
    filterLocation,
    filterCategory,
    setFilterCategory,
    page,
  } = controller

  const useCategory = useGetAllCategory()

  useEffect(() => {
    if (useCategory.isSuccess) {
      if (useCategory.data.data) {
        useCategory.data.data.map((category) => {
          if (category.name !== categoryState) {
            category.child_category.map((child) => {
              if (child.name !== categoryState) {
                child.child_category?.map((child2) => {
                  if (child2.name === categoryState) {
                    setCategoryTitle([
                      {
                        name: category.name,
                        link: `/cat/${category.name}`,
                      },
                      {
                        name: child.name,
                        link: `/cat/${child.name}`,
                      },
                      {
                        name: child2.name,
                        link: `/cat/${child2.name}`,
                      },
                    ])
                  }
                })
              } else {
                setCategoryTitle([
                  {
                    name: category.name,
                    link: `/cat/${category.name}`,
                  },
                  {
                    name: child.name,
                    link: `/cat/${child.name}`,
                  },
                ])
              }
            })
          } else {
            setCategoryTitle([
              {
                name: category.name,
                link: `/cat/${category.name}`,
              },
            ])
          }
        })
      }
    }
  }, [useCategory.isSuccess, categoryState])

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
    const queryCategory = filterCategory
    setCategoryState(queryCategory)
    setFlag(true)
  }, [filterCategory])

  useEffect(() => {
    const queryCategory = String(catName)
    setCategoryState(queryCategory)
    setFilterCategory(queryCategory)
    setFlag(true)
  }, [catName])

  useEffect(() => {
    queryParam.set('page', String(page))
    setFlag(true)
  }, [page])

  const productQuery: ProductQuery = {
    search: '',
    category: String(categoryState),
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
    listed_status: 1,
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
      router.push({
        pathname: `/cat/${categoryState}`,
        query: stringQuery,
      })
    }
  }, [flag])

  return (
    <>
      <Head>
        <title>Category Product - Murakali</title>
        <meta name="description" content="Murakali E-Commerce Application" />
      </Head>
      <Navbar />
      <TitlePageExtend title={categoryState} />
      <div className="container mx-auto mt-3">
        <div className="my-3 ml-3">
          <Breadcrumbs data={categoryTitle} />
        </div>
        {SearchProductList.isLoading ? (
          <ProductListingLayout controller={controller} isLoading={true} />
        ) : SearchProductList.data?.data?.rows ? (
          <ProductListingLayout
            controller={controller}
            isLoading={false}
            data={SearchProductList.data.data.rows}
            isCategoryPage={true}
            totalPage={SearchProductList.data.data.total_pages}
          />
        ) : (
          <></>
        )}
      </div>
      <Footer />
    </>
  )
}

export default FilterCategoryName

export async function getServerSideProps() {
  return {
    props: {},
  }
}
