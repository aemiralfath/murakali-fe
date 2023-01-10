/* eslint-disable @next/next/no-img-element */
import { H3, P, Chip, Button } from '@/components'
import React, { useState } from 'react'
import {
  HiAdjustments,
  HiOutlineLightBulb,
  HiTrash,
  HiUpload,
} from 'react-icons/hi'

import type { ChangeEvent } from 'react'
import cx from '@/helper/cx'
import { useModal } from '@/hooks'
import CropperComponent from '@/layout/template/cropper'

const Uploader: React.FC<{ id: string; title: string }> = ({ id, title }) => {
  const modal = useModal()
  const [image, setImage] = useState<string>()

  const onImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader()
      setImage(URL.createObjectURL(event.target.files[0]))
      reader.readAsDataURL(event.target.files[0])
    }
  }

  return (
    <div className="flex w-full items-center justify-center">
      <label
        htmlFor={id}
        className={cx(
          'flex aspect-square h-[12rem] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-all',
          image
            ? ''
            : 'group cursor-pointer hover:border-primary hover:bg-primary hover:bg-opacity-5'
        )}
      >
        {image ? (
          <div className="relative h-full w-full text-sm">
            <div className="absolute bottom-0 right-0 z-10 flex gap-1 p-2">
              <Button
                className="aspect-square rounded border-gray-200 bg-white shadow"
                outlined
                size="sm"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  modal.edit({
                    title: 'Crop Image',
                    content: (
                      <div>
                        <CropperComponent src={image} setImage={setImage} />
                      </div>
                    ),
                    closeButton: false,
                  })
                }}
              >
                <HiAdjustments />
              </Button>
              <Button
                className="aspect-square rounded border-gray-200 bg-white shadow"
                outlined
                size="sm"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setImage(undefined)
                }}
              >
                <HiTrash />
              </Button>
            </div>
            <img
              src={image}
              alt={'Preview Image'}
              className={
                'absolute top-1/2 left-1/2 z-0 max-h-full max-w-full -translate-y-1/2 -translate-x-1/2 rounded-lg object-fill'
              }
            />
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center justify-center px-5 pt-5 pb-6">
              <HiUpload className="mb-3 h-10 w-10 text-gray-400 transition-all group-hover:text-primary" />
              <p className="mb-2 text-center text-sm font-semibold text-gray-500 transition-all group-hover:text-primary">
                {title}
              </p>
              <p className="text-center text-xs text-gray-500 transition-all group-hover:text-primary">
                Click to upload
              </p>
            </div>
            <input
              accept="image/jpeg, image/jpg, image/x-png, image/png"
              id={id}
              type="file"
              className="hidden"
              onChange={onImageChange}
            />
          </>
        )}
      </label>
    </div>
  )
}

const UploadPhoto = () => {
  return (
    <div className="mt-3 flex h-full flex-col rounded border bg-white px-6 pt-6 pb-12 ">
      <H3>Upload Product</H3>
      <P className="mt-2 flex items-center gap-1 text-sm">
        <HiOutlineLightBulb className="text-accent" /> Avoid selling counterfeit
        products/infringing on intellectual property rights so that your product
        is not removed.
      </P>
      <div className="mt-6 flex gap-3">
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
        <div className="flex gap-3">
          <Uploader id={'thumbnail'} title={'Thumbnail Photo'} />
        </div>
      </div>
    </div>
  )
}

export default UploadPhoto
