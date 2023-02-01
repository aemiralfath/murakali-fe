import React from 'react'
import { HiChevronDown } from 'react-icons/hi'

import type { CategoryData } from '@/types/api/category'

import { Disclosure } from '@headlessui/react'

const RecursionCategory: React.FC<{
  categories: CategoryData
  filterCategory: string
  setFilterCategory: (p: string) => void
}> = ({ categories, filterCategory, setFilterCategory }) => {
  const isSelected = (c: string) => filterCategory == c

  return (
    <>
      {categories.child_category.length > 0 ? (
        categories.child_category.map((nextLevel) => {
          return (
            <Disclosure key={'nextLevel' + nextLevel.id}>
              {({ open }) => (
                <>
                  <div className="flex flex-row justify-between ">
                    <div
                      onClick={() => {
                        setFilterCategory(nextLevel.name)
                      }}
                      className="bg:white w-full rounded-lg py-1 px-5 hover:bg-gray-200  "
                    >
                      <span
                        className={
                          isSelected(nextLevel.name)
                            ? 'font-bold text-primary'
                            : ''
                        }
                      >
                        {nextLevel.name}
                      </span>
                    </div>

                    {nextLevel.child_category.length > 0 ? (
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

                  <Disclosure.Panel className="ml-2 mb-1 text-sm text-gray-500">
                    {nextLevel.child_category.length > 0 ? (
                      <RecursionCategory
                        filterCategory={filterCategory}
                        categories={nextLevel}
                        setFilterCategory={(p) => {
                          setFilterCategory(p)
                        }}
                      />
                    ) : (
                      <></>
                    )}
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          )
        })
      ) : (
        <></>
      )}
    </>
  )
}

export default RecursionCategory
