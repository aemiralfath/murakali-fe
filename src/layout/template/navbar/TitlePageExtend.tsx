import React from 'react'

import { H1 } from '@/components'

interface TitlePageExtendProps {
  title: string
}

const TitlePageExtend: React.FC<TitlePageExtendProps> = ({ title }) => {
  return (
    <div className="flex h-20 w-full bg-primary ">
      <H1 className="container mx-auto my-2 flex flex-wrap items-end px-5 text-white">
        {title}
      </H1>
    </div>
  )
}

export default TitlePageExtend
