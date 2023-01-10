import { Button, H2 } from '@/components'
import SellerPanelLayout from '@/layout/SellerPanelLayout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'
import { HiPlus } from 'react-icons/hi'

const Products = () => {
  const router = useRouter()

  return (
    <div>
      <Head>
        <title>Murakali | Seller Panel</title>
      </Head>
      <SellerPanelLayout selectedPage="product">
        <div className="flex w-full items-center justify-between">
          <H2>Product List</H2>
          <Button
            size={'sm'}
            buttonType="primary"
            outlined
            onClick={() => {
              router.push('/seller-panel/add-product')
            }}
          >
            <HiPlus /> Add Product
          </Button>
        </div>
        <div className="mt-3 flex h-full flex-col rounded border bg-white p-6 "></div>
      </SellerPanelLayout>
    </div>
  )
}

export default Products
