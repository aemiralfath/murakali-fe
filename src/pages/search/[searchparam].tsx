import React from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import MainLayout from '@/layout/MainLayout'
import ProductListingLayout from '@/layout/ProductListingLayout'

const SearchPage: NextPage = () => {
  const router = useRouter()
  const { searchparam } = router.query

  return (
    <>
      <Head>
        <title>Search - Murakali</title>
        <meta name="description" content="Murakali E-Commerce Application" />
      </Head>
      <MainLayout>
        <ProductListingLayout />
      </MainLayout>
    </>
  )
}

export default SearchPage
