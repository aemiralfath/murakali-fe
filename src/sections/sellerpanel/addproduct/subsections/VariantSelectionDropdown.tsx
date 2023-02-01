import React, { Fragment, useEffect, useRef } from 'react'
import { HiChevronRight, HiChevronDown } from 'react-icons/hi'

import { Divider } from '@/components'
import cx from '@/helper/cx'
import getKey from '@/helper/getKey'

import { Popover, Transition } from '@headlessui/react'

const VariantSelectionDropdown: React.FC<{
  variantType: string[]
  variantNames: string[][]
  selectKey: string[]
  setSelectKey: (s: string[]) => void
}> = ({ variantType, variantNames, selectKey, setSelectKey }) => {
  const isSelected = (index: number, vname: string) => {
    if (index === 0) {
      if ((variantNames[1]?.length ?? 0) > 0) {
        const selected = selectKey.filter((k) => k.includes(`1-${vname}`))
        return selected.length === variantNames[1]?.length
      } else {
        let ans = false
        selectKey.forEach((k) => {
          if (k.includes(`1-${vname}`)) {
            ans = true
          }
        })
        return ans
      }
    } else {
      const selected = selectKey.filter((k) => k.includes(`2-${vname}`))
      return selected.length === variantNames[0]?.length
    }
  }

  const toggleSelected = (index: number, vname: string) => {
    if (isSelected(index, vname)) {
      setSelectKey(
        selectKey.filter((k) => !k.includes(`${index + 1}-${vname}`))
      )
    } else {
      if ((variantNames[1]?.length ?? 0) > 0) {
        const temp: Array<string> = []
        variantNames[index === 0 ? 1 : 0]?.forEach((n) => {
          const key = getKey(index === 0 ? vname : n, index === 0 ? n : vname)
          if (!selectKey.includes(key)) {
            temp.push(key)
          }
        })
        setSelectKey([...selectKey, ...temp])
      } else {
        const key = getKey(vname)
        if (!selectKey.includes(key)) {
          setSelectKey([...selectKey, key])
        }
      }
    }
  }

  const toggleSelectAll = () => {
    if (
      selectKey.length ===
      Number(variantNames[0]?.length) *
        Number(variantNames[1]?.length === 0 ? 1 : variantNames[1]?.length)
    ) {
      setSelectKey([])
    } else {
      const temp: Array<string> = []
      variantNames[0]?.forEach((vname1) => {
        if ((variantNames[1]?.length ?? 0) > 0) {
          variantNames[1]?.forEach((vname2) => {
            const key = getKey(vname1, vname2)
            temp.push(key)
          })
        } else {
          const key = getKey(vname1)
          temp.push(key)
        }
      })
      setSelectKey(temp)
    }
  }

  const topCheckboxRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (typeof window !== 'undefined' && topCheckboxRef?.current !== null) {
      if (selectKey.length > 0) {
        if (
          selectKey.length ===
          Number(variantNames[0]?.length) *
            Number(variantNames[1]?.length === 0 ? 1 : variantNames[1]?.length)
        ) {
          topCheckboxRef.current.checked = true
          topCheckboxRef.current.indeterminate = false
        } else {
          topCheckboxRef.current.checked = false
          topCheckboxRef.current.indeterminate = true
        }
      } else {
        topCheckboxRef.current.checked = false
        topCheckboxRef.current.indeterminate = false
      }
    }
  }, [selectKey])

  return (
    <div className="flex items-center gap-2">
      <div className="flex w-fit items-center gap-2 rounded-lg bg-base-200 px-3 py-3">
        <input
          type={'checkbox'}
          className={'checkbox'}
          ref={topCheckboxRef}
          onClick={toggleSelectAll}
        />
        <Popover className="relative w-full">
          {({ open }) => (
            <>
              <Popover.Button
                className={cx('btn btn-ghost btn-xs focus-within:outline-none')}
              >
                <span className={cx('transform', open ? 'rotate-180' : '')}>
                  <HiChevronRight />
                </span>
              </Popover.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 -translate-x-[0.1rem]"
                enterTo="opacity-100 translate-x-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-x-0"
                leaveTo="opacity-0 -translate-x-[0.1rem]"
              >
                <Popover.Panel className="absolute right-0 top-1/2 z-10 w-fit translate-x-[110%] -translate-y-1/2 transform px-4 sm:px-0">
                  <div className="flex flex-col items-start gap-2 overflow-hidden rounded-lg border bg-white p-2 shadow-lg">
                    <div className="whitespace-nowrap text-xs text-gray-500">
                      Select Products
                    </div>
                    {variantType.map((type, idx) => {
                      if (type !== '') {
                        return (
                          <Popover
                            className="relative w-full rounded border"
                            key={type}
                          >
                            {({ open }) => (
                              <>
                                <div className="flex items-center justify-between gap-2 p-2">
                                  <div className="flex items-center gap-2">
                                    <span className="pl-2">{type}</span>
                                  </div>
                                  <Popover.Button
                                    className={cx(
                                      'btn btn-ghost btn-xs px-3 focus-within:outline-none'
                                    )}
                                  >
                                    <span
                                      className={cx(
                                        'transform',
                                        open ? 'rotate-180' : ''
                                      )}
                                    >
                                      <HiChevronDown />
                                    </span>
                                  </Popover.Button>
                                </div>
                                <Transition
                                  as={Fragment}
                                  enter="transition-all ease-out duration-200"
                                  enterFrom="opacity-0 scale-y-0"
                                  enterTo="opacity-100 scale-y-100"
                                  leave="transition-all ease-in duration-150"
                                  leaveFrom="opacity-100 scale-y-100"
                                  leaveTo="opacity-0 scale-y-0"
                                >
                                  <Popover.Panel className="flex origin-top flex-col gap-2 px-4 pb-2 sm:px-0 ">
                                    <Divider />
                                    {variantNames[idx]?.map((name) => {
                                      return (
                                        <div
                                          className="flex items-center gap-2 px-2 text-sm"
                                          key={`${type}-${name}`}
                                        >
                                          <input
                                            type="checkbox"
                                            className="checkbox checkbox-xs mx-0.5"
                                            checked={isSelected(idx, name)}
                                            onChange={() => {
                                              toggleSelected(idx, name)
                                            }}
                                          />
                                          <span>{name}</span>
                                        </div>
                                      )
                                    })}
                                  </Popover.Panel>
                                </Transition>
                              </>
                            )}
                          </Popover>
                        )
                      } else {
                        return <></>
                      }
                    })}
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  )
}

export default VariantSelectionDropdown
