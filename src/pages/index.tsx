import bannerData from '@/dummy/bannerData'
import categoriesData from '@/dummy/categoriesData'
import MainLayout from '@/layout/MainLayout'
import BannerCarousel from '@/sections/home/BannerCarousel'
import CategoriesCarousel from '@/sections/home/CategoriesCarousel'
import { type NextPage } from 'next'
import Head from 'next/head'

const Home: NextPage = () => {
  return (
    <div className="relative">
      <Head>
        <title>Murakali</title>
        <meta name="description" content="Murakali E-Commerce Application" />
      </Head>
      <div className="max-w-screen absolute z-50 translate-y-[4.5rem] overflow-hidden">
        <BannerCarousel banners={bannerData} />
      </div>
      <MainLayout>
        <div className="h-[32vh] w-full sm:h-[25rem] md:h-[28rem]"></div>
        <CategoriesCarousel categories={categoriesData} />
        <div className="h-screen" />
      </MainLayout>
    </div>
  )
}

export default Home
