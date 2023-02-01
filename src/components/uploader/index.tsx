/* eslint-disable @next/next/no-img-element */
import React, { useCallback, useEffect, useState } from 'react'
import type { ChangeEvent } from 'react'
import { HiTrash, HiUpload } from 'react-icons/hi'

import cx from '@/helper/cx'
import { useModal } from '@/hooks'
import CropperComponent from '@/layout/template/cropper'

import Button from '../button'

const Uploader: React.FC<{
  id: string
  title: string
  onChange: (s: string) => void
  size?: 'md' | 'lg'
  defaultImage?: string
}> = ({ id, title, onChange, size = 'md', defaultImage }) => {
  const modal = useModal()
  const [image, setImage] = useState<string>()
  const [option, setOption] = useState(-1)

  useEffect(() => {
    onChange(image ?? '')
  }, [image])

  useEffect(() => {
    if (defaultImage) {
      setImage(defaultImage)
    }
  }, [defaultImage])

  const onImageChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      event.preventDefault()
      if (event.target.files && event.target.files[0]) {
        const reader = new FileReader()
        setImage(URL.createObjectURL(event.target.files[0]))
        reader.readAsDataURL(event.target.files[0])
        setOption(1)
      }
    },
    [image]
  )

  useEffect(() => {
    if (option === 1) {
      modal.edit({
        title: 'Crop Image',
        content: (
          <div>
            <CropperComponent
              src={image}
              setImage={setImage}
              setOption={setOption}
            />
          </div>
        ),
        closeButton: false,
      })
    }
  }, [option])

  return (
    <div className="flex w-full items-center justify-center">
      <label
        htmlFor={id}
        className={cx(
          'flex aspect-square flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-all',
          size === 'md' ? 'h-[8rem]' : 'h-[12rem]',
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
                  setImage(undefined)
                  setOption(-1)
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
            <div
              className={cx(
                'flex flex-col items-center justify-center pt-5 pb-6',
                size === 'lg' ? 'px-5' : 'px-2'
              )}
            >
              <HiUpload
                className={cx(
                  ' text-gray-400 transition-all group-hover:text-primary',
                  size === 'lg' ? 'mb-3 h-10 w-10' : 'mb-1 h-8 w-8'
                )}
              />
              <p
                className={cx(
                  'text-center text-sm font-semibold text-gray-500 transition-all group-hover:text-primary',
                  size === 'lg' ? 'mb-2' : 'mb-0.5'
                )}
              >
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
export default Uploader
