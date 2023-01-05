import { H4 } from '@/components'
import React, { useState } from 'react'
import { HiChevronUp, HiChevronDown } from 'react-icons/hi'

const CategoryFilter: React.FC<{
  categories: string[]
  filterCategory: string[]
  setFilterCategory: (p: string[]) => void
}> = ({ categories, filterCategory, setFilterCategory }) => {
  const [showAllCategory, setShowAllCategory] = useState(false)
  const addSelectedCategory = (c: string) => {
    setFilterCategory([...filterCategory, c])
  }
  const removeSelectedCategory = (c: string) => {
    setFilterCategory(filterCategory.filter((cs) => cs !== c))
  }
  const isSelected = (c: string) => filterCategory.includes(c)

  return (
    <div>
      <H4>Category</H4>
      <div className="mt-1 flex flex-col gap-1">
        {categories.slice(0, showAllCategory ? 10 : 4).map((data, idx) => {
          return (
            <label
              className="flex cursor-pointer items-center gap-2 text-sm"
              key={idx}
            >
              <input
                type="checkbox"
                className="checkbox-primary checkbox checkbox-xs border-gray-300"
                defaultChecked={isSelected(data)}
                checked={isSelected(data)}
                onChange={() => {
                  if (isSelected(data)) {
                    removeSelectedCategory(data)
                  } else {
                    addSelectedCategory(data)
                  }
                }}
              />
              <span className="line-clamp-1">{data}</span>
            </label>
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
