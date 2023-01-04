import { useGetAllProvince } from '@/api/user/address/extra'
import {
  A,
  Button,
  Divider,
  H3,
  H4,
  P,
  PaginationNav,
  RatingStars,
  TextInput,
} from '@/components'
import productListingCategory from '@/dummy/productListingCategory'
import { useDebounce } from '@/hooks'
import type { ProvinceDetail } from '@/types/api/address'
import { Menu, Transition } from '@headlessui/react'
import React, { Fragment, useState } from 'react'
import {
  HiArrowDown,
  HiArrowUp,
  HiCalendar,
  HiChevronDown,
  HiChevronRight,
  HiChevronUp,
  HiFilter,
  HiSearch,
  HiSortDescending,
} from 'react-icons/hi'

const ProvinceBtnMenu: React.FC<{
  provinces: ProvinceDetail[]
  addSelectedProvince: (p: ProvinceDetail) => void
  removeSelectedProvince: (p: ProvinceDetail) => void
  isSelected: (p: ProvinceDetail) => boolean
}> = ({
  provinces,
  addSelectedProvince,
  removeSelectedProvince,
  isSelected,
}) => {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)

  return (
    <Menu as="div" className="relative w-full">
      <Menu.Button className="btn-ghost btn-sm btn flex w-full items-center gap-2 rounded bg-white text-primary">
        Show All <HiChevronRight />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 top-1/2 h-[16rem] w-56 origin-left -translate-y-1/2 translate-x-[100%] divide-y divide-gray-100 overflow-auto rounded border bg-white shadow-lg">
          <div className="relative p-2">
            <input
              className="input-bordered input input-sm w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <HiSearch className="pointer-events-none absolute right-0 top-1/2 mr-4 -translate-y-1/2 opacity-50" />
          </div>
          {provinces
            .filter((p) => {
              if (debouncedSearch === '') {
                return true
              } else {
                return p.province
                  .toLowerCase()
                  .includes(debouncedSearch.toLowerCase())
              }
            })
            .map((p, idx) => {
              const checked = isSelected(p)
              return (
                <Menu.Item key={idx}>
                  <div className="p-2">
                    <label className="flex cursor-pointer items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        className="checkbox-primary checkbox checkbox-xs border-gray-300"
                        defaultChecked={checked}
                        checked={checked}
                        onChange={() => {
                          if (checked) {
                            removeSelectedProvince(p)
                          } else {
                            addSelectedProvince(p)
                          }
                        }}
                      />
                      <span className="line-clamp-1">{p.province}</span>
                    </label>
                  </div>
                </Menu.Item>
              )
            })}
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

const ProductListingLayout: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const defaultShownProvince = [
    'DKI Jakarta',
    'Jawa Barat',
    'DI Yogyakarta',
    'Jawa Timur',
    'Sumatera Selatan',
  ]
  const allProvince = useGetAllProvince()

  const [shownProvince, setShownProvince] = useState(defaultShownProvince)
  const [selectedProvince, setSelectedProvince] = useState<ProvinceDetail[]>([])
  const addSelectedProvince = (p: ProvinceDetail) => {
    if (defaultShownProvince.includes(p.province)) {
      setShownProvince(shownProvince)
    } else {
      setShownProvince([p.province, ...shownProvince])
    }
    setSelectedProvince([p, ...selectedProvince])
  }
  const removeSelectedProvince = (p: ProvinceDetail) => {
    if (defaultShownProvince.includes(p.province)) {
      setShownProvince(shownProvince)
    } else {
      setShownProvince(
        shownProvince.filter((psdetail) => psdetail !== p.province)
      )
    }
    setSelectedProvince(
      selectedProvince.filter((ps) => ps.province_id !== p.province_id)
    )
  }
  const isSelected = (p: ProvinceDetail) => {
    return selectedProvince.includes(p)
  }

  const [showAllCategory, setShowAllCategory] = useState(false)

  return (
    <div className="flex gap-3">
      <div className="w-[14rem]">
        <div className="flex w-full flex-col gap-3 rounded border py-2 px-3">
          <div>
            <H4>Location</H4>
            <div className="mt-1 flex flex-col gap-1">
              {allProvince.data?.data ? (
                <>
                  {shownProvince.map((data, idx) => {
                    const provinceIdx = allProvince.data.data.rows.findIndex(
                      (province) => province.province === data
                    )
                    if (provinceIdx === -1) {
                      return <></>
                    }

                    const province = allProvince.data.data.rows[provinceIdx]
                    const checked = isSelected(province)
                    return (
                      <label
                        className="flex cursor-pointer items-center gap-2 text-sm"
                        key={idx}
                      >
                        <input
                          type="checkbox"
                          className="checkbox-primary checkbox checkbox-xs border-gray-300"
                          defaultChecked={checked}
                          checked={checked}
                          onChange={() => {
                            if (checked) {
                              removeSelectedProvince(province)
                            } else {
                              addSelectedProvince(province)
                            }
                          }}
                        />
                        <span className="line-clamp-1">{data}</span>
                      </label>
                    )
                  })}
                  <ProvinceBtnMenu
                    provinces={allProvince.data.data.rows}
                    addSelectedProvince={addSelectedProvince}
                    removeSelectedProvince={removeSelectedProvince}
                    isSelected={isSelected}
                  />
                </>
              ) : (
                <div className="h-[8rem] w-full animate-pulse rounded bg-base-300" />
              )}
            </div>
          </div>
          <Divider />
          <div>
            <H4>Price Range</H4>
            <div className="mt-1">
              <div className="flex max-w-full flex-col gap-2">
                <TextInput
                  type={'number'}
                  placeholder={'Minimum'}
                  min={'0'}
                  fit
                  inputSize="sm"
                  leftIcon={
                    <P className="text-sm font-semibold opacity-50">Rp.</P>
                  }
                />
                <TextInput
                  type={'number'}
                  placeholder={'Maximum'}
                  min={'0'}
                  fit
                  inputSize="sm"
                  leftIcon={
                    <P className="text-sm font-semibold opacity-50">Rp.</P>
                  }
                />
              </div>
              <div className="mt-2 flex w-full justify-end">
                <A className="flex items-center gap-1 text-sm font-semibold text-primary">
                  <HiFilter /> Filter
                </A>
              </div>
            </div>
          </div>
          <Divider />
          <div>
            <H4>Rating</H4>
            <div className="mt-1 flex flex-col">
              <div className="flex max-w-fit cursor-pointer items-center gap-2 rounded-full py-1 px-2 transition-all hover:bg-accent hover:bg-opacity-10">
                <RatingStars rating={5} />
                <P className="text-sm">and above</P>
              </div>
              <div className="flex max-w-fit cursor-pointer items-center gap-2 rounded-full py-1 px-2 transition-all hover:bg-accent hover:bg-opacity-10">
                <RatingStars rating={4} />
                <P className="text-sm">and above</P>
              </div>
              <div className="flex max-w-fit cursor-pointer items-center gap-2 rounded-full py-1 px-2 transition-all hover:bg-accent hover:bg-opacity-10">
                <RatingStars rating={3} />
                <P className="text-sm">and above</P>
              </div>
              <div className="flex max-w-fit cursor-pointer items-center gap-2 rounded-full py-1 px-2 transition-all hover:bg-accent hover:bg-opacity-10">
                <RatingStars rating={2} />
                <P className="text-sm">and above</P>
              </div>
              <div className="flex max-w-fit cursor-pointer items-center gap-2 rounded-full py-1 px-2 transition-all hover:bg-accent hover:bg-opacity-10">
                <RatingStars rating={1} />
                <P className="text-sm">and above</P>
              </div>
            </div>
          </div>
          <Divider />
          <div>
            <H4>Category</H4>
            <div className="mt-1 flex flex-col gap-1">
              {productListingCategory
                .slice(0, showAllCategory ? 10 : 4)
                .map((data, idx) => {
                  return (
                    <label
                      className="flex cursor-pointer items-center gap-2 text-sm"
                      key={idx}
                    >
                      <input
                        type="checkbox"
                        className="checkbox-primary checkbox checkbox-xs border-gray-300"
                      />
                      <span className="line-clamp-1">{data}</span>
                    </label>
                  )
                })}
              {productListingCategory.length > 4 ? (
                <button
                  className="btn-ghost btn-sm btn flex w-full items-center gap-2 rounded bg-white text-primary"
                  onClick={() => setShowAllCategory(!showAllCategory)}
                >
                  {showAllCategory ? (
                    <>
                      Hide <HiChevronUp />
                    </>
                  ) : (
                    <>
                      Show All <HiChevronDown />
                    </>
                  )}
                </button>
              ) : (
                <></>
              )}
            </div>
          </div>
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
          <PaginationNav
            total={12}
            page={2}
            onChange={(p) => {
              console.log(p)
            }}
            size="sm"
          />
        </div>
      </div>
    </div>
  )
}

export default ProductListingLayout
