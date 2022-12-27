import { Button, P } from '@/components'
import { useMediaQuery } from '@/hooks'
import Link from 'next/link'
import React from 'react'
import style from './carousel.module.css'

const Banner: React.FC<{
  title?: string
  content?: string
  imageUrl?: string
  pageUrl: string
}> = ({ title, content, imageUrl, pageUrl }) => {
  const lg = useMediaQuery('lg')

  return (
    <div
      className="flex h-[16rem] w-full justify-center gap-4 bg-cover bg-center bg-no-repeat px-8 py-12 sm:h-[18rem] sm:px-12 sm:pt-12 sm:pb-20 lg:h-[22rem]"
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
              <Link href={pageUrl}>
                <Button
                  buttonType="white"
                  size={lg ? 'md' : 'sm'}
                  className="px-6 text-base-content"
                >
                  Shop Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const BannerCarousel: React.FC<{
  banners: Array<{
    title: string
    content: string
    image_url: string
    page_url: string
    is_active: boolean
  }>
}> = ({ banners }) => {
  return (
    <div className="w-screen">
      <div className={style.bannerCarousel}>
        {banners.map((banner, index) => {
          return (
            <div
              key={index}
              id={`slide${index}`}
              className="carousel-item relative h-[16rem] w-full sm:h-[18rem] lg:h-[22rem]"
            >
              <Banner
                title={banner.title}
                content={banner.content}
                imageUrl={banner.image_url}
                pageUrl={banner.page_url}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default BannerCarousel
