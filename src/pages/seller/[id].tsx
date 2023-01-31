import { useGetSellerProduct } from '@/api/product'
import { useSearchQueryProduct } from '@/api/product/search'
import { useGetSellerInfo } from '@/api/seller'
import { useGetSellerCategory } from '@/api/seller/category'
import { Divider, H2, H3, H4, P } from '@/components'
import cx from '@/helper/cx'
import { useMediaQuery } from '@/hooks'
import MainLayout from '@/layout/MainLayout'
import ProductListingLayout, {
  useProductListing,
} from '@/layout/ProductListingLayout'
import ProductCarousel from '@/sections/home/ProductCarousel'
import type { CategoryData } from '@/types/api/category'
import type { ProductQuery } from '@/types/api/product'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { AiFillStar } from 'react-icons/ai'

const CategoryTab: React.FC<{
  categories: CategoryData[]
  selectedTab: string
  setSelectedTab: (s: string) => void
}> = ({ selectedTab, setSelectedTab, categories }) => {
  const [categoryOpen, setCategoryOpen] = useState(false)
  const sm = useMediaQuery('sm')

  return (
    <div className="tabs-boxed z-10 grid w-full grid-cols-2 bg-primary bg-opacity-10 sm:grid-cols-5 ">
      {sm ? (
        <div className="tabs col-span-4 flex-nowrap items-center space-x-5 overflow-auto">
          <button
            onClick={() => setSelectedTab('')}
            className={cx(
              'tab-lg w-1/2 min-w-max text-center text-base sm:w-1/4',
              selectedTab === '' ? 'tab-active' : ''
            )}
          >
            All Item
          </button>
          {categories.length <= 4 ? (
            categories.map((item, index) => {
              return (
                <button
                  key={index}
                  onClick={() => setSelectedTab(item.name)}
                  className={cx(
                    'tab-lg w-1/4 min-w-max text-center text-base',
                    selectedTab === item.name ? 'tab-active' : ''
                  )}
                >
                  {item.name}
                </button>
              )
            })
          ) : (
            <>
              {categories.slice(0, 3).map((item, index) => {
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedTab(item.name)}
                    className={cx(
                      'tab-lg w-1/4 min-w-max text-center text-base',
                      selectedTab === item.name ? 'tab-active' : ''
                    )}
                  >
                    {item.name}
                  </button>
                )
              })}
            </>
          )}
        </div>
      ) : (
        <div className="tabs flex-nowrap items-center space-x-5 overflow-auto">
          <button
            onClick={() => setSelectedTab('')}
            className={cx(
              'tab-lg w-full min-w-max text-center text-base',
              selectedTab === '' ? 'tab-active' : ''
            )}
          >
            All Item
          </button>
        </div>
      )}
      <>
        {sm ? (
          categories.length > 4 ? (
            <div className="dropdown dropdown-end dropdown-hover mx-auto w-full">
              <label
                tabIndex={0}
                className="btn-outline btn-primary btn w-full border-0 text-base font-normal"
              >
                Other Category
              </label>
              <button
                className="bg-transparent text-2xl text-white md:hidden "
                type="button"
                onClick={() => setCategoryOpen(!categoryOpen)}
              ></button>

              <ul
                tabIndex={0}
                className="dropdown-content dropdown-end dropdown-hover menu rounded-box w-52 bg-base-100 p-2 shadow"
              >
                {categories.slice(3, 999).map((item, index) => {
                  return (
                    <li key={index} className="">
                      <button
                        onClick={() => setSelectedTab(item.name)}
                        className={cx(
                          'flexitems-center tab-lg my-auto min-w-max flex-auto justify-center px-10 text-center ',
                          selectedTab === item.name ? 'tab-active' : ''
                        )}
                      >
                        {item.name}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ) : (
            <></>
          )
        ) : (
          <>
            <div className="dropdown dropdown-end dropdown-hover mx-auto w-full">
              <label
                tabIndex={0}
                className="btn-outline btn-primary btn w-full border-0 text-base font-normal"
              >
                Other Category
              </label>
              <button
                className="bg-transparent text-2xl text-white md:hidden "
                type="button"
                onClick={() => setCategoryOpen(!categoryOpen)}
              ></button>

              <ul
                tabIndex={0}
                className="dropdown-content dropdown-end menu rounded-box w-52 bg-base-100 p-2 shadow"
              >
                {categories.slice(0, 999).map((item, index) => {
                  return (
                    <li key={index} className="">
                      <button
                        onClick={() => setSelectedTab(item.name)}
                        className={cx(
                          'flexitems-center tab-lg my-auto min-w-max flex-auto justify-center text-center ',
                          selectedTab === item.name ? 'tab-active' : ''
                        )}
                      >
                        {item.name}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          </>
        )}
      </>
    </div>
  )
}

function Seller() {
  const [selectedTab, setSelectedTab] = useState('')
  const [, setFlag] = useState(true)
  const param = useRouter()
  const controller = useProductListing()
  const [locationState, setLocationState] = useState('')
  const [, setCategoryState] = useState('')
  const INF = 1000000000

  const md = useMediaQuery('md')
  const [queryParam] = useState<Map<string, string>>(new Map<string, string>())
  const sellerProfile = useGetSellerInfo(param.query.id as string)
  const sellerCategory = useGetSellerCategory(param.query.id as string)
  const product = useGetSellerProduct(
    1,
    6,
    '',
    '',
    'unit_sold',
    'desc',
    0,
    0,
    0,
    0,
    param.query.id as string
  )

  const {
    sortBy,
    setSortBy,
    filterPrice,
    filterRating,
    filterLocation,
    filterCategory,
    page,
    setPage,
  } = controller

  useEffect(() => {
    setPage(1)
  }, [selectedTab])

  useEffect(() => {
    setSortBy({ sort: 'DESC', sort_by: 'unit_sold' })
  }, [])

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

  const productQuery: ProductQuery = {
    search: '',
    category: selectedTab,
    limit: 20,
    page: page,
    sort_by: sortBy.sort_by,
    sort: sortBy.sort,
    min_price: filterPrice !== undefined ? filterPrice.min : 0,
    max_price: filterPrice !== undefined ? filterPrice.max : INF,
    min_rating: filterRating,
    max_rating: 5,
    shop_id: param.query.id as string,
    province_ids: locationState,
  }

  const SearchProductList = useSearchQueryProduct(productQuery)

  return (
    <>
      <div>
        <Head>
          <title>Seller | Murakali</title>
          <meta name="description" content="Murakali E-Commerce Application" />
        </Head>
        <MainLayout>
          <div className="rounded bg-primary bg-opacity-5 py-5">
            <div className="flex flex-col items-center sm:flex-row">
              {sellerProfile.data?.data ? (
                <>
                  <div className="relative -z-0 mb-6 flex h-[150px] w-[150px] justify-center rounded-full sm:mb-0 md:h-[200px] md:w-[200px]">
                    <img
                      src={sellerProfile.data.data.photo_url}
                      alt={sellerProfile.data.data.name}
                      className={
                        'z-10 aspect-square w-full rounded-full object-cover shadow-lg'
                      }
                      height={150}
                      width={150}
                    />
                    <div className="absolute top-1/2 left-1/2 -z-0 hidden h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white sm:block md:h-[280px] md:w-[280px]" />
                    <div className="absolute top-1/2 left-0 -z-0 hidden h-[300px]  w-[150px] -translate-y-1/2 -translate-x-[50%] bg-white sm:block md:w-[300px]" />
                  </div>
                  <div className="z-10 col-span-4 ml-[30px] flex w-full flex-grow flex-col px-1 sm:w-auto sm:px-3 md:ml-[40px] md:px-5">
                    <H2 className="mb-3 flex flex-col gap-4 font-normal leading-3 md:mb-0 md:flex-row md:leading-normal">
                      <span className="font-extrabold leading-snug text-primary">
                        {sellerProfile.data.data.name}
                      </span>
                    </H2>
                    <P className="mt-2 flex gap-4">
                      Total Product
                      <span className="text-primary">
                        {sellerProfile.data.data.total_product} Products
                      </span>
                    </P>
                    <P className="flex gap-4">
                      Total Rating
                      <span className="text-primary">
                        {sellerProfile.data.data.total_rating} Rating
                      </span>
                    </P>
                    <P className="mb-2 flex items-start gap-4">
                      Rating Avg
                      <span className="flex items-center gap-1 text-primary">
                        <AiFillStar className="text-accent" />{' '}
                        {sellerProfile.data.data.rating_avg} Rating
                      </span>
                    </P>
                    {md ? (
                      sellerCategory.data?.data ? (
                        <CategoryTab
                          categories={sellerCategory.data.data}
                          selectedTab={selectedTab}
                          setSelectedTab={setSelectedTab}
                        />
                      ) : (
                        <></>
                      )
                    ) : (
                      <></>
                    )}
                  </div>
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
          {!md ? (
            sellerCategory.data?.data ? (
              <CategoryTab
                categories={sellerCategory.data.data}
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
              />
            ) : (
              <></>
            )
          ) : (
            <></>
          )}
          <div className="flex justify-between ">
            <H3>Most Purchased Products</H3>
            <H4 className="self-end">
              <a href="#allproducts">See All</a>
            </H4>
          </div>
          <ProductCarousel product={product.data?.data?.rows ?? []} />
          <div id="allproducts"></div>
          <Divider />
          <H3 id="seller-products">Seller Products</H3>
          {SearchProductList.isLoading ? (
            <ProductListingLayout controller={controller} isLoading={true} />
          ) : SearchProductList.data?.data &&
            SearchProductList.data.data.rows ? (
            <ProductListingLayout
              controller={controller}
              isLoading={false}
              data={SearchProductList.data.data.rows}
              totalPage={SearchProductList.data.data.total_pages}
              noCategory={true}
            />
          ) : (
            <div>handle error</div>
          )}
        </MainLayout>
      </div>
    </>
  )
}

export default Seller
