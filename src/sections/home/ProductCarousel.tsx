import ProductCard from '@/layout/template/product/ProductCard'
import { Transition } from '@headlessui/react'
import React, { useEffect, useRef, useState } from 'react'
import { HiArrowLeft, HiArrowRight } from 'react-icons/hi'
import type { BriefProduct } from '@/types/api/product'

const ProductCarousel: React.FC<{
  product: Array<BriefProduct>
}> = ({ product }) => {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [isAtStart, setIsAtStart] = useState(true)
  const [isAtEnd, setIsAtEnd] = useState(false)
  const [scroll, setScroll] = useState<'none' | 'left' | 'right'>('none')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const carouselContainer = carouselRef.current
      if (carouselContainer) {
        carouselContainer.addEventListener('scroll', () => {
          if (
            carouselContainer.scrollLeft + carouselContainer.clientWidth ===
            carouselContainer.scrollWidth
          ) {
            setIsAtEnd(true)
          } else {
            setIsAtEnd(false)
          }
          if (carouselContainer.scrollLeft === 0) {
            setIsAtStart(true)
          } else {
            setIsAtStart(false)
          }
        })
      }
    }
  }, [])

  useEffect(() => {
    const carouselContainer = carouselRef.current
    if (carouselContainer) {
      if (scroll === 'left') {
        carouselContainer.scrollLeft -= 200
        setScroll('none')
      }
      if (scroll === 'right') {
        carouselContainer.scrollLeft += 200
        setScroll('none')
      }
    }
  }, [scroll])

  return (
    <div className="relative">
      <Transition
        show={!isAtEnd}
        enter={'transition-all duration-50'}
        enterFrom={'translate-x-1/2 opacity-0'}
        enterTo={'translate-x-0 opacity-100'}
        leave={'transition-all duration-50'}
        leaveFrom={'translate-x-0 opacity-100'}
        leaveTo={'translate-x-1/2 opacity-0'}
        className="absolute right-0 z-40 flex h-[85%] origin-right items-center px-3 text-xl"
      >
        <div
          className="cursor-pointer rounded-full bg-white p-3 shadow"
          onClick={() => {
            setScroll('right')
          }}
        >
          <HiArrowRight />
        </div>
      </Transition>
      <Transition
        show={!isAtStart}
        enter={'transition-all duration-50'}
        enterFrom={'-translate-x-1/2 opacity-0'}
        enterTo={'translate-x-0 opacity-100'}
        leave={'transition-all duration-50'}
        leaveFrom={'translate-x-0 opacity-100'}
        leaveTo={'-translate-x-1/2 opacity-0'}
        className="absolute left-0 z-40 flex h-[85%] origin-left items-center px-3 text-xl"
      >
        <div
          className="cursor-pointer rounded-full bg-white p-3 shadow"
          onClick={() => {
            setScroll('left')
          }}
        >
          <HiArrowLeft />
        </div>
      </Transition>
      <div className="">
        <div
          className="carousel-center carousel -z-30 gap-4 "
          ref={carouselRef}
        >
          {product?.map((item, id) => (
            <div
              className="carousel-item z-0 flex w-[12rem] flex-col items-center justify-center "
              key={id}
            >
              <ProductCard isLoading={false} data={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProductCarousel
