import { useRecommendedProduct } from '@/api/product/recommended'
import { Divider, H1, H4 } from '@/components'
import bannerData from '@/dummy/bannerData'
import MainLayout from '@/layout/MainLayout'
import ProductCard from '@/layout/template/product/ProductCard'
import BannerCarousel from '@/sections/home/BannerCarousel'
import CategoriesCarousel from '@/sections/home/CategoriesCarousel'
import Head from 'next/head'

import { type NextPage } from 'next'
import CategorySearch from '@/sections/home/CategorySearch'
import Link from 'next/link'
import { useGetAllCategory } from '@/api/category'

const Home: NextPage = () => {
  const categories = useGetAllCategory()

  const recommendedProduct = useRecommendedProduct()

  return (
    <div className="relative">
      <Head>
        <title>Murakali</title>
        <meta name="description" content="Murakali E-Commerce Application" />
      </Head>
      <div className="absolute z-20 max-w-full translate-y-[4rem] overflow-x-hidden md:translate-y-[4.5rem]">
        <BannerCarousel banners={bannerData} />
      </div>
      <MainLayout>
        <div className="-z-50 h-[16rem] w-full sm:h-[18rem] lg:h-[22rem]" />
        <CategorySearch />
        {categories.data?.data ? (
          <CategoriesCarousel categories={categories.data.data} />
        ) : (
          <></>
        )}
        <div className="my-8">
          <Divider />
        </div>
        <div>
          <div className="flex justify-between ">
            <H1>Selected Products</H1>
            <H4 className="self-end">
              <Link href="/products" className="whitespace-nowrap">
                See All
              </Link>
            </H4>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {recommendedProduct.isLoading ? (
              Array(3)
                .fill('')
                .map((_, idx) => {
                  return (
                    <ProductCard key={`${idx}`} data={undefined} isLoading />
                  )
                })
            ) : recommendedProduct.isSuccess ? (
              recommendedProduct.data.data.rows.map((product, idx) => {
                return (
                  <ProductCard
                    key={`${product.title} ${idx}`}
                    data={product}
                    isLoading={false}
                    hoverable
                  />
                )
              })
            ) : (
              <div>{'Error'}</div>
            )}
          </div>
        </div>
      </MainLayout>
    </div>
  )
}

export default Home
