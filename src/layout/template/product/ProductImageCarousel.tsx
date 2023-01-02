import cx from '@/helper/cx'
import { useHover } from '@/hooks'
import { Transition } from '@headlessui/react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi'

type ProductImageCarouselProps = LoadingDataWrapper<{
  images?: string[]
  alt?: string
}> & {
  selectedImageUrl?: string
}

const SubImage: React.FC<{
  id: number
  url: string
  alt: string
  isSelected: boolean
  mainImage: string
  setMainImage: React.Dispatch<React.SetStateAction<string>>
  setMainID: React.Dispatch<React.SetStateAction<number>>
}> = ({ id, url, alt, isSelected, mainImage, setMainImage, setMainID }) => {
  const [ref, isHovered] = useHover()
  const [tempMainImage, setTempMainImage] = useState(mainImage)

  useEffect(() => {
    if (isHovered) {
      setTempMainImage(mainImage)
      setMainImage(url)
    } else {
      setMainImage(tempMainImage)
    }
  }, [isHovered])

  return (
    <div
      ref={ref}
      className={cx(
        'aspect-square h-[4rem] cursor-pointer overflow-hidden rounded transition-all',
        isSelected ? 'p-[1px] ring-2 ring-primary' : ''
      )}
      onClick={() => {
        setMainID(id)
        setTempMainImage(url)
      }}
    >
      <Image src={url} width={75} height={75} alt={alt} className={'rounded'} />
    </div>
  )
}

const ProductImageCarousel: React.FC<ProductImageCarouselProps> = ({
  selectedImageUrl,
  data,
  isLoading,
}) => {
  const [mainID, setMainID] = useState(0)
  const [mainImage, setMainImage] = useState(
    selectedImageUrl ?? data?.images[mainID]
  )

  const [ref, isHovered] = useHover()

  useEffect(() => {
    if (data?.images) {
      setMainImage(selectedImageUrl ?? data.images[mainID])
    }
  }, [selectedImageUrl, data])

  useEffect(() => {
    if (data.images) {
      setMainImage(data.images[mainID])
    }
  }, [mainID])

  return (
    <div className="flex gap-2">
      <div className="flex flex-col gap-2">
        {isLoading ? (
          <>
            <div className="aspect-square h-[4rem] animate-pulse rounded bg-base-300" />
            <div className="aspect-square h-[4rem] animate-pulse rounded bg-base-300" />
            <div className="aspect-square h-[4rem] animate-pulse rounded bg-base-300" />
            <div className="aspect-square h-[4rem] animate-pulse rounded bg-base-300" />
            <div className="aspect-square h-[4rem] animate-pulse rounded bg-base-300" />
          </>
        ) : (
          data.images.map((url, idx) => {
            return (
              <div key={idx}>
                <SubImage
                  id={idx}
                  alt={data.alt}
                  isSelected={url === mainImage}
                  url={url}
                  mainImage={mainImage}
                  setMainID={setMainID}
                  setMainImage={setMainImage}
                />
              </div>
            )
          })
        )}
      </div>
      <div
        className={cx(
          'relative aspect-square h-[24rem] overflow-hidden rounded ',
          isLoading ? 'animate-pulse bg-base-300' : 'shadow-lg'
        )}
        ref={ref}
      >
        {isLoading ? (
          <></>
        ) : (
          <>
            <Transition
              show={isHovered}
              enter="transition ease-out duration-50"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
              className={
                'absolute top-1/2 flex w-full -translate-y-1/2 justify-between px-2'
              }
            >
              <>
                <button
                  className="aspect-square transform cursor-pointer rounded-full bg-white p-1 text-lg"
                  onClick={() => {
                    setMainID(
                      mainID === 0 ? data.images.length - 1 : mainID - 1
                    )
                  }}
                >
                  <HiChevronLeft />
                </button>
                <button
                  className="aspect-square cursor-pointer rounded-full bg-white p-1 text-lg"
                  onClick={() => {
                    setMainID(
                      mainID === data.images.length - 1 ? 0 : mainID + 1
                    )
                  }}
                >
                  <HiChevronRight />
                </button>
              </>
            </Transition>
            <Image src={mainImage} width={400} height={400} alt={data.alt} />
          </>
        )}
      </div>
    </div>
  )
}

export default ProductImageCarousel
