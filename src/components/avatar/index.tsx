import React, { useEffect, useState } from 'react'

const Avatar: React.FC<{
  size?: 'sm' | 'md' | 'lg' | 'xl'
  isLoading?: boolean
  url?: string
}> = ({ size = 'md', isLoading, url }) => {
  const computedSize =
    size === 'sm'
      ? `h-6 w-6`
      : size === 'lg'
      ? 'h-14 w-14'
      : size === 'xl'
      ? 'h-48 w-48'
      : 'h-8 w-8'

  const [src, setSrc] = useState<string>()
  useEffect(() => {
    if (url !== undefined) {
      setSrc(url)
    }
  }, [url])

  return (
    <div className={`rounded-full p-[2px]`}>
      <img
        className={`${computedSize} flex aspect-square items-center justify-center rounded-full object-base-200 object-cover object-center object-no-repeat text-gray-500 ${
          isLoading ? 'animate-pulse bg-gray-100' : ''
        }`}
        alt={'Avatar'}
        src={src ?? '/asset/no-image.png'}
        width={56}
        height={65}
        onError={({ currentTarget }) => {
          currentTarget.onerror = null
          setSrc('/asset/no-image.png')
        }}
      />
    </div>
  )
}

export default Avatar
