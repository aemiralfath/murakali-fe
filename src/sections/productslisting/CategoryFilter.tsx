import { H4 } from '@/components'
import React, { useState } from 'react'
import { HiChevronUp, HiChevronDown } from 'react-icons/hi'

const CategoryFilter: React.FC<{
  categories: string[]
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
        {categories.slice(0, showAllCategory ? 10 : 4).map((data, idx) => {
          return (
            <label
              className="my-1 flex cursor-pointer items-center gap-2 text-sm"
              key={idx}
            >
              <input
                type="radio"
                className="radio-primary radio-xs border-gray-300"
                defaultChecked={isSelected(data)}
                checked={isSelected(data)}
                onChange={() => {
                  if (!isSelected(data)) {
                    addSelectedCategory(data)
                  } else {
                    setFilterCategory('')
                  }
                }}
              />
              <span className="line-clamp-1">{data}</span>
            </label>
          )
        })}
        {categories.length > 4 ? (
          <button
            className="btn btn-ghost btn-sm flex w-full items-center gap-2 rounded bg-white text-primary"
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
