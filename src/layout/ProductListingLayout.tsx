import { useGetAllProvince } from '@/api/user/address/extra'
import { A, Divider, H4, P, PaginationNav } from '@/components'
import LocationFilter from '@/sections/productslisting/LocationFilter'
import React, { useEffect, useState } from 'react'
import { HiArrowDown, HiArrowUp, HiFilter, HiX } from 'react-icons/hi'
import PriceFilter from '@/sections/productslisting/PriceFilter'
import RatingFilter from '@/sections/productslisting/RatingFilter'
import CategoryFilter from '@/sections/productslisting/CategoryFilter'
import formatMoney from '@/helper/formatMoney'
import cx from '@/helper/cx'
import { useMediaQuery } from '@/hooks'
import { Transition } from '@headlessui/react'
import ProductCard from './template/product/ProductCard'
import Image from 'next/image'

import type { FilterPrice } from '@/sections/productslisting/PriceFilter'
import type { ProvinceDetail } from '@/types/api/address'
import type { SortBy } from '@/types/helper/sort'
import type { BriefProduct } from '@/types/api/product'
import { useGetAllCategory } from '@/api/category'
import { useRouter } from 'next/router'

const defaultShownProvince = [
  'DKI Jakarta',
  'Jawa Barat',
  'DI Yogyakarta',
  'Jawa Timur',
  'Sumatera Selatan',
]

const FilterChip: React.FC<{ value: string; onClose: () => void }> = ({
  value,
  onClose,
}) => {
  return (
    <div className=" flex items-center gap-1 rounded-full bg-primary bg-opacity-10 py-1 pl-2 pr-1 font-medium text-primary-focus">
      {value}
      <button
        className="flex aspect-square h-[1.5rem] items-center justify-center rounded-full border border-white bg-primary text-xs text-white"
        onClick={() => {
          onClose()
        }}
      >
        <HiX />
      </button>
    </div>
  )
}

const ButtonSortData = [
  { name: 'date', sort_by: 'created_at' },
  { name: 'price', sort_by: 'min_price' },
  { name: 'sold', sort_by: 'unit_sold' },
  { name: 'view', sort_by: 'view_count' },
]

const useProductListing = () => {
  const [sortBy, setSortBy] = useState<SortBy>({ sort_by: '', direction: '' })

  const [filterLocation, setFilterLocation] = useState<ProvinceDetail[]>([])
  const [filterPrice, setFilterPrice] = useState<FilterPrice>()
  const [filterRating, setFilterRating] = useState<number>(-1)
  const [filterCategory, setFilterCategory] = useState<string>('')

  const [page, setPage] = useState(1)

  return {
    sortBy,
    setSortBy,
    filterLocation,
    setFilterLocation,
    filterPrice,
    setFilterPrice,
    filterRating,
    setFilterRating,
    filterCategory,
    setFilterCategory,
    page,
    setPage,
  }
}

export type ProductListingHook = ReturnType<typeof useProductListing>

type ProductListingLayoutProps = LoadingDataWrapper<BriefProduct[]> & {
  controller: ProductListingHook
  totalPage?: number
  noCategory?: boolean
}

