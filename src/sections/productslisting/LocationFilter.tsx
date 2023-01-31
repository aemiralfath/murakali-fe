import { H4 } from '@/components'
import { useDebounce } from '@/hooks'
import { Menu, Transition } from '@headlessui/react'
import React, { Fragment, useState } from 'react'
import { HiChevronDown, HiSearch } from 'react-icons/hi'
import type { Province, ProvinceDetail } from '@/types/api/address'
import type { UseQueryResult } from '@tanstack/react-query'
import type { APIResponse } from '@/types/api/response'

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
      <Menu.Button className="btn btn-ghost btn-sm flex w-full items-center gap-2 rounded bg-white text-primary">
        Show All <HiChevronDown />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95 "
      >
        <Menu.Items className="absolute right-1/2 top-[110%] z-20 h-[16rem] w-56 origin-top translate-x-1/2 divide-y divide-gray-100 overflow-auto rounded border bg-white shadow-lg">
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

const LocationFilter: React.FC<{
  provinces: UseQueryResult<APIResponse<Province>, unknown>
  defaultShownProvince: string[]
  shownProvince: string[]
  setShownProvince: (p: string[]) => void
  filterLocation: ProvinceDetail[]
  setFilterLocation: (p: ProvinceDetail[]) => void
}> = ({
  provinces,
  defaultShownProvince,
  shownProvince,
  setShownProvince,
  filterLocation,
  setFilterLocation,
}) => {
  const addSelectedProvince = (p: ProvinceDetail) => {
    if (defaultShownProvince.includes(p.province)) {
      setShownProvince(shownProvince)
    } else {
      setShownProvince([p.province, ...shownProvince])
    }
    setFilterLocation([p, ...filterLocation])
  }
  const removeSelectedProvince = (p: ProvinceDetail) => {
    if (defaultShownProvince.includes(p.province)) {
      setShownProvince(shownProvince)
    } else {
      setShownProvince(
        shownProvince.filter((psdetail) => psdetail !== p.province)
      )
    }
    setFilterLocation(
      filterLocation.filter((ps) => ps.province_id !== p.province_id)
    )
  }
  const isProvinceSelected = (p: ProvinceDetail) => {
    return filterLocation.includes(p)
  }

  return (
    <div>
      <H4>Location</H4>
      <div className="mt-1 flex flex-col gap-1">
        {provinces.data?.data?.rows ? (
          <>
            {shownProvince.map((data, idx) => {
              const provinceIdx =
                provinces.data?.data?.rows.findIndex(
                  (province) => province.province === data
                ) ?? -1
              if (provinceIdx === -1) {
                return <></>
              }

              const province = provinces.data.data?.rows[provinceIdx]
              const checked = province ? isProvinceSelected(province) : false
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
                      if (province) {
                        if (checked) {
                          removeSelectedProvince(province)
                        } else {
                          addSelectedProvince(province)
                        }
                      }
                    }}
                  />
                  <span className="line-clamp-1">{data}</span>
                </label>
              )
            })}
            <ProvinceBtnMenu
              provinces={provinces.data.data.rows}
              addSelectedProvince={addSelectedProvince}
              removeSelectedProvince={removeSelectedProvince}
              isSelected={isProvinceSelected}
            />
          </>
        ) : (
          <div className="h-[8rem] w-full animate-pulse rounded bg-base-300" />
        )}
      </div>
    </div>
  )
}

export default LocationFilter
