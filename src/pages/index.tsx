import bannerData from '@/dummy/bannerData'
import categoriesData from '@/dummy/categoriesData'
import MainLayout from '@/layout/MainLayout'
import BannerCarousel from '@/sections/home/BannerCarousel'
import CategoriesCarousel from '@/sections/home/CategoriesCarousel'
import Head from 'next/head'

import { type NextPage } from 'next'
import CategorySearch from '@/sections/home/CategorySearch'

const Home: NextPage = () => {
  return (
    <div className="relative">
      <Head>
        <title>Murakali</title>
        <meta name="description" content="Murakali E-Commerce Application" />
      </Head>
      <div className="absolute z-20 max-w-full translate-y-[4rem] overflow-x-hidden overflow-y-visible md:translate-y-[4.5rem]">
        <BannerCarousel banners={bannerData} />
      </div>
      <MainLayout>
        <div className="-z-50 h-[16rem] w-full sm:h-[18rem] lg:h-[22rem]" />
        <CategorySearch />
        <div className="sm:h-[6rem]" />
        <CategoriesCarousel categories={categoriesData} />
      </MainLayout>
    </div>
  )
}

export default Home
