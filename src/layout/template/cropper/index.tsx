import { Button, Divider } from '@/components'
import { useDispatch } from '@/hooks'
import { closeModal } from '@/redux/reducer/modalReducer'
import React, { useCallback, useState } from 'react'
import type { Point, Area } from 'react-easy-crop'
import Cropper from 'react-easy-crop'

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

  return new Promise((resolve: (value: string) => void) => {
    canvas.toBlob((file) => {
      resolve(URL.createObjectURL(file))
    }, 'image/jpg')
  })
}

const CropperComponent: React.FC<{
  src: string
  setImage: (string) => void
}> = ({ src, setImage }) => {
  const dispatch = useDispatch()
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

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square w-full">
        <Cropper
          image={src}
          crop={crop}
          zoom={zoom}
          aspect={1}
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
            dispatch(closeModal())
          }}
        >
          Cancel
        </Button>
        <Button
          buttonType="primary"
          isLoading={isLoading}
          onClick={async () => {
            if (area) {
              setIsLoading(true)
              const croppedImg = await getCroppedImg(src, area)
              setImage(croppedImg)
              dispatch(closeModal())
              setIsLoading(false)
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