const ProductListingLayout: React.FC<ProductListingLayoutProps> = ({
  data,
  isLoading,
  controller,
  totalPage,
  noCategory,
}) => {
  const {
    sortBy,
    setSortBy,
    filterLocation,
    setFilterLocation,
    filterPrice,
    setFilterPrice,
    filterRating,
    setFilterRating,
    filterCategory,
    setFilterCategory,
    page,
    setPage,
  } = controller

  const lg = useMediaQuery('lg')
  const allProvince = useGetAllProvince()
  const [shownProvince, setShownProvince] = useState(defaultShownProvince)
  const [openMenu, setOpenMenu] = useState(false)
  const [categoryName, setCategoryName] = useState<string[]>([])
  const useCategory = useGetAllCategory()

  const router = useRouter()
  const { catName } = router.query

  useEffect(() => {
    if (catName === undefined) {
      setFilterCategory('')
    } else {
      setFilterCategory(String(catName))
    }
  }, [catName])

  useEffect(() => {
    if (useCategory.isSuccess) {
      const temp: string[] = useCategory.data.data.map(
        (category) => category.name
      )

      setCategoryName(temp)
    }
  }, [useCategory.isSuccess])

  return (
    <div className="flex gap-3">
      <Transition
        show={lg || openMenu}
        enter="transition ease-out duration-50"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
        className="absolute origin-top-left lg:relative"
      >
        <div className="absolute z-40 flex w-[14rem] flex-col gap-3 rounded border bg-white py-2 px-3 shadow-xl lg:relative lg:z-0 lg:shadow-none">
          <LocationFilter
            provinces={allProvince}
            defaultShownProvince={defaultShownProvince}
            shownProvince={shownProvince}
            setShownProvince={setShownProvince}
            filterLocation={filterLocation}
            setFilterLocation={setFilterLocation}
          />
          <Divider />
          <PriceFilter setFilterPrice={setFilterPrice} />
          <Divider />
          <RatingFilter
            filterRating={filterRating}
            setFilterRating={setFilterRating}
          />
          {noCategory ? (
            <></>
          ) : (
            <>
              <Divider />

              <CategoryFilter
                categories={categoryName}
                filterCategory={filterCategory}
                setFilterCategory={setFilterCategory}
              />
            </>
          )}
        </div>
        <div
          className="absolute h-screen w-screen"
          onClick={() => setOpenMenu(false)}
        />
      </Transition>
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex w-full items-center justify-between rounded border py-2 px-3">
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
        <div className="flex flex-col items-center justify-center gap-3 xl:flex-row">
          <div className="w-full flex-1">
            <div className="flex w-full items-center justify-between rounded border py-2 px-3">
              <div className="flex items-center gap-2">
                <H4>Filter</H4>
                <div className="ml-2 h-[1px] w-8 bg-base-300" />
                <div className=" flex flex-wrap items-center gap-1 rounded-full py-1 pl-2 pr-1">
                  {filterLocation.length === 0 &&
                  filterPrice === undefined &&
                  filterRating === -1 &&
                  filterCategory === '' ? (
                    <span className="h-[1.5rem] italic text-gray-400">
                      No Filter
                    </span>
                  ) : (
                    <>
                      {filterLocation.map((location) => {
                        return (
                          <FilterChip
                            key={`location-${location.province}`}
                            value={location.province}
                            onClose={() => {
                              setFilterLocation(
                                filterLocation.filter(
                                  (l) => l.province_id !== location.province_id
                                )
                              )
                            }}
                          />
                        )
                      })}
                      {filterPrice ? (
                        <FilterChip
                          key={'price'}
                          value={`Rp${formatMoney(
                            filterPrice.min
                          )} - Rp${formatMoney(filterPrice.max)}`}
                          onClose={() => setFilterPrice(undefined)}
                        />
                      ) : (
                        <></>
                      )}
                      {filterRating !== -1 ? (
                        <FilterChip
                          key={'rating'}
                          value={`Rating ${filterRating}+`}
                          onClose={() => setFilterRating(-1)}
                        />
                      ) : (
                        <></>
                      )}

                      <FilterChip
                        key={`category-${filterCategory}`}
                        value={filterCategory}
                        onClose={() => {
                          setFilterCategory('')
                        }}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="block w-full lg:hidden">
            <A
              className="-z-30 flex w-fit items-center gap-1 rounded text-sm font-semibold "
              onClick={() => setOpenMenu(!openMenu)}
            >
              <HiFilter /> Open Filter Menu
            </A>
          </div>
          <PaginationNav
            total={totalPage ?? 1}
            page={page}
            onChange={setPage}
            size="sm"
          />
        </div>
        <div className="min-h-[80vh] w-full">
          <div className="-z-10 grid w-full grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
            {isLoading ? (
              Array(5)
                .fill('')
                .map((_, idx) => {
                  return <ProductCard key={`${idx}`} isLoading />
                })
            ) : data.length === 0 ? (
              <div className="col-span-2 flex w-full flex-col items-center justify-center p-6 sm:col-span-3 md:col-span-4 xl:col-span-6">
                <Image
                  src={'/asset/sorry.svg'}
                  width={300}
                  height={300}
                  alt={'Sorry'}
                />
                <P className="text-sm italic text-gray-400">
                  Sorry, product you requested is not found.
                </P>
              </div>
            ) : (
              data.map((product, idx) => {
                return (
                  <ProductCard
                    key={`${product.title} ${idx}`}
                    data={product}
                    isLoading={false}
                    hoverable
                  />
                )
              })
            )}
          </div>
          {!isLoading && data?.length !== 0 ? (
            <div className="mt-4 flex w-full justify-center">
              <PaginationNav
                total={totalPage ?? 1}
                page={page}
                onChange={setPage}
                size="sm"
              />
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductListingLayout
export { useProductListing }
