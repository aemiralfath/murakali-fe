import React from 'react'
import { HiChevronLeft, HiChevronRight, HiDotsHorizontal } from 'react-icons/hi'

import cx from '@/helper/cx'
import { useMediaQuery, usePagination } from '@/hooks'

type PaginationBtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size: 'sm' | 'md'
}

const PaginationBtn: React.FC<PaginationBtnProps> = ({
  size,
  className,
  children,
  ...rest
}) => {
  return (
    <button
      className={cx(
        className,
        'flex aspect-square items-center justify-center rounded-full border text-center text-sm transition-all',
        'hover:border-primary hover:bg-primary hover:text-white',
        rest.disabled
          ? 'cursor-not-allowed hover:bg-white hover:text-black'
          : '',
        size === 'sm' ? 'h-[2rem]' : ' h-[2.4rem]'
      )}
      {...rest}
    >
      {children}
    </button>
  )
}

const PaginationNav: React.FC<{
  size?: 'sm' | 'md'
  page: number
  total: number
  onChange: (page: number) => void
}> = ({ size = 'md', page, total, onChange }) => {
  const xs = useMediaQuery('xs')
  const pagination = usePagination({ total, page, siblings: 1, onChange })

  return (
    <div className="flex items-center gap-1">
      <PaginationBtn
        size={size}
        className="border-0"
        disabled={page - 1 === 0}
        onClick={() => pagination.previous()}
      >
        <HiChevronLeft />
      </PaginationBtn>
      {xs ? (
        pagination.range.map((range, idx) => {
          if (range === 'dots') {
            return <HiDotsHorizontal key={idx} className={'mx-1'} />
          }

          return (
            <PaginationBtn
              size={size}
              key={idx}
              className={cx(
                page === range ? 'border-0 bg-primary text-white' : ''
              )}
              onClick={() => {
                if (typeof range === 'number') {
                  pagination.setPage(range)
                }
              }}
            >
              {range}
            </PaginationBtn>
          )
        })
      ) : (
        <PaginationBtn size={size}>{page}</PaginationBtn>
      )}
      <PaginationBtn
        size={size}
        className="border-0"
        disabled={page === total}
        onClick={() => pagination.next()}
      >
        <HiChevronRight />
      </PaginationBtn>
    </div>
  )
}

export default PaginationNav
