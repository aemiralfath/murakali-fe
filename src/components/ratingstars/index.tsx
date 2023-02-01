import React from 'react'
import { AiFillStar, AiOutlineStar } from 'react-icons/ai'

import cx from '@/helper/cx'

const RatingStars: React.FC<{ rating: number; size?: 'md' | 'lg' }> = ({
  rating,
  size = 'md',
}) => {
  let fullStars = 0
  let partialStarRatio = 0

  if (rating >= 5) {
    fullStars = 4
    partialStarRatio = 10
  } else if (rating <= 0) {
    fullStars = 0
    partialStarRatio = 0
  } else {
    partialStarRatio = Math.round((rating % 1) * 10)
    fullStars = Math.round(rating - partialStarRatio / 10)
  }

  return (
    <div
      className={cx(
        'flex max-w-fit text-accent',
        size === 'lg' ? 'text-2xl' : 'text-lg'
      )}
    >
      {Array(fullStars)
        .fill('')
        .map((_, idx) => {
          return (
            <div key={idx} className={'relative'}>
              <AiFillStar className="absolute" /> <AiOutlineStar />
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
          <AiFillStar />
        </span>{' '}
        <AiOutlineStar />
      </div>
      {fullStars + 1 >= 5 ? (
        <></>
      ) : (
        Array(4 - fullStars)
          .fill('')
          .map((_, idx) => {
            return (
              <div key={idx} className={'relative'}>
                <AiOutlineStar />
              </div>
            )
          })
      )}
    </div>
  )
}

export default RatingStars
