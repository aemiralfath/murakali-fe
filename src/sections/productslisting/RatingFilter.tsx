import React from 'react'

import { H4, RatingStars, P } from '@/components'
import cx from '@/helper/cx'

const RatingSelector: React.FC<{
  value: number
  isSelected: boolean
  setFilterRating: (p: number) => void
}> = ({ value, isSelected, setFilterRating }) => {
  return (
    <div
      className={cx(
        'flex max-w-fit cursor-pointer items-center gap-2 rounded-full py-1 px-2 transition-all',
        isSelected
          ? 'bg-accent bg-opacity-20'
          : 'hover:bg-accent hover:bg-opacity-10'
      )}
      onClick={() => {
        if (isSelected) {
          setFilterRating(-1)
        } else {
          setFilterRating(value)
        }
      }}
    >
      <RatingStars rating={value} />
      <P className="text-sm">and above</P>
    </div>
  )
}

const RatingFilter: React.FC<{
  filterRating: number
  setFilterRating: (p: number) => void
}> = ({ filterRating, setFilterRating }) => {
  return (
    <div>
      <H4>Rating</H4>
      <div className="mt-1 flex flex-col">
        <RatingSelector
          value={4}
          isSelected={filterRating === 4}
          setFilterRating={setFilterRating}
        />
        <RatingSelector
          value={3}
          isSelected={filterRating === 3}
          setFilterRating={setFilterRating}
        />
        <RatingSelector
          value={2}
          isSelected={filterRating === 2}
          setFilterRating={setFilterRating}
        />
        <RatingSelector
          value={1}
          isSelected={filterRating === 1}
          setFilterRating={setFilterRating}
        />
      </div>
    </div>
  )
}

export default RatingFilter
