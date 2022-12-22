import React from 'react'
import { HiUser } from 'react-icons/hi'

const Avatar: React.FC<{
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  url?: string
}> = ({ size = 'md', isLoading, url }) => {
  const computedSize =
    size === 'sm' ? `h-6 w-6` : size === 'lg' ? 'h-48 w-48' : 'h-8 w-8'

  return (
    <div className={`rounded-full p-[2px]`}>
      <div
        className={`${computedSize} flex items-center justify-center rounded-full bg-base-200 bg-cover bg-center bg-no-repeat text-gray-500 ${
          isLoading ? 'animate-pulse bg-gray-100' : ''
        }`}
        style={
          url && url !== ''
            ? {
                backgroundImage: `url(${url})`,
              }
            : { backgroundColor: '#fff' }
        }
      >
        {url ? <></> : <HiUser />}
      </div>
    </div>
  )
}

export default Avatar
