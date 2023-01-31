import cx from '@/helper/cx'
import { useHover } from '@/hooks'
import { Transition } from '@headlessui/react'
import React, { useEffect, useState } from 'react'
import { useSwipeable } from 'react-swipeable'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi'
import type { ProductImages } from '@/types/api/product'
import ModalPicture from '@/sections/productdetail/ModalPicture'

type ProductImageCarouselProps = LoadingDataWrapper<{
  images?: ProductImages[]
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
  setMainImage: (s: string) => void
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
        'aspect-square h-[50px] cursor-pointer overflow-hidden rounded transition-all md:h-[2.8rem] xl:h-[4rem]',
        isSelected ? 'p-[1px] ring-2 ring-primary' : ''
      )}
      onClick={() => {
        setMainID(id)
        setTempMainImage(url)
      }}
    >
      <img src={url} width={75} height={75} alt={alt} className={'rounded'} />
    </div>
  )
}

const ProductImageCarousel: React.FC<ProductImageCarouselProps> = ({
  selectedImageUrl,
  data,
  isLoading,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [mainID, setMainID] = useState(0)
  const [mainImage, setMainImage] = useState(selectedImageUrl)

  const [ref, isHovered] = useHover()

  const handleNextImage = () => {
    setMainID(
      data?.images && mainID === data.images.length - 1 ? 0 : mainID + 1
    )
  }
  const handlePreviousImage = () => {
    setMainID(
      data?.images && mainID === 0 ? data.images.length - 1 : mainID - 1
    )
  }

  const swipeHandler = useSwipeable({
    onSwipedRight: handleNextImage,
    onSwipedLeft: handlePreviousImage,
  })

  useEffect(() => {
    if (data?.images) {
      setMainImage(selectedImageUrl)
    }
  }, [selectedImageUrl, data])

  useEffect(() => {
    if (data?.images) {
      setMainImage(data.images[mainID]?.url)
    }
  }, [mainID])

  return (
    <div className="flex flex-col-reverse gap-2 md:flex-row">
      <div className="flex h-[80px] max-w-fit gap-2 overflow-x-auto p-1 sm:h-fit sm:w-fit sm:overflow-visible sm:p-0 md:flex-col">
        {isLoading ? (
          <>
            <div className="aspect-square h-[50px] animate-pulse rounded bg-base-300 md:h-[2.8rem] xl:h-[4rem]" />
            <div className="aspect-square h-[50px] animate-pulse rounded bg-base-300 md:h-[2.8rem] xl:h-[4rem]" />
            <div className="aspect-square h-[50px] animate-pulse rounded bg-base-300 md:h-[2.8rem] xl:h-[4rem]" />
          </>
        ) : data?.images ? (
          data.images.map((img, idx) => {
            return (
              <div key={idx}>
                <SubImage
                  id={idx}
                  alt={data.alt ?? 'Sub Image'}
                  isSelected={img.product_detail_id === mainImage}
                  url={img.url}
                  mainImage={mainImage ?? '/asset/image-empty.jpg'}
                  setMainID={setMainID}
                  setMainImage={setMainImage}
                />
              </div>
            )
          })
        ) : (
          <></>
        )}
      </div>
      <div
        className={cx(
          'relative aspect-square h-full w-full overflow-hidden md:h-[18rem] xl:h-[24rem] ',
          isLoading ? 'animate-pulse bg-base-300' : ''
        )}
        ref={ref}
      >
        {isLoading ? (
          <div className="aspect-square h-full w-full animate-pulse bg-base-300" />
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
                  onClick={handlePreviousImage}
                >
                  <HiChevronLeft />
                </button>
                <button
                  className="aspect-square cursor-pointer rounded-full bg-white p-1 text-lg"
                  onClick={handleNextImage}
                >
                  <HiChevronRight />
                </button>
              </>
            </Transition>
            <img
              onClick={() => {
                setIsOpen(true)
              }}
              {...swipeHandler}
              src={mainImage ?? '/asset/image-empty.jpg'}
              width={400}
              height={400}
              alt={data.alt ?? 'Product Main Image'}
              className={'w-full rounded'}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null
                currentTarget.src = '/asset/no-image.png'
              }}
            />
            <ModalPicture
              isOpen={isOpen}
              productImage={selectedImageUrl ?? '/asset/image-empty.jpg'}
              productTitle={data.alt ?? 'Product Image'}
              closeModal={() => {
                setIsOpen(false)
              }}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default ProductImageCarousel
