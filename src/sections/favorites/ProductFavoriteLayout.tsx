import { A, H4, P, PaginationNav } from '@/components'

import React, { useEffect, useState } from 'react'
import { HiArrowDown, HiArrowUp, HiFilter, HiX } from 'react-icons/hi'
import CategoryFilter from '@/sections/productslisting/CategoryFilter'
import cx from '@/helper/cx'
import { useMediaQuery } from '@/hooks'
import { Transition } from '@headlessui/react'
import Image from 'next/image'

import type { SortBy } from '@/types/helper/sort'
import type { BriefProduct } from '@/types/api/product'
import ProductCard from '@/layout/template/product/ProductCard'
import { useGetAllCategory } from '@/api/category'
import type { CategoryData } from '@/types/api/category'

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

const useFavoriteProductListing = () => {
  const [sortBy, setSortBy] = useState<SortBy>({ sort_by: '', sort: '' })

  const [filterCategory, setFilterCategory] = useState<string>('')

  const [page, setPage] = useState(1)

  return {
    sortBy,
    setSortBy,
    filterCategory,
    setFilterCategory,
    page,
    setPage,
  }
}

export type ProductListingHook = ReturnType<typeof useFavoriteProductListing>

type ProductFavoriteLayoutProps = LoadingDataWrapper<BriefProduct[]> & {
  controller: ProductListingHook
  totalPage?: number
}

const ProductFavoriteLayout: React.FC<ProductFavoriteLayoutProps> = ({
  data,
  isLoading,
  controller,
  totalPage,
}) => {
  const {
    sortBy,
    setSortBy,
    filterCategory,
    setFilterCategory,
    page,
    setPage,
  } = controller

  const lg = useMediaQuery('lg')

  const [openMenu, setOpenMenu] = useState(false)

  const [categoryList, setCategoryList] = useState<CategoryData[]>([])

  const useCategory = useGetAllCategory()

  useEffect(() => {
    if (useCategory.isSuccess) {
      setCategoryList(useCategory.data?.data)
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
          <CategoryFilter
            categories={categoryList}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
          />
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
                          sortBy.sort === 'ASC'
                          ? 'bg-primary text-xs text-white'
                          : ''
                      )}
                      onClick={() => {
                        if (
                          sortBy.sort_by === sorting.sort_by &&
                          sortBy.sort === 'ASC'
                        ) {
                          setSortBy({ ...sortBy, sort_by: '', sort: '' })
                        } else {
                          setSortBy({
                            ...sortBy,
                            sort_by: sorting.sort_by,
                            sort: 'ASC',
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
                          sortBy.sort === 'DESC'
                          ? 'bg-primary text-xs text-white'
                          : ''
                      )}
                      onClick={() => {
                        if (
                          sortBy.sort_by === sorting.sort_by &&
                          sortBy.sort === 'DESC'
                        ) {
                          setSortBy({ ...sortBy, sort_by: '', sort: '' })
                        } else {
                          setSortBy({
                            ...sortBy,
                            sort_by: sorting.sort_by,
                            sort: 'DESC',
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
                  {filterCategory.length === 0 ? (
                    <span className="h-[1.5rem] italic text-gray-400">
                      No Filter
                    </span>
                  ) : (
                    <>
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
        <div className="min-h-[30vh] w-full">
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
                    forFavPage={true}
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

export default ProductFavoriteLayout
export { useFavoriteProductListing }
