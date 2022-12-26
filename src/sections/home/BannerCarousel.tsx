import { Button, P } from '@/components'
import categoriesData from '@/dummy/categoriesData'
import { useMediaQuery } from '@/hooks'
import { Menu, Transition } from '@headlessui/react'
import Link from 'next/link'
import React, { Fragment, useState } from 'react'
import { HiChevronDown, HiSearch } from 'react-icons/hi'
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
      className="flex max-h-[44rem] w-full justify-center gap-4 bg-cover bg-top bg-no-repeat px-8 py-12 sm:px-12 sm:pt-12 sm:pb-20"
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
        <div className="containermx-auto flex h-full flex-col gap-3 text-white lg:justify-center">
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
  const [selectedCategory, setSelectedCategory] = useState(0)

  return (
    <div className="w-screen">
      <div className={style.bannerCarousel}>
        {banners.map((banner, index) => {
          return (
            <div
              key={index}
              id={`slide${index}`}
              className="carousel-item relative w-full"
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
      <div className="flex -translate-y-[50%] justify-center">
        <div className="hidden items-center gap-4 rounded-full bg-white shadow-md sm:flex sm:px-12 sm:py-5">
          <Menu as="div" className="inline-block w-fit text-left">
            <Menu.Button>
              <a className="flex items-center gap-2">
                <>
                  {
                    categoriesData.filter(
                      (data) => data.id === selectedCategory
                    )[0].name
                  }{' '}
                  <HiChevronDown />
                </>
              </a>
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items
                className={
                  'absolute mt-2 w-[32rem] origin-top-left divide-y divide-gray-100 rounded bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none xl:w-[48rem]'
                }
              >
                <div className="grid grid-flow-row grid-cols-3 p-1">
                  {categoriesData.map((category) => (
                    <Menu.Item key={category.id}>
                      <a
                        onClick={() => setSelectedCategory(category.id)}
                        className="w-full cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap rounded p-1 transition-all hover:bg-primary hover:bg-opacity-10 hover:text-primary"
                      >
                        {category.name}
                        <br />
                      </a>
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
          <input
            placeholder="Search"
            className="transition-color border-b-[1px] p-2 focus-visible:border-primary focus-visible:outline-none"
          ></input>
          <HiSearch />
        </div>
      </div>
    </div>
  )
}

export default BannerCarousel
