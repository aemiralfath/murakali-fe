import React, { useCallback, useEffect, useState } from 'react'
import Cropper from 'react-easy-crop'
import type { Point, Area } from 'react-easy-crop'
import { toast } from 'react-hot-toast'

import { useUploadProductPicture } from '@/api/product/picture'
import { Button, Divider } from '@/components'
import { useDispatch } from '@/hooks'
import { closeModal } from '@/redux/reducer/modalReducer'
import type { APIResponse } from '@/types/api/response'

import type { AxiosError } from 'axios'

function base64ToBlob(base64: string, mime: string) {
  mime = mime || ''
  const sliceSize = 512
  const byteChars = window.atob(base64)
  const byteArrays: Array<Uint8Array> = []

  for (
    let offset = 0, len = byteChars.length;
    offset < len;
    offset += sliceSize
  ) {
    const slice = byteChars.slice(offset, offset + sliceSize)

    const byteNumbers = new Array(slice.length)
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)

    byteArrays.push(byteArray)
  }

  return new Blob(byteArrays, { type: mime })
}

const createImage = (url: string) =>
  new Promise((resolve: (value: HTMLImageElement) => void, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.src = url
  })

function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180
}

function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = getRadianAngle(rotation)

  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  }
}

const calculateSize = (base64Image: string): number => {
  const base64Str = base64Image.substring(base64Image.indexOf(',') + 1)
  const bits = base64Str.length * 6
  const bytes = bits / 8

  return Math.ceil(bytes / 1000)
}

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  rotation = 0,
  flip = { horizontal: false, vertical: false }
) {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    return null
  }

  const rotRad = getRadianAngle(rotation)

  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation
  )

  canvas.width = bBoxWidth
  canvas.height = bBoxHeight

  ctx.translate(bBoxWidth / 2, bBoxHeight / 2)
  ctx.rotate(rotRad)
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1)
  ctx.translate(-image.width / 2, -image.height / 2)

  ctx.drawImage(image, 0, 0)

  const data = ctx.getImageData(
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height
  )

  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

  ctx.putImageData(data, 0, 0)

  const qualities = [1, 0.8, 0.5, 0.2, 0.1]
  let jpegFile = ''

  qualities.every((quality) => {
    jpegFile = canvas.toDataURL('image/jpg', quality)
    return calculateSize(jpegFile) > 512
  })

  const jpegFile64 = jpegFile.replace(/^data:image\/(png|jpg);base64,/, '')
  const jpegBlob = base64ToBlob(jpegFile64, 'image/jpeg')

  return jpegBlob
}

const CropperComponent: React.FC<{
  src?: string
  setImage: (s: string | undefined) => void
  setOption: (s: number) => void
  aspect?: number
}> = ({ src, setImage, setOption, aspect = 1 }) => {
  const dispatch = useDispatch()
  const uploadProductPicture = useUploadProductPicture()
  const [isLoading, setIsLoading] = useState(false)
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [area, setArea] = useState<Area>()
  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixel: Area) => {
      setArea(croppedAreaPixel)
    },
    []
  )

  useEffect(() => {
    if (uploadProductPicture.isSuccess) {
      setImage(uploadProductPicture.data.data.data ?? '')
      dispatch(closeModal())
      setIsLoading(false)
    }
  }, [uploadProductPicture.isSuccess])

  useEffect(() => {
    if (uploadProductPicture.isError) {
      const errmsg = uploadProductPicture.error as AxiosError<APIResponse<null>>
      toast.error(
        errmsg.response ? errmsg.response.data.message : errmsg.message
      )
      setOption(-1)
      setImage(undefined)
      dispatch(closeModal())
    }
  }, [uploadProductPicture.isError])

  return (
    <div className="flex flex-col gap-4">
      <div className={'relative aspect-square w-full'}>
        <Cropper
          image={src}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </div>
      <div className="controls">
        <input
          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 "
          type="range"
          value={zoom}
          min={1}
          max={3}
          step={0.001}
          aria-labelledby="Zoom"
          onChange={(e) => {
            const parsed = parseFloat(e.target.value)
            if (parsed !== -1) {
              setZoom(parsed)
            }
          }}
        />
      </div>
      <Divider />
      <div className="flex justify-center gap-2">
        <Button
          buttonType="primary"
          outlined
          onClick={() => {
            setOption(-1)
            setImage(undefined)
            dispatch(closeModal())
          }}
        >
          Cancel
        </Button>
        <Button
          buttonType="primary"
          isLoading={isLoading}
          onClick={async () => {
            if (typeof document !== 'undefined') {
              if (area && src) {
                setIsLoading(true)
                const croppedImg = await getCroppedImg(src, area)
                if (croppedImg !== null) {
                  const imageFile = new File([croppedImg], 'img.jpg', {
                    type: 'image/jpg',
                  })
                  await uploadProductPicture.mutateAsync(imageFile)
                }
              }
            }
          }}
        >
          Save
        </Button>
      </div>
    </div>
  )
}

export default CropperComponent
