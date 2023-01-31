import React from 'react'
import { HiChevronRight } from 'react-icons/hi'

import Link from 'next/link'

import cx from '@/helper/cx'

const Breadcrumbs: React.FC<{
  data: Array<{ name: string; link: string }>
}> = ({ data }) => {
  return (
    <div className="flex flex-wrap items-center gap-1 text-sm">
      {data.map((d, idx) => {
        return (
          <div key={idx} className={'flex items-center'}>
            <Link
              href={d.link}
              className={cx(
                'text-primary line-clamp-1 hover:underline',
                idx === data.length - 1 ? 'font-semibold' : ''
              )}
            >
              {d.name}
            </Link>
            {idx === data.length - 1 ? (
              <></>
            ) : (
              <HiChevronRight className="ml-1" />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default Breadcrumbs
