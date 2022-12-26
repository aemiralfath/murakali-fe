import bannerData from '@/dummy/bannerData'
import MainLayout from '@/layout/MainLayout'
import BannerCarousel from '@/sections/home/BannerCarousel'
import { type NextPage } from 'next'
import Head from 'next/head'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Murakali</title>
        <meta name="description" content="Murakali E-Commerce Application" />
      </Head>
      <MainLayout>
        <div className="relative">
          <BannerCarousel banners={bannerData} />
        </div>
      </MainLayout>
    </>
  )
}

export default Home
