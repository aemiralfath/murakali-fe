import { H1 } from '@/components'
import React from 'react'
interface TitlePageExtendProps {
  title: string
}

const TitlePageExtend: React.FC<TitlePageExtendProps> = ({ title }) => {
  return (
    <div className="flex h-20 w-full bg-primary ">
      <H1 className="container mx-auto my-4 flex flex-wrap items-end px-5 text-white">
        {title}
      </H1>
    </div>
  )
}

export default TitlePageExtend
