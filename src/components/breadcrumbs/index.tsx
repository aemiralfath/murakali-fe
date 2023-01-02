import cx from '@/helper/cx'
import Link from 'next/link'
import React from 'react'
import { HiChevronRight } from 'react-icons/hi'

const Breadcrumbs: React.FC<{
  data: Array<{ name: string; link: string }>
}> = ({ data }) => {
  return (
    <div className="flex items-center gap-1 text-sm">
      {data.map((d, idx) => {
        return (
          <>
            <Link
              key={idx}
              href={d.link}
              className={cx(
                'text-primary hover:underline',
                idx === data.length - 1 ? 'font-semibold' : ''
              )}
            >
              {d.name}
            </Link>
            {idx === data.length - 1 ? <></> : <HiChevronRight />}
          </>
        )
      })}
    </div>
  )
}

export default Breadcrumbs
