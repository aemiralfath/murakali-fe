import cx from '@/helper/cx'
import React from 'react'
import { HiOutlineStar, HiStar } from 'react-icons/hi'

const RatingStars: React.FC<{ rating: number }> = ({ rating }) => {
  let fullStars = 0
  let partialStarRatio = 0

  if (rating >= 5) {
    fullStars = 4
    partialStarRatio = 1
  } else if (rating <= 0) {
    fullStars = 0
    partialStarRatio = 0
  } else {
    partialStarRatio = Math.round((rating % 1) * 10)
    fullStars = Math.round(rating - partialStarRatio / 10)
  }

  return (
    <div className="flex text-lg text-accent">
      {Array(fullStars)
        .fill('')
        .map((_, idx) => {
          return (
            <div key={idx} className={'relative'}>
              <HiStar className="absolute" /> <HiOutlineStar />
            </div>
          )
        })}
      <div className={'relative w-full'}>
        <span
          className={cx('absolute overflow-hidden')}
          style={{
            width: `${partialStarRatio * 0.6 * 10 + 20}%`,
          }}
        >
          <HiStar />
        </span>{' '}
        <HiOutlineStar />
      </div>
      {fullStars + 1 >= 5 ? (
        <></>
      ) : (
        Array(4 - fullStars)
          .fill('')
          .map((_, idx) => {
            return (
              <div key={idx} className={'relative'}>
                <HiOutlineStar />
              </div>
            )
          })
      )}
    </div>
  )
}

export default RatingStars
