import { useGetAllProvince } from '@/api/user/address/extra'
import { Divider, H4, PaginationNav } from '@/components'
import productListingCategory from '@/dummy/productListingCategory'
import LocationFilter from '@/sections/productslisting/LocationFilter'
import React, { useState } from 'react'
import { HiArrowDown, HiArrowUp } from 'react-icons/hi'

import type { FilterPrice } from '@/sections/productslisting/PriceFilter'
import type { ProvinceDetail } from '@/types/api/address'
import PriceFilter from '@/sections/productslisting/PriceFilter'
import RatingFilter from '@/sections/productslisting/RatingFilter'
import CategoryFilter from '@/sections/productslisting/CategoryFilter'

const ProductListingLayout = () => {
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
            <div className=" flex items-center gap-1 rounded-full py-1 pl-2 pr-1 font-medium">
              Price
              <button className="flex aspect-square h-[1.5rem] items-center justify-center rounded-full border text-xs">
                <HiArrowUp />
              </button>
              <button className="flex aspect-square h-[1.5rem] items-center justify-center rounded-full border text-xs">
                <HiArrowDown />
              </button>
            </div>
            <div className=" flex items-center gap-1 rounded-full py-1 pl-2 pr-1 font-medium">
              Date
              <button className="flex aspect-square h-[1.5rem] items-center justify-center rounded-full border text-xs">
                <HiArrowUp />
              </button>
              <button className="flex aspect-square h-[1.5rem] items-center justify-center rounded-full border text-xs">
                <HiArrowDown />
              </button>
            </div>
            <div className=" flex items-center gap-1 rounded-full py-1 pl-2 pr-1 font-medium">
              Rating
              <button className="flex aspect-square h-[1.5rem] items-center justify-center rounded-full border text-xs">
                <HiArrowUp />
              </button>
              <button className="flex aspect-square h-[1.5rem] items-center justify-center rounded-full border text-xs">
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
                <div className=" flex items-center gap-1 rounded-full py-1 pl-2 pr-1">
                  <span className="h-[1.5rem] italic text-gray-400">
                    No Filter
                  </span>
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
