import React from 'react'
import { HiOutlineLightBulb } from 'react-icons/hi'

import { H3, P, Chip } from '@/components'
import Uploader from '@/components/uploader'
import { useMediaQuery } from '@/hooks'

const UploadPhoto: React.FC<{
  setThumbnail: (s: string) => void
  defaultThumbnail?: string
}> = ({ setThumbnail, defaultThumbnail }) => {
  const md = useMediaQuery('md')

  return (
    <div className="mt-3 flex h-full flex-col rounded border bg-white px-6 pt-6 pb-12 ">
      <H3>Upload Product</H3>
      <P className="mt-2 flex items-baseline gap-1 text-sm">
        <HiOutlineLightBulb className="min-w-[1rem] text-accent" /> Avoid
        selling counterfeit products/infringing on intellectual property rights
        so that your product is not removed.
      </P>
      <div className="mt-6 flex gap-3">
        {md ? (
          <div className="w-[30%]">
            <div className="flex items-center gap-3">
              <H3>Product Photo</H3>
              <Chip type={'gray'}>Required</Chip>
            </div>
            <P className="mt-2 max-w-[20rem] text-sm">
              Use image formats .jpg, .jpeg, or .png,
              <br />
              <br />
              This photo will be the main thumbnail for your listed product.
            </P>
          </div>
        ) : (
          <></>
        )}
        <div className="flex flex-col gap-3">
          {md ? (
            <></>
          ) : (
            <div className="flex items-center gap-3">
              <H3>Product Photo</H3>
              <Chip type={'gray'}>Required</Chip>
            </div>
          )}
          <Uploader
            id={'thumbnail'}
            title={'Thumbnail Photo'}
            size="lg"
            onChange={(s) => setThumbnail(s)}
            defaultImage={defaultThumbnail}
          />
        </div>
      </div>
    </div>
  )
}

export default UploadPhoto
