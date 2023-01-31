import style from './carousel.module.css'
import { Button, P } from '@/components'
import bannerData from '@/dummy/bannerData'
import { useMediaQuery } from '@/hooks'
import type { BannerData } from '@/types/api/banner'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'

const Banner: React.FC<{
  title?: string
  content?: string
  imageUrl?: string
  pageUrl: string
}> = ({ title, content, imageUrl, pageUrl }) => {
  const lg = useMediaQuery('lg')

  return (
    <div
      className="flex h-[16rem] w-full  justify-center gap-4 bg-cover bg-center bg-no-repeat px-8 py-12 sm:h-[22rem] sm:px-12 sm:pt-12 sm:pb-20 lg:h-[28rem] lg:justify-around"
      style={
        lg
          ? {
              backgroundImage: `linear-gradient(
          to left,
          rgba(0, 0, 0, 0), 
          rgba(0, 0, 0, 0), 
          rgba(0, 0, 0, 0.4), 
          rgba(0, 0, 0, 0.6)
        ), url(${imageUrl})`,
            }
          : {
              backgroundImage: `linear-gradient(
          to left,
          rgba(0, 0, 0, 0), 
          rgba(0, 0, 0, 0.4), 
          rgba(0, 0, 0, 0.6)
        ), url(${imageUrl})`,
            }
      }
    >
      <div>
        <div className="container mx-auto flex h-full flex-col gap-3 text-white lg:justify-center">
          <div className="flex flex-col gap-3 sm:max-w-[80%] lg:max-w-[50%]">
            <div className="block font-heading text-[2rem] font-extrabold leading-[2rem] tracking-tighter sm:text-[3rem] sm:leading-[3rem] xl:text-[5rem] xl:leading-[5rem]">
              {title}
            </div>
            <div className="text-sm line-clamp-3 sm:text-base xl:line-clamp-4">
              <P>{content}</P>
            </div>

            <div className="mt-3">
              <a href={pageUrl === '' ? '#recommended-product-list' : pageUrl}>
                <Button
                  buttonType="white"
                  size={lg ? 'md' : 'sm'}
                  className="px-6 text-base-content"
                >
                  Click here
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div></div>
      <div></div>
    </div>
  )
}

const BannerCarousel: React.FC<{
  banners: BannerData[]
  isLoading?: boolean
}> = ({ banners, isLoading }) => {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [scroll, setScroll] = useState<'none' | 'left' | 'right'>('none')

  useEffect(() => {
    const carouselContainer = carouselRef.current
    if (carouselContainer) {
      if (scroll === 'left') {
        carouselContainer.scrollLeft -= carouselContainer.clientWidth
        setScroll('none')
      }
      if (scroll === 'right') {
        carouselContainer.scrollLeft += carouselContainer.clientWidth
        setScroll('none')
      }
    }
  }, [scroll])

  useEffect(() => {
    const carouselContainer = carouselRef.current
    if (carouselContainer !== null) {
      const interval = setInterval(() => {
        if (
          carouselContainer.scrollLeft + carouselContainer.clientWidth ===
          carouselContainer.scrollWidth
        ) {
          carouselContainer.scrollLeft = 0
        } else {
          setScroll('right')
        }
      }, 7000)
      return () => clearInterval(interval)
    }
  }, [])

  return (
    <div className="max-w-full">
      <div className={style.bannerCarousel} ref={carouselRef}>
        {isLoading ? (
          <>
            <div className="carousel-item relative h-[16rem] w-screen sm:h-[22rem] lg:h-[28rem]">
              <div className="flex h-[16rem] w-full animate-pulse justify-center gap-4   bg-gray-300 bg-cover bg-center bg-no-repeat px-8 py-12 sm:h-[22rem] sm:px-12 sm:pt-12 sm:pb-20 lg:h-[28rem]">
                <div className="container mx-auto flex h-full flex-col gap-3 text-white lg:justify-center">
                  <div className="flex flex-col gap-3 sm:max-w-[80%] lg:max-w-[50%]"></div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {banners.filter((item) => item.is_active === true) ? (
              banners
                .filter((item) => item.is_active === true)
                .map((banner, index) => {
                  return (
                    <>
                      {banner.is_active ? (
                        <div
                          id={`slide${index}`}
                          className="carousel-item relative h-[16rem] w-full sm:h-[22rem] lg:h-[28rem]"
                          key={index}
                        >
                          <Banner
                            title={banner.title}
                            content={banner.content}
                            imageUrl={banner.image_url}
                            pageUrl={banner.page_url}
                          />
                        </div>
                      ) : (
                        <></>
                      )}
                    </>
                  )
                })
            ) : (
              <>
                {bannerData.map((banner, index) => {
                  return (
                    <>
                      {banner.is_active ? (
                        <div
                          id={`slide${index}`}
                          className="carousel-item relative h-[16rem] w-full sm:h-[22rem] lg:h-[28rem]"
                          key={index}
                        >
                          <Banner
                            title={banner.title}
                            content={banner.content}
                            imageUrl={banner.image_url}
                            pageUrl={banner.page_url}
                          />
                        </div>
                      ) : (
                        <></>
                      )}
                    </>
                  )
                })}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default BannerCarousel
