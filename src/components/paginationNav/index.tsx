import cx from '@/helper/cx'
import { useMediaQuery, usePagination } from '@/hooks'
import React from 'react'
import { HiChevronLeft, HiChevronRight, HiDotsHorizontal } from 'react-icons/hi'

type PaginationBtnProps = React.ButtonHTMLAttributes<HTMLButtonElement>

const PaginationBtn: React.FC<PaginationBtnProps> = ({
  className,
  children,
  ...rest
}) => {
  return (
    <button
      className={cx(
        className,
        'flex aspect-square h-[2.4rem] items-center justify-center rounded-full border text-center text-sm transition-all',
        'hover:border-primary hover:bg-primary hover:text-white',
        rest.disabled
          ? 'cursor-not-allowed hover:bg-white hover:text-black'
          : ''
      )}
      {...rest}
    >
      {children}
    </button>
  )
}

const PaginationNav: React.FC<{
  page: number
  total: number
  onChange: (page: number) => void
}> = ({ page, total, onChange }) => {
  const xs = useMediaQuery('xs')
  const pagination = usePagination({ total, page, siblings: 1, onChange })

  return (
    <div className="flex items-center gap-1">
      <PaginationBtn
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
        <PaginationBtn>{page}</PaginationBtn>
      )}
      <PaginationBtn
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
