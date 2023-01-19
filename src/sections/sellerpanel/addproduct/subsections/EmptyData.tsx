import { P } from '@/components'
import Image from 'next/image'

const EmptyData = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center py-6">
      <Image
        src={'/asset/empty.png'}
        alt={'No data'}
        height={300}
        width={200}
      />
      <P className="mt-6 italic text-gray-400">Data not found</P>
    </div>
  )
}

export default EmptyData
