import cx from '@/helper/cx'
import toTitleCase from '@/helper/toTitleCase'
import type { CategoryData } from '@/types/api/category'
import { Popover, Transition } from '@headlessui/react'
import React, { Fragment } from 'react'
import { HiChevronRight } from 'react-icons/hi'

const CategorySelector: React.FC<{
  selectedCategory: CategoryData[]
  setSelectedCategory: (s: CategoryData[]) => void
  categoryData?: CategoryData[]
  disabled?: boolean
}> = ({ selectedCategory, setSelectedCategory, categoryData, disabled }) => {
  const handleSelect = (c: CategoryData, idx: number) => {
    if (selectedCategory[idx]) {
      setSelectedCategory(
        selectedCategory
          .map((last, idxx) => {
            if (idx === idxx) {
              return c
            } else {
              return last
            }
          })
          .splice(0, idx + 1)
      )
    } else {
      setSelectedCategory([...selectedCategory, c])
    }
  }

  return (
    <Popover className="relative z-20">
      <Popover.Button
        disabled={disabled}
        className={cx('btn-ghost btn', disabled ? 'btn-disabled' : '')}
      >
        Choose Category
      </Popover.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 -translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 -translate-y-1"
      >
        <Popover.Panel className="absolute right-0 mt-1 w-[300px] transform rounded border bg-white px-4 shadow-md sm:px-0 md:w-[32rem]">
          <div className="grid grid-cols-6 gap-1 divide-x-2 divide-primary divide-opacity-10 p-2">
            <div
              className={
                selectedCategory[0]?.child_category.length > 0
                  ? selectedCategory[1]?.child_category.length > 0
                    ? selectedCategory[2]?.child_category.length > 0
                      ? 'col-span-3'
                      : 'col-span-2'
                    : 'col-span-3'
                  : 'col-span-6'
              }
            >
              {categoryData ? (
                categoryData.map((category) => {
                  return (
                    <div
                      key={category.id}
                      className={cx(
                        'z-20 flex cursor-pointer items-center justify-between rounded p-1 transition-all',
                        selectedCategory[0]?.id === category.id
                          ? 'bg-primary bg-opacity-10 text-primary-focus'
                          : 'hover:bg-primary hover:bg-opacity-5 hover:text-primary-focus'
                      )}
                      onClick={() => handleSelect(category, 0)}
                    >
                      <span>{toTitleCase(category.name)}</span>
                      {selectedCategory[0]?.id === category.id &&
                      category.child_category.length > 0 ? (
                        <HiChevronRight />
                      ) : (
                        <></>
                      )}
                    </div>
                  )
                })
              ) : (
                <div className="text-sm italic">No data!</div>
              )}
            </div>
            {selectedCategory[0]?.child_category.length > 0 ? (
              <div
                className={cx(
                  selectedCategory[1]?.child_category.length > 0
                    ? selectedCategory[2]?.child_category.length > 0
                      ? 'col-span-3'
                      : 'col-span-2'
                    : 'col-span-3'
                )}
              >
                {selectedCategory[0].child_category.map((category) => {
                  return (
                    <div
                      key={category.id}
                      className={cx(
                        'z-20 flex cursor-pointer items-center justify-between rounded p-1 transition-all',
                        selectedCategory[1]?.id === category.id
                          ? 'bg-primary bg-opacity-10 text-primary-focus'
                          : 'hover:bg-primary hover:bg-opacity-5 hover:text-primary-focus'
                      )}
                      onClick={() => handleSelect(category, 1)}
                    >
                      <span>{toTitleCase(category.name)}</span>
                      {selectedCategory[1]?.id === category.id &&
                      category.child_category.length > 0 ? (
                        <HiChevronRight />
                      ) : (
                        <></>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <></>
            )}
            {selectedCategory[1]?.child_category.length > 0 ? (
              <div className={'col-span-2'}>
                {selectedCategory[1].child_category.map((category) => {
                  return (
                    <div
                      key={category.id}
                      className={cx(
                        'z-20 flex cursor-pointer items-center justify-between rounded p-1 transition-all',
                        selectedCategory[2]?.id === category.id
                          ? 'bg-primary bg-opacity-10 text-primary-focus'
                          : 'hover:bg-primary hover:bg-opacity-5 hover:text-primary-focus'
                      )}
                      onClick={() => handleSelect(category, 2)}
                    >
                      <span>{toTitleCase(category.name)}</span>
                    </div>
                  )
                })}
              </div>
            ) : (
              <></>
            )}
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  )
}

export default CategorySelector
