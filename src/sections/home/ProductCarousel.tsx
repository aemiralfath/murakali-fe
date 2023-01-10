import { H1, H4, P } from '@/components'
import { useMediaQuery } from '@/hooks'
import ProductCard from '@/layout/template/product/ProductCard'
import type { CategoryData } from '@/types/api/category'
import { BriefProduct } from '@/types/api/product'
import { Transition } from '@headlessui/react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { HiArrowLeft, HiArrowRight } from 'react-icons/hi'

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
        enter={'transition-transform duration-50'}
        enterFrom={'scale-x-0'}
        enterTo={'scale-x-100'}
        leave={'transition-transform duration-50'}
        leaveFrom={'scale-x-100'}
        leaveTo={'scale-x-0'}
        className="absolute right-0 z-40 flex h-[85%] origin-right cursor-pointer items-center bg-white px-3 text-xl"
      >
        <div
          onClick={() => {
            setScroll('right')
          }}
        >
          <HiArrowRight />
        </div>
      </Transition>
      <Transition
        show={!isAtStart}
        enter={'transition-transform duration-50'}
        enterFrom={'scale-x-0'}
        enterTo={'scale-x-100'}
        leave={'transition-transform duration-50'}
        leaveFrom={'scale-x-100'}
        leaveTo={'scale-x-0'}
        className={
          'absolute left-0 z-40 flex h-[85%] origin-left cursor-pointer items-center bg-white px-3 text-xl'
        }
      >
        <div
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
