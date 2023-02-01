import React, { useState } from 'react'
import { HiChevronUp, HiChevronDown } from 'react-icons/hi'

import { H4 } from '@/components'
import type { CategoryData } from '@/types/api/category'

import { Disclosure } from '@headlessui/react'

import RecursionCategory from './RecursionCategory'

const CategoryFilter: React.FC<{
  categories: CategoryData[]
  filterCategory: string
  setFilterCategory: (p: string) => void
}> = ({ categories, filterCategory, setFilterCategory }) => {
  const [showAllCategory, setShowAllCategory] = useState(false)
  const addSelectedCategory = (c: string) => {
    setFilterCategory(c)
  }

  const isSelected = (c: string) => filterCategory == c

  return (
    <div>
      <H4>Category</H4>
      <div className="mt-1 flex flex-col gap-1">
        {categories.slice(0, showAllCategory ? 10 : 4).map((levelOne, idx) => {
          return (
            <div
              className="my-1 flex cursor-pointer flex-col  text-sm"
              key={idx}
            >
              <Disclosure>
                {({ open }) => (
                  <>
                    <div className="flex flex-row justify-between ">
                      <div
                        onClick={() => {
                          addSelectedCategory(levelOne.name)
                        }}
                        className="bg:white w-full rounded-lg py-1 px-5 hover:bg-gray-200  "
                      >
                        <span
                          className={
                            isSelected(levelOne.name)
                              ? 'font-bold text-primary'
                              : ''
                          }
                        >
                          {levelOne.name}
                        </span>
                      </div>
                      {levelOne.child_category.length > 0 ? (
                        <Disclosure.Button className="flex items-center justify-between rounded-lg bg-white  py-0 text-left text-sm font-medium text-purple-900 focus:outline-none focus-visible:ring ">
                          <HiChevronDown
                            className={`${
                              open ? 'rotate-180 transform' : ''
                            } h-5 w-5 text-primary`}
                          />
                        </Disclosure.Button>
                      ) : (
                        <></>
                      )}
                    </div>

                    <Disclosure.Panel className="ml-2  text-sm text-gray-500">
                      {levelOne.child_category.length > 0 ? (
                        <RecursionCategory
                          filterCategory={filterCategory}
                          categories={levelOne}
                          setFilterCategory={(p) => {
                            addSelectedCategory(p)
                          }}
                        />
                      ) : (
                        <></>
                      )}
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            </div>
          )
        })}
        {categories.length > 4 ? (
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
  )
}

export default CategoryFilter
