import React from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import MainLayout from '@/layout/MainLayout'
import ProductListingLayout, {
  useProductListing,
} from '@/layout/ProductListingLayout'
import { useRecommendedProduct } from '@/api/product/recommended'

const SearchPage: NextPage = () => {
  const router = useRouter()
  const { searchparam } = router.query

  const recommendedProduct = useRecommendedProduct()
  const controller = useProductListing()

  // Get the state like this :
  const { priceSort, dateSort } = controller

  return (
    <>
      <Head>
        <title>Search - Murakali</title>
        <meta name="description" content="Murakali E-Commerce Application" />
      </Head>
      <MainLayout>
        {recommendedProduct.isLoading ? (
          <ProductListingLayout controller={controller} isLoading={true} />
        ) : recommendedProduct.data.data.rows ? (
          <ProductListingLayout
            controller={controller}
            isLoading={false}
            data={recommendedProduct.data.data.rows}
          />
        ) : (
          <div>handle error</div>
        )}
      </MainLayout>
    </>
  )
}

export default SearchPage
