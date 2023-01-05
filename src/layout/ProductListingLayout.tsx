import { useGetAllProvince } from '@/api/user/address/extra'
import { Divider, H4, PaginationNav } from '@/components'
import productListingCategory from '@/dummy/productListingCategory'
import LocationFilter from '@/sections/productslisting/LocationFilter'
import React, { useState } from 'react'
import { HiArrowDown, HiArrowUp, HiX } from 'react-icons/hi'
import PriceFilter from '@/sections/productslisting/PriceFilter'
import RatingFilter from '@/sections/productslisting/RatingFilter'
import CategoryFilter from '@/sections/productslisting/CategoryFilter'
import formatMoney from '@/helper/formatMoney'

import type { FilterPrice } from '@/sections/productslisting/PriceFilter'
import type { ProvinceDetail } from '@/types/api/address'
import type { SortDirection } from '@/types/helper/sort'
import cx from '@/helper/cx'

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

const ProductListingLayout = () => {
  const [priceSort, setPriceSort] = useState<SortDirection | undefined>()
  const [dateSort, setDateSort] = useState<SortDirection | undefined>()
  const [ratingSort, setRatingSort] = useState<SortDirection | undefined>()

  const defaultShownProvince = [
    'DKI Jakarta',
    'Jawa Barat',
    'DI Yogyakarta',
    'Jawa Timur',
    'Sumatera Selatan',
  ]
  const allProvince = useGetAllProvince()
  const [shownProvince, setShownProvince] = useState(defaultShownProvince)

  const [filterLocation, setFilterLocation] = useState<ProvinceDetail[]>([])
  const [filterPrice, setFilterPrice] = useState<FilterPrice | undefined>()
  const [filterRating, setFilterRating] = useState<number>(-1)
  const [filterCategory, setFilterCategory] = useState<string[]>([])

  const [page, setPage] = useState(1)

  return (
    <div className="flex gap-3">
      <div className="w-[14rem]">
        <div className="flex w-full flex-col gap-3 rounded border py-2 px-3">
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
          <Divider />
          <CategoryFilter
            categories={productListingCategory}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
          />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex w-full items-center justify-between rounded border py-2 px-3">
          <div className="flex items-center gap-2">
            <H4>Sort</H4>
            <div className="ml-2 h-[1px] w-8 bg-base-300" />
            <div
              className={cx(
                ' flex items-center gap-1 rounded-full py-1 pl-2 pr-1 font-medium',
                priceSort ? 'bg-primary bg-opacity-10 text-primary-focus' : ''
              )}
            >
              Price
              <button
                className={cx(
                  'flex aspect-square h-[1.5rem] items-center justify-center rounded-full border text-xs',
                  priceSort === 'ASC' ? 'bg-primary text-xs text-white' : ''
                )}
                onClick={() => {
                  if (priceSort === 'ASC') {
                    setPriceSort(undefined)
                  } else {
                    setPriceSort('ASC')
                  }
                }}
              >
                <HiArrowUp />
              </button>
              <button
                className={cx(
                  'flex aspect-square h-[1.5rem] items-center justify-center rounded-full border text-xs',
                  priceSort === 'DESC' ? 'bg-primary text-xs text-white' : ''
                )}
                onClick={() => {
                  if (priceSort === 'DESC') {
                    setPriceSort(undefined)
                  } else {
                    setPriceSort('DESC')
                  }
                }}
              >
                <HiArrowDown />
              </button>
            </div>
            <div
              className={cx(
                ' flex items-center gap-1 rounded-full py-1 pl-2 pr-1 font-medium',
                dateSort ? 'bg-primary bg-opacity-10 text-primary-focus' : ''
              )}
            >
              Date
              <button
                className={cx(
                  'flex aspect-square h-[1.5rem] items-center justify-center rounded-full border text-xs',
                  dateSort === 'ASC' ? 'bg-primary text-xs text-white' : ''
                )}
                onClick={() => {
                  if (dateSort === 'ASC') {
                    setDateSort(undefined)
                  } else {
                    setDateSort('ASC')
                  }
                }}
              >
                <HiArrowUp />
              </button>
              <button
                className={cx(
                  'flex aspect-square h-[1.5rem] items-center justify-center rounded-full border text-xs',
                  dateSort === 'DESC' ? 'bg-primary text-xs text-white' : ''
                )}
                onClick={() => {
                  if (dateSort === 'DESC') {
                    setDateSort(undefined)
                  } else {
                    setDateSort('DESC')
                  }
                }}
              >
                <HiArrowDown />
              </button>
            </div>
            <div
              className={cx(
                ' flex items-center gap-1 rounded-full py-1 pl-2 pr-1 font-medium',
                ratingSort ? 'bg-primary bg-opacity-10 text-primary-focus' : ''
              )}
            >
              Rating
              <button
                className={cx(
                  'flex aspect-square h-[1.5rem] items-center justify-center rounded-full border text-xs',
                  ratingSort === 'ASC' ? 'bg-primary text-xs text-white' : ''
                )}
                onClick={() => {
                  if (ratingSort === 'ASC') {
                    setRatingSort(undefined)
                  } else {
                    setRatingSort('ASC')
                  }
                }}
              >
                <HiArrowUp />
              </button>
              <button
                className={cx(
                  'flex aspect-square h-[1.5rem] items-center justify-center rounded-full border text-xs',
                  ratingSort === 'DESC' ? 'bg-primary text-xs text-white' : ''
                )}
                onClick={() => {
                  if (ratingSort === 'DESC') {
                    setRatingSort(undefined)
                  } else {
                    setRatingSort('DESC')
                  }
                }}
              >
                <HiArrowDown />
              </button>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <div className="flex w-full items-center justify-between rounded border py-2 px-3">
              <div className="flex items-center gap-2">
                <H4>Filter</H4>
                <div className="ml-2 h-[1px] w-8 bg-base-300" />
                <div className=" flex flex-wrap items-center gap-1 rounded-full py-1 pl-2 pr-1">
                  {filterLocation.length === 0 &&
                  filterPrice === undefined &&
                  filterRating === -1 &&
                  filterCategory.length === 0 ? (
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
                      {filterCategory.map((category) => {
                        return (
                          <FilterChip
                            key={`category-${category}`}
                            value={category}
                            onClose={() => {
                              setFilterCategory(
                                filterCategory.filter((c) => c !== category)
                              )
                            }}
                          />
                        )
                      })}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <PaginationNav total={12} page={page} onChange={setPage} size="sm" />
        </div>
      </div>
    </div>
  )
}

export default ProductListingLayout
